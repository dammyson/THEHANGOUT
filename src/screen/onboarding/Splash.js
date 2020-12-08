
import React, { Component } from 'react';
import { Platform, StyleSheet, AsyncStorage, View, Image, StatusBar, ImageBackground } from 'react-native';
import { Actions } from 'react-native-router-flux';
import SVGImage from 'react-native-svg-image';
import {
  BarIndicator,
} from 'react-native-indicators';

import firebase from 'react-native-firebase'

export default class Splash extends Component {

  constructor(props) {
    super(props);
    this.state = {
      token: "",
    }

  }

  async componentDidMount() {
    this.checkPermission();
    setTimeout(() => {
     //this.initPage();
    this.props.navigation.replace('home');
     
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

    //1
    async checkPermission() {
      const enabled = await firebase.messaging().hasPermission();
      if (enabled) {
        //  console.warn('enabled');
        this.getToken();
      } else {
        // console.warn('not enabled');
        this.requestPermission();
      }
      // firebase.messaging().subscribeToTopic("global");
    }
    async getToken() {
      let fcmToken = await AsyncStorage.getItem('fcmToken');
      console.warn(fcmToken);
      this.setState({ token: fcmToken })
      if (!fcmToken) {
        fcmToken = await firebase.messaging().getToken();
        console.warn(fcmToken);
        if (fcmToken) {
          // user has a device token
          await AsyncStorage.setItem('fcmToken', fcmToken);
          this.setState({ token: fcmToken })
        }
      }
    }
  
    //2
    async requestPermission() {
      try {
        await firebase.messaging().requestPermission();
        // User has authorised
        this.getToken();
      } catch (error) {
        // User has rejected permissions
        console.warn('permission rejected');
      }
    }
  

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" hidden={false} backgroundColor="transparent" />
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
