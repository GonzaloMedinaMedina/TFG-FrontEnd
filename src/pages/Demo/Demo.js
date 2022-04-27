import React from 'react';
import 'react-dropdown/style.css';
import Chart from '../../components/Chart/Chart'
import './Demo.css';
import '../Home/Home.css';
import App from '../../App';
import fotonlpModels from '../../images/nlpmodels.jpg';
import selectDates from '../../images/selectDates.PNG';
import selectLanguage from '../../images/selectLanguage.PNG';
import numberOfTweets from '../../images/numberOfTweets.PNG';
import searchCriteria from '../../images/searchCriteria.PNG';
import twitterDemo from '../../images/twitterDemo.PNG';
import text from '../../images/texto.jpg';
import basicDemo from '../../images/basicDemo.png';

import Stepper from '../../components/Stepper/Stepper'

const basic = 
{
  title: "This demo allow you to analyze text typed using differents Natural Languages Processing models",
  data:
  [
      {
        title: "Select a NLP model",
        descImgURL: fotonlpModels
      },
      {
        title: "Type text to process in the text box and click proccess button",
        descImgURL: text
      },
      {
        title: "And see the results in the chart",
        descImgURL: basicDemo
      }
  ]
}

const twitter = 
{
  title: "This demo allow you to analyze analyze batch of tweets",
  data:
  [
      {
        title: "Select a NLP model",
        descImgURL: fotonlpModels
      },
      {
        title: "Select dates",
        descImgURL: selectDates
      },
      {
        title: "Select a language",
        descImgURL: selectLanguage
      },
      {
        title: "Type number of tweets to proccess",
        descImgURL: numberOfTweets
      },
      {
        title: "Type to search by hashtag, user or keywords. And click proccess button",
        descImgURL: searchCriteria
      },
      {
        title: "And see the results in the chart",
        descImgURL: twitterDemo
      }
  ]
}
// 

const tripleFormat =
  [
    'negative',
    'neutral',
    'positive'
  ]


class Demo extends React.Component {
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

  static checkCrossModel() {
    var modelText = document.getElementById('dropDownList').selectedOptions[0].outerText;

    if (modelText.includes('(EN)')) {
      App.showPopUpMessage('Cross language is not able on this model', 'Error');
      return false;
    }
    else {
      App.showPopUpMessage('Cross language model was enabled', 'Warning');
      return true;
    }
  }

  GetModel() {
    var modelText = document.getElementById('dropDownList').value;

    if (!document.getElementById('dropDownList').selectedOptions[0].outerText.includes('(EN)') &&
      document.getElementById('languageDropDownList').value !== 'en') {
      return [modelText.slice(0, 19), 'xlm-', modelText.slice(19)].join('');
    }

    return modelText;
  }

  createChart(state) {
    return (new Chart(state)).render();
  }

  async updateChartVisibility(arrayScores, isTwitterDemo, textEvaluated = null) {
    var me = this,
      currentFormat = (Demo.modelsFormat.find(element => element.id === document.getElementById('dropDownList').value)).format;

    var state = {
      state:
      {
        textEvaluated: textEvaluated === null ? '' : textEvaluated,
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

  async CreateElementsWithReponse(arrayScores, isTwitterDemo = true, textEvaluated = null) {
    if (arrayScores !== null) {
      await this.updateChartVisibility(arrayScores, isTwitterDemo, textEvaluated);
    }
  }

  clearScreen() {
    this.chart = undefined;

    var actualScores = document.getElementById('scoresContainer');

    if (document.getElementById('divBarChar' + 0) !== null) {
      for (var i = 0; i < 20; i++) {
        var divBarChar = document.getElementById('divBarChar' + i);
        divBarChar.className = 'hiddenDivBarChar';

        var barChar = document.getElementById('barChar' + i);
        barChar.setAttribute('visibility', 'hidden');
      }
    }

    if (actualScores !== null) {
      actualScores.remove();
    }
  }

  updateStatistics(json) {
    if (this.statistics.length === 0) {
      var formats = (Demo.modelsFormat.find(element => element.id === document.getElementById('dropDownList').value)).format;

      for (var i = 0; i < formats.length; i++) {
        this.statistics.push(
          {
            id: formats[i],
            value: 0
          }
        )
      }
    }

    var maxIndex = 0;

    for (i = 0; i < json[0].length; i++) {
      if (json[0][i].score > json[0][maxIndex].score) {
        maxIndex = i;
      }
    }

    this.statistics[maxIndex].value++;
  }

  async evaluateTweets(json) {

    var tweets = json.data,
      scores = [],
      tweetContainer = document.getElementById('tweetsContainer'),
      me = this;

    for (var i = 0; i < tweets.length; i++) {
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

  getModels() {
    var modelsIds = [];

    Demo.modelsFormat.forEach(function (model) {
      var text = model.id === 'cardiffnlp/twitter-roberta-base' ? 'base' : model.id.includes('sentiment') ? 'sentiment' : model.id.slice(32) + ' (EN)';
      modelsIds.push(<option value={model.id}>{text}</option>);
    })
    return modelsIds;
  }

  createExplanationContent(subMenuKey) 
  {
    var subMenu;

    switch (subMenuKey) {
      case 'BASIC':
        subMenu = basic;
        break;
      case 'TWITTER':
        subMenu = twitter;
        break;
      default:
        break;                
    }
  
    return (
      <div id='explanationDiv' className='explanationContainer centerElement'>
        <p className='text-black'>{subMenu.title}</p>
        <Stepper steps={subMenu.data} ></Stepper>          
      </div>
    );
  }


  render(subMenu, subMenuKey) {
    this.subMenu = subMenu;
    this.explanation = undefined;

    if (this.chart === undefined && subMenuKey !== undefined) 
    {
      this.explanation = this.createExplanationContent(subMenuKey);
    }

    var title = subMenuKey.substr(0,1) + subMenuKey.toLowerCase().substr(1) + " demo";

    return (

      <div className='active-page' id='current-page'>
        <div className='headerContainer'>
          <h1 className='title'>{title}</h1>
          <div className='dropdownContainer'>
                <h1 className='text dropdownTitle'>NLP parameters</h1>
                <div className='dropdownElement'>
                  <label className='text dropdownLabel'>Models</label>
                  <select name="models" id="dropDownList" className='inputClass'>
                    {this.getModels()}
                  </select>
                </div>
          </div>
        </div>
        <hr />
        <div id='mainMidContainer' className='mainMidContainer'>

          <div className='resultsContainer' id='resultsContainer'>

            <div>
              {this.chart}
              {this.explanation}
            </div>

          </div>

          <hr />
            <div id='demo' className='demoContainer'>
              {this.subMenu}
            </div>
        </div>

      </div>
    );
  }
};

export default Demo;