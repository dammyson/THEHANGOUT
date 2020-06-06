/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, StatusBar, View} from 'react-native';

import AppNavigator from '../../component/navigation/MerchantTabsNavigator';



export default class MerchantHome extends Component{
 
  render() {
    return (
      <View style={{ flex: 1,}}>
         <StatusBar barStyle="dark-content" hidden={false} backgroundColor="transparent" />
        <AppNavigator/>

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