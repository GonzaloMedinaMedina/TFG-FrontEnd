import React from 'react';
import Demo from '../../pages/Demo/Demo';
import App from '../../App';
import "./BasicDemo.css"

class BasicDemo extends React.Component {
  constructor(props) {
    super(props);
    this.demoPage = new Demo();
    this.element =
      <div className='basicDemo' id='midContainer'>
        <textarea rows="5" className='text-input centerElement' id='textareaId' placeholder='Type text to evaluate'></textarea>
        <button className='proccessButton centerElement' onClick={() => { this.onClickProccessButton(this) }}>Proccess</button>
      </div>

  }


  async onClickProccessButton(me) {

    var textToProccess = document.getElementById('textareaId').value,
      model = document.getElementById('dropDownList').value,
      scores = [],
      evaluated = false;

    if (textToProccess !== '') {
      App.showLoader();

      if (textToProccess.includes('twitter.com')) 
      {
        var tweetId = textToProccess.substring(textToProccess.search('status') + 7);
        const url = App.serverIP + `SingleTweet/?tweetId=${tweetId}&model=${model}`;

        await fetch(url,
          {
            method: 'GET'
          })
          .then(await async function (response) {
            if (response.ok) {
              await response.json().then(await async function (json) {
                textToProccess = json.text;
                evaluated = true;
                scores = json.score[0];
              })
            }
          });
      }

      if (textToProccess !== '' && !evaluated) 
      {
        const url = App.serverIP + `evaluateText?text=${textToProccess}/&model=${model}`;
        this.demoPage.clearScreen();

        await fetch(url, {
          method: 'GET'
        })
          .then(await async function (response) {
            if (response.ok) {
              await response.json().then(await async function (json) {
                textToProccess = json.text;
                evaluated = true;
                scores = json.score[0];
              });
            }
          });
      }

      me.demoPage.CreateElementsWithReponse(scores, false, textToProccess.substring(0, textToProccess.length - 1));
      me.forceUpdate();
      App.hideLoader();
    }
  }

  render() {
    return (
      <>
        {this.demoPage.render(this.element, 'BASIC')}
      </>
    )
  }
}
export default BasicDemo;