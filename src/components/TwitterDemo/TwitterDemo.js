import React from 'react';
import Demo from '../../pages/Demo/Demo';
import App from '../../App';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css'

class TwitterDemo extends React.Component
{
    constructor(props)
    {
        super(props);

        this.demoPage = new Demo();
        this.element = undefined;
        this.tabs = undefined;
        this.tabTitles = undefined;
        this.tabContents = undefined;
        this.tweetsInfo = [];      
    }

    async callTwitterEndPoint(text, dateFrom, dateTo, numberOfTweets, language)
    {
        var me = this,
            success = true,
            model = me.demoPage.GetModel();

        const url = App.serverIP + `SearchTweets/?twitterContent=${text}&dateFrom=${dateFrom}&dateTo=${dateTo}&numberOfTweets=${numberOfTweets}&language=${language}&model=${model}`

        await fetch(url, 
        {
            method: 'GET'
        })
        .then(await async function (response)
        {
           // if (response.ok)
           // {

                await response.json().then( await async function (json)
                {
                    await json.forEach( async function (item)
                    {
                        var tweetResults = JSON.parse(item);

                        me.tweetsInfo.push
                        ({
                            tweets: tweetResults.tweets,
                            date: tweetResults.date
                        })
                    
                        me.scoreAverage.push
                        ({
                            scores: tweetResults.format,
                            date: tweetResults.date
                        });
                    });
                });   
           // } 
        })
        .catch((e) =>{
            App.showPopUpMessage(e.message);   
            success = false;       
        });

        return success;
    }

    checkTwitterParameters(dateFrom, dateTo, numberOfTweets)
    {
        var errorMessages = [],
            numberOfTweetsNotInteger =  (numberOfTweets === ""  || Number.isInteger(numberOfTweets)),
            previusDateTo = dateFrom > dateTo;


        if (previusDateTo || dateFrom === "" || dateTo === "")
        {
            errorMessages.push( (previusDateTo ? "Date from must be a date before Date to" : "Please select dates") )
        }

        if (numberOfTweets > 100 || numberOfTweets < 10 || numberOfTweetsNotInteger)
        {
            errorMessages.push(("Number of tweets must be a number between 10 and 100"))
        }

        if (document.getElementById('twitterTextArea').value === '')
        {
            errorMessages.push('Please type hastag, user or keyword to search');
        }

        return errorMessages;
    }

    async proccessTwitterApi()
    {
        var me = this,
            text = undefined,
            dateFrom = document.getElementById('dateFrom').value,
            dateTo = document.getElementById('dateTo').value,
            numberOfTweets = document.getElementById('numberOfTweetsInput').value,
            language = document.getElementById('languageDropDownList').value,
            errorMessages = [];

        errorMessages = me.checkTwitterParameters(dateFrom, dateTo, numberOfTweets);

        if (errorMessages.length > 0)
        {
            App.showPopUpMessage(errorMessages);
            return false;
        }
        else
        {
            me.scoreAverage = [];
            me.demoPage.clearScreen();    

            if ( document.getElementById('twitterTextArea') !== null)
            {
                text = document.getElementById('twitterTextArea').value.replace("#", "%23").replace("@", "%40");
            }

            if (text !== undefined && text.length > 0)
            {   
                if(!await me.callTwitterEndPoint(text, dateFrom, dateTo, numberOfTweets, language))
                {
                    return false;
                }
            }

            return true;
        }
    }

    async onClickTwitter()
    {              
        App.showLoader();
        this.tweetsInfo = [];
        this.demoPage = new Demo();

        if (await this.proccessTwitterApi())
        {
            this.scoreAverage.numberOfTweets = document.getElementById('numberOfTweetsInput').value;

            this.createTabs();
            await this.demoPage.CreateElementsWithReponse(this.scoreAverage);
            this.forceUpdate();
        }

        App.hideLoader();
    }
    
