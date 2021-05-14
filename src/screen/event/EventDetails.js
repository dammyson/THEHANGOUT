import React, { Component } from "react";
import { Alert, Dimensions, TouchableOpacity, ImageBackground, StyleSheet, AsyncStorage, StatusBar, ScrollView, } from "react-native";
import { Container, Content, View, Text, Button, Left, Right, Toast, Title, List, ListItem, } from 'native-base';
import { Avatar, Icon, } from 'react-native-elements';
import DatePicker from 'react-native-datepicker'
import StarRating from 'react-native-star-rating';
const URL = require("../../component/server");
import Modal, { SlideAnimation, ModalContent } from 'react-native-modals';
import color from '../../component/color';
const { width: screenWidth } = Dimensions.get('window')
import RNPickerSelect from 'react-native-picker-select';
import {
  BarIndicator,
} from 'react-native-indicators';
import Moment from 'moment';
Moment.locale('en');
import Navbar from '../../component/Navbar';
import { getIsGuest, getData, getHeaders } from '../../component/utilities';


export default class EventDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      is_guest: true,
      loading: true,
      data: '',
      name: '',
      id: '',
      details: {},
      show_rating: false,
      starCount: 0,
      view_create: false



    };
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

  async componentDidMount() {
    const { id } = this.props.route.params;
    this.setState({ is_guest: await getIsGuest() =="YES" ? true : false})
    this.setState({ id: id });
    if(await getIsGuest() =="NO"){
    AsyncStorage.getItem('data').then((value) => {
      if (value == '') { } else {
        this.setState({ data: JSON.parse(value) })
        this.setState({ user: JSON.parse(value).user })
      }
     
    })}
    this.processGetEvent();
  }

  processGetEvent() {
    const { data, id,is_guest } = this.state
    console.warn(id, getHeaders(is_guest, data.token));

    fetch(URL.url + 'events/' + id, {
      method: 'GET', headers: getHeaders(is_guest, data.token),
    })
      .then(res => res.json())
      .then(res => {
        console.warn(res.data);
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
    fetch(URL.url + 'events/' + id, {
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
      method: 'GET', headers:  getHeaders(is_guest, data.token)
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


  rateEvent() {
    const { data, details, starCount } = this.state
    console.warn(details.organizerId)
    this.setState({ show_rating: false })
    this.setState({ loading: true })
    fetch(URL.url + 'reviews', {
      method: 'POST', headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Authorization': 'Bearer ' + data.token,
      }, body: JSON.stringify({
        EntityId: details.organizerId,
        Module: 'Events',
        Rating: starCount,
      }),
    })
      .then(res => res.json())
      .then(res => {
        console.warn(res);
        if (res.status) {
          this.RgetEventsRequest();
          this.setState({
            loading: false,
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
        <Button   style={{ height: 40, width:40, justifyContent:'center' }} transparent onPress={() => goBack(null)}>
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
         <StatusBar barStyle="light-content" hidden={false} backgroundColor="#101023" />
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
                    <Text style={{ color: '#fff', fontSize: 14, fontWeight: '200', marginTop: 15, opacity: 0.6 }}>{Moment(details.startDate).format('llll')} - {Moment(details.endDate).format('llll')} </Text>

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
                        <Text style={{ marginLeft: 2, color: '#fff', fontSize: 13, fontWeight: '100' }}>Event </Text>
                      </View>

                    </View>

                    <View style={{ alignItems: 'center', backgroundColor: '#111123', flexDirection: 'row', marginTop: 15, opacity: 0.5 }}>


                      <View style={{ flex: 1, flexDirection: 'row', marginTop: 3, marginLeft: 15 }}>
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

                    <ScrollView horizontal style={{ marginVertical: 20 }}>

                      {this.renderGallery(details.galleryList)}

                    </ScrollView>

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



                    <View style={styles.lineStyle} />

                    <Text style={styles.headings}> EVENT DETAILS </Text>
                    <Text style={{ marginLeft: 2, color: '#fff', fontSize: 13, fontWeight: '200', opacity: 0.6, marginTop: 15, }}>  {details.description}</Text>
                   
                    <Text style={styles.headings}> LOCATION </Text>
                    <Text style={{ marginLeft: 2, color: '#fff', fontSize: 13, fontWeight: '200', opacity: 0.6, marginTop: 15, }}>  {details.location}  </Text>
                    <View style={styles.map}>
                    </View>
                    <Text style={styles.headings}> ORGANIZER </Text>
                    <View style={{ flexDirection: 'row', marginTop: 15, marginBottom: 30, opacity: 0.8, marginLeft: 5 }}>
                      <View style={{ marginRight: 15, }}>
                        <Avatar
                          rounded
                          size="medium"
                          source={{ uri: details.organizer.bannerUrl }}
                        /></View>
                      <View style={{ flex: 1, }}>
                        <View style={{ width: 100, marginLeft: 10, flexDirection: 'row', justifyContent: 'center', justifyContent: 'center' }}>
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
                          <Text style={{ marginLeft: 2, color: '#fff', fontSize: 13, fontWeight: '500' }}> {details.rating} </Text>
                        </View>
                        <Text style={{ marginLeft: 2, color: '#fff', fontSize: 13, fontWeight: '500' }}>  {details.organizer.name} </Text>
                        <Text style={{ marginLeft: 2, color: '#fff', fontSize: 13, fontWeight: '200', opacity: 0.6, }}> {details.organizer.description} </Text>
                        <View style={{ marginLeft: 10, flexDirection: 'row', justifyContent: 'center', justifyContent: 'center' }}>
                          <View style={{ flex: 1, justifyContent: 'center', justifyContent: 'center' }}>
                            <TouchableOpacity onPress={() =>  this.state.is_guest? this.showToast() : this.props.navigation.navigate('organizer_details', { id: details.id })} >
                              <Text style={{ marginLeft: 2, color: color.primary_color, fontSize: 13, fontWeight: '200', marginTop: 15, }}>More Details</Text>
                            </TouchableOpacity>
                          </View>
                          <View style={{ flex: 1, justifyContent: 'center', justifyContent: 'center' }}>
                            <TouchableOpacity onPress={() => this.state.is_guest? this.showToast() : this.setState({ show_rating: true })} >
                              <Text style={{ marginLeft: 2, color: color.primary_color, fontSize: 13, fontWeight: '200', marginTop: 15, }}>Rate Us</Text>
                            </TouchableOpacity>
                          </View>
                        </View>

                      </View>
                    </View>

                  </View>

                </View>


              </ScrollView>
            </View>

            <View style={{ alignItems: 'center', justifyContent: 'center',  flexDirection: 'row',  }}>
              <View style={{ alignItems: 'center', marginLeft:10, justifyContent: 'center', flex: 1,borderRadius: 5, backgroundColor: '#000', height: 50, flexDirection: 'row' }}>
                <Icon
                  active
                  name="ticket"
                  type='font-awesome'
                  color='#FFF'
                />
                <Text style={{ marginLeft: 20, color: '#fff', fontSize: 15, fontWeight: '600' }}>  {details.type} </Text>
              </View>
                {this.state.is_guest? 
                 <TouchableOpacity onPress={()=>  this.props.navigation.reset({
                  index: 0,
                  routes: [{ name: 'intro' }],
              })} style={{ height: 50, flexDirection: 'row', marginTop: 20, marginBottom: 20, margin: 10, flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 5, backgroundColor: color.primary_color }}>
                 <Text style={{ color: '#000', fontSize: 15, fontWeight: '600' }}>{"Get Account"}</Text>
               </TouchableOpacity>
                
                : 
                 <TouchableOpacity onPress={() => this.props.navigation.navigate('buyPT', { id: details.id, ticket: details.eventTickets, event: details })} style={{ height: 50, flexDirection: 'row', marginTop: 10, marginBottom: 20, margin: 10, flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 5, backgroundColor: color.primary_color }}>
                 <Text style={{ color: '#000', fontSize: 15, fontWeight: '600' }}>{details.type == 'Free' ? 'GET TICKETS' : 'BUY TICKETS'}</Text>
               </TouchableOpacity>
                }
             

            </View>


          </View>


        </Content>

        <Modal
          visible={this.state.show_rating}
          modalAnimation={new SlideAnimation({
            slideFrom: 'right',
          })}
          rounded={false}
        >
          <ModalContent style={styles.modal}>
            <View style={{ flex: 1 }}>

              <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 1, paddingBottom: 10 }}>
                <Text style={{ fontFamily: 'NunitoSans-Black', color: '#fff', fontSize: 15, textAlign: 'left', paddingBottom: 10, marginTop: 1, flex: 1 }}> Rate Us </Text>
                <TouchableOpacity onPress={() => this.setState({ show_rating: false })} style={{ marginLeft: 10, height: 30, width: 20, backgroundColor: '#000' }}>
                  <Icon
                    name="close"
                    size={20}
                    type='antdesign'
                    color="red"
                  />
                </TouchableOpacity>
              </View>
              <View style={{ paddingTop: 1, marginTop: 15, paddingBottom: 10, flex: 1, }}>
                <View style={{ marginRight: 20, marginLeft: 20, }}>
                  <View style={styles.rowchild}>
                    <View style={{ width: 200, marginTop: 20, marginLeft: 10, justifyContent: 'center' }}>
                      <StarRating
                        disabled={false}
                        maxStars={5}
                        rating={this.state.starCount}
                        selectedStar={(rating) => this.setState({ starCount: rating })}
                        iconSet={'FontAwesome'}
                        starSize={20}
                        starStyle={{ borderColor: 'red' }}
                        fullStarColor={color.primary_color}
                        emptyStarColor={color.primary_color}
                      />
                    </View>
                  </View>
                  <View style={{ marginLeft: 10, flexDirection: 'row', marginTop: 20 }}>
                    <View style={{ justifyContent: 'center', justifyContent: 'center' }}>
                      <TouchableOpacity onPress={() => this.setState({ show_rating: false })} >
                        <Text style={{ marginLeft: 2, color: color.primary_color, fontSize: 13, fontWeight: '200', marginTop: 15, }}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, }} />
                    <View style={{ justifyContent: 'center', justifyContent: 'center' }}>
                      <TouchableOpacity onPress={() => [setTimeout(() => { this.rateEvent() }, 500), this.setState({ show_rating: false }),]} >
                        <Text style={{ marginLeft: 2, color: color.primary_color, fontSize: 13, fontWeight: '200', marginTop: 15, }}>Ok</Text>
                      </TouchableOpacity>
                    </View>
                  </View>




                </View>

              </View>
            </View>
          </ModalContent>
        </Modal>
      </Container>
    );
  }

  renderGallery(data) {

    let cat = [];
    for (var i = 0; i < data.length; i++) {
      cat.push(

        <ImageBackground
          opacity={0.8}
          style={{ height: Dimensions.get('window').height / 6, width: Dimensions.get('window').width / 2, marginHorizontal: 10, borderRadius: 10 }}
          source={{ uri: data[i] }}
          imageStyle={{ backgroundColor: 'blue', alignItems: 'flex-start', justifyContent: 'flex-start', borderRadius: 10 }}
        >
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
  modal: {
    width: Dimensions.get('window').width,
    height: 220,
    justifyContent: 'flex-end',
    margin: 0,
    backgroundColor: "#010113"

  },
});