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
import { getSaveRestaurant, getData } from '../../component/utilities';

import Navbar from '../../component/Navbar';
import Success from "../../component/views/Success";
import CardPay from "../../component/views/CardPay";
import Balance from '../../component/views/Balance';

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
            done: false,
            show_card: false,
            data: '',
            event: '',
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
            ticketsPrice: 0,
            pay_type: 0,
            refresh_balance: true,


        }
    }



    async componentWillMount() {

        const { id, ticket, event } = this.props.route.params;
        this.setState({ id: id, event: event });
        this.setState({
            data: JSON.parse(await getData()),
            user: JSON.parse(await getData()).user
        })

        AsyncStorage.getItem('bal').then((value) => {
            if (value == '') { } else {
                this.setState({ bal: value })
            }
        })

        if (ticket) {
            this.setState({ tickets: ticket });
        }
        this._unsubscribe();
    }

    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.refresh()
        });
    }

    refresh() {
        this.setState({ refresh_balance: false })
        setTimeout(() => {
            this.setState({ refresh_balance: true })
        }, 500);
    }

    segmentClicked = (index) => {
        this.setState({
            pay_type: index
        })
    }


    onChangeText(text, i, name,) {
        var instant_array = []
        instant_array = this.state.form_data
        var obj;
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

    handleButtonClick() {
        const { form_data, pay_type, ticketsPrice } = this.state

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

        console.warn(ticketsPrice)
        if (pay_type == 0) {
            this.processGetEventTickets('no ref', true)
        } else {
            this.setState({ show_card: true })
        }
    }

    processGetEventTickets(ref, isWallet) {

        const { form_data, data, ticket_buy, pay_type } = this.state

        console.warn(form_data);
        console.warn(JSON.stringify({
            ticketsList: form_data,
            isWallet: isWallet,
            PaymentRef: ref
        }))

        this.setState({ loading: true })
        fetch(URL.url + 'tickets/subscribe', {
            method: 'POST', headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': 'Bearer ' + data.token,
            }, body: JSON.stringify({
                ticketsList: form_data,
                isWallet: isWallet,
                PaymentRef: ref
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
    renderBalance() {
        return (
           
            <Balance

            OnButtonPress={() => this.props.navigation.replace('fundW')}
            backgroundColor={'#111124'}
            buttonColor={color.primary_color}
            textColor={'#010113'}
            buttonText={'Fund Wallet'}
            balTextColor={'#fff'}
            commentTextColor={'#fff'}
        />
        )
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
                                        <TouchableOpacity onPress={() => this.segmentClicked(0)} style={[this.state.pay_type == 0 ? styles.activeType : styles.inActiveType]} >
                                            <Icon
                                                active
                                                name="wallet"
                                                type='simple-line-icon'
                                                color='#000'
                                                size={26}
                                            />
                                            <Text style={{ color: '#000', fontSize: 10, fontWeight: '200', fontFamily: 'NunitoSans', }}>Pay with wallet</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => this.state.event.type == 'Free' ? null : this.segmentClicked(1)} style={[this.state.pay_type == 1 ? styles.activeType : styles.inActiveType]} >
                                            <Icon
                                                active
                                                name="bank"
                                                type='font-awesome'
                                                color='#5F5C7F'
                                                size={26}
                                            />
                                            <Text style={{ color: '#5F5C7F', fontSize: 10, fontWeight: '200', fontFamily: 'NunitoSans', }}>Pay with Card</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <View style={{ backgroundColor: '#fff', marginTop: 20, marginBottom: 20, marginLeft: 20, marginRight: 20, }}>

                                    {this.state.refresh_balance ? this.renderBalance() : null}
                        
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
                                    <TouchableOpacity onPress={() => this.handleButtonClick()} style={styles.enablebutton} block iconLeft>
                                        <Text style={{ color: color.secondary_color, marginTop: 10, marginBottom: 10, fontSize: 14, fontWeight: '200', fontFamily: 'NunitoSans', }}>PAY ₦  {this.currencyFormat(this.state.ticketsPrice)}  </Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </View>


                    </Content>

                </Container>
                {this.state.done ? this.success() : null}
                {this.state.show_card ? this.renderCardPay() : null}
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
                    <View style={{ flexDirection: 'row', marginTop: 4, marginBottom: 14, }}>
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



                    <Text style={{ color: '#1E1E1E', marginTop: 1, fontSize: 12, fontFamily: 'NunitoSans-Bold', flex: 1, opacity: 0.6 }}>Ticket Type </Text>
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
    onPress() {
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
    onSuccess(res) {
        this.setState({ show_card: false })
        this.processGetEventTickets(res.reference, false)
    }
    onFailed() {
        this.setState({ show_card: false })
        Alert.alert('Process failed', 'Check your card and try again or use another payment method', [{ text: 'Okay' }])
    }
    renderCardPay() {
        const { ticketsPrice } = this.state
        const amount = ticketsPrice * 100
        return (
            <CardPay
                onClose={(v) => this.setState({ show_card: false })}
                onSuccess={(res) => this.onSuccess(res)}
                onFailed={() => this.onFailed()}
                amount={amount}
            />
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