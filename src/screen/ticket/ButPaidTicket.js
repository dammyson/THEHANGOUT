import React, { Component } from "react";
import { Alert, Dimensions, TouchableOpacity, TextInput, StyleSheet, AsyncStorage, StatusBar, ScrollView, } from "react-native";
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

import Navbar from '../../component/Navbar';
import Success from "../../component/views/Success";

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

export default class BuyPaidTicket extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            done: true,
            data: '',
            name: '',
            id: '',
            details: {},
            condition: true,
            form_data: [],
            event_id: 2,
            eventTicket_id: 9,
            ticket_count_array: [1],
            tickets: [],
            bal: '',
            ticket_buy: [],
            ticketsPrice: 0


        }
    }



    componentWillMount() {

        const { id, ticket } = this.props.route.params;
        this.setState({ id: id });
        AsyncStorage.getItem('data').then((value) => {
            if (value == '') { } else {
                this.setState({ data: JSON.parse(value) })
                this.setState({ user: JSON.parse(value).user })
            }
            // this.processGetEvent();
        })

        AsyncStorage.getItem('bal').then((value) => {
            if (value == '') { } else {
                this.setState({ bal: value })
            }
        })

        if (ticket) {
            this.setState({ tickets: ticket });
        }
    }


    onChangeText(text, i, name,) {
        var instant_array = []
        instant_array = this.state.form_data

        if (instant_array[i] == null) {
            obj = {};

            obj.EventId = this.state.id
            //  obj.EventTicketId = this.state.tickets[0].id
            obj.Type = 'Events'

            if (name == 'fname') {
                obj.FirstName = text
            }

            if (name == 'lname') {
                obj.LastName = text
            }
            if (name == 'phone') {
                obj.Phone = text
            }

            if (name == 'email') {
                obj.Email = text
            }

            if (name == 'tick') {
                obj.EventTicketId = text
            }
            instant_array[i] = obj

        } else {
            obj = instant_array[i];

            if (name == 'fname') {
                obj.FirstName = text
            }

            if (name == 'lname') {
                obj.LastName = text
            }
            if (name == 'phone') {
                obj.Phone = text
            }

            if (name == 'email') {
                obj.Email = text
            }
            if (name == 'tick') {
                obj.EventTicketId = text
            }
            instant_array[i] = obj
        }



        this.setState({ form_data: instant_array })

    }



    addTicketType(pos, title, price, id) {
        console.warn(pos, title, price, id)
        var instant_array = []
        instant_array = this.state.ticket_buy
        this.onChangeText(id, pos, 'tick')
        if (instant_array[pos] == null) {
            obj = {};
            obj.title = title
            obj.price = price
            instant_array[pos] = obj

        } else {
            obj = instant_array[pos];
            obj.title = title
            obj.price = price
            instant_array[pos] = obj
        }
        this.setState({ ticket_buy: instant_array })
        let sum = 0
        for (let i = 0; i < this.state.ticket_buy.length; i++) {
            sum = sum + this.state.ticket_buy[i].price
        }
        this.setState({ ticketsPrice: sum })

    }



    processGetEventTickets() {

        const { form_data, data, ticket_buy } = this.state

        console.warn(form_data);

        if (form_data.length < 1) {
            Alert.alert('Validation failed', "Fields can not be empty", [{ text: 'Okay' }])
            return
        }


        for (let i = 0; i < form_data.length; i++) {
            if (form_data[i].FirstName == null || form_data[i].FirstName == '') {
                Alert.alert('Validation failed', "FirstName field can not be empty", [{ text: 'Okay' }])
                return
            }
            if (form_data[i].LastName == null || form_data[i].LastName == '') {
                Alert.alert('Validation failed', "LastName field can not be empty", [{ text: 'Okay' }])
                return
            }
            if (form_data[i].EventTicketId == null || form_data[i].EventTicketId == '') {
                Alert.alert('Validation failed', "Select Ticket Type field can not be empty", [{ text: 'Okay' }])
                return
            }
        }

        this.setState({ loading: true })
        fetch(URL.url + 'tickets/subscribe', {
            method: 'POST', headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': 'Bearer ' + data.token,
            }, body: JSON.stringify({
                ticketsList: form_data,
            }),
        })
            .then(res => res.json())
            .then(res => {
                console.warn(res);
                if (res.status) {
                    AsyncStorage.setItem('bal', this.currencyFormat(res.data.balance));
                    this.setState({ loading: false, done: true })

                } else {
                    Alert.alert('Process failed', res.message, [{ text: 'Okay' }])
                    this.setState({ loading: false })
                }
            }).catch((error) => {
                console.warn(error);
                this.setState({ loading: false })
                alert(error.message);
            });

    }

    incrememntTicketCount() {
        var instant_array_count = []
        instant_array_count = this.state.ticket_count_array
        instant_array_count.push(instant_array_count.length + 1);
        this.setState({ ticket_count_array: instant_array_count })
    }

    delete(i) {

        var instant_array_count = []
        instant_array_count = this.state.ticket_count_array
        instant_array_count.splice(i, 1);
        this.setState({ ticket_count_array: instant_array_count })


        var instant_array = []
        instant_array = this.state.form_data
        instant_array.splice(i, 1);
        this.setState({ form_data: instant_array })

    }

    currencyFormat(n) {
        return n.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    }

    render() {

        if (this.state.loading) {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000000' }}>
                    <View style={styles.welcome}>
                        <Text style={{ fontSize: 12, color: '#fff' }}>adding ticket </Text>
                        <BarIndicator count={4} color={color.primary_color} />
                        <Text style={{ fontSize: 10, flex: 1, color: '#fff', opacity: 0.6 }}>Please wait...</Text>
                    </View>
                </View>
            );
        }

        return (
            <>
                {this.state.done ?
                    this.success()
                    :
                    this.Body()}
            </>
        );


    }

    Body() {
        const { state, goBack } = this.props.navigation;
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
        return (
            <>
                <Container style={{ backgroundColor: '#000' }}>
                    <StatusBar barStyle="dark-content" hidden={false} backgroundColor="transparent" />
                    <Navbar left={left} right={right} title='Ticket Details' bg='#111124' />
                    <Content>
                        <View style={styles.container}>


                            <View style={{ flex: 1, }}>

                                <ScrollView style={{ flex: 1, }}>
                                    <Text style={{ color: '#fff', fontSize: 14, fontWeight: '200', marginLeft: 20, marginTop: 15, marginBottom: 6, fontFamily: 'NunitoSans', }}>PAYMENT </Text>


                                    <View style={{ flexDirection: 'row', marginTop: 6, marginLeft: 32, marginRight: 32 }}>
                                        <TouchableOpacity style={styles.activeType} >
                                            <Icon
                                                active
                                                name="wallet"
                                                type='simple-line-icon'
                                                color='#000'
                                                size={26}
                                            />
                                            <Text style={{ color: '#000', fontSize: 10, fontWeight: '200', fontFamily: 'NunitoSans', }}>Pay with wallet</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.inActiveType} >
                                            <Icon
                                                active
                                                name="bank"
                                                type='font-awesome'
                                                color='#5F5C7F'
                                                size={26}
                                            />
                                            <Text style={{ color: '#5F5C7F', fontSize: 10, fontWeight: '200', fontFamily: 'NunitoSans', }}>Pay with wallet</Text>
                                        </TouchableOpacity>
                                    </View>






                                    <View style={{ backgroundColor: '#fff', marginTop: 20, marginBottom: 20, marginLeft: 20, marginRight: 20, }}>
                                        <View style={{ flexDirection: 'row', backgroundColor: '#111124', marginTop: 24, marginBottom: 24, marginLeft: 20, marginRight: 20, borderRadius: 5 }}>
                                            <View style={{ marginLeft: 20, flex: 1, alignItems: 'flex-start', marginTop: 10, marginBottom: 10 }}>
                                                <Text style={{ color: '#fff', fontSize: 16, fontWeight: '200', fontFamily: 'NunitoSans-Bold', }}>₦{this.state.bal}</Text>
                                                <Text style={{ color: '#fff', fontSize: 12, fontFamily: 'NunitoSans', opacity: 0.77 }}>My Wallet Balance</Text>

                                            </View>
                                            <View style={{ alignItems: 'flex-start', marginTop: 10, marginBottom: 10, marginRight: 15 }}>
                                                <TouchableOpacity onPress={() =>  this.props.navigation.navigate('fundW')} style={{ backgroundColor: color.primary_color, alignItems: 'center', alignContent: 'space-around', paddingLeft: 13.5, paddingRight: 13.5, borderRadius: 5, }} block iconLeft>
                                                    <Text style={{ color: "#010113", marginTop: 7, marginBottom: 7, fontSize: 16, fontWeight: '200', fontFamily: 'NunitoSans', opacity: 0.77 }}>Fund Wallet</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                        <View style={styles.inputView}>
                                            <Text style={{ color: '#000', fontSize: 12, fontWeight: '200', margin: 10, fontFamily: 'NunitoSans', }}>You will not be charged for this transaction</Text>
                                        </View>

                                        {this.renderUpcomming()}

                                        <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                                            <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 10, marginBottom: 10, }}>
                                                <TouchableOpacity onPress={() => this.incrememntTicketCount()} style={styles.enablebutton} block iconLeft>
                                                    <Text style={{ color: color.secondary_color, marginTop: 10, marginBottom: 10, fontSize: 14, fontWeight: '200', fontFamily: 'NunitoSans', }}>Add</Text>
                                                </TouchableOpacity>
                                            </View>

                                        </View>

                                    </View>


                                </ScrollView>
                            </View>
                            <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                                <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 10, marginBottom: 10, }}>
                                    <TouchableOpacity onPress={() => this.processGetEventTickets()} style={styles.enablebutton} block iconLeft>
                                        <Text style={{ color: color.secondary_color, marginTop: 10, marginBottom: 10, fontSize: 14, fontWeight: '200', fontFamily: 'NunitoSans', }}>PAY ₦  {this.currencyFormat(this.state.ticketsPrice)}  </Text>
                                    </TouchableOpacity>
                                </View>

                            </View>

                        </View>


                    </Content>

                </Container>
                {this.state.done ?
                    this.success() :
                    null}
            </>);
    }
    renderUpcomming() {
        let items = [];
        for (let i = 0; i < this.state.ticket_count_array.length; i++) {

            items.push(
                <View style={{ marginLeft: 20, marginRight: 20, borderBottomColor: '#808080', borderBottomWidth: 0.5 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>
                        <Text style={{ color: '#1E1E1E', marginTop: 15, fontSize: 12, fontFamily: 'NunitoSans-Bold', flex: 1 }}>TICKET {this.state.ticket_count_array[i]}</Text>
                        <TouchableOpacity onPress={() => this.delete(i)} ><Icon
                            active
                            name="ios-close"
                            type='ionicon'
                            color='red'

                        /></TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 10, marginBottom: 2, }}>
                        <View style={styles.inputTextView}>
                            <TextInput
                                placeholder={"First name"}
                                placeholderTextColor={'#bbb'}
                                returnKeyType="next"
                                keyboardType='email-address'
                                autoCapitalize="none"
                                autoCorrect={false}
                                inlineImageLeft='ios-call'
                                style={{ flex: 1, fontSize: 12 }}
                                onChangeText={text => this.onChangeText(text, i, 'fname', 1)}
                            />

                        </View>



                        <View style={[styles.inputTextView, { marginLeft: 15 }]}>
                            <TextInput
                                placeholder="Last name"
                                placeholderTextColor={'#bbb'}
                                returnKeyType="next"

                                keyboardType='email-address'
                                autoCapitalize="none"
                                autoCorrect={false}
                                inlineImageLeft='ios-call'
                                style={{ flex: 1, fontSize: 12 }}
                                onChangeText={text => this.onChangeText(text, i, 'lname', 2)}

                            />

                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 4, marginBottom: 24, }}>
                        <View style={styles.inputTextView}>
                            <TextInput
                                placeholder="phone"
                                placeholderTextColor={'#bbb'}
                                returnKeyType="next"

                                keyboardType='email-address'
                                autoCapitalize="none"
                                autoCorrect={false}
                                inlineImageLeft='ios-call'
                                style={{ flex: 1, fontSize: 12 }}
                                onChangeText={text => this.onChangeText(text, i, 'phone', 3)}
                            />

                        </View>



                        <View style={[styles.inputTextView, { marginLeft: 15 }]}>
                            <TextInput
                                placeholder="Email"
                                placeholderTextColor={'#bbb'}
                                returnKeyType="next"

                                keyboardType='email-address'
                                autoCapitalize="none"
                                autoCorrect={false}
                                inlineImageLeft='ios-call'
                                style={{ flex: 1, fontSize: 12 }}
                                onChangeText={text => this.onChangeText(text, i, 'email', 4)}
                            />

                        </View>
                    </View>



                    <Text style={{ color: '#1E1E1E', marginTop: 15, fontSize: 12, fontFamily: 'NunitoSans-Bold', flex: 1, opacity: 0.6 }}>Ticket Type </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-start', marginBottom: 15, marginTop: 10 }}>

                        {this.renderTicket(i)}



                    </View>
                </View>


            );
        };
        return items;
    }


    renderTicket(pos) {
        let items = [];
        for (let i = 0; i < this.state.tickets.length; i++) {

            items.push(
                <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                    <Text style={{ color: '#1E1E1E', marginRight: 2, fontSize: 12, fontFamily: 'NunitoSans', }}>{this.state.tickets[i].title} {'(' + this.currencyFormat(this.state.tickets[i].cost) + ')'}</Text>
                    <TouchableOpacity onPress={() => this.addTicketType(pos, this.state.tickets[i].title, this.state.tickets[i].cost, this.state.tickets[i].id)} style={[{
                        height: 16,
                        width: 16,
                        borderRadius: 11,
                        borderWidth: 1,
                        borderColor: '#F7A400',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 10
                    }]}>
                        {this.state.ticket_buy[pos] != null ?

                            this.state.tickets[i].cost == this.state.ticket_buy[pos].price && this.state.tickets[i].title == this.state.ticket_buy[pos].title ?
                                <View style={{
                                    height: 12,
                                    width: 12,
                                    borderRadius: 6,
                                    backgroundColor: '#F7A400',
                                }} />

                                :
                                null

                            :
                            null


                        }



                    </TouchableOpacity>
                </View>
            )

        };
        return items;
    }
    onPress () {
        this.props.navigation.replace('listT');
      }
    success() {
        return (
            <Success
                onPress={() => this.onPress()}
                button_color={color.primary_color}
                button_text={'VIEW MY TICKETS'}
                button_text_color={color.secondary_color}
                message_color={'#fff'}
                title={'Success'}
                icon_bg={'#25AE88'}
                message={'Your Ticket has been successfully purchased. We have emailed you digital copies of your Tickets'}
            />

        );
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
    inputView: {
        backgroundColor: 'rgba(247,164,0,0.3)',
        marginTop: 7,
        marginBottom: 5,
        borderColor: '#F7A400',
        borderWidth: 1,
        borderRadius: 5,
        marginLeft: 20,
        marginRight: 20,
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
    inActiveType: {
        flex: 1,
        backgroundColor: "#111124",
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 5,
        paddingBottom: 10,
        borderRadius: 4,
        margin: 7
    },
    inputTextView: {
        flex: 1,
        height: 39,
        marginTop: 10,
        marginBottom: 10,

        borderColor: '#BBB',
        borderWidth: 1,
        borderRadius: 5,
    },

    lineStyle: {
        height: 0.5,
        margin: 20,
        backgroundColor: '#808080',

    },

});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 12,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30,
        fontFamily: 'NunitoSans-Bold', // to ensure the text is never behind the icon
    },
    inputAndroid: {
        fontSize: 12,
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderRadius: 8,
        color: '#fff',
        paddingRight: 30,
        fontFamily: 'NunitoSans-Bold', // to ensure the text is never behind the icon
    },

});