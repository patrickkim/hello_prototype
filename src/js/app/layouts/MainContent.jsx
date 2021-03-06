import React, { Component } from 'react';
import MainCanvas from './MainCanvas';
import UserBalance from '../components/UserBalance';

export default class MainContent extends Component {

  render() {
    return (
      <div id="MainContent">
        <MainCanvas />
        <UserBalance />
      </div>
    );
  }
}
