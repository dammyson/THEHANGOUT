import React, { Component } from "react";
import { Alert, Dimensions, TouchableOpacity, TextInput, StyleSheet, AsyncStorage, FlatList, ScrollView, } from "react-native";
import { Container, Content, View, Text, Button, Left, Right, Body, Title, List, ListItem, } from 'native-base';
import { Avatar, Icon, } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
const deviceHeight = Dimensions.get("window").height;
const URL = require("../../component/server");

import color from '../../component/color';

import {
    BarIndicator,
} from 'react-native-indicators';
import Moment from 'moment';

import Navbar from '../../component/Navbar';



export default class More extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data: '',
            name: '',
            prams: '',
            events: [],
            condition: true,
            activeIndex: 0


        };
    }



    componentWillMount() {
        this.setState({ prams: this.props.prams });
       
        AsyncStorage.getItem('data').then((value) => {
            if (value == '') { } else {
                this.setState({ data: JSON.parse(value) })
                this.setState({ user: JSON.parse(value).user })
            }
            this.processGetEventTickets();
        })


    }




    processGetEventTickets() {
        const { data,prams } = this.state
        console.warn(URL.url + 'restaurants/'+ prams)
        this.setState({ loading: true })
        fetch(URL.url + 'restaurants/'+ prams, {
            method: 'GET', headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': 'Bearer ' + data.token,
            },
        })
            .then(res => res.json())
            .then(res => {
                console.warn(res);
                if (res.status) {
                    this.setState({
                        loading: false,
                        events: res.data,
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
                        <Text style={{ fontSize: 12, color: '#fff' }}>Getting more restaurants </Text>
                        <BarIndicator count={4} color={color.primary_color} />
                        <Text style={{ fontSize: 10, flex: 1, color: '#fff', opacity: 0.6 }}>Please wait...</Text>
                    </View>
                </View>
            );
        }

        return (
            <Container style={{ backgroundColor: '#000' }}>
                <Navbar left={left} right={right} title='Restaurants Listing' bg='#111124' />
                <Content>
                    <View style={styles.container}>
                        <View style={{ flex: 1, }}>
                          
                                    <ScrollView style={{ flex: 1, }}>
                                        <View style={{ flex: 1, marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                                          
                                            <View style={styles.item}>

                                                <TextInput
                                                    placeholder="Search Events"
                                                    placeholderTextColor='#8d96a6'
                                                    returnKeyType="next"
                                                    keyboardType='default'
                                                    autoCapitalize="none"
                                                    autoCorrect={false}
                                                    style={styles.menu}
                                                   
                                                />

                                                <TouchableOpacity style={{ height: 30, width: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: '#DD352E' }}>
                                                    <Icon active name="search" type='feather' color='#fff' />
                                                </TouchableOpacity>

                                            </View>


                                        


                                            {this.renderItem(this.state.events)}





                                        </View>




                                    </ScrollView>




                        </View>

                    </View>


                </Content>
            </Container>
        );
    }

    renderItem(tickets) {
        Moment.locale('en');

        let items = [];
        for (let i = 0; i < tickets.length; i++) {
            items.push(
                <TouchableOpacity onPress={() => Actions.restaurantD({id: tickets[i].id})} style={styles.oneRow}>
                    <View style={{ marginRight: 20 , marginLeft:20}}>
                        <Text style={styles.title}> {tickets[i].name}</Text>
                        <Text style={{ marginLeft: 2, textAlign: 'left', color: '#fff', fontSize: 12, fontWeight: '100', marginRight: 40, opacity: 0.59 }}> {tickets[i].description} </Text>
                       
                        <View style={{  backgroundColor: '#111123', marginTop: 10, opacity: 0.5 }}>
                            <View style={{  flexDirection: 'row',}}>
                                <Icon
                                    active
                                    name="source-commit-start-next-local"
                                    type='material-community'
                                    color='#FFF'
                                    size={16}
                                />
                                <Text style={{ marginLeft: 2, color: '#fff', fontSize: 13, fontWeight: '100' }}>{tickets[i].location} </Text>
                            </View>

                            <View style={{  flexDirection: 'row' }}>
                                <Icon
                                    active
                                    name="update"
                                    type='material-community'
                                    color='#FFF'
                                    size={16}
                                />
                                <Text style={{ marginLeft: 2, color: '#fff', fontSize: 13, fontWeight: '100' }}> Opens: {  Moment( new Date('2019/02/28 '+ tickets[i].openingTime) ).format('LT')  } - {  Moment( new Date('2019/02/28 '+ tickets[i].closingTime) ).format('LT')  } </Text>
                            </View>

                        </View>
                      
                    </View>

                </TouchableOpacity>
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
    welcome: {
        height: 90,
        alignItems: 'center',
        justifyContent: 'center',
    },

});

