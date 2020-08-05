import React, { Component } from "react";
import { Alert, Dimensions, TouchableOpacity, TextInput, StyleSheet, AsyncStorage, StatusBar, NativeModules, } from "react-native";
import { Container, Content, View, Text, Button, Left, Toast, Right, Body, Title, List, ListItem, } from 'native-base';
import { Avatar, Icon, } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
const deviceHeight = Dimensions.get("window").height;
import DatePicker from 'react-native-datepicker'
const URL = require("../../component/server");
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Moment from 'moment';
import color from '../../component/color';
const { width: screenWidth } = Dimensions.get('window')
import RNPickerSelect from 'react-native-picker-select';
import {
    BarIndicator,
} from 'react-native-indicators';

import Navbar from '../../component/Navbar';



export default class SelectAddress extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            name: '',
            type: '',
            amount: '',

        };
    }



    componentWillMount() {
        AsyncStorage.getItem('data').then((value) => {
            if (value == '') { } else {
                this.setState({ data: JSON.parse(value) })
                this.setState({ user: JSON.parse(value).user })
            }
        })
    }

    setType(data) {
        var index = data.value
        if (data.value == null) {
            return
        }

        this.setState({ type: index })
    }
    processAddOn() {
        const { onSelected,  } = this.props;
        const { data, address } = this.state


        if (address == '') {
            Alert.alert('Validation failed', "address fields can not be empty", [{ text: 'Okay' }])
            return
        }

          this.setState({ loading: true })
          fetch(URL.url + 'food/address/add', {
            method: 'POST', headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': 'Bearer ' + data.token,
            }, body: JSON.stringify({
                address: address,

            }),
        })
              .then(res => res.json())
              .then(res => {
                  console.warn(res);
                  if (res.status) {
                      Toast.show({
                          text: 'Address created sucessfully !',
                          position: 'bottom',
                          type: 'success',
                          buttonText: 'Dismiss',
                          duration: 2500
                      });
                      setTimeout(() => {
                          this.setState({ loading: false })
                          onSelected(res.data);
                      }, 500);
  
                  } else {
                      Alert.alert('Action failed', res.message, [{ text: 'Okay' }])
                      this.setState({ loading: false })
                  }
              }).catch((error) => {
                  console.warn(error);
                  alert(error.message);
              });
  
    }





    render() {
        const { onClose,  } = this.props;

        var left = (
            <Left style={{ flex: 1 }}>
                <Button transparent onPress={() => onClose()}>
                    <Icon
                        active
                        name="close"
                        type='antdesign'
                        color='#FFF'
                    />
                </Button>
            </Left>
        );

        if (this.state.loading) {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000000' }}>
                    <View style={styles.welcome}>
                        <Text style={{ fontSize: 15, color: '#fff' }}>Adding add-ons</Text>
                        <BarIndicator count={4} color={color.primary_color} />
                        <Text style={{ fontSize: 13, flex: 1, color: '#fff' }}>Please wait...</Text>
                    </View>
                </View>
            );
        }

        return (
            <Container style={{ backgroundColor: '#101023' }}>
                <Navbar left={left} title='Add Add-on' bg='#101023' />
                <Content>
                    <View style={styles.container}>



                        {this.renderUpcomming()}

                    </View>


                </Content>
            </Container>
        );
    }

    renderUpcomming() {
        const ticketVisibility = {
            label: 'Select type',
            value: null,
            color: '#000',
        };
        return (
            <View>


                <View style={styles.oneRow}>

                    <View style={{ marginLeft: 30, flex: 1 }}>
                        <View>
                            <Text style={styles.hintText}>Address </Text>
                        </View>
                        <View style={styles.item}>
                            <TextInput
                                placeholder="Enter address"
                                placeholderTextColor='#6d706e'
                                returnKeyType="next"

                                keyboardType='default'
                                autoCapitalize="none"
                                autoCorrect={false}
                                style={styles.menu}
                                onChangeText={text => this.setState({ address: text })}
                            />
                        </View>
                    </View>
                </View>

            


                <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 10, marginBottom: 10, }}>
                        <TouchableOpacity onPress={() => this.processAddOn()} style={styles.enablebutton} block iconLeft>
                            <Text style={{ color: color.secondary_color, marginTop: 10, marginBottom: 10, fontSize: 14, fontWeight: '200', fontFamily: 'NunitoSans', }}>Add Address</Text>
                        </TouchableOpacity>
                    </View>

                </View>


            </View>);


    }
}

SelectAddress;
const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
        flex:1,

    },
    oneRow: {
        marginBottom: 10,
        width: Dimensions.get('window').width,
    
    },
    hintText: {
        fontSize: 13.5,
        color: '#ffffff',
        opacity: 0.9
    },
    importText: {
        fontSize: 13,
        color: '#8d96a6',
    },
    item: {
        flexDirection: 'row',
        borderColor: '#8d96a6',
        borderBottomWidth: 0.6,
        alignItems: 'center',
        marginRight: 30,

    },
    menu: {
        flex: 1,
        fontSize: 16,
        color: '#ffffff',
        textAlign: 'left',
        fontFamily: 'NunitoSans-Bold',
    },
    itemTwo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 30,

    },
    fab: {
        height: 60,
        width: 60,
        borderRadius: 200,
        position: 'absolute',
        bottom: 10,
        right: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
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
        paddingLeft: 73,
        paddingRight: 73,
        borderRadius: 5,
    },
    date_text: {
        color: '#fff',
        fontSize: 20,
        marginLeft: 40
    }
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 8,
        color: '#fff',
        paddingRight: 30, // to ensure the text is never behind the icon
    },

});