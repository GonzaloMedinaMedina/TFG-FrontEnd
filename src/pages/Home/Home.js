import React from 'react';
import './Home.css';

function Home() {
  return (
    <div className='active-page' id='current-page'>
      <div className="headerContainer">
        <h1 className='title'>NLP4SM</h1>
      </div>
        <div className='welcomeContainer'>
          <p className='text-black centerElement'>The Natural Language Processing tool for Twitter</p>
        </div>
        <div className='welcomeRootContainer'>
          <p className='text-black centerElement white padding-top-bot'>What will you find here?</p>         
          <div>
            <div className='flex'>
              <div className='welcomeContainer margin'>
                <p className='text-black centerElement padding-top-bot semiTitle'>If you just wanna feel the power of the NLP, you are in the right place!</p>

                <p className='text-black centerElement'>See what the NLP can do, just try it</p>
                <p className='text-black centerElement'>Go to one of our demos, analyze batch of tweets in real time</p>
                <p className='text-black centerElement'>Enjoy the experience!</p>
              </div>                
                <div className='welcomeContainer margin'>
                  <p className='text-black centerElement padding-top-bot semiTitle'>Are you here just to know more about NLP or how the Twitter API works?</p>
                  <p className='text-black centerElement'>Don't worry, we can help you, just navigate to:</p>
                  <p className='text-black centerElement'>Documentation to learn about finetuning a language model</p>
                  <p className='text-black centerElement'>Getting Data to discover how the Twitter API works</p>
                  <p className='text-black centerElement'>Or just visit this repository {<a href='https://github.com/cardiffnlp/xlm-t/blob/main/README.md'> XLM-T</a>} to have a deeper learning</p> 
              </div>
            </div>
        </div>
        
        </div>
      </div>
  );
}

export default Home;