/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, StatusBar, View} from 'react-native';

import AppNavigatori from '../../component/navigation/TabsNavigation';



export default class Landing extends Component{
 
  render() {
    return (
      <View style={{ flex: 1,}}>
         <StatusBar barStyle="dark-content" hidden={false} backgroundColor="transparent" />
        <AppNavigatori/>

      </View>
     
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});