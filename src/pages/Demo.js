import React from 'react';
import 'react-dropdown/style.css';
import Popup from 'reactjs-popup';
import Chart from '../components/Chart'
import {CanvasJSChart} from 'canvasjs-react-charts'

const modelsFormat = 
  [
    {
      id: 'cardiffnlp/twitter-roberta-base-sentiment',
      format: [
                'negative',
                'neutral',
                'positive'
              ]
    },
    {
      id: 'cardiffnlp/twitter-roberta-base-emotion',
      format: [
                'joy',
                'optimism',
                'anger',
                'sadness'
              ]
    },
    {
      id: 'cardiffnlp/twitter-roberta-base-hate',
      format: [
                'not-hate',
                'hate'
              ]
    },
    {
      id: 'cardiffnlp/twitter-roberta-base-irony',
      format: [
                'irony',
                'non-irony',
              ]
    },
    {
      id: 'cardiffnlp/twitter-roberta-base-offensive',
      format: [
                'not-offensive',
                'offensive'
              ]
    },
    {
      id: 'cardiffnlp/twitter-roberta-base-emoji',
      format: [
                'positive',
                'neutral',
                'negative'
              ]
    },
    {
      id: 'cardiffnlp/twitter-roberta-base-stance-abortion',
      format: [
                'not-abortion-related',
                'abortion-topic-related',
                'abortion'
              ]
    },
    {
      id: 'cardiffnlp/twitter-roberta-base-stance-atheism',
      format: [
                'not-atheism-related',
                'atheism-topic-related',
                'atheism'
              ]
    },
    {
      id: 'cardiffnlp/twitter-roberta-base-stance-climate',
      format: [
                'positive',
                'neutral',
                'negative'
              ]
    },
    {
      id: 'cardiffnlp/twitter-roberta-base-stance-feminist',
      format: [
                'positive',
                'neutral',
                'negative'
              ]
    },
    {
      id: 'cardiffnlp/twitter-roberta-base-stance-hillary',
      format: [
                'positive',
                'neutral',
                'negative'
              ]
    },
    {
      id: 'cardiffnlp/twitter-roberta-base',
      format: [
                'positive',
                'neutral',
                'negative'
              ]
    }
  ]
 
class Demo extends React.Component
{  
  constructor(props) {
    super(props);

    this.state = {
      chartVisible: false,
      text: "hola"
    };

    this.updateChartVisibility = this.updateChartVisibility.bind(this);

    this.onClickProccessButton = this.onClickProccessButton.bind(this);
    this.createSVG = this.createSVG.bind(this);
    this.onClickTwitter = this.onClickTwitter.bind(this);
    this.popUp = <div id='popUp' className='popUp'>
                  Waitting until the model is loadded
                  <Popup
                          trigger={<button className='hiddenPopUp'> Accept </button>}
                          position='center center'
                          nested={true}
                        >
                          <span> Popup content </span>
                    </Popup>
                  </div>
  }

  updateChartVisibility()
  {
    this.setState({chartVisible: !this.state.chartVisible}, ()=>{
      console.log(this.state.chartVisible);
    });

    this.setState({text: 'helloooo'}, ()=>{
      console.log(this.state.text);
    });
  }

  showPopUp()
  {
    this.popUp.props.className = 'visiblePopUp';
  }

  CreateElementsWithReponse(arrayScores)
  {
    if(arrayScores !== null)
    {
      if(document.getElementById('scoresContainer') === null){

        var midContainer = document.getElementById('resultsContainer'),
            table = document.createElement('table'),
            i = 0,
            modelFormat = modelsFormat.find(model => model.id == document.getElementById('dropDownList').value).format,
            height = 0;

        table.id = 'scoresContainer';

        arrayScores.forEach(element => {            
          var divBarChar = document.getElementById('divBarChar'+i);
          divBarChar.className='visibleDivBarChar';
          height += divBarChar.offsetHeight;

          var barChar = document.getElementById('barChar'+(i));
          barChar.setAttribute('visibility', 'visible');
          barChar.setAttribute('width', element.toFixed(2) * 400);

          var row = table.insertRow();
          row.style.cssText='background-color: deepskyblue;border';
          var cell = row.insertCell();
          cell.innerHTML = modelFormat[i++] + " " + element.toFixed(2);
          });

          table.style.cssText = 'height:'+height+';font-weight:700;float:left;display:block;background-color: deepskyblue';

          midContainer.insertAdjacentElement('afterbegin', table);
          midContainer.setAttribute('height', table.offsetHeight);        
        }
    }
  }

