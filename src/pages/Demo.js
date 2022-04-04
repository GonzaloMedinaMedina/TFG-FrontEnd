import React from 'react';
import 'react-dropdown/style.css';
import Chart from '../components/Chart'
import '../stylesheets/Demo.css';
import '../stylesheets/Home.css';
import App from '../App';
import fotonlpModels from '../images/nlpmodels.jpg';
import fototext from '../images/texto.jpg';
import fotobasicDemo from '../images/basicDemo.png';
import selectDates from '../images/selectDates.PNG';
import selectLanguage from '../images/selectLanguage.PNG';
import numberOfTweets from '../images/numberOfTweets.PNG';
import searchCriteria from '../images/searchCriteria.PNG';
import twitterDemo from '../images/twitterDemo.PNG';

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

    this.explanation = undefined;
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
      document.getElementById('languageDropDownList').value !== 'en')
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
        currentFormat = (Demo.modelsFormat.find(element => element.id === document.getElementById('dropDownList').value)).format;

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
    if(this.statistics.length === 0)
    {
      var formats = (Demo.modelsFormat.find(element => element.id === document.getElementById('dropDownList').value)).format;
      
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

    for (i = 0; i<json[0].length; i++)
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

      var tweets = json.data,
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

  getModels()
  {
    var modelsIds = [];

    Demo.modelsFormat.forEach(function (model)
    {
      var text = model.id === 'cardiffnlp/twitter-roberta-base' ? 'base' : model.id.includes('sentiment') ? 'sentiment' : model.id.slice(32) + ' (EN)';
      modelsIds.push(<option value={model.id}>{text}</option>);
    })
    return modelsIds;
  }

  createExplanationContent(subMenuKey)
  {       
    switch (subMenuKey)
    {
      case 'BASIC':
        return( 
          <div id='explanationDiv' className='explanationContainer centerElement'>
            
            <div id='explanationContentContainer' className='explanationContentContainer'>

              <div className='explanationParagraph'>
                <text className='explanationTitle'>This demo allow you to analyze text typed using differents Natural Languages Processing models</text>
              </div>
              
              <div className='explanationParagraph'>
                <p className='explanationText'>1º Select a NLP model</p>
                <img className='centerElement' src={fotonlpModels} width="auto" height="auto"/>
              </div>

              <div className='explanationParagraph'>
                <p className='explanationText'>2º Type text to process in the text box </p>
                <img className='centerElement' src={fototext} width="auto" height="auto"/>
              </div>

              <div className='explanationParagraph'>
                <p className='explanationText'>3º Click on Proccess button and wait for results</p>
                <img className='centerElement' src={fotobasicDemo} width="100%" height="auto"/>
              </div>

            </div>
        </div>
        );
      
      case 'TWITTER':
        return(
        <div id='explanationDiv' className='explanationContainer centerElement'>

            <div id='explanationContentContainer' className='explanationContentContainer'>
              
              <div className='explanationParagraph'>
                <text className='explanationTitle'>This demo allow you to analyze analyze batch of tweets between dates and searching by hashtag, user or keyword using differents Natural Languages Processing models</text>
              </div>

              <div className='explanationParagraph'>
                <p className='explanationText'>1º Select a NLP model</p>
                <img className='centerElement' src={fotonlpModels} width="auto" height="auto"/>
              </div>

              <div className='explanationParagraph'>
                <p className='explanationText'>2º Select dates</p>
                <img className='centerElement' src={selectDates} width="auto" height="auto"/>
              </div>
              
              <div className='explanationParagraph'>
                <p className='explanationText'>3º Select Language</p>
                <img className='centerElement' src={selectLanguage} width="auto" height="auto"/>
              </div>
              
              <div className='explanationParagraph'>
                <p className='explanationText'>4º Type number of tweets to process</p>
                <img className='centerElement' src={numberOfTweets} width="auto" height="auto"/>
              </div>
              
              <div className='explanationParagraph'>
                <p className='explanationText'>5º Type to search by hashtag, user or keywords</p>
                <img className='centerElement' src={searchCriteria}  width="auto" height="auto"/>
              </div>
              
              <div className='explanationParagraph'>
                <p className='explanationText'>6º Click on Proccess button and wait for results</p>
                <img className='centerElement' src={twitterDemo}  width="100%" height="auto"/>
              </div>

            </div>

        </div>
        )
      
      default:
          return <div></div>;
    }
  }


  render(subMenu, subMenuKey) {
    this.subMenu = subMenu;
    this.explanation = undefined;

    if (this.chart === undefined && subMenuKey !== undefined)
    {
      this.explanation = this.createExplanationContent(subMenuKey);
    }

    return (

      <div className='active-page' id='current-page'>
      <h1 className='title'>Demo</h1>

        <div className='dropdownDiv'>
          
          <div className='dropdownContainer borderBotRadius'>
            <h1 className='text dropdownTitle'>NLP parameters</h1>

            <div className='dropdownElement'>
              <label className='text dropdownLabel'>Models</label>
              <select name="models" id="dropDownList" className='dropdown'>
                {this.getModels()}
              </select>
            </div>           

          </div>
        
        </div>

        <div id ='mainMidContainer' className='mainMidContainer'>
        
          <div id='demo' className='demoContainer'>
            {this.subMenu}
          </div>

          <div className='resultsContainer' id='resultsContainer'>                               

            <div>          
              {this.chart}
              {this.explanation}
            </div>
          
          </div>
        
        </div>        

      </div>
    );
  }
};

export default Demo;