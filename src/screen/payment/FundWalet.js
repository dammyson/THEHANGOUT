import React, { Component } from "react";
import { Alert, Dimensions, TouchableOpacity, TextInput, StyleSheet, AsyncStorage, StatusBar, ScrollView, } from "react-native";
import { Container, Content, View, Text, Button, Left, Right, Body, Title, List, ListItem, } from 'native-base';
import { Avatar, Icon, } from 'react-native-elements';
const deviceHeight = Dimensions.get("window").height;
const URL = require("../../component/server");
import RNPaystack from 'react-native-paystack';
RNPaystack.init({ publicKey: 'pk_test_c78f193a7340923195cea7b1e4108f585346e254' });


import color from '../../component/color';
import { CreditCardInput } from "react-native-credit-card-input";
import {
  BarIndicator,
} from 'react-native-indicators';
import Moment, { max } from 'moment';

import Navbar from '../../component/Navbar';
import Balance from "../../component/views/Balance";



export default class FundWallet extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: '',
      name: '',
      id: '',
      details: {},
      cardDetails: null,
      pay: false,
      amount: 0,
      bal: '',
      done: false


    };
  }



  componentWillMount() {
    this.setState({ id: this.props.id });
    AsyncStorage.getItem('data').then((value) => {
      if (value == '') { } else {
        this.setState({ data: JSON.parse(value) })
        this.setState({ user: JSON.parse(value).user })
        console.warn(this.state.user)
      }

    })



    AsyncStorage.getItem('bal').then((value) => {
      if (value == '') { } else {
        this.setState({ bal: value })
      }
    })


  }

  processFundWallet(response) {
    const { data, amount } = this.state
    this.setState({ loading: true })
    fetch(URL.url + 'wallet/fund', {
      method: 'POST', headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Authorization': 'Bearer ' + data.token,
      }, body: JSON.stringify({
        TransactionReference: response.reference,
        Amount: amount,
      }),
    })
      .then(res => res.json())
      .then(res => {
        console.warn(res);
        if (res.status) {
          AsyncStorage.setItem('bal', this.currencyFormat(res.data.balance));
          this.setState({
            bal: this.currencyFormat(res.data.balance),
            loading: false,
            pay: false,
            done: true
          })

        } else {
          Alert.alert('Process failed', res.message, [{ text: 'Okay' }])
          this.setState({ loading: false })
        }
      }).catch((error) => {
        console.warn(error);
        alert(error.message);
      });

  }

  chargeCard() {

    const { cardDetails, amount, user } = this.state

    var res = cardDetails.values.expiry.split("/");
    this.setState({ loading: true })
    RNPaystack.chargeCard({
      cardNumber: cardDetails.values.number,
      expiryMonth: res[0],
      expiryYear: res[1],
      cvc: cardDetails.values.cvc,
      email: user.userName,
      amountInKobo: amount * 100,
    })
      .then(response => {
        console.warn(response); // card charged successfully, get reference here
        this.processFundWallet(response)
      })
      .catch(error => {
        this.setState({ loading: false })
        console.warn(error);
        Alert.alert('Process failed', error.message, [{ text: 'Okay' }])// error is a javascript Error object
      })

  }

  _onChange = (formData) => {
    this.setState({ cardDetails: formData })

  };
  _onFocus = (field) => console.log("focusing", field);

  currencyFormat(n) {
    return n.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  }

  displayCard() {

    const { amount } = this.state
    if (amount > 0) {
      this.setState({ pay: true })
    } else {
      Alert.alert('Operation failed', 'Sorry you can not fund walet with ₦' + amount, [{ text: 'Okay' }])
    }

  }
  render() {

    var left = (
      <Left style={{ flex: 1 }}>
        <Button transparent onPress={() => this.props.navigation.goBack()}>
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
            <Text style={{ fontSize: 12, color: '#fff' }}>funding wallet </Text>
            <BarIndicator count={4} color={color.primary_color} />
            <Text style={{ fontSize: 10, flex: 1, color: '#fff', opacity: 0.6 }}>Please wait...</Text>
          </View>
        </View>
      );
    }


    if (this.state.done) {
      return (
        <Container style={{ backgroundColor: '#000' }}>
          <StatusBar barStyle="dark-content" hidden={false} backgroundColor="transparent" translucent={true} />

          <Navbar left={left} right={right} title='Success' bg='#111124' />
          <Content>
            <View style={styles.container}>


              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

                <View style={{ alignItems: 'center', margin: 20, }}>
                  <TouchableOpacity style={{ backgroundColor: '#25AE88', height: 74, width: 74, borderRadius: 37, justifyContent: 'center', alignItems: 'center', }}>
                    <Icon
                      active
                      name="md-checkmark"
                      type='ionicon'
                      color='#fff'
                      size={34}
                    />
                  </TouchableOpacity>

                  <Text style={{ color: '#fff', fontSize: 22, fontWeight: '200', fontFamily: 'NunitoSans-Bold', }}>Success</Text>
                  <Text style={{ textAlign: 'center', color: '#fff', fontSize: 12, fontWeight: '200', fontFamily: 'NunitoSans', opacity: 0.8 }}>Funding wallet was successful.</Text>
                </View>




                <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20, marginBottom: 20, }}>
                  <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={styles.enablebutton} block iconLeft>
                    <Text style={{ color: color.secondary_color, marginTop: 15, marginBottom: 15, fontSize: 16, fontWeight: '200', fontFamily: 'NunitoSans', }}>Continue</Text>
                  </TouchableOpacity>
                </View>


              </View>



            </View>


          </Content>
        </Container>
      );
    }

    return (
      <Container style={{ backgroundColor: '#000', paddingTop: 10 }}>
        <StatusBar barStyle="dark-content" hidden={false} backgroundColor="transparent" translucent={true} />

        <Navbar left={left} right={right} title='Fund Wallet' bg='#111124' />
        <Content>
          <View style={styles.container}>

            {this.state.pay ?
              <View style={{ marginTop: 20 }}>
                <View style={{ height: 320, alignItems: 'center', justifyContent: 'center' }}>

                  <CreditCardInput
                    autoFocus

                    requiresName
                    requiresCVC
                    requiresPostalCode
                    allowScroll={true}
                    labelStyle={styles.label}
                    inputStyle={styles.input}
                    validColor={"white"}
                    invalidColor={"white"}
                    placeholderColor={"darkgray"}

                    onFocus={this._onFocus}
                    onChange={this._onChange} />


                </View>



                <TouchableOpacity onPress={() => this.chargeCard()} style={styles.enablebutton} block iconLeft>
                  <Text style={{ color: color.secondary_color, marginTop: 10, marginBottom: 15, fontSize: 16, fontWeight: '200', fontFamily: 'NunitoSans', }}>PAY ₦{this.state.amount}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.setState({ pay: false })} style={[styles.enablebutton, { marginTop: 8 }]} block iconLeft>
                  <Text style={{ color: color.secondary_color, marginTop: 10, marginBottom: 15, fontSize: 16, fontWeight: '200', fontFamily: 'NunitoSans', }}>Change amount</Text>
                </TouchableOpacity>

              </View>

              :

              <View style={{ marginTop: 20 }}>

                <Balance
                  OnButtonPress={() => console.warn('l')}
                  buttonColor={'#fff'}
                  textColor={'#000'}
                  buttonText={''}
                  textColor={'#000'}
                  balTextColor={'#000'}
                  commentTextColor={'#000'}
                  backgroundColor={'#fff'}
                />

                <View style={{ justifyContent: 'center' }}>
                  <Text style={{ color: '#fff', fontSize: 12, marginLeft: 30, marginRight: 20, fontFamily: 'NunitoSans', opacity: 0.77 }}>Enter amount to fund your walet</Text>
                  <View style={[styles.inputTextView]}>
                    <TextInput
                      placeholder="₦5000"
                      placeholderTextColor={'#F7a40060'}
                      returnKeyType="next"
                      defaultValue={this.state.amount}
                      onSubmitEditing={() => this.passwordInput.focus()}
                      keyboardType='numeric'
                      autoCapitalize="none"
                      autoCorrect={false}
                      inlineImageLeft='ios-call'
                      style={{ marginLeftt: 20, flex: 1, fontSize: 16, color: color.primary_color }}
                      onChangeText={text => this.setState({ amount: text })}

                    />

                  </View>

                </View>

                <TouchableOpacity onPress={() => this.displayCard()} style={[styles.enablebutton, { marginTop: 20 }]} block iconLeft>
                  <Text style={{ color: color.secondary_color, marginTop: 10, marginBottom: 15, fontSize: 16, fontWeight: '200', fontFamily: 'NunitoSans', }}>FUND ₦{this.state.amount}</Text>
                </TouchableOpacity>

              </View>

            }



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
  enablebutton: {
    backgroundColor: color.primary_color,
    alignItems: 'center',
    alignContent: 'space-around',
    paddingLeft: 53,
    paddingRight: 53,
    borderRadius: 5,
    marginLeft: 30,
    marginRight: 30,
  },
  inputTextView: {
    marginLeft: 30,
    marginRight: 30,
    height: 45,
    marginTop: 10,
    marginBottom: 10,
    borderColor: color.primary_color,
    borderWidth: 1,
    borderRadius: 5,
  },
  label: {
    color: "white",
    fontSize: 12,
  },
  input: {
    fontSize: 16,
    color: "black",
    borderBottomColor: 'red',
    borderBottomWidth: 1
  },
});

