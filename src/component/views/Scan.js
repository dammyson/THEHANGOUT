'use strict';

import React, { Component } from 'react';
import { Alert, AsyncStorage, TextInput, Dimensions, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { Container, Content, View, Text, Button, Left, Right, Body, Title, List, Item, Thumbnail, Grid, Col } from 'native-base';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { withNavigationFocus } from 'react-navigation';
import { Icon } from 'react-native-elements';
import color from '../color'
import { PulseIndicator, BarIndicator } from 'react-native-indicators';
import URL from '../server'
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import CardPay from "./CardPay";
import Modal, { SlideAnimation, ModalContent } from 'react-native-modals';


class Scan extends Component {


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
    const { onScan,onClose} = this.props;
    const result = e.data
    onScan(result)
   
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


  closedialog() {
    this.setState({ visible: false, })
  }

  render() {
    return (<>
      {this.state.can_scan ? this.renderScan() : this.renderBody()}
    </>)
  }

  renderScan() {
    const { onScan,onClose} = this.props;
    return (
      <Container style={{position: "absolute",}}>
        <Content>
          <View style={{
            flex: 1, alignContent: 'center', backgroundColor: 'black', width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,  
          }}>
            <View style={styles.arrowContainer}>
              <Button onPress={() => onClose()} transparent>
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


  renderBody() {
    return (
      <Container style={{ backgroundColor: '#000' }}>
        <StatusBar barStyle="dark-content" hidden={false} backgroundColor="transparent" translucent={true} />

        <Content>
          <View style={styles.container}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

            </View>
          </View>
        </Content>
      </Container>
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

export default Scan;