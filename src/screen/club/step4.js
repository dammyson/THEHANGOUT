import React, { Component } from "react";
import { Alert, Dimensions, TouchableOpacity, TextInput, StyleSheet, TouchableHighlight } from "react-native";
import { Container, Content, View, Text, Button, Left, Right, Body, Title, List, ListItem, } from 'native-base';
import { Avatar, Badge, } from 'react-native-elements';
import { Card, Icon, SocialIcon } from 'react-native-elements'
import { placeApi } from '../../component/utilities/Keys';
import { Actions } from 'react-native-router-flux';
const deviceHeight = Dimensions.get("window").height;
import _ from "lodash";
import color from '../../component/color';
const { width: screenWidth } = Dimensions.get('window')
import Navbar from '../../component/Navbar';
const URL = require("../../component/server");
import {
  getLocation,
  geocodeLocationByName,
  geocodeAddressByName
} from '../../component/utilities/locationService';

export default class step4 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      venue: '',
      data: '',
      error: "",
      destination: "",
      latitude: 6.5244,
      longitude: 3.3792,
      locationPredictions: []

    };
    this.onChangeDestinationDebounced = _.debounce(
      this.onChangeDestination,
      1000
    );
  }

  nextStep = () => {
    const { venue, latitude, longitude, data } = this.state;
    // Save state for use in other steps
    if (venue == "") {
      Alert.alert('Validation failed', "All fields are requried", [{ text: 'Okay' }])
      return
    }
    const data_moving = data;
    data_moving['venue'] = venue
    data_moving['latitude'] = latitude
    data_moving['longitude'] = longitude
    this.props.navigation.navigate('Club5', { data_moving: data_moving });
  };

  goBack() {
    const { goBack } = this.props.navigation;
    goBack(null)
  }

  componentDidMount() {
    const { data_moving } = this.props.route.params;
    console.warn(data_moving)
    this.setState({ data: data_moving})
    console.warn(placeApi())
    var cordinates = getLocation();
    cordinates.then((result) => {
      this.setState({
        latitude: result.latitude,
        longitude: result.longitude
      });
      console.log(result);
    }, err => {
      console.log(err);
    });



  }


  countChange(text) {
    this.setState({ count: 140 - text.length })

  }


  onChangeDestination = async (venue) => {
    const { longitude, latitude } = this.state;
    if (venue.lenght < 4) {
      return
    }
    const apiKey = 'AIzaSyBuEYeKLbJ0xnFwHKT-z2Kq174a3f7u4ac'
    const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${apiKey}&input=${venue}&location=${latitude},${longitude}&radius=2000`;
    console.log(apiUrl);
    try {
      const result = await fetch(apiUrl);
      const json = await result.json();
      console.log(json)
      this.setState({
        locationPredictions: json.predictions
      });
    } catch (err) {
      console.error(err);
    }
  }


  onAddressSelected = (location) => {
    this.setState({ locationPredictions: [], venue: location })
    geocodeLocationByName(location).then((result) => {
      console.warn(result)
      this.setState({
        latitude: result.lat, longitude: result.lng
      })
    }, err => {
      console.log(err);
    });
  }

  renderPrediction = (predictions) => {
    let cat = [];
    for (var i = 0; i < predictions.length; i++) {
      let location = predictions[i].structured_formatting.main_text
      cat.push(
        <TouchableHighlight
          onPress={() => this.onAddressSelected(location)}>
          <View style={{ marginLeft: 10, marginRight: 10 }}>
            <Text style={styles.suggestions}>
              {predictions[i].structured_formatting.main_text}
            </Text>
          </View>
        </TouchableHighlight>
      );
    }
    return cat;
  }

  render() {

    var left = (
      <Left style={{ flex: 1 }}>
        <Button transparent onPress={() => this.goBack()}>
          <Icon
            active
            name="ios-arrow-back"
            type='ionicon'
            color='#FFF'
          />
        </Button>
      </Left>
    );


    return (
      <Container style={{ backgroundColor: "#010113" }}>
        <Navbar left={left} title={this.state.data.title} bg='#101023' />
        <Content>
          <View style={styles.container}>
            <View>
              <Text style={styles.titleText}>CHOOSE CLUB VENUE</Text>
            </View>
            <View style={styles.item}>
              <Icon active name="md-locate" type='ionicon' color='red' />
              <TextInput
                placeholder="Search for a location"
                defaultValue={this.state.venue}
                placeholderTextColor='#8d96a6'
                returnKeyType="next"
                onSubmitEditing={() => this.nextStep()}
                keyboardType='default'
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.menu}
                onChangeText={venue => {
                  this.setState({ venue });
                  this.onChangeDestinationDebounced(venue);
                }}

              />

              <TouchableOpacity style={{ height: 30, width: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: 'red' }}>
                <Icon active name="search" type='feather' color='#fff' />
              </TouchableOpacity>

            </View>
            <View style={{ backgroundColor: "#101023", }}>
              {this.renderPrediction(this.state.locationPredictions)}
            </View>
            <View style={styles.nextContainer}>
              <TouchableOpacity onPress={this.nextStep} style={styles.qrbuttonContainer} block iconLeft>
                <Icon
                  active
                  name="arrowright"
                  type='antdesign'
                  color={color.button_blue}
                />
              </TouchableOpacity>

            </View>
          </View>
        </Content>
      </Container>
    );
  }

  renderItem = ({ item }) => {
    return (
      <View style={{ marginLeft: 20, marginRight: 20, marginTop: 30 }}>
        <Text style={{ fontSize: 14, color: '#ffffff', }}>Oriental Hotel Lekki Lagos </Text>
        <Text style={{ fontSize: 12, color: '#8d96a6', }}>Lekki-expressway Lagos LA </Text>
      </View>

    )

  }
}


const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 80,
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: "6%"
  },
  titleText: {
    fontSize: 21,
    color: '#ffffff',
    marginTop: 25,
    marginLeft: 15,
    fontFamily: 'NunitoSans-Bold'
  },
  titlesubText: {
    fontSize: 15,
    color: '#8d96a6',
    marginTop: 25,
    marginLeft: 15,
    fontFamily: 'NunitoSans-Bold'
  },
  item: {
    flexDirection: 'row',
    marginTop: 2,
    margin: 15,
    borderColor: 'red',
    borderBottomWidth: 2,
    alignItems: 'center',
    marginRight: 20,
  },
  menu: {
    flex: 1,
    marginRight: 13,
    marginLeft: 13,
    fontSize: 20,
    color: '#ffffff',
    textAlign: 'left',
    fontFamily: 'NunitoSans-Bold'
  },
  qrbuttonContainer: {
    flexDirection: 'row',
    backgroundColor: color.white,
    marginTop: 1,
    borderRadius: 40,
    padding: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,

  },
  nextContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',

    paddingBottom: 20
  },
  suggestions: {
    backgroundColor: "#101023",
    padding: 8,
    fontSize: 14,
    borderWidth: 0.5,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 10,
    color: '#fff',
    fontFamily: 'NunitoSans-Light'
  },
});
