
import React, { Component } from 'react';
import { Platform, StyleSheet, AsyncStorage, View, Image, StatusBar, ImageBackground } from 'react-native';
import { Actions } from 'react-native-router-flux';
import SVGImage from 'react-native-svg-image';
import {
  BarIndicator,
} from 'react-native-indicators';

export default class Splash extends Component {

  async componentDidMount() {
    setTimeout(() => {
      //this.initPage();
     this.props.navigation.navigate('home');
     
    }, 3000);
  }

  initPage = () => {

    AsyncStorage.getItem('login').then((value) => {
      if (value == 'true') {
        this.goHome()
      } else if (value == null) {
        this.props.navigation.navigate('intro');
      } else {
        this.props.navigation.navigate('intro');
      }

    })

  }

  goHome() {
    AsyncStorage.getItem('role').then((value) => {
      if (value == '') { } else {
        if (value == 'Customer') {
          this.props.navigation.navigate('home');
        } else {
          this.props.navigation.navigate('merchant_home');
        }
      }


    })
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
