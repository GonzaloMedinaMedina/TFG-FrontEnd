import React from 'react';
import './TopNavigator.css';
import topArrow from '../../images/topArrow.png';

const TopNavigator = () => 
{
    const NavigateToTop = () => 
    {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    return (<div className='topNavigator' onClick={() => NavigateToTop()}>
                <img src={topArrow} alt='To Top' ></img>
            </div>
    )
}


export default TopNavigator;