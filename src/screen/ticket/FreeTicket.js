import React, { Component } from "react";
import { Alert, Dimensions, TouchableOpacity, TextInput, StyleSheet, AsyncStorage, ActivityIndicator, NativeModules, } from "react-native";
import { Container, Content, View, Text, Button, Left, Toast, Body, Title, List, ListItem, } from 'native-base';
import { Avatar, Icon, } from 'react-native-elements';
const deviceHeight = Dimensions.get("window").height;
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Moment from 'moment';
const URL = require("../../component/server");

import color from '../../component/color';
const { width: screenWidth } = Dimensions.get('window')
import RNPickerSelect from 'react-native-picker-select';
import {
    BarIndicator,
} from 'react-native-indicators';

import Navbar from '../../component/Navbar';


const sports = [
    {
        label: 'Visible',
        value: '1',
        color: '#000',
    },
    {
        label: 'Not Visible',
        value: '2',
        color: '#000',
    },

];
export default class FreeTicket extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: '',
            form_data: [],
            startdate: new Date(),
            enddate: new Date(),
            todate: "2019-06-11",
            ticket_count_array: [1],
            show_from_picker: false,
            show_to_picker: false
        };
    }



    componentWillMount() {
        AsyncStorage.getItem('data').then((value) => {
            if (value == '') { } else {
                this.setState({ data: JSON.parse(value) })
                this.setState({ user: JSON.parse(value).user })
            }
            console.warn(value);
        })
        this.setState({
            today: new Date(),
        });


    }

    goBack() {
        const {  goBack } = this.props.navigation; 
        goBack(null)
    }

    processAddTicket() {

        const { data, form_data } = this.state
        console.warn(form_data);

        if (form_data.length < 1) {
            Alert.alert('Validation failed', "Fields can not be empty", [{ text: 'Okay' }])
            return
        }

        for (let i = 0; i < form_data.length; i++) {
            if (form_data[i].Title == null || form_data[i].Title == '') {
                Alert.alert('Validation failed', "Quantity field can not be empty", [{ text: 'Okay' }])
                return
            }
            if (form_data[i].Quantity == null || form_data[i].Quantity == '') {
                Alert.alert('Validation failed', "Quantity field can not be empty", [{ text: 'Okay' }])
                return
            }
            if (form_data[i].StartDate == null || form_data[i].StartDate == '') {
                Alert.alert('Validation failed', "Please modify the start date", [{ text: 'Okay' }])
                return
            }
            if (form_data[i].EndDate == null || form_data[i].EndDate == '') {
                Alert.alert('Validation failed', "Please modify the end date", [{ text: 'Okay' }])
                return
            }
            if (form_data[i].Status == null || form_data[i].Status == '') {
                Alert.alert('Validation failed', "Visibility field can not be empty", [{ text: 'Okay' }])
                return
            }
            if (form_data[i].MinAllowed == null || form_data[i].MinAllowed == '') {
                Alert.alert('Validation failed', "MinAllowed field can not be empty", [{ text: 'Okay' }])
                return
            }
            if (form_data[i].MaxAllowed == null || form_data[i].MaxAllowed == '') {
                Alert.alert('Validation failed', "MaxAllowed field can not be empty", [{ text: 'Okay' }])
                return
            }

        }


        this.setState({ loading: true })
        AsyncStorage.removeItem('currentT');

        fetch(URL.url + 'events/add-tickets', {
            method: 'POST', headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': 'Bearer ' + data.token,
            }, body: JSON.stringify({
                Type: "Free",
                ticketList: form_data,

            }),
        })
            .then(res => res.json())
            .then(res => {
                console.warn(res);
                if (res.status) {
                    AsyncStorage.setItem('currentT', JSON.stringify(res.data));
                    Toast.show({
                        text: 'Ticket created sucessfully !',
                        position: 'bottom',
                        type: 'success',
                        buttonText: 'Dismiss',
                        duration: 2500
                    });
                    setTimeout(() => {
                        this.setState({ loading: false })
                        this.props.navigation.goBack()
                    }, 2000);

                } else {
                    Alert.alert('Action failed', res.message, [{ text: 'Okay' }])
                    this.setState({ loading: false })
                }
            }).catch((error) => {
                console.warn(error);
                alert(error.message);
            });
    }



    onChangeText(text, i, name, ) {
        var instant_array = []
        instant_array = this.state.form_data

        if (instant_array[i] == null) {
            obj = {};

            obj.Cost = 0

            if (name == 'name') {
                obj.Title = text
            }

            if (name == 'qty') {
                obj.Quantity = text
            }


            if (name == 'visibility') {
                obj.Status = text
            }

            if (name == 'startdate') {
                obj.StartDate = text
            }

            if (name == 'enddate') {
                obj.EndDate = text
            }
            if (name == 'min') {
                obj.MinAllowed = text
            }
            if (name == 'max') {
                obj.MaxAllowed = text
            }


            instant_array[i] = obj

        } else {
            obj = instant_array[i];

            if (name == 'name') {
                obj.Title = text
            }

            if (name == 'qty') {
                obj.Quantity = text
            }


            if (name == 'visibility') {
                obj.Status = text
            }

            if (name == 'startdate') {
                obj.StartDate = text
            }

            if (name == 'enddate') {
                obj.EndDate = text
            }
            if (name == 'min') {
                obj.MinAllowed = text
            }
            if (name == 'max') {
                obj.MaxAllowed = text
            }
            instant_array[i] = obj
        }

        this.setState({ form_data: instant_array })

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

    render() {


        var left = (
            <Left style={{ flex: 1 }}>
                <Button transparent onPress={() => this.goBack()}>
                    <Icon
                        active
                        name="ios-arrow-back"
                        type='ionicon'
                        color='#FFF'
                    />
                </Button>
            </Left>
        );

        if (this.state.loading) {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000000' }}>
                    <View style={styles.welcome}>
                        <Text style={{ fontSize: 15, color: '#fff' }}>Adding ticket</Text>
                        <BarIndicator count={4} color={color.primary_color} />
                        <Text style={{ fontSize: 13, flex: 1, color: '#fff' }}>Please wait...</Text>
                    </View>
                </View>
            );
        }

        return (
            <Container style={{ backgroundColor: '#101023' }}>
                <Navbar left={left} title='Free Ticket' bg='#101023' />
                <Content>
                    <View style={styles.container}>



                        {this.renderUpcomming()}

                        <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                            <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 10, marginBottom: 10, }}>
                                <TouchableOpacity onPress={() => this.incrememntTicketCount()} style={styles.enablebutton} block iconLeft>
                                    <Text style={{ color: color.secondary_color, marginTop: 10, marginBottom: 10, fontSize: 14, fontWeight: '200', fontFamily: 'NunitoSans', }}>Add</Text>
                                </TouchableOpacity>
                            </View>

                        </View>

                        <TouchableOpacity style={styles.fab} onPress={() => this.processAddTicket()}>
                            <Icon
                                active
                                name="check"
                                type='feather'
                                color='green'
                                size={25}
                            />
                        </TouchableOpacity>

                        <View style={{ height: 4 }} >

                        </View>

                    </View>


                </Content>
            </Container>
        );
    }

    renderUpcomming() {
        const ticketVisibility = {
            label: 'Select visibility',
            value: null,
            color: '#000',
        };

        let items = [];
        for (let i = 0; i < this.state.ticket_count_array.length; i++) {
            var lol = i;
            items.push(
                <View>

                    <View style={{ flexDirection: 'row', margin: 30, marginTop: 15 }}>
                        <Text style={{ color: '#fff', fontSize: 14, fontFamily: 'NunitoSans-Bold', flex: 1 }}>TICKET  {i + 1}</Text>
                        <TouchableOpacity style={{ backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', paddingLeft: 6, paddingRight: 6, }} onPress={() => this.delete(i)} ><Icon
                            active
                            name="ios-close"
                            type='ionicon'
                            color='red'

                        /></TouchableOpacity>
                    </View>
                    <View style={styles.oneRow}>

                        <View style={{ marginLeft: 30, flex: 1 }}>
                            <View>
                                <Text style={styles.hintText}>Ticket name </Text>
                            </View>
                            <View style={styles.itemTwo}>
                                <TextInput
                                    placeholder="Enter what you'd like to call your ticket "
                                    placeholderTextColor='#6d706e'
                                    returnKeyType="next"
                                    keyboardType='default'
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    style={styles.menu}
                                    onChangeText={text => this.onChangeText(text, lol, 'name')}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={styles.oneRow}>

                        <View style={{ marginLeft: 30, flex: 1 }}>
                            <View>
                                <Text style={styles.hintText}>Quantity </Text>
                            </View>
                            <View style={styles.itemTwo}>
                                <TextInput
                                    placeholder="Number of tickets for your event"
                                    placeholderTextColor='#6d706e'
                                    returnKeyType="next"
                                    keyboardType='numeric'
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    style={styles.menu}
                                    onChangeText={text => this.onChangeText(text, lol, 'qty')}
                                />
                            </View>
                        </View>
                    </View>

                    <View style={[styles.oneRow, { marginTop: 20 }]}>
                        <View style={{ flex: 1 }}>
                            <View>
                                <Text style={[styles.hintText, { marginLeft: 30, }]}>Event Starts </Text>
                            </View>
                            <View style={styles.itemTwo}>

                            <TouchableOpacity onPress={() => this.setState({ show_from_picker: true })}>
                                    <Text style={styles.date_text}>{Moment(this.state.form_data.length > 0 + i ? this.state.form_data[i].StartDate : this.state.enddate).format('YYYY-MM-DD HH:mm')} </Text>
                                </TouchableOpacity>

                                <DateTimePickerModal
                                    isVisible={this.state.show_from_picker}
                                    mode="datetime"
                                    onConfirm={(date) => { [this.setState({ show_from_picker: false, }), this.onChangeText(date, lol, 'startdate')] }}
                                    onCancel={() => this.setState({ show_to_picker: false })}
                                />


                            </View>
                        </View>
                    </View>


                    <View style={styles.oneRow}>

                        <View style={{ flex: 1 }}>
                            <View>
                                <Text style={[styles.hintText, { marginLeft: 30, }]}>Event End </Text>
                            </View>
                            <View style={styles.itemTwo}>
                            <TouchableOpacity onPress={() => this.setState({ show_to_picker: true })}>
                                    <Text style={styles.date_text}>{Moment(this.state.form_data.length > 0 + i ? this.state.form_data[i].EndDate : this.state.enddate).format('YYYY-MM-DD HH:mm')} </Text>
                                </TouchableOpacity>

                                <DateTimePickerModal
                                    isVisible={this.state.show_to_picker}
                                    mode="datetime"
                                    onConfirm={(date) => { [this.setState({ show_to_picker: false, }), this.onChangeText(date, lol, 'enddate')] }}
                                    onCancel={() => this.setState({ show_to_picker: false })}
                                />
                            </View>
                        </View>
                    </View>

                    <View style={styles.oneRow}>

                        <View style={{ marginLeft: 30, flex: 1 }}>
                            <View>
                                <Text style={styles.hintText}>Ticket Visibility  </Text>
                            </View>
                            <View style={styles.itemTwo}>
                                <RNPickerSelect
                                    placeholder={ticketVisibility}
                                    placeholderTextColor='#fff'
                                    items={sports}

                                    onValueChange={value => {
                                        this.onChangeText(value, i, 'visibility')
                                    }}
                                    style={pickerSelectStyles}

                                    value={this.state.visibility}
                                    useNativeAndroidPickerStyle={false}

                                />
                            </View>
                        </View>
                    </View>


                    <View style={styles.oneRow}>

                        <View style={{ marginLeft: 30, flex: 1 }}>
                            <View>
                                <Text style={styles.hintText}>Ticket allowed per order  </Text>
                            </View>

                            <View style={{ flexDirection: 'row', marginTop: 10 }}>


                                <View style={{ flex: 1 }}>
                                    <View>
                                        <Text style={[styles.hintText, { color: '#F7A400' }]}>Minimum </Text>
                                    </View>
                                    <View style={styles.item}>
                                        <TextInput
                                            placeholder="1"
                                            placeholderTextColor='#6d706e'
                                            returnKeyType="next"
                                            keyboardType='numeric'
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            style={styles.menu}
                                            onChangeText={text => this.onChangeText(text, lol, 'min')}
                                        />
                                    </View>
                                </View>

                                <View style={{ flex: 1 }}>
                                    <View>
                                        <Text style={[styles.hintText, { color: '#F7A400' }]}>Maximum </Text>
                                    </View>
                                    <View style={styles.item}>
                                        <TextInput
                                            placeholder="15"
                                            placeholderTextColor='#6d706e'
                                            returnKeyType="next"
                                            keyboardType='numeric'
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            style={styles.menu}
                                            onChangeText={text => this.onChangeText(text, lol, 'max')}
                                        />
                                    </View>
                                </View>

                            </View>

                        </View>
                    </View>

                </View>)
        }
        return items;
    }
}

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,

    },
    oneRow: {
        marginBottom: 10,
        width: Dimensions.get('window').width,
    },
    hintText: {
        fontSize: 13.5,
        color: '#ffffff',
        opacity: 0.6
    },
    importText: {
        fontSize: 13,
        color: '#8d96a6',
    },
    item: {
        flexDirection: 'row',
        borderColor: '#8d96a6',
        borderBottomWidth: 0.6,
        alignItems: 'center',
        marginRight: 30,

    },
    menu: {
        flex: 1,
        fontSize: 16,
        color: '#ffffff',
        textAlign: 'left',
        fontFamily: 'NunitoSans-Bold',
    },
    itemTwo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 30,

    },
    fab: {
        height: 60,
        width: 60,
        borderRadius: 200,
        position: 'absolute',
        bottom: 10,
        right: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    welcome: {
        height: 90,
        alignItems: 'center',
        justifyContent: 'center',
    },
    enablebutton: {
        backgroundColor: color.primary_color,
        alignItems: 'center',
        alignContent: 'space-around',
        paddingLeft: 53,
        paddingRight: 53,
        borderRadius: 5,
    },
    date_text: {
        color: '#fff',
        fontSize: 20,
        marginLeft: 40
    }
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
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