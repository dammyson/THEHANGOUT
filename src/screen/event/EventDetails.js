import React, { Component } from "react";
import { Alert, Dimensions, TouchableOpacity, ImageBackground, StyleSheet, AsyncStorage, StatusBar, ScrollView, } from "react-native";
import { Container, Content, View, Text, Button, Left, Right, Toast, Title, List, ListItem, } from 'native-base';
import { Avatar, Icon, } from 'react-native-elements';
import DatePicker from 'react-native-datepicker'
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


export default class EventDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: '',
      name: '',
      id: '',
      details: {}


    };
  }



  componentWillMount() {
    const { id } = this.props.route.params;

    this.setState({ id: id });
    AsyncStorage.getItem('data').then((value) => {
      if (value == '') { } else {
        this.setState({ data: JSON.parse(value) })
        this.setState({ user: JSON.parse(value).user })
      }
      this.processGetEvent();
    })


  }




  processGetEvent() {
    const { data, id, } = this.state
    console.warn(id);

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
            details: res.data,
            loading: false
          })
        } else {
          Alert.alert('Action failed', res.message, [{ text: 'Okay' }])
        }
      }).catch((error) => {
        this.setState({ loading: false })
        console.warn(error);
        alert(error.message);
      });


  }


  RgetEventsRequest() {
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




  };

  likeUnlikeRequest(id, pos) {
    const { data, } = this.state
    fetch(URL.url + 'events/like/' + id, {
      method: 'GET', headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Authorization': 'Bearer ' + data.token,
      }
    })
      .then(res => res.json())
      .then(res => {
        if (res.status) {
          if (pos) {
            Toast.show({
              text: 'Event removed from favorite !',
              position: 'bottom',
              type: 'success',
              buttonText: 'Dismiss',
              duration: 2000
            });
          } else {
            Toast.show({
              text: 'Event Added to favorite !',
              position: 'bottom',
              type: 'success',
              buttonText: 'Dismiss',
              duration: 2000
            });
          }

          this.RgetEventsRequest()
        } else {

        }
      })
      .catch(error => {
        alert(error.message);
        console.warn(error);

      });
  };



  render() {
    const { state, goBack } = this.props.navigation;
    const { details, } = this.state
    const ticketVisibility = {
      label: 'Select visibility',
      value: null,
      color: '#000',
    };


    var left = (
      <Left style={{ flex: 1 }}>
        <Button transparent onPress={() => goBack(null)}>
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
        <Button transparent>
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
      <Container style={{ backgroundColor: '#101023' }}>
        <Navbar left={left} right={right} title={details.title} bg='#111123' />
        <Content>
          <View style={styles.container}>


            <View style={{ flex: 1, }}>
              <ScrollView style={{ flex: 1, }}>
                <View style={{ flex: 1, }}>
                  <ImageBackground
                    opacity={0.8}
                    style={{ height: Dimensions.get('window').height / 3 }}
                    source={{ uri: details.banner }}
                    imageStyle={{ backgroundColor: 'blue', alignItems: 'flex-start', justifyContent: 'flex-start' }}
                  >




                    <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end', padding: 20 }}>
                      <View style={[styles.iconContainer, { marginRight: 15 }]}>
                        {details.isLike ?
                          <TouchableOpacity onPress={() => this.likeUnlikeRequest(details.id, details.isLike)}>

                            <Icon
                              active
                              name="heart"
                              type='antdesign'
                              color='red'
                              size={15}
                            />
                          </TouchableOpacity>

                          :

                          <TouchableOpacity onPress={() => this.likeUnlikeRequest(details.id, details.isLike)}>

                            <Icon
                              active
                              name="hearto"
                              type='antdesign'
                              color='red'
                              size={15}
                            />
                          </TouchableOpacity>

                        }

                      </View>
                    </View>

                  </ImageBackground>

                  <View style={{ backgroundColor: '#111123', marginLeft: 20, marginRight: 20 }}>
                    <Text style={styles.title}> {details.title} </Text>
                    <Text style={{ color: '#fff', fontSize: 14, fontWeight: '200', marginTop: 15, opacity: 0.6 }}>Monday 28TH EDC. 10AM </Text>

                    <View style={{ alignItems: 'center', backgroundColor: '#111123', flexDirection: 'row', marginTop: 15, opacity: 0.5 }}>
                      <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginRight: 15 }}>
                        <Icon
                          active
                          name="ticket"
                          type='font-awesome'
                          color='#FFF'
                        />
                        <Text style={{ marginLeft: 2, color: '#fff', fontSize: 13, fontWeight: '100' }}> {details.type} </Text>
                      </View>

                      <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                        <Icon
                          active
                          name="food"
                          type='material-community'
                          color='#FFF'
                        />
                        <Text style={{ marginLeft: 2, color: '#fff', fontSize: 13, fontWeight: '100' }}> Food </Text>
                      </View>

                    </View>


                    <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 15, opacity: 0.8, marginLeft: 10 }}>
                      <Icon
                        active
                        name="location-pin"
                        type='simple-line-icon'
                        color='#FFF'
                      />
                      <Text style={{ marginLeft: 2, color: '#fff', fontSize: 13, fontWeight: '200' }}> {details.location} </Text>
                    </View>



                    <View style={styles.lineStyle} />

                    <Text style={styles.headings}> EVENT DETAILS </Text>
                    <Text style={{ marginLeft: 2, color: '#fff', fontSize: 13, fontWeight: '200', opacity: 0.6, marginTop: 15, }}>  {details.description}</Text>
                    <Text style={{ marginLeft: 2, color: color.primary_color, fontSize: 13, fontWeight: '200', opacity: 0.6, marginTop: 15, }}> Read more</Text>

                    <Text style={styles.headings}> LOCATION </Text>
                    <Text style={{ marginLeft: 2, color: '#fff', fontSize: 13, fontWeight: '200', opacity: 0.6, marginTop: 15, }}>  {details.location}  </Text>
                    <View style={styles.map}>
                    </View>
                    <Text style={styles.headings}> ORGANIZER </Text>
                    <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginTop: 15, opacity: 0.8, marginLeft: 5 }}>
                      <View style={{ marginRight: 15 }}>
                        <Avatar
                          rounded
                          size="large"
                          source={{ uri: details.organizer.bannerUrl }}
                        /></View>
                      <View style={{ flex: 1, }}>
                        <Text style={{ marginLeft: 2, color: '#fff', fontSize: 13, fontWeight: '500' }}>  {details.organizer.name} </Text>
                        <Text style={{ marginLeft: 2, color: '#fff', fontSize: 13, fontWeight: '200', opacity: 0.6, }}> {details.organizer.description} </Text>
                      </View>
                    </View>

                  </View>

                </View>


              </ScrollView>
            </View>

            <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#111123', flexDirection: 'row', height: 50, }}>
              <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, flexDirection: 'row' }}>
                <Icon
                  active
                  name="ticket"
                  type='font-awesome'
                  color='#FFF'
                />
                <Text style={{ marginLeft: 20, color: '#fff', fontSize: 15, fontWeight: '600' }}>  {details.type} </Text>
              </View>

                { details.type =='Free' ? null 
                :
              <TouchableOpacity onPress={() => this.props.navigation.navigate('buyPT', { id: details.id, ticket: details.eventTickets, type: 'replace' })} style={{ height: 50, flexDirection: 'row', marginTop: 20, marginBottom: 20, margin: 10, flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 5, backgroundColor: color.primary_color }}>
                <Text style={{ color: '#000', fontSize: 15, fontWeight: '600' }}>BUY TICKETS</Text>
              </TouchableOpacity>
              }
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
    fontSize: 22,
    fontWeight: '600'
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
});