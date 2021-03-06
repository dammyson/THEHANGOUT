import React, { Component } from "react";
import { Alert, Dimensions, TouchableOpacity, TextInput, StyleSheet, AsyncStorage, FlatList, ScrollView, } from "react-native";
import { Container, Content, View, Text, Button, Left, Right, Body, Title, List, ListItem, } from 'native-base';
import { Avatar, Icon, } from 'react-native-elements';
const deviceHeight = Dimensions.get("window").height;
const URL = require("../../component/server");

import color from '../../component/color';
const { width: screenWidth } = Dimensions.get('window')
import RNPickerSelect from 'react-native-picker-select';
import {getUser, getData, getIsGuest, getHeaders  } from '../../component/utilities';
import IsGuest from "../../component/views/IsGuest";

import {
    BarIndicator,
} from 'react-native-indicators';
import Moment from 'moment';

import Navbar from '../../component/Navbar';

const type = [
    {
        label: '1 (Qty)',
        value: '1',
    },
    {
        label: '2 (Qty)',
        value: '2 (Qty)',
    },
    {
        label: '3 (Qty)',
        value: '3',
    },
];

export default class ListTickets extends Component {

    constructor(props) {
        super(props);
        this.state = {
            is_guest: true,
            loading: true,
            data: '',
            name: '',
            id: '',
            ticket_list: {},
            condition: true,
            activeIndex: 0,
            status: false,
            user:{profilePicture:'jjjjjjj'},


        };
    }



   async componentDidMount() {
        this.setState({ is_guest: await getIsGuest() =="YES" ? true : false})
        if(await getIsGuest() =="NO"){
        AsyncStorage.getItem('data').then((value) => {
            if (value == '') { } else {
                this.setState({ data: JSON.parse(value) })
                this.setState({ user: JSON.parse(value).user })
            }
            this.processGetEventTickets();
        })}


    }




    processGetEventTickets() {
        const { data, } = this.state

        this.setState({ loading: true })
        fetch(URL.url + 'tickets/myTickets', {
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
                        ticket_list: res.data,
                        status: res.status
                    })
                } else {
                    this.setState({ loading: false, status: res.status })
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
        const { state, goBack } = this.props.navigation;
        if (this.state.is_guest) {
            return (
                <IsGuest onPress={()=>  this.props.navigation.reset({
                    index: 0,
                    routes: [{ name: 'intro' }],
                })} />
            );
        }

        var left = (
            <Left style={{ flex: 1 }}>
                <Button transparent onPress={() => goBack(null)}>
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
                        <Text style={{ fontSize: 12, color: '#fff' }}>Getting details </Text>
                        <BarIndicator count={4} color={color.primary_color} />
                        <Text style={{ fontSize: 10, flex: 1, color: '#fff', opacity: 0.6 }}>Please wait...</Text>
                    </View>
                </View>
            );
        }

