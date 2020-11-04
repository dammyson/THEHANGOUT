import React, { Component } from "react";
import { Alert, Dimensions, TouchableOpacity, ImageBackground, StyleSheet, AsyncStorage, StatusBar, ScrollView, } from "react-native";
import { Container, Content, View, Text, Button, Left, Right, Body, Title, List, ListItem, } from 'native-base';
import { Avatar, Icon, } from 'react-native-elements';
const deviceHeight = Dimensions.get("window").height;
const URL = require("../../component/server");
import RNPaystack from 'react-native-paystack';
RNPaystack.init({ publicKey: 'pk_test_c78f193a7340923195cea7b1e4108f585346e254' });

import { getSaveRestaurant, getData } from '../../component/utilities';
import color from '../../component/color';
import { CreditCardInput } from "react-native-credit-card-input";
import {
    BarIndicator,
} from 'react-native-indicators';
import Moment, { max } from 'moment';

import Navbar from '../../component/Navbar';



export default class CardPay extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: '',
            user: '',
            name: '',
            id: '',
            details: {},
            cardDetails: null


        };
    }



    async componentDidMount() {
        this.setState({
            data: JSON.parse(await getData()),
            user: JSON.parse(await getData()).user
        })

    }


    chargeCard() {
        const { cardDetails, user} = this.state
        const {onSuccess, onFailed, amount } = this.props;
        console.warn(amount)
        console.warn('i am paying');
        var res = cardDetails.values.expiry.split("/");
        this.setState({ loading: true })
        RNPaystack.chargeCard({
            cardNumber: cardDetails.values.number,
            expiryMonth: res[0],
            expiryYear: res[1],
            cvc: cardDetails.values.cvc,
            email: user.userName,
            amountInKobo: amount,
        })
            .then(response => {
                this.setState({ loading: false })
                console.warn('Good to go');
                onSuccess(response)
            })
            .catch(error => {
                console.warn('could not pay');
                console.warn(error);
                console.warn(error.message);
                console.warn(error.code); 
                this.setState({ loading: false })
                onFailed(error.message)
            })

    }

    _onChange = (formData) => {
        this.setState({ cardDetails: formData })

    };
    _onFocus = (field) => console.log("focusing", field);

    render() {
        const {onClose } = this.props;
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

        var right = (
            <Right style={{ flex: 1 }}>
                <Button transparent >
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
                <View style={{ flex: 1,  width: Dimensions.get('window').width, height: Dimensions.get('window').height, position:'absolute', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000000' }}>
                    <View style={styles.welcome}>
                        <Text style={{ fontSize: 12, color: '#fff' }}>processing payment </Text>
                        <BarIndicator count={4} color={color.primary_color} />
                        <Text style={{ fontSize: 10, flex: 1, color: '#fff', opacity: 0.6 }}>Please wait...</Text>
                    </View>
                </View>
            );
        }

        return (
            <Container style={{ backgroundColor: '#000',flex:1 , paddingTop:24, position:'absolute'}}>
                <StatusBar barStyle="dark-content" hidden={false} backgroundColor="transparent" translucent={true} />

                <Navbar left={left} right={right} title='Card Pay' bg='#111124' />
                <Content>
                    <View style={styles.container}>
                     <View style={{height:40}} />

                        <View style={{ height: 350, alignItems: 'center', justifyContent: 'center' }}>

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
                            <Text style={{ color: color.secondary_color, marginTop: 15, marginBottom: 15, fontSize: 16, fontWeight: '200', fontFamily: 'NunitoSans', }}>PAY</Text>
                        </TouchableOpacity>



                    </View>


                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height

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
    inputView: {
        backgroundColor: 'rgba(247,164,0,0.3)',
        marginTop: 10,
        marginBottom: 10,
        justifyContent: "flex-start",
        borderColor: '#F7A400',
        borderWidth: 1,
        borderRadius: 5,


    },
    item: {
        flexDirection: 'row',
        borderColor: '#8d96a6',
        borderBottomWidth: 0.6,
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderColor: '#F7A400',
        borderWidth: 1,
        borderRadius: 5,
        flex: 1
    },
    enablebutton: {
        backgroundColor: color.primary_color,
        alignItems: 'center',
        alignContent: 'space-around',
        paddingLeft: 53,
        paddingRight: 53,
        borderRadius: 5,
        marginRight:30,
        marginLeft:30
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

