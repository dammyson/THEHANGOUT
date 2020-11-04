'use strict';

import React, { Component } from 'react';
import { Alert, AsyncStorage, TextInput, Dimensions, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { Container, Content, View, Text, Button, Left, Right, Body, Title, List, Item, Thumbnail, Grid, Col } from 'native-base';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { withNavigationFocus } from 'react-navigation';
import { Icon } from 'react-native-elements';
import color from '../../component/color'
import { PulseIndicator, BarIndicator } from 'react-native-indicators';
import URL from '../../component/server'
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import CardPay from "../../component/views/CardPay";
import Modal, { SlideAnimation, ModalContent } from 'react-native-modals';


class QRcode extends Component {


  constructor(props) {
    super(props);
    this.state = {
      message: 'data',
      loading: false,
      data: '',
      ammount: '',
      pin: '',
      done: false,
      can_scan: true,
      respons: '',
      status: false,
      view_create: false,
      show_card: false,
      scan_data: '',
      card_amount: ''
    };
  }

  onSuccess = (e) => {
    const result = e.data
    var temp = Base64.decode(result);
    var res = temp.split("|");
    const amount = res[1] * 100
    console.warn('scan is done'+ res, amount)
    this.setState({ scan_data: e, can_scan: false, view_create: true, card_amount: amount });
  }


  handlePayWithCard() {
    this.setState({ view_create: false, show_card: true });
  }

  handlePayWithWallet() {
    this.setState({ view_create: false });
    this.makePaymentRequest('no ref', true)
  }


  check = () =>
    check(PERMISSIONS.IOS.CAMERA)
      .then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log('the feature is not available');
            break;
          case RESULTS.GRANTED:
            console.log('permission is granted');
            break;
          case RESULTS.DENIED:
            console.log('permission is denied and / or requestable');
            break;
          case RESULTS.BLOCKED:
            console.log('permission is denied and not requestable');
            break;
        }
      })
      .catch(error => {
        // …
      });

  refresh = () => {
    this.setState({ statuses: [] }, this.check);
  };

  componentDidMount() {
    this.check();
  }

  makePaymentRequest = (ref, isWallet) => {
    console.warn( 'going to back'+ ref, isWallet)
    const { data, scan_data } = this.state
    const result = scan_data.data
    this.setState({ loading: true });
    var temp = Base64.decode(result);
    var res = temp.split("|");

    fetch(URL.url + 'wallet/transfer', {
      method: 'POST', headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Authorization': 'Bearer ' + data.token,
      }, body: JSON.stringify({
        Recipient: res[0],
        Amount: res[1],
        Description: res[2],
        CashierCode: res[3],
        EventCode: res[4],
        PaymentRef: res[5],
        isWallet: isWallet,
        PaymentRef: ref
      }),
    })
      .then(res => res.json())
      .then(res => {
        console.warn('got to back'+res);
        this.setState({ done: true })

        if (res.status) {

          this.setState({
            loading: false,
            can_scan: false,
            status: res.status,
            respons: 'Transaction was successfull'
          })

        } else {
          Alert.alert('Process failed', res.message, [{ text: 'Okay' }])
          this.setState({ loading: false, can_scan: false, status: res.status, respons: 'Transaction was unsuccessfull' })
        }
      }).catch((error) => {
        console.warn(error);
        alert(error.message);
      });






  };


  componentWillMount() {
    AsyncStorage.getItem('data').then((value) => {
      if (value == '') { } else {
        this.setState({ data: JSON.parse(value) })
      }


    })

  }


  closedialog() {
    this.setState({ visible: false, })
  }



  render() {
    return (<>
      {this.state.can_scan ? this.renderScan() : this.renderBody()}
      {this.state.loading ? this.renderActivityIndicator() : null}
      {this.renderModal()}
      {this.state.show_card ? this.renderCardPay() : null}
    </>)
  }

  renderActivityIndicator() {
    return (
      <View style={{ flex: 1,  width: Dimensions.get('window').width,
      height: Dimensions.get('window').height, position: "absolute", alignItems: 'center', justifyContent: 'center', backgroundColor: '#000000' }}>
        <View style={styles.welcome}>
          <Text style={{ fontSize: 15, color: '#fff' }}>Processing Payment</Text>
          <BarIndicator count={4} color={color.primary_color} />
          <Text style={{ fontSize: 13, flex: 1, color: '#fff' }}>Please wait...</Text>
        </View>
      </View>
    );
  }

  renderScan() {
    return (
      <Container>
        <Content>
          <View style={{
            flex: 1, alignContent: 'center', backgroundColor: 'black', width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
          }}>
            <View style={styles.arrowContainer}>
              <Button onPress={() => this.props.navigation.goBack()} transparent>
                <Icon
                  name="ios-arrow-back"
                  size={30}
                  type='ionicon'
                  color={color.primary_color}
                />
              </Button>


            </View>

            <View style={{ flex: 1, alignContent: 'center' }}>
              <QRCodeScanner
                onRead={this.onSuccess}
                ref={(node) => { this.scanner = node }}
                reactivate={true}
                showMarker={true}
                bottomContent={
                  <TouchableOpacity
                    style={styles.buttonTouchable}>
                    <Text style={styles.buttonText}>scan qr code!</Text>
                  </TouchableOpacity>
                }
              />


            </View>
          </View>
        </Content>
      </Container>
    );
  }

  onPaySuccess(res) {
    console.warn('i am done paying' + res);
    // card charged successfully, get reference here
    this.setState({ show_card: false , view_create: false})
    this.makePaymentRequest(res.reference, false)
  }
  onPayFailed() {
    this.setState({ show_card: false , view_create: false})
    Alert.alert('Process failed', 'Check your card and try again or use another payment method', [{ text: 'Okay' }])
  }
  renderCardPay() {
    const { card_amount } = this.state
    return (
      <CardPay
        onClose={(v) => this.setState({ show_card: false })}
        onSuccess={(res) => this.onPaySuccess(res)}
        onFailed={() => this.onPayFailed()}
        amount={card_amount}
      />
    )
  }

  renderBody() {
    return (
      <Container style={{ backgroundColor: '#000' }}>
        <StatusBar barStyle="dark-content" hidden={false} backgroundColor="transparent" translucent={true} />

        <Content>
          <View style={styles.container}>


            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              {this.state.done ?
                <>
                  <View style={{ alignItems: 'center', margin: 20, }}>


                    {this.state.status ?
                      <TouchableOpacity style={{ backgroundColor: '#25AE88', height: 74, width: 74, borderRadius: 37, justifyContent: 'center', alignItems: 'center', }}>

                        <Icon
                          active
                          name="md-checkmark"
                          type='ionicon'
                          color='#fff'
                          size={34}
                        />
                      </TouchableOpacity>
                      :
                      <TouchableOpacity style={{ backgroundColor: 'red', height: 74, width: 74, borderRadius: 37, justifyContent: 'center', alignItems: 'center', }}>

                        <Icon
                          active
                          name="md-close"
                          type='ionicon'
                          color='#fff'
                          size={34}
                        />

                      </TouchableOpacity>}





                    <Text style={{ color: '#fff', fontSize: 22, marginTop: 20, fontWeight: '200', fontFamily: 'NunitoSans-Bold', }}>  {this.state.status ? "Payment Successful" : "Payment Failed"} </Text>
                    <Text style={{ textAlign: 'center', color: '#fff', fontSize: 12, fontWeight: '200', fontFamily: 'NunitoSans', opacity: 0.8 }}> {this.state.respons} </Text>
                  </View>




                  <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20, marginBottom: 20, }}>
                    {this.state.status ?

                      <TouchableOpacity onPress={() => this.props.navigation.replace('transaction')} style={styles.enablebutton} block iconLeft>
                        <Text style={{ color: color.secondary_color, marginTop: 15, marginBottom: 15, fontSize: 16, fontWeight: '200', fontFamily: 'NunitoSans', }}>VIEW MY TRANSACTIONS</Text>
                      </TouchableOpacity>
                      :
                      <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={styles.enablebutton} block iconLeft>
                        <Text style={{ color: color.secondary_color, marginTop: 15, marginBottom: 15, fontSize: 16, fontWeight: '200', fontFamily: 'NunitoSans', }}>Try again</Text>
                      </TouchableOpacity>
                    }

                  </View>
                </>
                : null}
            </View>



          </View>


        </Content>
      </Container>
    );

  }

  renderModal() {
    return (
      <Modal
        visible={this.state.view_create}
        modalAnimation={new SlideAnimation({
          slideFrom: 'right',
        })}
        rounded={false}
      >
        <ModalContent style={styles.modal}>
          <View style={{ flex: 1, }}>
            <TouchableOpacity onPress={() => this.setState({ view_create: false })} style={{ backgroundColor: 'red', height: 34, width: 34, borderRadius: 37, justifyContent: 'center', alignItems: 'center', }}>
              <Icon
                active
                name="md-close"
                type='ionicon'
                color='#fff'
                size={34}
              />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', marginTop: 20, marginBottom: 20, marginLeft: 32, marginRight: 32 }}>
              <TouchableOpacity onPress={() => this.handlePayWithWallet()} style={[styles.activeType]} >
                <Icon
                  active
                  name="wallet"
                  type='simple-line-icon'
                  color='#000'
                  size={26}
                />
                <Text style={{ color: '#000', fontSize: 10, fontWeight: '200', fontFamily: 'NunitoSans', }}>Pay with wallet</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.handlePayWithCard()} style={[styles.activeType]} >
                <Icon
                  active
                  name="bank"
                  type='font-awesome'
                  color='#5F5C7F'
                  size={26}
                />
                <Text style={{ color: '#5F5C7F', fontSize: 10, fontWeight: '200', fontFamily: 'NunitoSans', }}>Pay with Card</Text>
              </TouchableOpacity>
            </View>


          </View>
        </ModalContent>
      </Modal>

    );
  }

}

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  loadingBackgroundImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },

  arrowContainer: {
    flexDirection: "row",
    justifyContent: 'flex-start',
    marginLeft: 40,
    marginRight: 20,
    marginTop: 30,
  },
  welcome: {
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },

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
  },
  modal: {
    width: Dimensions.get('window').width,
    height: 170,
    justifyContent: 'flex-end',
    margin: 0,
    backgroundColor: "#010113"

  },
  activeType: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 5,
    paddingBottom: 10,
    borderRadius: 4,
    margin: 7
  },

});

export default QRcode;