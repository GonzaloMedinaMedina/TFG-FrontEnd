import './stylesheets/App.css';
import React from 'react';
import { Container } from 'react-bootstrap';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import Demo from './pages/Demo';
import Documentation from './pages/Documentation';
import GettingData from './pages/GettingData';
import './stylesheets/Navbar.css';

function App() {

  return (
    <div className='full-screen'>
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
            <Route path='/documentation' component={Documentation} />
            <Route path='/gettingData' component={GettingData} />
          </Switch>
        </Router>
    </>
    </div>
  );
}

export default App;
