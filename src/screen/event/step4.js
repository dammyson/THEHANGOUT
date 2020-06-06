import React, { Component } from "react";
import { Alert, Dimensions, TouchableOpacity, TextInput, StyleSheet, FlatList } from "react-native";
import { Container, Content, View, Text, Button, Left, Right, Body, Title, List, ListItem, } from 'native-base';
import { Avatar, Badge, } from 'react-native-elements';
import { Card, Icon, SocialIcon } from 'react-native-elements'
import Carousel, { Pagination, ParallaxImage } from 'react-native-snap-carousel';
import { Actions } from 'react-native-router-flux';
const deviceHeight = Dimensions.get("window").height;

import color from '../../component/color';
const { width: screenWidth } = Dimensions.get('window')
import Navbar from '../../component/Navbar';

export default class step4 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      venue: '',
      data: '',

    };
  }

  nextStep = () => {
    const { next, saveState } = this.props;
    // Save state for use in other steps
    if(this.state.venue == ""){
      Alert.alert('Validation failed', "All fields are requried", [{ text: 'Okay' }])
      return
    }
    saveState({ venue: this.state.venue });
  
    // Go to next step
    next();
  };

  goBack() {
    const { back } = this.props;
    // Go to previous step
    back();
  }

  componentDidMount() {
    const { getState } = this.props;
    const state = getState();
    this.setState({ data: state })
  }


  countChange(text) {
    this.setState({ count: 140 - text.length })

  }

  render() {

    var left = (
      <Left style={{ flex: 1 }}>
        <Button transparent onPress={this.props.back}>
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
      <Container style={{ backgroundColor: 'transparent' }}>
        <Navbar left={left} title={this.state.data.title} bg='#101023' />
        <Content>
          <View style={styles.container}>
            <View>
              <Text style={styles.titleText}>CHOOSE EVENT VENUE</Text>
            </View>
            <View style={styles.item}>
              <Icon active name="md-locate" type='ionicon' color='red' />
              <TextInput
                placeholder="Search for a location"
                placeholderTextColor='#8d96a6'
                returnKeyType="next"
                onSubmitEditing={() => this.nextStep()}
                keyboardType='default'
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.menu}
                onChangeText={text => [this.countChange(text), this.setState({ venue: text})]}
              />

              <TouchableOpacity style={{ height: 30, width: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: 'red' }}>
                <Icon active name="search" type='feather' color='#fff' />
              </TouchableOpacity>

            </View>
           

            <View style={styles.nextContainer}>
              <TouchableOpacity  onPress={this.nextStep}   style={styles.qrbuttonContainer} block iconLeft>
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

const slides = [
  {
    key: 'somethun',
    title: 'Put your money',

  },
  {
    key: 'somethun-dos',
    title: 'Fund your mobile ',

  },
  {
    key: 'somethun-dos',
    title: 'No More Change wahala !',
  }
];

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
  }
});