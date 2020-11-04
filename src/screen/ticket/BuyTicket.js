import React, { Component } from "react";
import { Alert, Dimensions, TouchableOpacity, ImageBackground, StyleSheet, AsyncStorage, StatusBar, ScrollView, } from "react-native";
import { Container, Content, View, Text, Button, Left, Right, Body, Title, List, ListItem, } from 'native-base';
import { Avatar, Icon, } from 'react-native-elements';
const deviceHeight = Dimensions.get("window").height;
const URL = require("../../component/server");

import color from '../../component/color';
const { width: screenWidth } = Dimensions.get('window')
import RNPickerSelect from 'react-native-picker-select';
import {
  BarIndicator,
} from 'react-native-indicators';
import Moment from 'moment';

import Navbar from '../../component/Navbar';

const type = [
  {
    label: '1 (Qty)',
    value: '1',
  },
  {
    label: '2 (Qty)',
    value: '2 (Qty)',
  },
  {
    label: '3 (Qty)',
    value: '3',
  },
];

export default class BuyTicket extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: '',
      name: '',
      id: '',
      details: {}


    };
  }



  componentWillMount() {
    this.setState({ id: this.props.id });
    AsyncStorage.getItem('data').then((value) => {
      if (value == '') { } else {
        this.setState({ data: JSON.parse(value) })
        this.setState({ user: JSON.parse(value).user })
      }
      // this.processGetEvent();
    })


  }




  processGetEvent() {
    const { data, id, } = this.state
   
    this.setState({ loading: true })
    fetch(URL.url + 'events/' + id, {
      method: 'GET', headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Authorization': 'Bearer ' + data.token,
      },
    })
      .then(res => res.json())
      .then(res => {
        console.warn(res);
        if (res.status) {
          this.setState({
            loading: false,
            details: res.data,
          })
        } else {
          Alert.alert('Action failed', res.message, [{ text: 'Okay' }])
          this.setState({ loading: false })
        }
      }).catch((error) => {
        this.setState({ loading: false })
        console.warn(error);
        alert(error.message);
      });


  }

  render() {
    const { details, } = this.state
    const typePlaceholder = {
      label: 'Select Qty',
      value: null,
      color: '#000',
    };


    var left = (
      <Left style={{ flex: 1 }}>
        <Button transparent onPress={() =>this.props.navigation.goBack()}>
          <Icon
            active
            name="ios-arrow-back"
            type='ionicon'
            color='#FFF'
          />
        </Button>
      </Left>
    );

    var right = (
      <Right style={{ flex: 1 }}>
        <Button transparent >
          <Icon
            active
            name="md-more"
            type='ionicon'
            color='#FFF'
          />
        </Button>
      </Right>
    );
    if (this.state.loading) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000000' }}>
          <View style={styles.welcome}>
            <Text style={{ fontSize: 12, color: '#fff' }}>Getting details </Text>
            <BarIndicator count={4} color={color.primary_color} />
            <Text style={{ fontSize: 10, flex: 1, color: '#fff', opacity: 0.6 }}>Please wait...</Text>
          </View>
        </View>
      );
    }

    return (
      <Container style={{ backgroundColor: '#000' }}>
        <Navbar left={left} right={right} title='Ticket Details' bg='#111124' />
        <Content>
          <View style={styles.container}>


            <View style={{ flex: 1, }}>
              <Text style={{ color: '#fff', fontSize: 14, fontWeight: '200', marginLeft: 20, marginTop: 15, marginBottom: 15, fontFamily: 'NunitoSans', }}>Buy Ticket </Text>

              <View style={{ backgroundColor: '#111124' }}>
                <View style={{ paddingRight: 20, paddingLeft: 20 }}>
                  <Text style={styles.title}> GTB FOOD & Drink </Text>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ color: '#fff', fontSize: 10, fontWeight: '200', fontFamily: 'NunitoSans', }}>By</Text>
                    <Text style={{ color: color.primary_color, fontSize: 10, fontWeight: '200', fontFamily: 'NunitoSans', }}> plug officials</Text>
                  </View>

                  <Text style={{ color: '#fff', fontSize: 12, fontWeight: '200', marginTop: 15, fontFamily: 'NunitoSans', }}>Monday, 28TH December. from 10:00AM - 4:00PM (WAT) </Text>
                  <View style={styles.inputView}>
                    <Text style={{ color: '#fff', fontSize: 12, fontWeight: '200', margin: 10, fontFamily: 'NunitoSans', }}>This Event is limited</Text>
                  </View>

                  <View style={{ flexDirection: 'row', marginTop:15 }}>
                    <Text style={{ flex: 1, color: '#fff', fontSize: 14, fontWeight: '200', margin: 10, fontFamily: 'NunitoSans', }}>Number of Tickets</Text>
                    <View style={styles.item}>
                      <RNPickerSelect
                        placeholder={typePlaceholder}
                        items={type}
                        onValueChange={value => {
                          this.setState({
                            type: value,
                          });
                        }}
                        style={pickerSelectStyles}
                        value={this.state.type}
                        useNativeAndroidPickerStyle={false}

                      />
                        <TouchableOpacity  style={{ alignItems:'flex-end', justifyContent: 'flex-end',}}>
                   <Icon
                        active
                        name="ios-arrow-down"
                        type='ionicon'
                        color='#fff'
                    />
              </TouchableOpacity>
                    </View>
                  
                  </View>

                  <View style={{ alignItems: 'flex-end', marginTop: 20, marginBottom: 20 }}>
                    <Text style={{ color: '#fff', fontSize: 12, fontWeight: '200', fontFamily: 'NunitoSans', opacity: 0.55 }}>Total</Text>
                    <Text style={{ color: '#fff', fontSize: 18, fontWeight: '200', fontFamily: 'NunitoSans', }}>FREE</Text>

                  </View>


                </View>

              </View>

   <View style={{ alignItems: 'center', justifyContent:'center', marginTop: 20, marginBottom: 20 , }}>
   <TouchableOpacity  style={styles.enablebutton } block iconLeft>
                                <Text style={{ color: color.secondary_color, marginTop: 15, marginBottom: 15 ,fontSize: 16, fontWeight: '200', fontFamily: 'NunitoSans', }}>REGISTER</Text>
                            </TouchableOpacity>
   </View>
             

            </View>



          </View>


        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 80,

  },
  iconContainer: {
    height: 28,
    width: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10
  },
  title: {
    marginTop: 22,
    color: '#fff',
    fontSize: 16,
    fontFamily: 'NunitoSans-Bold',
  },
  headings: {
    marginTop: 22,
    color: '#fff',
    fontSize: 14,
    fontWeight: '600'
  },
  lineStyle: {
    height: 0.8,
    marginTop: 20,
    opacity: 0.5,
    backgroundColor: '#fff',

  },
  map: {
    height: 100,
    marginTop: 15
  },
  welcome: {
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputView: {
    backgroundColor: 'rgba(247,164,0,0.3)',
    marginTop: 10,
    marginBottom: 10,
    justifyContent: "flex-start",
    borderColor: '#F7A400',
    borderWidth: 1,
    borderRadius: 5,


  },
  item: {
    flexDirection: 'row',
    borderColor: '#8d96a6',
    borderBottomWidth: 0.6,
    alignItems: 'center',
    justifyContent:'flex-start',
    borderColor: '#F7A400',
    borderWidth: 1,
    borderRadius: 5,
    flex: 1
  },
  enablebutton:{
    backgroundColor: color.primary_color, 
    alignItems: 'center', 
    alignContent: 'space-around',
    paddingLeft:53,
    paddingRight:53,
    borderRadius: 5,
},
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    fontFamily: 'NunitoSans-Bold', // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 8,
    color: '#fff',
    paddingRight: 30,
    fontFamily: 'NunitoSans-Bold', // to ensure the text is never behind the icon
  },

});