  clearScreen()
  {
    if (document.getElementById('tweetsContainer'))
    {
      document.getElementById('tweetsContainer').textContent ='';  
    }

    var actualScores = document.getElementById('scoresContainer');

    if(document.getElementById('divBarChar'+0) != null)
    {
      for(var i = 0; i<20; i++)
      {
        var divBarChar = document.getElementById('divBarChar'+i);
        divBarChar.className = 'hiddenDivBarChar';

        var barChar = document.getElementById('barChar'+i);
        barChar.setAttribute('visibility', 'hidden');
      }
    }

    if (actualScores !== null)
    {
      actualScores.remove();
    }
  }

  async evaluateTweets(json)
  {
    const url = 'https://api-inference.huggingface.co/models/';
    var token = 'api_QDmvqWFqDPqTngiSDNRqcfUlcrVeckHbKD',
        model = document.getElementById('dropDownList').value,
        path = url + model,
        metaData = json.search_metadata,
        tweets = json.statuses,
        scores = [],
        tweetContainer = document.getElementById('tweetsContainer'),
        me = this;

      for(var i = 0; i<tweets.length; i++){
        await fetch(path, {
        headers : {'Authorization' : 'Bearer ' + token},
        method: "POST",
        body: JSON.stringify(tweets[i].text)
      })
      .then(async function(response)
      {
        if (response.ok) {
          response.json().then(async function(json)
          {
            scores.push(json);
          });
        }
        else if (response.status == 503)
        {
          me.showPopUp();
        }
      });
      
      var tweetDiv = document.createElement('div');
      tweetDiv.className = 'tweetDiv';
      var content = document.createElement('p');
      content.innerText = tweets[i].text;
      tweetDiv.appendChild(content);
      tweetContainer.appendChild(tweetDiv);
    }

    return scores;
  }

  async onClickTwitter()
  {
    this.clearScreen();
    var me = this,
        text = undefined;

    if ( document.getElementById('twitterTextArea') != null)
    {
      text = document.getElementById('twitterTextArea').value.replace("#", "%23").replace("@", "%40");
    }

    if (text !== undefined && text.length > 0)
    {   
      await fetch(`http://localhost:5000/SearchTweets/?twitterContent=${text}`, {
        method: 'GET'
      })
      .then(async function (response)
      {
        if (response.ok)
          response.json().then(async function (json){
            var scores = await me.evaluateTweets(json),
                size = scores[0][0].length,
                scoreAverage = new Array(size).fill(0);

            for(var i = 0; i<scores.length; i++)
            {
              for(var j = 0; j<size; j++)
              {
                scoreAverage[j] += parseFloat(scores[i][0][j].score.toFixed(2));
              }
            }

            for (var i = 0; i<size; i++)
            {
              scoreAverage[i] = scoreAverage[i] / scores.length;
            }

            me.CreateElementsWithReponse(scoreAverage);
          });
      });
    } 

  }

  async onClickProccessButton()
  {    
    this.updateChartVisibility();

    var text = document.getElementById('textareaId'),
    me = this;

    if (text !== null && text.value != '')
    {
      const url = 'https://api-inference.huggingface.co/models/';
      var token = 'api_QDmvqWFqDPqTngiSDNRqcfUlcrVeckHbKD',
        model = document.getElementById('dropDownList').value,
        path = url + model,
        scores = [];
        this.clearScreen();

      await fetch(path, {
        headers : {'Authorization' : 'Bearer ' + token},
        method: "POST",
        body: JSON.stringify(text.value)
      })
      .then(async function(response)
      {
        if (response.ok) {
          response.json().then(async function(json)
          {
            json[0].forEach(score => {
              scores.push(score.score);
            })

            me.CreateElementsWithReponse(scores);
          });
        }
        else if (response.status == 503)
        {
          me.showPopUp();
        }
      });
    }
  }

