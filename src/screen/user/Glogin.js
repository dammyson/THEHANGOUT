import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Animated, TouchableOpacity } from 'react-native';

import{ Easing } from 'react-native-reanimated';
import { TapGestureHandler, State } from 'react-native-gesture-handler';
const { width, height } = Dimensions.get('window');
const {
  Value,
  event,
  block,
  cond,
  eq,
  set,
  Clock,
  startClock,
  stopClock,
  debug,
  timing,
  clockRunning,
  interpolate,
  Extrapolate,
  concat,
} = Animated;



class Glogin extends Component {
  constructor(props) {
    super(props);
    this.buttonOpacity = new Value(1);
    this.state ={
      animation: new Animated.Value(0),
      animation2: new Animated.Value(0)
    }
  

  }
 

anit(){
  Animated.timing(
    this.state.animation,
    {
      toValue: 250,
      duration: 1000
    }
    
  ).start();


}
  render() {
  
    return (
      <View style={{flex:1}}>
      <Animated.View 
      style={{   
      ...objectStyles.object,
      transform: [
        { translateY: this.state.animation }
      ]
    }} >
      </Animated.View>

<TouchableOpacity onPress={() => this.anit()}>
  <Text>LOLO</Text>
</TouchableOpacity>
    </View>
    );
  }
}
export default Glogin;

const objectStyles = {
  object: {
    backgroundColor: 'red',
    width: 100,
    height: 100
  },
  objec: {
    backgroundColor: 'red',
    width: 600,
    height: 100
  }
}