        if (!this.state.status) {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000000' }}>
                    <View style={styles.welcome}>
                        <Text style={{ fontSize: 12, color: '#fff' }}>Oops </Text>
                        <Text style={{ fontSize: 10, flex: 1, color: '#fff', opacity: 0.6 }}>No Data at the moment</Text>
                    </View>
                </View>
            );
        }

        return (
            <Container style={{ backgroundColor: '#000' }}>
                <Navbar left={left} right={right} title='My Tickets' bg='#111124' />
                <Content>
                    <View style={styles.container}>
                        <View style={{ flex: 1, }}>
                            <View style={{ flexDirection: 'row', marginTop: 15, marginLeft: 20, marginRight: 20 }}>

                                <TouchableOpacity style={[styles.activeType, this.state.activeIndex == 0 ? { borderBottomColor: color.primary_color, } : {}]}
                                    onPress={() => this.segmentClicked(0)}
                                    active={this.state.activeIndex == 0}
                                >
                                    <Text style={[styles.toggleText, this.state.activeIndex == 0 ? { color: color.primary_color, } : {}]}>Upcoming</Text>
                                </TouchableOpacity>
                                <View style={{ backgroundColor: '#5F5C7F', width: 1, marginBottom: 3 }} />
                                <TouchableOpacity style={[styles.activeType, this.state.activeIndex == 1 ? { borderBottomColor: color.primary_color, } : {}]}
                                    onPress={() => this.segmentClicked(1)}
                                    active={this.state.activeIndex == 1}>
                                    <Text style={[styles.toggleText, this.state.activeIndex == 1 ? { color: color.primary_color, } : {}]}>Past Events</Text>
                                </TouchableOpacity>

                            </View>


                            {
                                this.state.activeIndex == 0 ?
                                    <ScrollView style={{ flex: 1, }}>
                                        <View style={{ flex: 1, marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                                            <Text style={{ fontSize: 12, color: '#ffffff', opacity: 0.67 }}>Serach by Event name, Organizer or City </Text>
                                            <View style={styles.item}>

                                                <TextInput
                                                    placeholder="Search Tickets"
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



                                            {this.state.ticket_list.upComing.tomorrow == null ? null :

                                                this.state.ticket_list.upComing.tomorrow.length > 0 ?
                                                    <View>
                                                        <Text style={styles.headings}> Tomorrow </Text>
                                                        {this.renderItem(this.state.ticket_list.upComing.tomorrow)}
                                                    </View>

                                                    :
                                                    null

                                            }



                                            {this.state.ticket_list.upComing.upcoming == null ? null :

                                                this.state.ticket_list.upComing.upcoming.length > 0 ?
                                                    <View>
                                                        <Text style={styles.headings}> Upcoming </Text>

                                                        {this.renderItem(this.state.ticket_list.upComing.upcoming)}

                                                    </View>
                                                    : null
                                            }


                                        </View>




                                    </ScrollView>

                                    :

                                    <ScrollView style={{ flex: 1, }}>
                                        <View style={{ flex: 1, marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                                            <Text style={{ fontSize: 12, color: '#ffffff', opacity: 0.67 }}>Serach by Event name, Organizer or City </Text>
                                            <View style={styles.item}>

                                                <TextInput
                                                    placeholder="Search Tickets"
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


                                            {this.state.ticket_list.pastEvents.upcoming == null ? null :

                                                this.state.ticket_list.pastEvents.upcoming.length > 0 ?
                                                    <View>
                                                       <Text style={styles.headings}> Past Events </Text>

                                                        {this.renderItem(this.state.ticket_list.pastEvents.upcoming)}

                                                    </View>
                                                    : null
                                            }

                                        </View>




                                    </ScrollView>

                            }




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
                <TouchableOpacity onPress={() => this.props.navigation.navigate('detailT', { id: tickets[i].eventId })} style={styles.oneRow}>
                    <View>
                        <View style={styles.dot} />
                    </View>
                    <View style={{ marginRight: 20 }}>
                        <Text style={styles.title}> {tickets[i].eventTitle}</Text>
                        <Text style={{ marginLeft: 2, textAlign: 'left', color: '#fff', fontSize: 10, fontWeight: '100', marginRight: 40, opacity: 0.59 }}> {tickets[i].description} </Text>
                        <View style={{ alignItems: 'center', backgroundColor: '#111123', flexDirection: 'row', marginTop: 15, opacity: 0.5 }}>
                            <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginRight: 15 }}>
                                <Icon
                                    active
                                    name="timer-sand"
                                    type='material-community'
                                    color='#FFF'
                                    size={16}
                                />
                                <Text style={{ marginLeft: 2, color: '#fff', fontSize: 13, fontWeight: '100' }}>{tickets[i].date} {tickets[i].time}  </Text>
                            </View>

                            <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                                <Icon
                                    active
                                    name="ticket"
                                    type='font-awesome'
                                    color='#FFF'
                                    size={16}
                                />
                                <Text style={{ marginLeft: 2, color: '#fff', fontSize: 13, fontWeight: '100' }}> {tickets[i].numberOfTickets} </Text>
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