  async getHuggingFaceModels()
  {
    const url = 'https://huggingface.co/api/models/?repo_id=cardiffnlp';
    var modelsAdded = [];

    var dropdown = document.getElementById('dropDownList');

      await fetch(url, {
            method: 'GET',
        })
        .then(function (response)
        {
          return response.json();
        })
        .then(function (body)
        {
          for (var index in body)
          {
            if(body[index].modelId.includes('cardiffnlp/twitter-roberta-base') && !modelsAdded.includes(body[index].modelId))
            {
              modelsAdded.push(body[index].modelId);          
            }
          }
        });
        
    if (dropdown !== null && dropdown.childNodes.length == 0)
    {
        modelsAdded.forEach( function (model)
        {
          var option = document.createElement('option');
          option.value = model;
          option.innerHTML = model;
          dropdown.appendChild(option);
        })
    }
  }

  createSVG()
  {
    var a=[];
    for(var i=0; i<20; i++)
    {
      a.push(<div className='hiddenDivBarChar' id={'divBarChar' + i}>
      <svg className='svgClass'>
        <rect  id={'barChar' + i} className='rectClass' rx='5' ry='25'></rect>
      </svg>
      </div>)
    }
    
    return a;
  }

  getModels()
  {
    var modelsIds = [];

    modelsFormat.forEach(function (model)
    {
      var text = model.id == 'cardiffnlp/twitter-roberta-base' ? 'base' : model.id.slice(32);
      modelsIds.push(<option value={model.id}>{text}</option>);
    })
    return modelsIds;
  }

  render() {
    //getHuggingFaceModels()

    return (

      <div className='full-screen'>
        <h1 className='title'>Demo</h1>

        <div className='dropdownContainer'>
        
          <label className='labels'>Models</label>
          <select name="models" id="dropDownList" className='dropdown'>
            {this.getModels()}
          </select>
      
        </div>
  
        <div id='dateContainer' className='dateContainer'>
        
            <h1 className='dateTitle'>Twitter</h1>
        
            <div className='dateElement'>      
        
              <label className='labels' for="dateFrom">Date From:</label>
              <input type="date" id="dateFrom" name="dateFrom"></input>
        
            </div>

            <div className='dateElement'>
        
              <label className='labels' for="dateTo">Date To:</label>
              <input type="date" id="dateTo" name="dateTo"></input>
        
            </div>

            <div className='dateElement'>
        
              <input className='twitterSearchInput' id='twitterTextArea' type='text-input' placeholder='Search tweets by hashtag, user or id'></input>
              <button className='button' onClick={this.onClickTwitter}>Proccess</button>
            
            </div>

            <h1 className='tweetsTitle'></h1>                 
            <div className='tweetsContainer' id='tweetsContainer'>
            </div>
            {this.popup}            

        </div>  

        <div>     
          
          <div className='resultsContainer' id='resultsContainer'>
          
            <div className='barCharContainer' id='barCharContainer'>
            
              {this.createSVG()}
            </div>
          
          </div>
          
          <div className='mid-element' id='midContainer'>
          
            <textarea className='text-input' id='textareaId' placeholder='Type text to evaluate'></textarea>   
              <button className='button' onClick={this.onClickProccessButton}>{this.state.chartVisible}Proccess</button>
          
          </div>
          <div id='graphicClass' className='graphicClass'>
            {<Chart 
              visible={this.state.chartVisible}
              text={this.state.text}
            />}
            </div>
        </div>

        {this.popUp}
 
        
      </div>
    );
  }
};

export default Demo;