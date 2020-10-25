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
import Teste from '../../screen/onboarding/Test';
import CreateMenu from '../../screen/menu/CreateMenu';
import RestaurantDetails from '../../screen/merchant/RestaurantDetails';
import PlaceOrder from '../../screen/restaurant/PlaceOrder';
import ForgetPassword from '../../screen/user/ForgetPassword';
import ChangePassword from '../../screen/user/ChangePassword';

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
            <Stack.Screen name="sorting" component={Sorting}   />
            <Stack.Screen name="category" component={Category}   />
            <Stack.Screen name="login" component={Login}   />
            <Stack.Screen name="reg" component={Register}   />
            <Stack.Screen name='engagement' component={EngagementStart}   />
            <Stack.Screen name='intro' component={Intro}   />
            <Stack.Screen name='home' component={Home}   />
            <Stack.Screen name='merchant_home' component={MerchantHome}   />
            <Stack.Screen name='profile' component={Profile}   />
            <Stack.Screen name='dashboard' component={Dashboard}   />
            <Stack.Screen name='glogin' component={Glogin}   />
            <Stack.Screen name='events' component={Events}   />
            <Stack.Screen name='createevent' component={CreateEvent}   />
            <Stack.Screen name='test' component={test}   />
            <Stack.Screen name='creatorganizer' component={CreatOrganizer}   />
            <Stack.Screen name='freeT' component={FreeTicket}   />
            <Stack.Screen name='paidT' component={PaidTicket}   />
            <Stack.Screen name='eventD' component={EventDetails}   />
            <Stack.Screen name='buyT' component={BuyTicket}   />
            <Stack.Screen name='buyPT' component={BuyPaidTicket}   />
            <Stack.Screen name='listT' component={ListTickets}   />
            <Stack.Screen name='detailT' component={TicketDetails}   />
            <Stack.Screen name='manageP' component={ManagementPayment}   />
            <Stack.Screen name='transaction' component={Transaction}   />
            <Stack.Screen name='fundW' component={FundWalet}   />
            <Stack.Screen name='more' component={MoreEvent}   />
            
            <Stack.Screen name='pay' component={PayPage}   />
            <Stack.Screen name='qr' component={QRcode}   />
            <Stack.Screen name='withdraw' component={WithDraw}   />

            <Stack.Screen name='createRestaurant' component={Create}   />

            <Stack.Screen name='restaurants' component={Restaurants}   />
            <Stack.Screen name='restaurantD' component={Details}   />
            <Stack.Screen name='reserveT' component={ReserveTable}   />
            <Stack.Screen name='table' component={Tables}   />
            <Stack.Screen name='moreR' component={More}   />

            <Stack.Screen name='merchant_dashboard' component={MerchantDashboard}   />
            <Stack.Screen name='service_details' component={ServiceDetails}   />
            <Stack.Screen name='services' component={Services}   />
            <Stack.Screen name='test2' component={Teste}   />
            <Stack.Screen name='agent_create' component={CreateAgent}   />
            <Stack.Screen name='agent_pay' component={PayAgent}   />


            <Stack.Screen name='createMenu' component={CreateMenu}   />
            <Stack.Screen name='res_service_details' component={RestaurantDetails}   />

            <Stack.Screen name='place_order' component={PlaceOrder}   />
            <Stack.Screen name='forget_password' component={ForgetPassword}   />
            <Stack.Screen name='change_password' component={ChangePassword}   />
           

             
            </Stack.Navigator>
          
          </NavigationContainer>
          </Root>
        );
    }
  
  }
  export default AppStack;
/*
  const prevGetStateForActionHomeStack = Stack.router.getStateForAction;
  Stack.router.getStateForAction = (action, state) => {
  if (state && action.type === 'ReplaceCurrentScreen') {
    const routes = state.routes.slice(0, state.routes.length - 1);
    routes.push(action);
    return {
      ...state,
      routes,
      index: routes.length - 1,
    };
  }
  return prevGetStateForActionHomeStack(action, state);
}

*/