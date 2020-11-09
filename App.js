/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
*/

import React, {Component, AppRegistry} from 'react';
import { StatusBar } from 'react-native';
import Main from './src/component/navigation/app-stack';

export default class App extends Component{
 
  render() {
    return (
      <>
       <StatusBar backgroundColor='#101023' barStyle="light-content" />
      <Main/>
      </>
    );
  }
}