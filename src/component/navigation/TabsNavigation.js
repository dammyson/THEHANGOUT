import React, { Component } from 'react';
import { View, Text, Dimensions } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';


import Home from '../../screen/dashboard/DashBoard';
import Payment from '../../screen/payment/ManagementPayment';
import Manage from '../../screen/user/Profile';

import { Card, Icon, SocialIcon } from 'react-native-elements'
import color from './../color'

const Tab = createBottomTabNavigator();


class AppNavigator extends Component {

  render() {

    return (
        <Tab.Navigator

          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              if (route.name === 'Home') {
                return (
                  <View style={{width:Dimensions.get('window').width/3}}>
                    <Icon
                      active
                      focused={focused}
                      name="home"
                      type='antdesign'
                      color={color}
                    />
                    <Text style={{ marginTop: 1, marginRight: 7, marginLeft: 7, fontSize: 10, color: color, textAlign: 'center' }}>Home</Text>
                  </View>
                );
              } else if (route.name === 'Payment') {

                return (
                  <View style={{width:Dimensions.get('window').width/3}}>
                    <Icon
                      active
                      name="creditcard"
                      type='antdesign'
                      color={color}
                    />
                    <Text style={{ marginTop: 1, marginRight: 7, marginLeft: 7, fontSize: 10, color: color, textAlign: 'center', }}>Payment</Text>
                  </View>
                );
              } else if (route.name == 'Manage') {
                return (
                  <View style={{width:Dimensions.get('window').width/3}}>
                    <Icon
                      active
                      name="sliders"
                      type='font-awesome'
                      color={color}
                    />
                    <Text style={{ marginTop: 1, marginRight: 7, marginLeft: 7, fontSize: 10, color: color, textAlign: 'center', }}>Manage</Text>
                  </View>
                );
              }
            },
          })}
            tabBarOptions={{
            activeTintColor: 'black',
            inactiveTintColor: 'gray',
            showLabel: false,
            animationEnabled: true,
            keyboardHidesTabBar:true,
            color: '#FFFFFF',
            activeTintColor: color.primary_color,
            inactiveTintColor: '#ffffff',
            style: {
              backgroundColor: '#101023',
              padding:1,
            },
          }}
        >
          <Tab.Screen navigation={this.props.navigation} name="Home" component={Home} />
          <Tab.Screen name="Payment" component={Payment} />
          <Tab.Screen navigation={this.props.navigation} name="Manage" component={Manage} />


        </Tab.Navigator>
     

    );
  }

}

export default AppNavigator;