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
import Clubs from '../../screen/club';
import UpdateProfile from '../../screen/user/UpdateProfile';
import CreatClub from '../../screen/club/CreatClub';
import ReserveSpot from '../../screen/club/ReserveSpot';
import Spots from '../../screen/club/Spots';
import ClubMore from '../../screen/club/More';
import ClubListinDetails from '../../screen/club/Details';
import ClubDetails from '../../screen/merchant/ClubDetails';
import OrgDetails from '../../screen/organizer/Details';
import ScanTicket from '../../screen/ticket/ScanTicket';
import ScanQRcodeTicket from '../../screen/ticket/ScanQRcodeTicket';

import Strange from '../../screen/user/Strange';
//console.disableYellowBox = true;

class AppStack extends Component {

  render() {
    const Stack = createStackNavigator();
    return (
      <Root>
        <NavigationContainer>

          <Stack.Navigator
            screenOptions={{
              gestureEnabled: true,
              headerTintColor: 'white',
              headerStyle: { backgroundColor: '#7862ff' },
              headerShown: false,
            }}
            initialRouteName="Splash">

            <Stack.Screen name="Splash" component={Splash} />
            <Stack.Screen name="sorting" component={Sorting} />
            <Stack.Screen name="category" component={Category} />
            <Stack.Screen name="login" component={Login} />
            <Stack.Screen name="reg" component={Register} />
            <Stack.Screen name='engagement' component={EngagementStart} />
            <Stack.Screen name='intro' component={Intro} />
            <Stack.Screen name='update_user' component={UpdateProfile} />
            <Stack.Screen name='home' component={Home} />
            <Stack.Screen name='merchant_home' component={MerchantHome} />
            <Stack.Screen name='profile' component={Profile} />
            <Stack.Screen name='dashboard' component={Dashboard} />
            <Stack.Screen name='glogin' component={Glogin} />
            <Stack.Screen name='events' component={Events} />
            <Stack.Screen name='createevent' component={CreateEvent} />
            <Stack.Screen name='test' component={Strange} />
            <Stack.Screen name='creatorganizer' component={CreatOrganizer} />
            <Stack.Screen name='organizer_details' component={OrgDetails} />
            <Stack.Screen name='freeT' component={FreeTicket} />
            <Stack.Screen name='paidT' component={PaidTicket} />
            <Stack.Screen name='eventD' component={EventDetails} />
            <Stack.Screen name='buyT' component={BuyTicket} />
            <Stack.Screen name='buyPT' component={BuyPaidTicket} />
            <Stack.Screen name='listT' component={ListTickets} />
            <Stack.Screen name='detailT' component={TicketDetails} />
            <Stack.Screen name='manageP' component={ManagementPayment} />
            <Stack.Screen name='transaction' component={Transaction} />
            <Stack.Screen name='fundW' component={FundWalet} />
            <Stack.Screen name='more' component={MoreEvent} />

            <Stack.Screen name='pay' component={PayPage} />
            <Stack.Screen name='qr' component={QRcode} />
            <Stack.Screen name='withdraw' component={WithDraw} />

            <Stack.Screen name='createRestaurant' component={Create} />

            <Stack.Screen name='restaurants' component={Restaurants} />
            <Stack.Screen name='restaurantD' component={Details} />
            <Stack.Screen name='reserveT' component={ReserveTable} />
            <Stack.Screen name='table' component={Tables} />
            <Stack.Screen name='moreR' component={More} />
            <Stack.Screen name='merchant_dashboard' component={MerchantDashboard} />
            <Stack.Screen name='service_details' component={ServiceDetails} />
            <Stack.Screen name='services' component={Services} />
            <Stack.Screen name='test2' component={Teste} />
            <Stack.Screen name='agent_create' component={CreateAgent} />
            <Stack.Screen name='agent_pay' component={PayAgent} />
            <Stack.Screen name='createMenu' component={CreateMenu} />
            <Stack.Screen name='res_service_details' component={RestaurantDetails} />
            <Stack.Screen name='place_order' component={PlaceOrder} />
            <Stack.Screen name='forget_password' component={ForgetPassword} />
            <Stack.Screen name='change_password' component={ChangePassword} />
            <Stack.Screen name='clubs' component={Clubs} />
            <Stack.Screen name='createClub' component={CreatClub} />
            <Stack.Screen name='clubD' component={ClubListinDetails} />
            <Stack.Screen name='reserveS' component={ReserveSpot} />
            <Stack.Screen name='spotsC' component={Spots} />
            <Stack.Screen name='moreC' component={ClubMore} />
            <Stack.Screen name='club_service_details' component={ClubDetails} />
            <Stack.Screen name='scan_tickets' component={ScanTicket} />
            <Stack.Screen name='scan_tickets_qr' component={ScanQRcodeTicket} />
          </Stack.Navigator>
        </NavigationContainer>
      </Root>
    );
  }

}
export default AppStack;
