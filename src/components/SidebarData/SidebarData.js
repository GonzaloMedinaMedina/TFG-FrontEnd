import React from 'react';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';

export const SidebarData = [
  {
    title: 'Home',
    path: '/',
    icon: <AiIcons.AiFillHome />,
    cName: 'nav-text'
  },
  {
    title: 'Basic Demo',
    path: '/basicDemo',
    icon: <AiIcons.AiTwotoneExperiment />,
    cName: 'nav-text'
  },
  {
    title: 'Twitter Demo',
    path: '/twitterDemo',
    icon: <AiIcons.AiTwotoneExperiment />,
    cName: 'nav-text'
  },
  {
    title: 'Documentation',
    path: '/documentation',
    icon: <IoIcons.IoIosPaper />,
    cName: 'nav-text'
  },
  {
    title: 'Getting Data',
    path: '/gettingData',
    icon: <IoIcons.IoIosPaper />,
    cName: 'nav-text'
  }
];