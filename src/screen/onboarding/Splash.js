
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
  Actions.home({type: 'replace'});
  //Actions.merchant_home();
          }, 3000);
    }

    initPage = () => {
     
        AsyncStorage.getItem('login').then((value) => {
          if(value=='true'){
            this.goHome()
          }else if(value==null){
            Actions.intro({type: 'replace'});
          }else{
            Actions.intro({type: 'replace'});
          } 
            
        })
       
      }

     goHome(){
      AsyncStorage.getItem('role').then((value) => {
        if (value == '') { } else {
           if(value == 'Customer'){
            Actions.home({type: 'replace'});
           }else{
            Actions.merchant_home({type: 'replace'});
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
      logo:{
        width:300,
        height:120,
        justifyContent: 'center',
        resizeMode: 'contain'
    }
});
