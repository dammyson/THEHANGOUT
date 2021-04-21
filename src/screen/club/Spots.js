import React, { Component } from "react";
import { Alert, Dimensions, TouchableOpacity, TextInput, StyleSheet, StatusBar, FlatList, ScrollView, } from "react-native";
import { Container, Content, View, Text, Button, Left, Right, Body, Title, List, ListItem, } from 'native-base';
import { Avatar, Icon, } from 'react-native-elements';
const deviceHeight = Dimensions.get("window").height;
const URL = require("../../component/server");

import color from '../../component/color';
const { width: screenWidth } = Dimensions.get('window')
import RNPickerSelect from 'react-native-picker-select';
import {
    BarIndicator,
} from 'react-native-indicators';
import Moment from 'moment';
import { getIsGuest, getData, getHeaders } from '../../component/utilities';
import Navbar from '../../component/Navbar';
import IsGuest from "../../component/views/IsGuest";

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

export default class Spots extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            is_guest: true,
            data: '',
            order: [],
            name: '',
            id: '',
            ticket_list: {},
            condition: true,
            activeIndex: 0,
            menuIndex: 1,
            status: false,
            user: { profilePicture: 'jjjjjjj' },


        };
    }



    async componentWillMount() {
        this.setState({ id: this.props.id });
        this.setState({ is_guest: await getIsGuest() =="YES" ? true : false})
        if (await getIsGuest() == "NO") {
            this.setState({
                data: JSON.parse(await getData()),
                user: JSON.parse(await getUser()),
            })
            this.processGetEventTickets();
        }
       



    }




    processGetEventTickets() {
        const { data,is_guest } = this.state

        this.setState({ loading: true })
        fetch(URL.url + 'clubs/myTables', {
            method: 'GET', headers: getHeaders(is_guest, data.token),
        })
            .then(res => res.json())
            .then(res => {
                console.warn(res.data);
                if (res.status) {
                    this.setState({
                        loading: false,
                        ticket_list: res.data,
                        order: res.data.orders,
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

    menuClicked = (index) => {
        this.setState({
            menuIndex: index
        })
    }

    render() {
        const { details, } = this.state
        const typePlaceholder = {
            label: 'Select Qty',
            value: null,
            color: '#000',
        };

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
                <Button transparent >

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
                        <Text style={{ fontSize: 12, color: '#fff' }}>Getting histories </Text>
                        <BarIndicator count={4} color={color.primary_color} />
                        <Text style={{ fontSize: 10, flex: 1, color: '#fff', opacity: 0.6 }}>Please wait...</Text>
                    </View>
                </View>
            );
        }

        if (!this.state.status) {
            return (
                <Container style={{ backgroundColor: color.secondary_color }}>
                    <StatusBar backgroundColor='#101023' barStyle="light-content" />
                    <Navbar left={left} right={right} title="Clubs" bg='#101023' />
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000000' }}>

                        <View style={styles.welcome}>
                            <Text style={{ fontSize: 15, color: '#fff' }}>No Club at the moment </Text>
                        </View>
                    </View>
                </Container>
            );
        }
        return (
            <View style={{ backgroundColor: '#000', height: Dimensions.get('window').height, }}>
                <Navbar left={left} right={right} title='My Spots' bg='#111124' />
                <View style={styles.container}>

                    <View style={{ flex: 1, }}>
                        {this.renderTable()}
                    </View>
                </View>
            </View>
        );
    }

    renderOrder() {
        return (
            <View style={{ flex: 1, }}>
                <View style={{ marginTop: 15, marginLeft: 20, marginRight: 20 }}>
                    {this.renderOrderItem(this.state.order)}
                </View>
            </View>
        )
    }

    renderTable() {
        return (
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
                        <Text style={[styles.toggleText, this.state.activeIndex == 1 ? { color: color.primary_color, } : {}]}>Past</Text>
                    </TouchableOpacity>

                </View>


                {
                    this.state.activeIndex == 0 ?
                        <ScrollView style={{ flex: 1, }}>
                            <View style={{ flex: 1, marginTop: 20, marginLeft: 20, marginRight: 20 }}>

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
                                        placeholder="Search Tables"
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

        )
    }


    renderOrderItem(tickets) {


        let items = [];
        for (let i = 0; i < tickets.length; i++) {
            items.push(
                <View style={styles.oneRow}>
                    <View>
                        <View style={styles.dot} />
                    </View>
                    <View style={{ marginRight: 20 }}>
                        <Text style={styles.title}> {tickets[i].name}</Text>
                        <Text style={{ marginLeft: 2, textAlign: 'left', color: '#fff', fontSize: 10, fontWeight: '100', marginRight: 40, opacity: 0.69 }}> {tickets[i].description} </Text>
                        <View style={{ flexDirection: 'row', marginRight: 15 }}>
                            <Icon
                                active
                                name="source-commit-next-local"
                                type='material-community'
                                color='#FFF'
                                size={16}
                            />
                            <Text style={{ marginLeft: 2, opacity: 0.59, color: '#fff', fontSize: 13, fontWeight: '100' }}>{tickets[i].address}  </Text>
                        </View>
                        <View style={{ alignItems: 'center', backgroundColor: '#111123', flexDirection: 'row', marginTop: 15, opacity: 0.5 }}>
                            <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginRight: 15 }}>
                                <Icon
                                    active
                                    name="list"
                                    type='entypo'
                                    color='#FFF'
                                    size={16}
                                />
                                <Text style={{ marginLeft: 2, color: '#fff', fontSize: 13, fontWeight: '100' }}>{tickets[i].quantity}  </Text>
                            </View>

                            <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                                <Icon
                                    active
                                    name="price-tag"
                                    type='entypo'
                                    color='#FFF'
                                    size={16}
                                />
                                <Text style={{ marginLeft: 2, color: '#fff', fontSize: 13, fontWeight: '100' }}> {tickets[i].amount}  </Text>
                            </View>

                        </View>
                    </View>

                </View>
            )

        }

        return items;

    }

    renderItem(tickets) {


        let items = [];
        for (let i = 0; i < tickets.length; i++) {
            items.push(
                <View style={styles.oneRow}>
                    <View>
                        <View style={styles.dot} />
                    </View>
                    <View style={{ marginRight: 20 }}>
                        <Text style={styles.title}> {tickets[i].name}</Text>
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
                                    name="user"
                                    type='font-awesome'
                                    color='#FFF'
                                    size={16}
                                />
                                <Text style={{ marginLeft: 2, color: '#fff', fontSize: 13, fontWeight: '100' }}> {tickets[i].noOfAdults}  </Text>
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
        height: Dimensions.get('window').height,

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
    activeMenu: {
        flex: 1,
        borderBottomColor: '#5F5C7F',
        borderBottomWidth: 0.8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: color.primary_color,
        height: 40
    },
    inActiveMenu: {
        flex: 1,
        borderColor: color.primary_color,
        borderWidth: 0.8,
        alignItems: 'center',
        justifyContent: 'center',
        height: 40
    },
    activeMenuText: {
        color: '#000',
        fontSize: 14,
        fontFamily: 'NunitoSans',
    },

    inActiveMenuText: {
        color: color.primary_color,
        fontSize: 14,
        fontFamily: 'NunitoSans',
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

