import React, { Component } from "react";
import { Alert, Dimensions, TouchableOpacity, ImageBackground, StyleSheet, AsyncStorage, StatusBar, ScrollView, } from "react-native";
import { Container, Content, View, Text, Button, Left, Right, Toast, Title, List, ListItem, } from 'native-base';
import { Avatar, Icon, } from 'react-native-elements';
import DatePicker from 'react-native-datepicker'
import StarRating from 'react-native-star-rating';
const URL = require("../../component/server");

import color from '../../component/color';
const { width: screenWidth } = Dimensions.get('window')
import RNPickerSelect from 'react-native-picker-select';
import {
  BarIndicator,
} from 'react-native-indicators';
import Moment from 'moment';
Moment.locale('en');
import Navbar from '../../component/Navbar';


export default class OrgDetails extends Component {

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
    fetch(URL.url + 'events/' + 53, {
      method: 'GET', headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Authorization': 'Bearer ' + data.token,
      },
    })
      .then(res => res.json())
      .then(res => {
        console.warn(res.data.pastEvents);
       // console.warn(res.data.organizer.pastEvents);
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
                  <View style={{ backgroundColor: '#111123', marginLeft: 20, marginRight: 20 }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginTop: 15, marginBottom: 30, opacity: 0.8, marginLeft: 5 }}>
                      <View style={{ marginRight: 15 }}>
                        <Avatar
                          rounded
                          size="medium"
                          source={{ uri: details.organizer.bannerUrl }}
                        /></View>
                      <View style={{ flex: 1, }}>
                        <View style={{ width: 100, flexDirection: 'row', justifyContent: 'center', justifyContent: 'center' }}>
                          <StarRating
                            disabled={false}
                            maxStars={5}
                            rating={details.rating}
                            iconSet={'FontAwesome'}
                            starSize={15}
                            starStyle={{ borderColor: 'red' }}
                            fullStarColor={color.primary_color}
                            emptyStarColor={color.primary_color}
                          />
                          <Text style={{ marginLeft: 2, color: '#fff', fontSize: 15, fontWeight: '500' }}> {details.rating} </Text>
                        </View>
                        <Text style={{ marginLeft: 2, color: '#fff', fontSize: 15, fontFamily: 'NunitoSans-Bold', }}>{details.organizer.name} </Text>
                        <Text style={{ marginLeft: 2, color: '#fff', fontSize: 13, fontWeight: '200', }}>{details.organizer.description} </Text>
                      </View>
                    </View>

                  </View>

                </View>
                <ScrollView horizontal style={{ marginVertical: 20 }}>

                  {this.renderGallery(details.pastEvents)}

                </ScrollView>

              </ScrollView>
            </View>
          </View>


        </Content>
      </Container>
    );
  }



  renderGallery(data) {

    let cat = [];
    for (var i = 0; i < data.length; i++) {
      let id =  data[i].id 
      cat.push(

          <ImageBackground
            opacity={0.5}
            style={{ borderRadius: 12, width: Dimensions.get('window').width - 50, marginHorizontal:10 }}
            source={{ uri: data[i].banner }}
            imageStyle={{ borderRadius: 20, backgroundColor: 'blue' }}

          >
            <View style={styles.details} >
              <Text style={styles.date}>{Moment(data[i].startDate).format('llll')}</Text>
              <Text style={styles.tittle}>{data[i].title}</Text>
              <View style={styles.piceContainer}>
                <View style={{ flex: 1, flexDirection: 'row', marginTop: 3, marginLeft: 15 }}>
                  <Icon
                    active
                    name="ticket"
                    type='entypo'
                    color='#fff'
                    size={15}
                  />
                  <Text style={styles.price}>{data[i].type}</Text>
                  <Icon
                    active
                    name="music"
                    type='foundation'
                    color='#fff'
                    size={15}
                  />
                  <Text style={styles.price}>{data[i].category}</Text>
                </View>
              </View>

            </View>


          </ImageBackground>


      );
    }
    return cat;
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
  details: {
    marginTop: 120,
    marginBottom: 25,
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
    fontSize: 16,
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
});