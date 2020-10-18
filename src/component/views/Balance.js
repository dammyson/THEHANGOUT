
import React, { Component, useImperativeHandle } from 'react';
import { StyleSheet, Text, Dimensions, Alert, ImageBackground, StatusBar, Image, TouchableOpacity, View, AsyncStorage } from 'react-native';
import { Container, Content, } from 'native-base';
const URL = require("../../component/server");
import { getData, getBalance } from '../utilities';




export default class Balance extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bal: 0
        };
    }

    async componentDidMount() {
        this.setState({
            data: JSON.parse(await getData()),
            user: JSON.parse(await getData()).user,
            bal: await getBalance()
        })
        this.getBalanceRequest()
    }

  

    getBalanceRequest() {
        const { data, user } = this.state


        fetch(URL.url + 'wallet/getBalance', {
            method: 'GET', headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': 'Bearer ' + data.token,
            }
        })
            .then(res => res.json())
            .then(res => {
                this.setState({ loading: false})
                console.warn(res);
                if (res.status) {
                    this.setState({ bal: this.currencyFormat(res.data)})
                    AsyncStorage.setItem('bal', this.currencyFormat(res.data));

                   } else {
                   
                }
            })
            .catch(error => {
                console.warn(error);
                this.setState({ loading: false })
            });


    };


    currencyFormat(n) {
        return n.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    }

    render() {
        const { OnButtonPress,buttonColor, textColor, buttonText, backgroundColor , balTextColor, commentTextColor} = this.props;
        return (
            <View style={{ flexDirection: 'row', backgroundColor: backgroundColor, marginTop: 24, marginBottom: 24, marginLeft: 30, marginRight: 30, borderRadius: 5 }}>
                <View style={{ marginLeft: 20, flex: 1, alignItems: 'flex-start', marginTop: 10, marginBottom: 10 }}>
                    <Text style={{ color: balTextColor, fontSize: 16, fontWeight: '200', fontFamily: 'NunitoSans-Bold', }}>₦{this.state.bal}</Text>
                    <Text style={{ color: commentTextColor, fontSize: 12, fontFamily: 'NunitoSans', opacity: 0.77 }}>My Wallet Balance</Text>

                </View>
                <View style={{ alignItems: 'flex-start', marginTop: 10, marginBottom: 10, marginRight: 15 }}>
                    <TouchableOpacity onPress={() => OnButtonPress()} style={{ backgroundColor: buttonColor, alignItems: 'center', alignContent: 'space-around', paddingLeft: 13.5, paddingRight: 13.5, borderRadius: 5, }} block iconLeft>
                        <Text style={{ color: textColor, marginTop: 7, marginBottom: 7, fontSize: 16, fontWeight: '200', fontFamily: 'NunitoSans', opacity: 0.77 }}> {buttonText}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

}
Balance;

