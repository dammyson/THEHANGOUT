import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';



import Step1 from "./step1";
import step2 from './step2';
import step3 from './step3';
import step4 from './step4';
import step5 from './step5';


class CreatClub extends Component {

  render() {
    const Stack = createStackNavigator();
    return (
          <Stack.Navigator
          screenOptions={{ 
              gestureEnabled: false,
              headerTintColor: 'white',
              headerStyle: { backgroundColor: '#7862ff' }, //tomato
              //headerLeft: null,
              headerShown: false,
             }}
             initialRouteName="Club1"
             >
            <Stack.Screen name="Club1" component={Step1}  />
            <Stack.Screen name="Club2" component={step2}  />
            <Stack.Screen name="Club3" component={step3}  />
            <Stack.Screen name="Club4" component={step4}  />
            <Stack.Screen name="Club5" component={step5}  />
           
          </Stack.Navigator>
      );
  }

}

export default CreatClub;

