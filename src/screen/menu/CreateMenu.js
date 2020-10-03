import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';



import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";



class Create extends Component {

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
             initialRouteName="Menu1"
             >
            <Stack.Screen name="Menu1" component={Step1}  />
            <Stack.Screen   name="Menu2" component={Step2}  />
            <Stack.Screen   name="Menu3" component={Step3}  />
          </Stack.Navigator>
      );
  }

}

export default Create;

