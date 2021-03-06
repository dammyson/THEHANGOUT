import React, { Component } from "react";
import { Alert, Dimensions, TouchableOpacity, ImageBackground, StyleSheet, AsyncStorage, StatusBar, ScrollView, } from "react-native";
import { Container, Content, View, Text, Button, Left, Right, Toast, Title, List, ListItem, } from 'native-base';
import { Avatar, Icon, } from 'react-native-elements';
import DatePicker from 'react-native-datepicker'
const deviceHeight = Dimensions.get("window").height;
const URL = require("../../component/server");
import { getIsGuest, getData, getHeaders } from '../../component/utilities';
import color from '../../component/color';
const { width: screenWidth } = Dimensions.get('window')
import RNPickerSelect from 'react-native-picker-select';
import {
  BarIndicator,
} from 'react-native-indicators';
import Moment from 'moment';
Moment.locale('en');
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



 async componentWillMount() {
    const { id } = this.props.route.params;

    this.setState({ id: id });
    if (await getIsGuest() == "NO") {
      AsyncStorage.getItem('data').then((value) => {
        if (value == '') { } else {
          this.setState({ data: JSON.parse(value) })
          this.setState({ user: JSON.parse(value).user })
        }
       
      })
    }

    this.processGetEvent();
  }


  async componentDidMount() {
    this.setState({ is_guest: await getIsGuest() == "YES" ? true : false })
  }


  showToast(){
    Toast.show({
        text: 'This feature is only available to registered user',
        position: 'top',
        type: 'warning',
        buttonText: 'Dismiss',
        duration: 2000
    });
}

  processGetEvent() {
    const { data, id, is_guest } = this.state
    console.warn("jdjdjdjdjdj"+id);

    fetch(URL.url + 'clubs/' + id, {
      method: 'GET', headers: getHeaders(is_guest, data.token)
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
    const { data, id,is_guest } = this.state

    this.setState({ loading: true })
    fetch(URL.url + 'clubs/' + id, {
      method: 'GET', headers: getHeaders(is_guest, data.token)
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
    const { data,is_guest } = this.state

    if(is_guest){
      this.showToast()
       return
   }
    fetch(URL.url + 'events/like/' + id, {
      method: 'GET', headers: getHeaders(is_guest, data.token)
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
        <Button  style={{ height: 40, width:40, justifyContent:'center' }} transparent onPress={() => goBack(null)}>
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
            <BarIndicator count={4} color={color.club_color} />
            <Text style={{ fontSize: 10, flex: 1, color: '#fff', opacity: 0.6 }}>Please wait...</Text>
          </View>
        </View>
      );
    }

    return (
      <Container style={{ backgroundColor: '#101023' }}>
        <Content>
          <View style={styles.container}>
            <View style={{ flex: 1, }}>
              <ScrollView style={{ flex: 1, }}>
                <View style={{ flex: 1, }}>
                  <ImageBackground
                    opacity={0.8}
                    style={{ height: Dimensions.get('window').height / 3 }}
                    source={{ uri: details.imageUrl }}
                    imageStyle={{ backgroundColor: 'blue', alignItems: 'flex-end', justifyContent: 'flex-end' }}
                  >
                    <View style={{ paddingTop: 20, marginLeft: 20 }}>
                      <Button transparent onPress={() => this.props.navigation.goBack()}>
                        <Icon
                          active
                          name="ios-arrow-back"
                          type='ionicon'
                          color='#FFF'
                          size={30}
                        />
                      </Button>
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'flex-end' }}>
                      <View style={styles.details} >
                        <Text style={styles.date}>{Moment(details.date).calendar()}</Text>
                        <Text style={styles.tittle}>{details.name}</Text>

                        <View style={{ alignItems: 'center', marginLeft: 15, flexDirection: 'row', marginBottom: 15, opacity: 0.5 }}>
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
                            <Text style={{ marginLeft: 2, color: '#fff', fontSize: 13, fontWeight: '100' }}>Event </Text>
                          </View>

                          <View style={{ flexDirection: 'row', marginTop: 3, marginLeft: 15 }}>
                            <Icon
                              active
                              name="map-marker-distance"
                              type='material-community'
                              color='#fff'
                              size={15}
                            />
                            <Text style={{ marginLeft: 2, color: '#fff', fontSize: 13, fontWeight: '100' }}> {details.distance} ({details.duration})</Text>

                          </View>


                        </View>

                      </View>
                    </View>
                  </ImageBackground>

                  <View style={{ backgroundColor: '#111123', marginLeft: 20, marginRight: 20 }}>
                    <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 15, opacity: 0.8, marginLeft: 10 }}>
                      <Icon
                        active
                        name="location-pin"
                        type='simple-line-icon'
                        color='#FFF'
                      />
                      <Text style={{ marginLeft: 2, color: '#fff', fontSize: 13, fontWeight: '200' }}> {details.location} </Text>
                    </View>
                    <View style={styles.piceContainer}>

                    </View>

                    <Text style={styles.headings}> ABOUT </Text>
                    <Text style={{ marginLeft: 2, color: '#fff', fontSize: 13, fontWeight: '200', opacity: 0.6, marginTop: 15, }}>  {details.description}</Text>

                    <Text style={styles.headings}> STARRING </Text>
                    <Text style={{ marginLeft: 2, color: '#fff', fontSize: 13, fontWeight: '200', opacity: 0.6, marginTop: 15, }}>  {details.starring}  </Text>


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

              <TouchableOpacity onPress={() =>this.state.is_guest? this.showToast() :  this.props.navigation.navigate('reserveS', { club: details })} style={{ height: 50, flexDirection: 'row', marginTop: 20, marginBottom: 20, margin: 10, flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 5, backgroundColor: color.club_color }}>
                <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>{'RESERVE A SPOT'}</Text>
              </TouchableOpacity>

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
    height: Dimensions.get('window').height - 40,

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
  date: {
    marginRight: 13,
    marginLeft: 13,
    fontSize: 12,
    color: '#ffffff',
    textAlign: 'left',
    fontFamily: 'NunitoSans-Bold'
  },
  tittle: {
    marginRight: 13,
    marginLeft: 13,
    fontSize: 22,
    color: '#ffffff',
    textAlign: 'left',
    fontWeight: '600',
    fontFamily: 'NunitoSans-Bold'
  },
  price: {
    marginRight: 5,
    marginLeft: 5,
    fontSize: 10,
    color: '#ffffff',
    textAlign: 'left',
    fontFamily: 'NunitoSans-Bold'
  },
  piceContainer: {
    flexDirection: 'row'
  },
});