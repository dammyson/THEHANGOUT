import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Root } from 'native-base';


import Splash from '../../screen/onboarding/Splash';
import Intro from '../../screen/onboarding/Intro';
import Sorting from '../../screen/onboarding/Sorting';
import Category from '../../screen/onboarding/Category';
import Login from '../../screen/user/Login';
import Register from '../../screen/user/Register';
import EngagementStart from '../../screen/engagement/EngagementStart'


import Home from '../../screen/engagement/Home';
import MerchantHome from '../../screen/merchant/MerchantHome';
import Profile from '../../screen/user/Profile';
import Dashboard from '../../screen/dashboard/DashBoard';
import CreateEvent from '../../screen/event/CreatEvent';
import Glogin from '../../screen/user/Glogin';

import Events from '../../screen/event/index';
import Restaurants from '../../screen/restaurant/index';
import test from '../../screen/user/test';

import CreatOrganizer from '../../screen/organizer/Create';


import FreeTicket from '../../screen/ticket/FreeTicket';
import PaidTicket from '../../screen/ticket/PaidTicket';
import EventDetails from '../../screen/event/EventDetails';
import BuyTicket from '../../screen/ticket/BuyTicket';
import BuyPaidTicket from '../../screen/ticket/ButPaidTicket';
import TicketSuccess from '../../screen/ticket/TicketSuccess';
import ListTickets from '../../screen/ticket/ListTickets';
import TicketDetails from '../../screen/ticket/TicketDetail';
import ManagementPayment from '../../screen/payment/ManagementPayment';
import Transaction from '../../screen/payment/Transaction';
import FundWalet from '../../screen/payment/FundWalet';
import PayPage from '../../screen/payment/PayPage';
import MoreEvent from '../../screen/event/MoreEvent';
import QRcode from '../../screen/payment/QRcode';
import WithDraw from '../../screen/payment/WithDraw';
import Create from '../../screen/restaurant/Create';
import Details from '../../screen/restaurant/Details';
import ReserveTable from '../../screen/restaurant/ReserveTable';
import Tables from '../../screen/restaurant/Tables';
import More from '../../screen/restaurant/More';
import MerchantDashboard from '../../screen/merchant/MerchantDashboard';
import ServiceDetails from '../../screen/merchant/ServiceDetails';
import Services from '../../screen/merchant/Services';
import CreateAgent from '../../screen/agent/Create';
import PayAgent from '../../screen/agent/Pay';
import Test from '../../screen/onboarding/Test';
import CreateMenu from '../../screen/menu/CreateMenu';
import RestaurantDetails from '../../screen/merchant/RestaurantDetails';
import PlaceOrder from '../../screen/restaurant/PlaceOrder';

//console.disableYellowBox = true;

class AppStack extends Component {

    render() {
      const Stack = createStackNavigator();
      return (
        <Root>
          <NavigationContainer>
        
            <Stack.Navigator
            screenOptions={{ 
                gestureEnabled: false,
                headerTintColor: 'white',
                headerStyle: { backgroundColor: '#7862ff' }, 
                headerShown: false,
               }}
               initialRouteName="Splash">
  
              <Stack.Screen name="Splash" component={Splash}  />
             
            </Stack.Navigator>
          
          </NavigationContainer>
          </Root>
        );
    }
  
  }
  export default AppStack;