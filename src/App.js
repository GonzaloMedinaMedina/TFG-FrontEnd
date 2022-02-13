import './stylesheets/App.css';
import React from 'react';
import { Container } from 'react-bootstrap';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import Demo from './pages/Demo';
import Documentation from './pages/Documentation';
import GettingData from './pages/GettingData';
import TwitterDemo from './components/TwitterDemo';
import BasicDemo from './components/BasicDemo';
import './stylesheets/Navbar.css';


class App extends React.Component
{
  constructor()
  {
    super();
  }

  static showPopUpMessage(messages, titleText = '')
  {
    var popUp = document.createElement('div'),
        title = document.createElement('h1'),
        titleDiv = document.createElement('div'),
        innerDiv = document.createElement('div'),
        button = document.createElement('button'),
        contentDiv = document.createElement('div');
    
    button.className = 'popUpButton';
    button.innerText = 'OK';
    button.onclick = App.closePopUp;

    if (Array.isArray(messages))
    {
      messages.forEach(message => {
        var p = p = document.createElement('p');
        p.innerText += message;
        contentDiv.appendChild(p);
      });
    }
    else
    {
      var p = p = document.createElement('p');
      p.innerText += messages;
      contentDiv.appendChild(p);
    }

    title.innerText = titleText == '' ? 'Something went wrong' : titleText;
    title.className = 'popUpTitle';
    titleDiv.appendChild(title);
    innerDiv.appendChild(titleDiv);

    contentDiv.appendChild(button);
    innerDiv.appendChild(contentDiv);
    innerDiv.className = 'popUpinnerDiv';

    popUp.className = 'popUp';
    popUp.appendChild(innerDiv);
    popUp.id = 'popUp';
    document.getElementById('current-page').appendChild(popUp);
    document.getElementById('nav-menu-items').style.pointerEvents = "none";

}

  static closePopUp()
  {
    document.getElementById('popUp').remove();
    document.getElementById('nav-menu-items').style.pointerEvents = "auto";
  }

  static showLoader()
  {

    var loader = document.createElement('div'),
        divLoader = document.createElement('div');

    loader.className = 'loader';
    loader.id = 'loader';

    divLoader.className = 'popUp';
    divLoader.appendChild(loader);
    divLoader.id = 'divLoader';

    document.getElementById('current-page').appendChild(divLoader);
    document.getElementById('nav-menu-items').style.pointerEvents = "none";
  }

  static hideLoader()
  {
    document.getElementById('divLoader').remove();
    document.getElementById('current-page').style.backgroundColor = '#f5f5f5';
    document.getElementById('nav-menu-items').style.pointerEvents = "auto";
  }

  render() {

  return (
    <div className='full-screen' id='app'>
    <>
        <Router> 
        <Navbar>
          <Container>
            <Navbar.Brand href="#home">Brand link</Navbar.Brand>
          </Container>
        </Navbar>     
          <Switch id='navBarItem'>
            <Route path='/' exact component={Home} />
            <Route path='/demo' component={Demo} />
            <Route path='/basicDemo' component={BasicDemo} />
            <Route path='/twitterDemo' component={TwitterDemo} />
            <Route path='/documentation' component={Documentation} />
            <Route path='/gettingData' component={GettingData} />
          </Switch>
        </Router>
    </>
    </div>
  );
}

}
export default App;
