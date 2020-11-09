import React, { Component } from "react";
import { Alert, Dimensions, TouchableOpacity, FlatList, StyleSheet, AsyncStorage, StatusBar, ScrollView, } from "react-native";
import { Container, Content, View, Text, Button, Left, Right, Body, Title, List, ListItem, } from 'native-base';
import { Avatar, Icon, } from 'react-native-elements';
const deviceHeight = Dimensions.get("window").height;
const URL = require("../../component/server");
import color from '../../component/color';
const { width: screenWidth } = Dimensions.get('window')
import {
    BarIndicator,
} from 'react-native-indicators';
import Moment from 'moment';

import Navbar from '../../component/Navbar';



export default class Transaction extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data: '',
            name: '',
            id: '',
            details: [],
            condition: true,
            bal: 0,
            more: false,
            qr_generated: false


        };
    }



    componentWillMount() {
        this.setState({ id: this.props.id });
        AsyncStorage.getItem('data').then((value) => {
            if (value == '') { } else {
                this.setState({ data: JSON.parse(value) })
                this.setState({ user: JSON.parse(value).user })
            }
            this.processTransaction();
        })


    }
    currencyFormat(n) {
        return n.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");


    }
    processTransaction() {
        const { data } = this.state
        this.setState({ loading: true })
        fetch(URL.url + 'wallet/transaction/history', {
            method: 'POST', headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': 'Bearer ' + data.token,
            }, body: JSON.stringify({
                StartDate: "",
                EndDate: "",
            }),
        })
            .then(res => res.json())
            .then(res => {
                console.warn(res);
                if (res.status) {
                    AsyncStorage.setItem('bal', this.currencyFormat(res.data.balance));
                    this.setState({
                        loading: false,
                        details: res.data.allTransactions,
                        bal: res.data.balance,

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
    segmentClicked = (index) => {
        this.setState({
            activeIndex: index
        })
    }
    render() {
        const { details, } = this.state
        const typePlaceholder = {
            label: 'Select Qty',
            value: null,
            color: '#000',
        };


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
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000000' }}>
                    <View style={styles.welcome}>
                        <Text style={{ fontSize: 12, color: '#fff' }}>Getting transaction history </Text>
                        <BarIndicator count={4} color={color.primary_color} />
                        <Text style={{ fontSize: 10, flex: 1, color: '#fff', opacity: 0.6 }}>Please wait...</Text>
                    </View>
                </View>
            );
        }

        return (
            <Container style={{ backgroundColor: '#000' }}>
                <Navbar left={left} right={right} title='Transaction History' bg='#111124' />
                <Content>
                    <View style={styles.container}>
                        <View style={{ flex: 1, }}>

                            <View style={{ flexDirection: 'row', backgroundColor: '#fff', marginTop: 24, marginBottom: 24, marginLeft: 30, marginRight: 30, borderRadius: 5 }}>
                                <View style={{ marginLeft: 20, flex: 1, alignItems: 'flex-start', marginTop: 10, marginBottom: 10 }}>
                                    <Text style={{ color: '#111124', fontSize: 18, fontWeight: '200', fontFamily: 'NunitoSans-Bold', }}>₦{this.currencyFormat(this.state.bal)} </Text>
                                    <Text style={{ color: '#111124', fontSize: 12, fontFamily: 'NunitoSans', opacity: 0.77 }}>My Wallet Balance</Text>

                                </View>
                                <View style={{ alignItems: 'flex-start', marginTop: 10, marginBottom: 10, marginRight: 15 }}>

                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', marginLeft: 20, marginRight: 20, marginTop: 15, borderBottomColor: '#808080', borderBottomWidth: 0.7, paddingBottom: 15 }}>

                                <Text style={{ color: "#fff", fontSize: 14, fontWeight: '500', flex: 1 }}>ALL TRANSACTION </Text>
                                <Icon
                                    active
                                    name="filter"
                                    type='antdesign'
                                    color='#fff'
                                    size={30}
                                />
                            </View>

                            <View style={{ marginTop: 15 }}>

                                <FlatList
                                    style={{ paddingBottom: 5 }}
                                    data={this.state.details}
                                    renderItem={this.renderItem}
                                    keyExtractor={item => item.id}
                                    ItemSeparatorComponent={this.renderSeparator}
                                    ListHeaderComponent={this.renderHeader}
                                />

                            </View>

                        </View>

                    </View>




                </Content>
            </Container>
        );
    }

    renderItem = ({ item, }) => {
        return (
            <View style={{ marginLeft: 20, marginRight: 20, borderBottomColor: '#808080', borderBottomWidth: 0.7, paddingTop: 20, paddingBottom: 20 }}
                underlayColor="red">
                <View style={{ flex: 1, flexDirection: 'row', }}>
                    <Text style={{ color: "#fff", fontSize: 14, fontWeight: '500', flex: 1 }}>{item.title}</Text>
                    <Text style={{ color: "#fff", fontSize: 14, fontWeight: '300' }}> ₦{this.currencyFormat(item.amount)}</Text>
                </View>

                <View style={{ flex: 1, flexDirection: 'row', marginTop: 15 }}>
                    <Text style={{ color: "#fff", fontSize: 14, fontWeight: '500', flex: 1, opacity: 0.8 }}>{item.transactionReference} </Text>
                    <Text style={{ color: "#fff", fontSize: 14, fontWeight: '300', opacity: 0.8 }}>{item.date} </Text>
                </View>

            </View>

        )

    }
}
const sports = [
    {
        label: 'N3,700,000 Jackpot!',
        value: 'football',
    },
    {
        label: 'N350,000 Jackpot!',
        value: 'baseball',
    },
    {
        label: 'N30,000 Jackpot',
        value: 'hockey',
    },
    {
        label: 'Match 4',
        value: 'baseball',
    },
    {
        label: 'Match 3',
        value: 'hockey',
    }, {
        label: 'Match 2',
        value: 'hockey',
    },
];

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height - 80,

    },
    activeType: {
        flex: 1,
        borderBottomColor: '#5F5C7F',
        borderBottomWidth: 0.8,
        alignItems: 'center'
    },
    toggleText: {
        color: '#5F5C7F',
        fontSize: 16,
        fontWeight: '200',
        fontFamily: 'NunitoSans',
        marginBottom: 10
    },
    item: {
        flexDirection: 'row',
        borderColor: '#DD352E',
        borderBottomWidth: 2,
        alignItems: 'center',
    },
    menu: {
        flex: 1,
        marginRight: 1,
        marginLeft: 1,
        fontSize: 24,
        color: '#ffffff',
        textAlign: 'left',
        fontFamily: 'NunitoSans-Bold'
    },
    oneRow: {
        marginTop: 20,
        flexDirection: 'row',
        backgroundColor: '#111124',
        borderLeftWidth: 4,
        paddingBottom: 15
    },
    title: {
        marginTop: 16,
        color: '#fff',
        fontSize: 16,
        fontWeight: '600'
    },
    dot: {
        height: 12,
        width: 12,
        borderRadius: 6,
        backgroundColor: '#F7A400',
        margin: 10,
    },
    headings: {
        marginTop: 22,
        color: '#fff',
        fontSize: 12,
        fontFamily: 'NunitoSans-Bold'
    },
    inputView: {
        backgroundColor: 'rgba(247,164,0,0.3)',
        marginTop: 15,
        marginBottom: 5,
        justifyContent: "flex-start",
        borderColor: '#F7A400',
        borderWidth: 1,
        borderRadius: 5,
    },
    inputTextView: {
        marginTop: 20,
        marginBottom: 5,
        justifyContent: "flex-start",
        borderColor: '#BBB',
        borderWidth: 0.8,
        borderRadius: 5,

        paddingLeft: 10,
    },
    modal: {
        width: Dimensions.get('window').width - 40,
        backgroundColor: "#fff",
        height: 200,


    },
    Qrcontainer: {
        margin: 3

    },
    lineStyle: {
        height: 0.8,
        marginTop: 20,
        opacity: 0.5,
        backgroundColor: '#1e1e1e',

    },
    welcome: {
        height: 90,
        alignItems: 'center',
        justifyContent: 'center',
    },

});

