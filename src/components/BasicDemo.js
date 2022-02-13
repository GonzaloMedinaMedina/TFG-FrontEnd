import React from 'react';
import Demo from '../pages/Demo';
import App from '../App';

class BasicDemo extends React.Component
{
    constructor(props)
    {
        super(props);
        this.demoPage = new Demo();
        this.element =             
          <div className='basicDemo' id='midContainer'>
              
              <textarea className='text-input' id='textareaId' placeholder='Type text to evaluate'></textarea>   
              <button className='proccessButtonBasicDemo' onClick={() => {this.onClickProccessButton(this)}}>Proccess</button>
            
          </div>
        
    }


    async onClickProccessButton(me)
    {            
        App.showLoader();

        var textToProccess = document.getElementById('textareaId').value,
        model = document.getElementById('dropDownList').value,
        scores = [],
        evaluated = false;

        if (textToProccess.includes('twitter.com'))
        {
            var tweetId = textToProccess.substring(textToProccess.search('status') + 7);

            await fetch(`http://localhost:5000/SingleTweet/?tweetId=${tweetId}&model=${model}`,
            {
                method: 'GET'
            })
            .then( await async function (response)
            {
                if (response.ok)
                {
                    await response.json().then( await async function (json)
                    {
                        textToProccess = json.text;
                        evaluated=true;
                        scores = json.score[0];
                    })
                }
            });
        }

        if (textToProccess != '' && !evaluated)
        {
            const url = `http://localhost:5000/evaluateText?text=${textToProccess}/&model=${model}`
            this.demoPage.clearScreen();

            await fetch(url, {
                method: "GET",
            })
            .then( await async function(response)
            {
                if (response.ok) {
                    await response.json().then(await async function(json)
                    {
                        textToProccess = json.text;
                        evaluated=true;
                        scores = json.score[0];
                    });
                }
            });
        }

        me.demoPage.CreateElementsWithReponse(scores, false, textToProccess);
        me.forceUpdate();
        App.hideLoader();
    }

    render()
    {
        return(
            this.demoPage.render(this.element)
        )
    }
}
export default BasicDemo;