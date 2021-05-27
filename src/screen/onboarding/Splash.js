
import React, { Component } from 'react';
import { Platform, StyleSheet, AsyncStorage, View, Image, StatusBar, ImageBackground } from 'react-native';
import { Actions } from 'react-native-router-flux';
import SVGImage from 'react-native-svg-image';
import {
  BarIndicator,
} from 'react-native-indicators';

import messaging from '@react-native-firebase/messaging';
//import firebase from 'react-native-firebase'

export default class Splash extends Component {

  constructor(props) {
    super(props);
    this.state = {
      token: "",
    }

  }

  async componentDidMount() {
    this.checkPermission()
    setTimeout(() => {
      // this.props.navigation.replace('home');
      this.initPage();
    }, 3000);
  }

  initPage = () => {
    AsyncStorage.getItem('login').then((value) => {
      if (value == 'true') {
        this.goHome()
      } else if (value == null) {
        this.props.navigation.replace('intro');
      } else {
        this.props.navigation.replace('intro');
      }

    })

  }


  async requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      this.getToken()
      console.log('Authorization status:', authStatus);
    }

  }


  async checkPermission() {
    const enabled = await messaging().hasPermission();
    if (enabled) {
      console.warn('enabled');
      this.getToken();
    } else {
      console.warn('not enabled');
      this.requestUserPermission();
    }
  }

  goHome() {
    AsyncStorage.getItem('role').then((value) => {
      if (value == '') { } else {
        if (value == 'Customer') {
          this.props.navigation.replace('home');
        } else {
          this.props.navigation.replace('merchant_home');
        }
      }
    })
  }


  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    console.warn(fcmToken);
    if (!fcmToken) {
      fcmToken = await messaging().getToken();
      console.warn(fcmToken);
      if (fcmToken) {
        await AsyncStorage.setItem('fcmToken', fcmToken);
        this.setState({ token: fcmToken })
      }
    } else {
      this.setState({ token: fcmToken })
    }
  }



  render() {
    return (
      <View style={styles.container}>
        <StatusBar translucent barStyle="light-content" hidden={false} backgroundColor="transparent" />
        <Image
          style={styles.logo}
          source={require('../../assets/logo.png')} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  logo: {
    width: 300,
    height: 120,
    justifyContent: 'center',
    resizeMode: 'contain'
  }
});
