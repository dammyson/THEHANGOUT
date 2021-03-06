import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';



import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";
import Step4 from "./step4";
import Step5 from "./step5";
import Step6 from "./step6";


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
             initialRouteName="Rest1"
             >
            <Stack.Screen name="Rest1" component={Step1}  />
            <Stack.Screen   name="Rest2" component={Step2}  />
            <Stack.Screen   name="Rest3" component={Step3}  />
            <Stack.Screen  name="Rest4" component={Step4}  />
            <Stack.Screen  name="Rest5" component={Step5}  />
            <Stack.Screen  name="Rest6" component={Step6}  />
          </Stack.Navigator>
      );
  }

}

export default Create;

