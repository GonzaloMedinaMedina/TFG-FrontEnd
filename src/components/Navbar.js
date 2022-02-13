import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { SidebarData } from './SidebarData';
import '../stylesheets/Navbar.css';
import { IconContext } from 'react-icons';
import App from '../App';

function Navbar() {

  const [sidebar, setSidebar] = useState(true);
  const showSidebar = () => setSidebar(!sidebar);

  return (
    <>
      <IconContext.Provider value={{ color: '#fff' }}>
        <nav className='nav-menu active' id='nav-menu'>
          <ul className='nav-menu-items' id='nav-menu-items'>
            
            {SidebarData.map((item, index) => {
              if (item.title == 'Demo')
              {
                return(
                <li key={index} className={item.cName}>
                    <Link to={item.path}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  <ul className='sub-menu'>
                    <li className='sub-menuItem'><Link to={'/basicDemo'}>
                      {item.icon}
                      <span>{'Basic Demo'}</span>
                    </Link></li>
                    <li className='sub-menuItem'><Link to={'/twitterDemo'}>
                      {item.icon}
                      <span>{'Twitter Demo'}</span>
                    </Link></li>         
                  </ul>
                </li>
                )
              }
              else
              {
                return (
                  <li key={index} className={item.cName}>
                    <Link to={item.path}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </li>
                );
              }          
            })}
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );

}

export default Navbar;