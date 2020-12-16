import React, { Component } from "react";
import { Alert, Dimensions, Image, ImageBackground, StyleSheet, AsyncStorage, StatusBar, ScrollView, } from "react-native";
import { Container, Content, View, Text, Button, Left, Right, Body, Title, List, ListItem, } from 'native-base';
import { Avatar, Icon, } from 'react-native-elements';
import DatePicker from 'react-native-datepicker'
const deviceHeight = Dimensions.get("window").height;
import QRCode from 'react-native-qrcode-svg';
const URL = require("../../component/server");

import color from '../../component/color';
const { width: screenWidth } = Dimensions.get('window')
import RNPickerSelect from 'react-native-picker-select';
import {
    BarIndicator,
} from 'react-native-indicators';
import Moment from 'moment';

import Navbar from '../../component/Navbar';


export default class TicketDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data: '',
            name: '',
            id: '',
            details: {}


        };
    }



    componentWillMount() {
        const { id,  } = this.props.route.params;
        this.setState({ id: id });
        AsyncStorage.getItem('data').then((value) => {
            if (value == '') { } else {
                this.setState({ data: JSON.parse(value) })
                this.setState({ user: JSON.parse(value).user })
            }
             this.processEventTicktetDetails();
        })
    }




    processEventTicktetDetails() {
        const { data, id, } = this.state

        this.setState({ loading: true })
        fetch(URL.url + 'tickets/details/' + id, {
            method: 'GET', headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': 'Bearer ' + data.token,
            },
        })
            .then(res => res.json())
            .then(res => {
                console.warn(res.data.purchasedTickets);
                if (res.status) {
                    this.setState({
                        loading: false,
                        details: res.data,
                    })
                } else {
                    Alert.alert('Action failed', res.message, [{ text: 'Okay' }])
                    this.setState({ loading: false })
                }
            }).catch((error) => {
                this.setState({ loading: false })
                console.warn(error);
                alert(error.message);
            });


    }

    render() {
        const { details, } = this.state
        const ticketVisibility = {
            label: 'Select visibility',
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
                        <Text style={{ fontSize: 12, color: '#fff' }}>Getting details </Text>
                        <BarIndicator count={4} color={color.primary_color} />
                        <Text style={{ fontSize: 10, flex: 1, color: '#fff', opacity: 0.6 }}>Please wait...</Text>
                    </View>
                </View>
            );
        }

        return (
            <Container style={{ backgroundColor: '#101023' }}>
                <Navbar left={left} right={right} title='My Tickets' bg='#111123' />
                <Content>
                    <View style={styles.container}>


                        <View style={{ flex: 1, backgroundColor: '#000', }}>
                            <ScrollView style={{ flex: 1, }}>
                                <View style={{ flex: 1, }}>

                                    <View style={{ marginLeft: 20, marginRight: 20 }}>
                                        <Text style={styles.title}>{details.eventTitle}</Text>
                                        <Text style={{ color: '#fff', fontSize: 12, fontWeight: '200', marginTop: 7, opacity: 0.6 }}>{details.date} </Text>

                                        <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 15, opacity: 0.5 }}>
                                            <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginRight: 15 }}>
                                                <Icon
                                                    active
                                                    name="ticket"
                                                    type='font-awesome'
                                                    color='#FFF'
                                                    size={15}
                                                />
                                                <Text style={{ marginLeft: 2, color: '#fff', fontSize: 12, fontWeight: '100' }}> {details.type} </Text>
                                            </View>

                                            <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                                                <Icon
                                                    active
                                                    name="food"
                                                    type='material-community'
                                                    color='#FFF'
                                                    size={15}
                                                />

                                                <Text style={{ marginLeft: 2, color: '#fff', fontSize: 12, fontWeight: '100' }}> Food </Text>
                                            </View>

                                        </View>


                                        <View style={{ flexDirection: 'row', marginTop: 15, opacity: 0.8, }}>

                                            <View>
                                                <Icon
                                                    active
                                                    name="location-pin"
                                                    type='simple-line-icon'
                                                    color='#FFF'
                                                    size={15}
                                                />
                                            </View>
                                            <View style={{ marginLeft: 7, }}>
                                                <Text style={{ marginLeft: 2, color: '#fff', fontSize: 13, fontWeight: '200' }}> {details.venue}  </Text>
                                                <Text style={{ marginLeft: 2, color: 'red', fontSize: 13, fontWeight: '200', opacity: 0.6, marginTop: 15, }}> See map</Text>
                                            </View>

                                        </View>


                                        <View style={{ flexDirection: 'row', marginBottom: 15, marginTop: 10 }}>
                                            <Text style={{ color: '#fff', fontSize: 10, fontWeight: '200', fontFamily: 'NunitoSans', }}>By</Text>
                                            <Text style={{ color: color.primary_color, fontSize: 10, fontWeight: '200', fontFamily: 'NunitoSans', }}> {details.organizer}</Text>
                                        </View>



                                        <View style={styles.lineStyle} />




                                    </View>
                                    <View style={{ margin: 20, }}>
                                        <Text style={styles.headings}> PURCHASED TICKTETS </Text>
                                    </View>


                                   

                                    {this.renderItem(details.purchasedTickets) }




                                </View>


                            </ScrollView>
                        </View>


                    </View>


                </Content>
            </Container>
        );
    }

    renderItem(tickets) {


        let items = [];
        for (let i = 0; i < tickets.length; i++) {
            items.push(
                <View style={{ backgroundColor: "#F2F2F2" , marginTop:20}}>
                <View style={{ flexDirection: 'row', marginBottom: 10, marginTop: 5, marginLeft: 20, marginRight: 20 }}>
                    <Text style={styles.titleDetails}> {tickets[i].eventTitle}</Text>
                    <View style={{}}>
                        <Image
                            style={styles.logo}
                            source={require('../../assets/logo.png')} />
                    </View>
                </View>
                <View style={{ flexDirection: 'row', backgroundColor: "#FFF", marginBottom: 20, marginTop: 5, marginLeft: 20, marginRight: 20, padding: 6 }}>
                    <View style={{ flex: 3 }}>
                        <Text style={{ marginLeft: 2, color: '#000', fontSize: 10, fontWeight: '400' }}>{tickets[i].name} {"("+ tickets[i].ticket +")"}  </Text>
                        <Text style={{ marginLeft: 2, color: '#1e1e1e', fontSize: 10, marginTop: 7, fontWeight: '400', opacity: 0.6 }}> {tickets[i].email}    <Text style={{ marginLeft: 2, color: '#000', fontSize: 10, fontWeight: '400' }}> 08066219798 </Text> </Text>
                        <Text style={{ marginLeft: 2, color: '#1e1e1e', fontSize: 10, marginTop: 12, fontWeight: '400', opacity: 0.6 }}> Purchased Date </Text>
                        <Text style={{ marginLeft: 2, color: '#000', fontSize: 10, fontWeight: '400' }}> {tickets[i].datePurchased}   </Text>
                        <Text style={{ marginLeft: 2, color: '#A60C05', fontSize: 10, marginTop: 12, fontWeight: '400', }}> You may be asked to show your Tickets at the venue for a QR code scan </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={styles.Qrcontainer}>
                            <QRCode
                                value={tickets[i].qrData}
                                size={80}
                                color="#000"
                                backgroundColor='#fff'
                            />
                        </View>
                    </View>

                </View>

            </View>
            )

        };
        return items;
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
        fontSize: 22,
        fontWeight: '600'
    },
    headings: {
        marginTop: 22,
        color: '#fff',
        fontSize: 14,
        fontWeight: '200'
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
    titleDetails: {
        marginTop: 15,
        color: '#000',
        fontSize: 15,
        fontWeight: '600',
        flex: 1
    },
    logo: {
        width: 90,
        height: 45,
        justifyContent: 'center',
        resizeMode: 'contain'
    },
    Qrcontainer: {
        margin: 3
        
    },
});