import React, { Component } from "react";
import { Alert, Dimensions, TouchableOpacity, StatusBar, StyleSheet, ScrollView, TextInput } from "react-native";
import { Container, Content, View, Text, Button, Left, Toast, Right, Body, Title, List, ListItem, } from 'native-base';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Card, Icon, SocialIcon } from 'react-native-elements'
import RNPickerSelect from 'react-native-picker-select';
const URL = require("../../component/server");
import color from '../../component/color';
const { width: screenWidth } = Dimensions.get('window')
import Navbar from '../../component/Navbar';
import {
    BarIndicator,
} from 'react-native-indicators';
import { getSaveRestaurant, getData } from '../../component/utilities';

import Moment from 'moment';
import SelectAddress from "./SelectAddress";


const sports = [
    {
        label: '2            ',
        value: 2,
    },
    {
        label: '3             ',
        value: 3,
        color: '#000',
    },
    {
        label: '4             ',
        value: 4,
    },
    {
        label: '5            ',
        value: 5,
    },
    {
        label: '6            ',
        value: 6,
    },

];

export default class PlaceOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            done: false,
            show_add: false,
            show_add_pika: false,
            pickup: 'Yes',
            res_id: '',
            restaurant: '',
            titleText: '',
            id: '',
            data: '',
            user: '',
            address_id: '',
            address: '',
            add_price: 0,
            delivery_price: 0,
            price: 0,
            selected_add: [],
            count: 140,
            startdate: new Date(),
            qty: 1,
            menu: {},
            message:''
        };
    }


    async componentWillMount() {
        this.setState({
            data: JSON.parse(await getData()),
            user: JSON.parse(await getData()).data
        })
        const { res_id, restaurant, menu_id } = this.props.route.params;
        
        this.setState({
            res_id: res_id,
            restaurant: restaurant,
            id: menu_id
        });
        this.processGetEvent()

    }
    processGetEvent() {
        this.setState({message:'getting menu... '})
        const { data, id, restaurant } = this.state
        this.setState({ loading: true })
        fetch(URL.url + 'food/menu/details/' + id, {
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
                        address:res.data.lastAddressUsed,
                        address_id: res.data.lastAddressUsedId,
                        menu: res.data,
                        loading: false,
                        price: parseInt(res.data.amount),
                        delivery_price: parseInt(res.data.deliveryPriceRange)

                    })
                } else {
                    Alert.alert('Action failed', res.message, [{ text: 'Okay' }])
                    this.setState({ loading: false })
                }
            }).catch((error) => {
                this.setState({ loading: false })
                alert(error.message);
            });


    }



    makePaymentRequest = (result) => {
        this.setState({message:'placing order... '})
        const { user, menu,address_id, restaurant, data, qty, delivery_price, price, add_price } = this.state
        if (address_id == '') {
            Alert.alert('Validation failed', "address fields can not be empty", [{ text: 'Okay' }])
            return
        }
        var amount = (price * qty) + add_price + delivery_price;
        var order_des = restaurant + ' - ' + menu.name;
        var formBody = JSON.stringify({
            Recipient: menu.restaurantOwnerId,
            Amount: amount,
            Description: order_des,
            CashierCode: 'BGBGG',
            EventCode: 'BGBGG',
            PaymentRef: 'BGBGG',
        })


        this.setState({ loading: true });
        fetch(URL.url + 'wallet/transfer', {
            method: 'POST', headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': 'Bearer ' + data.token,
            }, body: formBody,
        })
            .then(res => res.json())
            .then(res => {
                console.warn(res);
                if (res.status) {
                    this.processOrder()
                } else {
                    Alert.alert('Process failed', res.message, [{ text: 'Okay' }])
                    this.setState({ loading: false, can_scan: false, status: res.status, respons: 'Transaction was unsuccessfull' })
                }
            }).catch((error) => {
                console.warn(error);
                alert(error.message);
            });

    };





    countChange(text) {
        this.setState({ count: 140 - text.length })

    }



    processOrder() {
        const { data, menu, address_id, qty, pickup, selected_add, delivery_price, price, add_price } = this.state
        var amount = (price * qty) + add_price + delivery_price;
        if (pickup == 'Yes') {
            var delll = 'Delivery'
        } else {
            var delll = 'PickUp'
        }

        var formBody = JSON.stringify({
            Address: address_id,
            Quantity: qty,
            Amount: amount,
            AddOns: selected_add,
            DeliveryType: delll,
            MenuId: menu.id,

        })
        console.warn(formBody)

        this.setState({ loading: true })
        fetch(URL.url + 'food/placeOrder', {
            method: 'POST', headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': 'Bearer ' + data.token,
            }, body: formBody,
        })
            .then(res => res.json())
            .then(res => {
                console.warn("kaikkk", res);
                if (res.status) {
                    this.setState({ loading: false, done: true })
                } else {
                    Alert.alert('Operation failed', res.message, [{ text: 'Okay' }])
                    this.setState({ loading: false })
                }
            }).catch((error) => {
                console.warn(error);
                this.setState({ loading: false })
                alert(error.message);
            });


    }
    currencyFormat(n) {
        return  n.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
     }

   
    render() {
        const { menu, restaurant } = this.state

        Moment.locale('en');

        var left = (
            <Left style={{ flex: 1 }}>
                <Button transparent onPress={() => this.state.show_add ? this.setState({ show_add: false }) : this.props.navigation.goBack()}>
                    <Icon
                        active
                        name="left"
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
                        <Text style={{ fontSize: 12, color: '#fff' }}>{this.state.message} </Text>
                        <BarIndicator count={4} color={color.primary_color} />
                        <Text style={{ fontSize: 10, flex: 1, color: '#fff', opacity: 0.6 }}>Please wait...</Text>
                    </View>
                </View>
            );
        }


        if (this.state.done) {
            return (
                <Container style={{ backgroundColor: '#000' }}>
                    <StatusBar barStyle="dark-content" hidden={false} backgroundColor="transparent" />

                    <Navbar left={left} title='' bg='#000' />
                    <Content>
                        <View style={styles.container}>


                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

                                <View style={{ alignItems: 'center', margin: 20, }}>
                                    <TouchableOpacity style={{ backgroundColor: 'red', height: 74, width: 74, borderRadius: 37, justifyContent: 'center', alignItems: 'center', }}>
                                        <Icon
                                            active
                                            name="md-checkmark"
                                            type='ionicon'
                                            color='#fff'
                                            size={34}
                                        />
                                    </TouchableOpacity>

                                    <Text style={{ color: '#fff', fontSize: 22, fontWeight: '200', fontFamily: 'NunitoSans-Bold', }}>Success</Text>
                                    <Text style={{ textAlign: 'center', color: '#fff', fontSize: 12, fontWeight: '200', fontFamily: 'NunitoSans', opacity: 0.8 }}>Your Order has been placed sucessfully.</Text>
                                </View>




                                <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20, marginBottom: 20, }}>
                                    <TouchableOpacity onPress={() => this.props.navigation.replace('restaurants')} style={styles.enablebutton} block iconLeft>
                                        <Text style={{ color: '#fff', marginTop: 15, marginBottom: 15, fontSize: 16, fontWeight: '200', fontFamily: 'NunitoSans', }}>Continue</Text>
                                    </TouchableOpacity>
                                </View>


                            </View>



                        </View>


                    </Content>
                </Container>
            );
        }

        return (
            <Container style={{ backgroundColor: '#000' }}>
                <Navbar left={left} bg='000' />
                <Content>
                    {this.state.show_add ?  this.renderMenu() : this.renderADDON()}
                </Content>
                {this.state.show_add_pika ? 
                <View
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        width: Dimensions.get('window').width,
                        height: Dimensions.get('window').height,
                    }}
                   
                >

                 { this.renderAddressPicker()}
                </View>
               :null}
            </Container>
        );
    }
    handleSelectedAddress(data){
        console.warn(data);
        this.setState({ 
            show_add_pika: false, 
            address: data.address,
            address_id: data.id,
            })
    }

    renderAddressPicker() {
        return (
          <SelectAddress
          onSelected={(data) => this.handleSelectedAddress(data)}
           onClose={() => this.setState({ show_add_pika: false })} />
        )
      }

    renderADDON() {
        const { menu, restaurant } = this.state
        return (

            <View style={styles.container}>
  <StatusBar barStyle="dark-content" hidden={false} backgroundColor="transparent" />

                <View style={{ flex: 1, }}>
                    <ScrollView style={{ flex: 1, }}>
                        <View style={{ flex: 1, }}>
                            <View style={{ borderBottomColor: "#ffffff60", borderBottomWidth: 0.7, flexDirection: 'row', marginLeft: 20, marginRight: 20, paddingBottom: 15 }}>
                                <Text style={{ fontFamily: 'NunitoSans-Bold', color: '#fff', fontSize: 17, }}>{menu.name}</Text>
                            </View>

                            <View style={{ borderBottomColor: "#ffffff60", borderBottomWidth: 0.7, flexDirection: 'row', marginLeft: 20, marginRight: 20, paddingTop: 20, paddingBottom: 20 }}>
                                <Text style={{ fontFamily: 'NunitoSans-Regular', color: '#fff', fontSize: 13, }}>{menu.description}</Text>
                            </View>

                            {menu.titleAndOptions == null || menu.titleAndOptions.length == 0 ? null : this.renderOption(menu.titleAndOptions)}
                            <View style={{ marginTop: 15, marginRight: 30, marginLeft: 30 }}>
                                <Text style={{ fontFamily: 'NunitoSans-Regular', color: '#fff', fontSize: 13, marginBottom: 10 }}>Delivery Or Pickup</Text>
                                {this.renderDelivery(menu)}

                            </View>

                        </View>


                    </ScrollView>
                </View>


                <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#111123', flexDirection: 'row', paddingTop: 10, paddingBottom: 10, paddingLeft: 25, paddingRight: 25 }}>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                        <Text style={{ fontSize: 16, color: '#ffffff', textAlign: 'left', fontWeight: '600', fontFamily: 'NunitoSans-Bold' }}> ₦{ this.currencyFormat((this.state.price * this.state.qty) + this.state.delivery_price + this.state.add_price)}</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                        <TouchableOpacity   onPress={() =>  this.setState({ show_add: true }) } style={{ height: 45, flexDirection: 'row', paddingRight: 30, paddingLeft: 30, alignItems: 'center', justifyContent: 'center', borderRadius: 5, backgroundColor: 'red' }}>
                            <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>PROCEED</Text>
                        </TouchableOpacity>
                    </View>
                </View>





            </View>
        )
    }

    renderMenu() {
        const { menu, restaurant } = this.state

        const ticketVisibility = {
            label: '1                           ',
            value: 1,
            color: '#000',
        };

        return (
        <View style={styles.container}>
            <View >
            <StatusBar barStyle="dark-content" hidden={false} backgroundColor="transparent" />
                <Text style={styles.titleText}>CONFIRM ORDER</Text>
            </View>

            <View style={styles.main_content}>
                <Text style={styles.title}>{menu.name}</Text>
                <Text style={styles.date}>{restaurant}</Text>

                <View style={{ flexDirection: 'row', marginTop: 20, marginBottom: 10 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.date, {}]}>Quantity</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', borderColor: '#fff', alignItems: 'center', borderWidth: 1, paddingLeft: 10, marginRight: 20 }}>
                        <RNPickerSelect
                            placeholder={ticketVisibility}
                            placeholderTextColor='#fff'
                            items={sports}
                            onValueChange={value => {
                                this.setState({
                                    qty: value,
                                });
                            }}
                            style={pickerSelectStyles}

                            value={this.state.visibility}
                            useNativeAndroidPickerStyle={false}

                        />

                    </View>

                </View>



                <View style={[styles.oneRow, { marginTop: 20 }]}>
                    <View style={{ margin: 20, }}>
                        <Icon
                            active
                            name="location"
                            type='octicon'
                            color='#FFF'
                            size={20}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <View>
                            <Text style={styles.hintText}> Delievry Address</Text>
                        </View>
                        <TouchableOpacity  onPress={() => this.setState({show_add_pika:true})}style={styles.item}>
                        <Text style={styles.menu}> { this.state.address}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ alignItems: 'flex-end', marginTop: 2, marginBottom: 20 }}>

                    <Text style={styles.title}> ₦{ this.currencyFormat((this.state.price * this.state.qty) + this.state.delivery_price + this.state.add_price)}</Text>
                </View>


            </View>


            <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>

                <TouchableOpacity onPress={() => this.makePaymentRequest()} style={{ height: 45, flexDirection: 'row', paddingRight: 30, paddingLeft: 30, marginTop: 20, marginBottom: 20, margin: 10, alignItems: 'center', justifyContent: 'center', borderRadius: 5, backgroundColor: 'red' }}>
                    <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>Make Payment</Text>
                </TouchableOpacity>
            </View>




        </View>)
    }

    renderOption(data) {
        let new_cat = []
        for (var i = 0; i < data.length; i++) {
            new_cat.push(
                <View style={{ marginTop: 15, marginRight: 30, marginLeft: 30 }}>
                    <Text style={{ fontFamily: 'NunitoSans-Regular', color: '#fff', fontSize: 13, marginBottom: 10 }}>{data[i].title}</Text>
                    {this.renderAddOnChild(data[i].addOnList)}

                </View>
            )
        }
        return new_cat;
    }


    addAdd(item) {
        var instant_array = []
        instant_array = this.state.selected_add

        if (!instant_array.includes(item.id)) {
            instant_array.push(item.id)
            this.updatePrice('+', item)
            this.setState({ selected_add: instant_array })
        }
    }
    remAdd(item) {
        var instant_array = []
        instant_array = this.state.selected_add

        if (instant_array.includes(item.id)) {
            const index = instant_array.indexOf(item.id);
            if (index > -1) {
                instant_array.splice(index, 1);
                this.updatePrice('-', item)
                this.setState({ selected_add: instant_array })
            }
        }

    }


    updatePrice(opr, data) {
        var add_price = this.state.add_price
        if (opr == '+') {
            add_price = add_price + data.amount
        } else {
            add_price = add_price - data.amount
        }
        this.setState({ add_price: add_price })
    }

    pluck(arr, key) {
        return arr.reduce(function (p, v) {
            return p.concat(v[key]);
        }, []);
    }

    renderAddOnChild(data) {

        let cat = [];
        for (var i = 0; i < data.length; i++) {
            let id = i;
            cat.push(
                <View style={{ backgroundColor: '#101023', flexDirection: 'row', padding: 6, justifyContent: 'center', marginBottom: 5 }}>


                    {this.state.selected_add.includes(data[i].id) ?
                        <TouchableOpacity onPress={() => this.remAdd(data[id])} style={{ margin: 5 }}>
                            <Icon
                                active
                                name="radiobox-marked"
                                type='material-community'
                                color={color.red}
                            />
                        </TouchableOpacity>
                        :
                        <TouchableOpacity onPress={() => this.addAdd(data[id])} style={{ margin: 5 }}>
                            <Icon
                                active
                                name="radiobox-blank"
                                type='material-community'
                                color={color.red}
                            />
                        </TouchableOpacity>
                    }

                    <View style={{ flex: 1, justifyContent: 'center', marginLeft: 10 }}>
                        <Text style={{ textAlign: 'left', fontFamily: 'NunitoSans-SemiBold', color: '#fff', fontSize: 13, }}>{data[i].name} - ₦{this.currencyFormat(data[i].amount)}</Text>
                    </View>


                </View>
            );
        }
        return cat;
    }

    setDelevery(menu, action) {

        console.warn(action);
        if (action == 'Yes') {
            this.setState({
                delivery_price: parseInt(menu.deliveryPriceRange),
                pickup: action
            })
        } else {
            this.setState({
                delivery_price: 0,
                pickup: action
            })
        }

    }

    renderDelivery(menu) {
        return (
            <>
                <View style={{ backgroundColor: '#101023', flexDirection: 'row', padding: 6, justifyContent: 'center', marginBottom: 5 }}>


                    {this.state.pickup == 'Yes' ?
                        <View style={{ margin: 5 }}>
                            <Icon
                                active
                                name="radiobox-marked"
                                type='material-community'
                                color={color.red}
                            />
                        </View>
                        :
                        <TouchableOpacity onPress={() => this.setDelevery(menu, 'Yes')} style={{ margin: 5 }}>
                            <Icon
                                active
                                name="radiobox-blank"
                                type='material-community'
                                color={color.red}
                            />
                        </TouchableOpacity>
                    }

                    <View style={{ flex: 1, justifyContent: 'center', marginLeft: 10 }}>
                        <Text style={{ textAlign: 'left', fontFamily: 'NunitoSans-SemiBold', color: '#fff', fontSize: 13, }}>Delivery - ₦{menu.deliveryPriceRange}</Text>
                    </View>


                </View>
                <View style={{ justifyContent: 'center', flexDirection: 'row', }}>
                    <Text style={{ textAlign: 'left', flex: 1, fontFamily: 'NunitoSans-SemiBold', color: '#fff', fontSize: 13, }}>{this.state.address}</Text>
                    <TouchableOpacity onPress={() => this.setState({show_add_pika:true})} style={{ margin: 5 }}>
                        <Text style={{ textAlign: 'left', fontFamily: 'NunitoSans-SemiBold', color: 'red', fontSize: 13, }}>Change Address</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ backgroundColor: '#101023', flexDirection: 'row', padding: 6, justifyContent: 'center', marginBottom: 5 }}>

                    {this.state.pickup == 'No' ?
                        <View style={{ margin: 5 }}>
                            <Icon
                                active
                                name="radiobox-marked"
                                type='material-community'
                                color={color.red}
                            />
                        </View>
                        :
                        <TouchableOpacity onPress={() => this.setDelevery(menu, "No")} style={{ margin: 5 }}>
                            <Icon
                                active
                                name="radiobox-blank"
                                type='material-community'
                                color={color.red}
                            />
                        </TouchableOpacity>
                    }

                    <View style={{ flex: 1, justifyContent: 'center', marginLeft: 10 }}>
                        <Text style={{ textAlign: 'left', fontFamily: 'NunitoSans-SemiBold', color: '#fff', fontSize: 13, }}>Pickup</Text>
                    </View>


                </View>
            </>
        )
    }



}

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height - 80,
        flex:1,

    },
    btnContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: "6%"
    },
    titleText: {
        fontSize: 21,
        color: '#ffffff',
        marginTop: 25,
        marginLeft: 15,
        fontFamily: 'NunitoSans-Bold'
    },
    main_content: {
        marginTop: 20,
        marginRight: 10,
        marginLeft: 10,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#101023'

    },
    date: {
        marginTop: 10,
        marginBottom: 10,
        marginRight: 13,
        marginLeft: 13,
        fontSize: 12,
        color: '#ffffff',
        textAlign: 'left',
        fontFamily: 'NunitoSans-Bold'
    },
    title: {
        marginTop: 30,
        marginRight: 13,
        marginLeft: 13,
        fontSize: 16,
        color: '#ffffff',
        textAlign: 'left',
        fontWeight: '600',
        fontFamily: 'NunitoSans-Bold'
    },
    label: {
        marginTop: 10,
        marginBottom: 10,
        marginRight: 13,
        marginLeft: 13,
        fontSize: 10,
        color: '#ffffff',
        textAlign: 'left',
        fontFamily: 'NunitoSans-Bold'
    },
    welcome: {
        height: 90,
        alignItems: 'center',
        justifyContent: 'center',
    },
    enablebutton: {
        backgroundColor: 'red',
        alignItems: 'center',
        alignContent: 'space-around',
        paddingLeft: 53,
        paddingRight: 53,
        borderRadius: 5,
        marginLeft: 30,
        marginRight: 30,
    },
    date_text: {
        color: '#fff',
        fontSize: 18,
        marginLeft: 20
    },
    item: {
        flexDirection: 'row',
        borderColor: '#8d96a6',
        borderBottomWidth: 0.6,
        alignItems: 'center',
        marginRight: 30,
        flex: 1,

    },
    menu: {
        height: 45,
        flex: 1,
        fontSize: 15,
        color: '#ffffff',
        textAlign: 'left',
        fontFamily: 'NunitoSans-Bold',
    },
    oneRow: {
        flexDirection: "row",
        marginBottom: 5,
        width: Dimensions.get('window').width,
    },
    hintText: {
        fontSize: 12,
        color: '#ffffff',
        opacity: 0.6
    },

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