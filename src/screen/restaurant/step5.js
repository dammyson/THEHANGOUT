import React, { Component } from "react";
import { Alert, Dimensions, TouchableOpacity, AsyncStorage, StyleSheet, FlatList } from "react-native";
import { Container, Content, View, Text, Button, Left, Right, } from 'native-base';
import { Card, Icon, SocialIcon } from 'react-native-elements'
import {
  BarIndicator,
} from 'react-native-indicators';

import {
  SelectMultipleButton,
} from "react-native-selectmultiple-button";
import _ from "lodash";
import color from '../../component/color';
import Navbar from '../../component/Navbar';
const URL = require("../../component/server");



export default class step4 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      multipleSelectedData: [],
      multipleData: [],
      venue: '',
      data: '',
      loading: true,
      dataone: [],
    };
  }

  nextStep = () => {
    const { next, saveState } = this.props;
    const { dataone, multipleSelectedData } = this.state
    var serverarray = [];

    for (let i = 0; i < multipleSelectedData.length; i++) {
      serverarray.push(
        dataone[this.state.dataone.map(function (e) {
          return e.name;
        }).indexOf(multipleSelectedData[i])].id
      )
    }
    // Save state for use in other steps
    if (serverarray.length < 1) {
      Alert.alert('Validation failed', "Select atleast a category !", [{ text: 'Okay' }])
      return
    }
    saveState({ category: serverarray });

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
    AsyncStorage.getItem('data').then((value) => {
      if (value == '') { } else {
        this.setState({ udata: JSON.parse(value) })

      }

      this.getCatRequest()
    })
  }



  getCatRequest() {
    const { udata } = this.state

    fetch(URL.url + 'categories/Restaurants', {
      method: 'GET', headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Authorization': 'Bearer ' + udata.token,
      }
    })
      .then(res => res.json())
      .then(res => {
        if (res.status) {
          this.setState({
            multipleData: this.pluck(res.data, 'name'),
            dataone: res.data,
            loading: false
          })
        } else {
          this.setState({
            nodate: true,
            loading: false
          })
        }
      })
      .catch(error => {
        alert(error.message);
        console.warn(error);
        this.setState({ loading: false })
      });


  };

  pluck(arr, key) {
    return arr.reduce(function (p, v) {
      return p.concat(v[key]);
    }, []);
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
    if (this.state.loading) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000000' }}>
          <View style={styles.welcome}>
            <Text style={{ fontSize: 15, color: '#fff' }}>getting  categories</Text>
            <BarIndicator count={4} color={color.primary_color} />
            <Text style={{ fontSize: 13, flex: 1, color: '#fff' }}>Please wait...</Text>
          </View>
        </View>
      );
    }

    return (
      <Container style={{ backgroundColor: 'transparent' }}>
        <Navbar left={left} title={this.state.data.title} bg='#101023' />
        <Content>
          <View style={styles.container}>
            <View>
              <Text style={styles.titleText}>CHOOSE RESTAURANT CATEGORY</Text>
            </View>


            <View style={styles.multipleContainer}>
              {this.state.multipleData.map(interest => (
                <SelectMultipleButton
                  key={interest}
                  buttonViewStyle={{
                    borderRadius: 10,
                    height: 40,

                  }}
                  textStyle={{
                    fontSize: 15,
                    margin: 20
                  }}
                  highLightStyle={{
                    borderColor: "white",
                    backgroundColor: "transparent",
                    textColor: "white",
                    borderTintColor: color.primary_color,
                    backgroundTintColor: color.primary_color,
                    textTintColor: color.secondary_color
                  }}
                  value={interest}
                  selected={this.state.multipleSelectedData.includes(interest)}
                  singleTap={valueTap =>
                    this._singleTapMultipleSelectedButtons(interest)
                  }
                />
              ))}
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

  _singleTapMultipleSelectedButtons(interest) {

    if (this.state.multipleSelectedData.includes(interest)) {

      _.remove(this.state.multipleSelectedData, ele => {
        return ele === interest;
      });

    } else {
      this.state.multipleSelectedData.push(interest);
    }

    this.setState({
      multipleSelectedData: this.state.multipleSelectedData
    });
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
  },
  multipleContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "center",
    flex: 6,
    marginTop: 30,
    marginLeft: 20,
    marginRight: 20
  },
  welcome: {
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
});