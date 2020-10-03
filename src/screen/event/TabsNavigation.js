import React, { Component } from 'react';
import { View, Text } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';


import Home from './AllEvents';
import Search from './Search';
import Tickets from './../ticket/ListTickets';
import Payment from './../payment/ManagementPayment';
import Manage from './../engagement/Manage';


import { Card, Icon, SocialIcon} from 'react-native-elements'
import color from '../../component/color'

const Tab = createBottomTabNavigator();


class AppNavigator extends Component {

  render() {

    return (
      <Tab.Navigator

        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {

            if (route.name === 'Home') {
              return (
                <View>
                <Icon
                active
                focused={focused}
                name="home"
                type='antdesign'
                color={color}
              /> 
              <Text style={{ marginTop: 1, marginRight: 7, marginLeft: 7,fontSize: 10, color: color, textAlign: 'center'}}>Home</Text>
              </View>
              );
            } 
            else if (route.name == 'Search') {
              return (
                <View>
              <Icon
              active
              name="search"
              type='font-awesome'
              color={color}
            />
            <Text style={{ marginTop: 1, marginRight: 7, marginLeft: 7,fontSize: 10, color: color, textAlign: 'center',}}>Search</Text>
            </View>
            );
          }
              else if (route.name == 'Tickets') {
                return (
                  <View>
                <Icon
                active
                name="ticket"
                type='font-awesome'
                color={color}
              />
              <Text style={{ marginTop: 1, marginRight: 7, marginLeft: 7,fontSize: 10, color: color, textAlign: 'center',}}>My Tickets</Text>
              </View>
              );
              }else if (route.name === 'Payment') {

                return (
                  <View>
                <Icon
                active
                name="credit-card"
                type='font-awesome'
                color={color}
              />
              <Text style={{ marginTop: 1, marginRight: 7, marginLeft: 7,fontSize: 10, color: color, textAlign: 'center',}}>Payment</Text>
              </View>
              );
            } else if (route.name == 'Manage') {
              return (
                <View>
              <Icon
              active
              name="sliders"
              type='font-awesome'
              color={color}
            />
            <Text style={{ marginTop: 1, marginRight: 7, marginLeft: 7,fontSize: 10, color: color, textAlign: 'center',}}>Manage</Text>
            </View>
            );
            }
          },
        })}
        tabBarOptions={{
      
          activeTintColor: 'black', //'tomato',
          inactiveTintColor: 'gray',
          showLabel: false,
          animationEnabled: true,
          color: '#FFFFFF',
          tintColor: '#FFFFFF',
          activeTintColor: color.primary_color,
          inactiveTintColor: '#ffffff',
          style: {
            backgroundColor: '#101023',
            padding:5
          },
        }}
      >
        <Tab.Screen navigation={this.props.navigation} name="Home" component={Home}/>
        <Tab.Screen navigation={this.props.navigation} name="Search" component={Search}/>
        <Tab.Screen navigation={this.props.navigation} name="Tickets" component={Tickets}/>
        <Tab.Screen name="Payment" component={Payment} />
        <Tab.Screen navigation={this.props.navigation} name="Manage" component={Manage}/>


      </Tab.Navigator>

    );
  }

}

export default AppNavigator;