    getTabView(tweets)
    {
        var tweetContainer = document.createElement('div');

        for(var i = 0; i < tweets.length; i++)
        {   
            var tweetDiv = document.createElement('div');
            tweetDiv.className = 'tweetDiv';
            tweetDiv.style.backgroundColor = this.getTweetColor(tweets[i].type);
            var content = document.createElement('p');
            content.innerText = tweets[i].text;
            content.style.color = 'white';
            tweetDiv.appendChild(content);
            tweetContainer.appendChild(tweetDiv);
        }

        return tweetContainer;  
    }

    getTweetColor(labelName)
    {
        switch(labelName)
		{
			case 'neutral':
				return 'tomato'
			case 'positive':
				return 'limegreen'
			case 'negative':
				return 'crimson'
            default:
                return 'gray'
		}
    }

    createTabs()
    {
        var me = this,
            tabTitles = [],
            tabContents = [];

        me.tweetsInfo.map((tweetInfo) => 
        {

            var content = []

            tweetInfo.tweets.forEach( tweet => 
            {
                var color = me.getTweetColor(tweet.type) + " tweetDiv";
                content.push(<div className={color}>
                        <p>
                            {tweet.text}
                        </p>
                    </div>)
            })

            tabTitles.push(<Tab>{tweetInfo.date}</Tab>)
            tabContents.push(
            <TabPanel><div className='tweetsContainer'>
                    {content}
                </div>
            </TabPanel>)
        })

        this.tabTitles = tabTitles;
        this.tabContents = tabContents;

        this.tabs = <Tabs>
            <TabList>
                {this.tabTitles}
            </TabList>
                {this.tabContents}
            </Tabs>
        
    }

    render()
    {       
        var today = new Date();
        var mindate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+(today.getDate() - 7);
        var maxdate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

        this.element =  
        
        <div id='twitterContainer' className='twitterContainer'>

            <h1 className='text twitterTitle'>Twitter</h1>

            <div className='twitterParameters'>
                
                <div className='pairParametersContainer'>

                    <div className='twitterParameterContainer'>                     
                        <label className='text labels' for="dateFrom">Date From</label>
                        <input className='inputClass' type="date" id="dateFrom" name="dateFrom" min={mindate} max={maxdate}></input>                
                    </div>

                    <div className='twitterParameterContainer'>                
                        <label className='text labels' for="dateTo">Date To</label>
                        <input className='inputClass' type="date" id="dateTo" name="dateTo" min={mindate} max={maxdate}></input>                
                    </div>

                </div>

                <div className='pairParametersContainer'>

                    <div className='twitterParameterContainer'>
                        <label className='text labels'>Language</label>
                        <select name="models" id="languageDropDownList" className='twitterDropdown inputClass' onChange=
                        {
                            () => 
                                {
                                if(!Demo.checkCrossModel())
                                {
                                        document.getElementById('languageDropDownList').value = 'en';
                                }
                                }
                        }>
                            <option value='en'>English</option>
                            <option value='es'>Spanish</option>
                            <option value='fr'>French</option>
                        </select>

                    </div>


                    <div className='twitterParameterContainer'>
                        <label className='text labels'>Number of tweets</label>
                        <input className='inputTwitterParameter inputClass' id='numberOfTweetsInput'></input>
                    </div>
            
                </div>
                <div className='pairParametersContainer'>

                    <div className='twitterParameterContainer'>       
                        <label className='text labels'>Search Criteria</label>
                        <input className='inputClass' id='twitterTextArea' type='text-input' placeholder='Search tweets by hashtag, user or id'></input>          
                    </div>
                           
                    <button className='proccessButton inputClass' onClick={() => {this.onClickTwitter()}}>Proccess</button>
                    
                </div>

            </div>

            <div className='tweetsContainer' id='tweetsContainer'>
                {this.tabs}
            </div>
        </div>
        return(
            this.demoPage.render(this.element, 'TWITTER')
        );
    }
}

export default TwitterDemo;