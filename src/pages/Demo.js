import React from 'react';
import 'react-dropdown/style.css';
import Chart from '../components/Chart'
import '../stylesheets/Demo.css';
import App from '../App';

const tripleFormat = 
  [
    'negative',
    'neutral',
    'positive'
  ]

 
class Demo extends React.Component
{  
  static modelsFormat = 
  [
    {
      id: 'cardiffnlp/twitter-roberta-base-sentiment',
      format: tripleFormat
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
                'not-irony'
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
      format: tripleFormat
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
      format: tripleFormat
    },
    {
      id: 'cardiffnlp/twitter-roberta-base-stance-feminist',
      format: tripleFormat
    },
    {
      id: 'cardiffnlp/twitter-roberta-base-stance-hillary',
      format: tripleFormat
    },
    {
      id: 'cardiffnlp/twitter-roberta-base',
      format: tripleFormat
    }
  ]
  constructor(props) {
    super(props);

    this.subMenu = undefined;
    this.chart = undefined;
    this.updateChartVisibility = this.updateChartVisibility.bind(this);
    this.scoreAverage = [];
    this.statistics = [];
  }

  static checkCrossModel()
  {
    var modelText = document.getElementById('dropDownList').selectedOptions[0].outerText;

    if (modelText.includes('(EN)'))
    {
      App.showPopUpMessage('Cross language is not able on this model', 'Error');
      return false;
    }
    else
    {
      App.showPopUpMessage('Cross language model was enabled', 'Warning');
      return true;
    }
  }

  GetModel()
  {
    var modelText = document.getElementById('dropDownList').value;

    if (!document.getElementById('dropDownList').selectedOptions[0].outerText.includes('(EN)') &&
      document.getElementById('languageDropDownList').value != 'en')
    {
      return [modelText.slice(0,19), 'xlm-', modelText.slice(19)].join('');
    }

    return modelText;
  }
  
  createChart(state)
  {
    return (new Chart(state)).render();
  }

  async updateChartVisibility(arrayScores, isTwitterDemo, textEvaluated = null)
  {
    var me = this,
        currentFormat = (Demo.modelsFormat.find(element => element.id == document.getElementById('dropDownList').value)).format;

    var state = { state :
      {
        textEvaluated: textEvaluated == null ? '' : textEvaluated,
        title: isTwitterDemo ? me.GetModel() : document.getElementById('dropDownList').value,
        scores: arrayScores,
        height: document.getElementById('resultsContainer').getAttribute('height'),
        format: currentFormat,
        type: isTwitterDemo ? "line" : "column",
        statistics: this.statistics,
        moreThanOneTweet: isTwitterDemo
      }
    }

    me.chart = me.createChart(state);
    this.statistics = [];
    this.forceUpdate();
  }

  async CreateElementsWithReponse(arrayScores, isTwitterDemo = true, textEvaluated = null)
  {
    if(arrayScores !== null)
    {
      await this.updateChartVisibility(arrayScores, isTwitterDemo, textEvaluated);
    }
  }

  clearScreen()
  {
    this.chart = undefined;

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

  updateStatistics(json)
  {
    if(this.statistics.length == 0)
    {
      var formats = (Demo.modelsFormat.find(element => element.id == document.getElementById('dropDownList').value)).format;
      
      for (var i = 0; i< formats.length; i++)
      {
        this.statistics.push(
          {
            id: formats[i],
            value: 0
          }
        )
      }
    }

    var maxIndex = 0;

    for (var i = 0; i<json[0].length; i++)
    {
      if(json[0][i].score > json[0][maxIndex].score)
      {
        maxIndex = i;
      }
    }

    this.statistics[maxIndex].value++;
  }

  async evaluateTweets(json)
  {

      var model = this.GetModel(),
        tweets = json.data,
        scores = [],
        tweetContainer = document.getElementById('tweetsContainer'),
        me = this;

      for(var i = 0; i < tweets.length; i++)
      {
        me.updateStatistics(json);
        scores.push(json);
      

        var tweetDiv = document.createElement('div');
        tweetDiv.className = 'tweetDiv';
        var content = document.createElement('p');
        content.innerText = tweets[i].text;
        content.style.color = 'white';
        tweetDiv.appendChild(content);
        tweetContainer.appendChild(tweetDiv);
      }

    return scores;
  }

  /*Not used
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
*/

  getModels()
  {
    var modelsIds = [];

    Demo.modelsFormat.forEach(function (model)
    {
      var text = model.id == 'cardiffnlp/twitter-roberta-base' ? 'base' : model.id.includes('sentiment') ? 'sentiment' : model.id.slice(32) + ' (EN)';
      modelsIds.push(<option value={model.id}>{text}</option>);
    })
    return modelsIds;
  }

  render(subMenu) {
    this.subMenu = subMenu;

    return (

      <div className='active-page' id='current-page'>
        <h1 className='title'>Demo</h1>
        <div className='dropdownContainer borderBotRadius'>
            <h1 className='text dropdownTitle'>NLP parameters</h1>

            <div className='dropdownElement'>
              <label className='text dropdownLabel'>Models</label>
              <select name="models" id="dropDownList" className='dropdown'>
                {this.getModels()}
              </select>
            </div>           

          </div>
        
        <div id ='mainMidContainer' className='mainMidContainer'>
        
          <div id='demo' className='demoContainer'>
            {this.subMenu}
          </div>

          <div className='resultsContainer' id='resultsContainer'>                               

            <div>          
              {this.chart}
            </div>
          
          </div>
        
        </div>        

      </div>
    );
  }
};

export default Demo;