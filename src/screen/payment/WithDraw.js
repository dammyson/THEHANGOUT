import React, { Component } from "react";
import { Alert, Dimensions, TouchableOpacity, TextInput, StyleSheet, AsyncStorage, StatusBar, FlatList, } from "react-native";
import { Container, Content, View, Text, Button, Left, Right, Body, Title, List, ListItem, } from 'native-base';
import { Avatar, Icon, colors, } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
const deviceHeight = Dimensions.get("window").height;
const URL = require("../../component/server");
import Modal, { SlideAnimation, ModalContent } from 'react-native-modals';


import color from '../../component/color';
import { CreditCardInput } from "react-native-credit-card-input";
import {
  BarIndicator,
} from 'react-native-indicators';


import Navbar from '../../component/Navbar';



export default class WithDraw extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: '',
      name: '',
      account_number: '',
      details: {},
      banks: [],
      pay: false,
      amount: 0,
      bal: '',
      done: false,
      bank_name: 'Select Bank',
      view_bank: false,
      bank_code:''


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
      this.getBanksRequest();

    })



    AsyncStorage.getItem('bal').then((value) => {
      if (value == '') { } else {
        this.setState({ bal: value })
      }
    })


  }

  getBanksRequest() {
    const { data } = this.state
    fetch(URL.url + 'wallet/bankCodes', {
      method: 'GET', headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Authorization': 'Bearer ' + data.token,
      }
    })
      .then(res => res.json())
      .then(res => {
        console.warn(res);
        if (res.status) {
          this.setState({
            banks: res.data,
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

  processWithdrwaWallet() {
    const { data, amount,  bank_name, account_number, bank_code  } = this.state

    if (bank_name == "Select Bank'" || account_number == '' || bank_code == '') {
      Alert.alert('Validation failed', 'field(s) cannot be empty', [{ text: 'Okay' }])
      return;
    }
    
    this.setState({ loading: true })
    fetch(URL.url + 'wallet/withdraw', {
      method: 'POST', headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Authorization': 'Bearer ' + data.token,
      }, body: JSON.stringify({
        BankCode: bank_code,
        Amount: amount,
        AccountNumber: account_number,
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
  currencyFormat(n) {
    return n.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  }


  render() {

    var left = (
      <Left style={{ flex: 1 }}>
        <Button transparent onPress={() => Actions.pop()}>
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
        <Button transparent onPress={() => Actions.pop()}>
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
            <Text style={{ fontSize: 12, color: '#fff' }}>withdrawing from wallet </Text>
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
                  <Text style={{ textAlign: 'center', color: '#fff', fontSize: 12, fontWeight: '200', fontFamily: 'NunitoSans', opacity: 0.8 }}>WithDraw was successful.</Text>
                </View>




                <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20, marginBottom: 20, }}>
                  <TouchableOpacity onPress={() => Actions.transaction({type: 'replace'})} style={styles.enablebutton} block iconLeft>
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
      <Container style={{ backgroundColor: '#000' ,paddingTop:10}}>
        <StatusBar barStyle="dark-content" hidden={false} backgroundColor="transparent" translucent={true} />

        <Navbar left={left} right={right} title='Withdraw Fund ' bg='#111124' />
        <Content>
          <View style={styles.container}>


            <View style={{ marginTop: 20 }}>

              <View style={{ flexDirection: 'row', backgroundColor: '#fff', marginTop: 24, marginBottom: 24, marginLeft: 30, marginRight: 20, borderRadius: 5 }}>
                <View style={{ marginLeft: 20, flex: 1, alignItems: 'flex-start', marginTop: 10, marginBottom: 10 }}>
                  <Text style={{ color: '#111124', fontSize: 18, fontWeight: '200', fontFamily: 'NunitoSans-Bold', }}>₦{this.state.bal}</Text>
                  <Text style={{ color: '#111124', fontSize: 12, fontFamily: 'NunitoSans', opacity: 0.77 }}>My Wallet Balance</Text>

                </View>

              </View>
              <View style={{ justifyContent: 'center' }}>

                <View style={styles.oneRow}>

                  <View style={{flex: 1 }}>
                    <View>
                    <Text style={{ color: '#fff', fontSize: 13, marginLeft: 30, marginRight: 20, fontFamily: 'NunitoSans', opacity: 0.77, marginBottom:10, }}>Select Bank</Text>
              
                    </View>
                    <View onPress={() => this.setState({ view_organizer: true })} style={styles.item}>
                      <TouchableOpacity onPress={() => this.setState({ view_bank: true })}>
                        <Text style={{  fontSize: 16, color: color.primary_color, fontFamily: 'NunitoSans', marginBottom: 10, marginTop: 10, flex: 1 }}> {this.state.bank_name} </Text>
                      </TouchableOpacity>
                      <View style={{ flex: 1 }}></View>
                      <TouchableOpacity style={{ marginRight: 10, marginRight: 10, }}>
                        <Icon
                          active
                          name="chevron-down"
                          type='feather'
                          color='#FFF'
                          size={15}
                        />

                      </TouchableOpacity>

                    </View>


                  </View>
                </View>

                <Text style={{ color: '#fff', fontSize: 13, marginLeft: 30, marginRight: 20, fontFamily: 'NunitoSans', opacity: 0.77 }}>Enter Account number</Text>
                <View style={[styles.inputTextView]}>
                  <TextInput
                    placeholder="0011223344"
                    placeholderTextColor={'#F7a40060'}
                    returnKeyType="next"
                    onSubmitEditing={() => this.passwordInput.focus()}
                    keyboardType='numeric'
                    autoCapitalize="none"
                    autoCorrect={false}
                    inlineImageLeft='ios-call'
                    style={{ marginLeftt: 20, flex: 1, fontSize: 16, color: color.primary_color }}
                    onChangeText={text => this.setState({ account_number: text })}

                  />

                </View>
                <Text style={{ color: '#fff', fontSize: 13, marginLeft: 30, marginRight: 20, fontFamily: 'NunitoSans', opacity: 0.77 }}>Enter amount</Text>
                <View style={[styles.inputTextView]}>
                  <TextInput
                    placeholder="₦5000"
                    placeholderTextColor={'#F7a40060'}
                    returnKeyType="next"
                    defaultValue={this.state.amount}
                    onSubmitEditing={() => this.processWithdrwaWallet()}
                    keyboardType='numeric'
                    autoCapitalize="none"
                    autoCorrect={false}
                    inlineImageLeft='ios-call'
                    style={{ marginLeftt: 20, flex: 1, fontSize: 16, color: color.primary_color }}
                    onChangeText={text => this.setState({ amount: text })}
                    ref={(input)=> this.passwordInput = input}

                  />

                </View>

              </View>

              <TouchableOpacity onPress={() => this.processWithdrwaWallet()} style={[styles.enablebutton, { marginTop: 20 }]} block iconLeft>
                <Text style={{ color: color.secondary_color, marginTop: 10, marginBottom: 15, fontSize: 16, fontWeight: '200', fontFamily: 'NunitoSans', }}>Withdraw ₦{this.state.amount}</Text>
              </TouchableOpacity>

            </View>





          </View>
          <Modal
                        visible={this.state.view_bank}
                        modalAnimation={new SlideAnimation({
                            slideFrom: 'right',
                        })}
                    >
                        <ModalContent style={styles.modal}>
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 1, paddingBottom: 10 }}> 
                                <TouchableOpacity onPress={() => this.getBanksRequest()} style={{ marginLeft: 10, backgroundColor: '#000' }}>
                                 <Icon
                                            name="refresh"
                                            size={20}
                                            type='material-icon'
                                            color="#fff"
                                            size={30}
                                        />
                                    </TouchableOpacity>
                                    <View style={{ paddingTop: 1, paddingBottom: 10, flex: 1, alignItems:'center' }}>
                                    <Text style={{ fontFamily: 'Montserrat-Bold', color:'#fff', fontSize: 17, textAlign: 'left', paddingBottom: 10, marginTop: 25, }}> Banks </Text>
                                    </View> 
                                    <TouchableOpacity onPress={() => this.setState({ view_bank: false })} style={{ marginLeft: 10, backgroundColor: '#000' }}>
                                        <Icon
                                            name="close"
                                            size={20}
                                            type='antdesign'
                                            color="#fff"
                                        />
                                    </TouchableOpacity>

                                </View>
                                <View style={{ paddingTop: 1, paddingBottom: 10, flex: 1, }}>
                                    <FlatList
                                        style={{ paddingBottom: 5 }}
                                        data={this.state.banks}
                                        renderItem={this.renderItem}
                                        keyExtractor={item => item.id}
                                        ItemSeparatorComponent={this.renderSeparator}
                                        ListHeaderComponent={this.renderHeader}
                                    />

                                      
                                </View>
                            </View>
                        </ModalContent>
                    </Modal>

        </Content>
      </Container>
    );

  }

  _handleCategorySelect = (index) => {
    this.setState({ bank_code: index.code, bank_name: index.name, view_bank: false });

}
renderItem = ({ item, }) => {
    return (
        <TouchableOpacity style={{ marginLeft: 20, marginRight: 20, marginBottom: 10 }}
            onPress={() => this._handleCategorySelect(item)} underlayColor="red">
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <Text style={styles.nameList}>{item.name}</Text>
                <Icon
                    active
                    name="dots-vertical"
                    type='material-community'
                    color='#FFF'
                />
            </View>

        </TouchableOpacity>

    )

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
    paddingLeft:10
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
  oneRow: {
    flexDirection: "row",
    marginBottom: 10,
    width: Dimensions.get('window').width,
},
hintText: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.6
},
importText: {
    fontSize: 12,
    color: '#8d96a6',
},
item: {
    flexDirection: 'row',
    borderColor: '#8d96a6',
    borderWidth: 0.6,
    alignItems: 'center',
    marginLeft: 30,
    marginRight: 30,
    height: 45,
    borderColor: color.primary_color,
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft:10

},
menu: {
    flex: 1,
    fontSize: 15,
    color: '#ffffff',
    textAlign: 'left',
    fontFamily: 'NunitoSans-Bold',
},
itemTwo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 30,

},
inputPicker: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
},
modal: {
    width: Dimensions.get('window').width,
    height: URL.height,
    backgroundColor: "#010113"

},
nameList: {
    fontSize: 17,
    color: '#ffffff',
    flex: 1,
    marginLeft: 10
},
});

