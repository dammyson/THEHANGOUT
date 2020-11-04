import React, { Component } from "react";
import { Alert, Dimensions, TouchableOpacity, TextInput, StyleSheet, AsyncStorage, StatusBar, NativeModules, SafeAreaView, ScrollView } from "react-native";
import { Container, Content, View, Text, Button, Left, Toast, Right, Body, Title, List, ListItem, } from 'native-base';
import { Avatar, Icon, } from 'react-native-elements';

const URL = require("../../component/server");
import color from '../../component/color';
const { width: screenWidth } = Dimensions.get('window')
import RNPickerSelect from 'react-native-picker-select';
import Navbar from '../../component/Navbar';
import ActivityIndicator from "./ActivityIndicator";


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
export default class PaidTicket extends Component {

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

    processAddTicket() {
        const { onComplete } = this.props;
        const { data, form_data } = this.state


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
            if (form_data[i].Cost == null || form_data[i].Cost == '') {
                Alert.alert('Validation failed', "Price field can not be empty", [{ text: 'Okay' }])
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


        console.warn(form_data);


        this.setState({ loading: true })
        console.warn(URL.url + 'events/add-tickets')
        fetch(URL.url + 'events/add-tickets', {
            method: 'POST', headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': 'Bearer ' + data.token,
            }, body: JSON.stringify({
                Type: "Paid",
                ticketList: form_data,

            }),
        })
            .then(res => res.json())
            .then(res => {
                if (res.status) {
                    Toast.show({
                        text: 'Ticket created sucessfully !',
                        position: 'bottom',
                        type: 'success',
                        buttonText: 'Dismiss',
                        duration: 2500
                    });
                    setTimeout(() => {
                        this.setState({ loading: false })
                        onComplete(res.data)
                    }, 1000);

                } else {
                    Alert.alert('Action failed', res.message, [{ text: 'Okay' }])
                    this.setState({ loading: false })
                }
            }).catch((error) => {
                console.warn(error);
                alert(error.message);
            });

    }



    onChangeText(text, i, name,) {
        var obj = {};
        var instant_array = []
        instant_array = this.state.form_data

        if (instant_array[i] == null) {
            // obj = {};

            if (name == 'name') {
                obj.Title = text
            }

            if (name == 'qty') {
                obj.Quantity = text
            }
            if (name == 'bprice') {
                obj.Cost = text
            }

            if (name == 'visibility') {
                obj.Status = text
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
            if (name == 'bprice') {
                obj.Cost = text
            }

            if (name == 'visibility') {
                obj.Status = text
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
        const { onPress, onClose } = this.props;

        var left = (
            <Left style={{ flex: 1 }}>
                <Button transparent onPress={() => onClose()}>
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
                <ActivityIndicator message={'Adding tickects'} color={color.primary_color} />
            );
        }

        return (
            <Container style={{ height: Dimensions.get('window').height, backgroundColor: '#101023', position: "absolute", top:10 }}>
                <StatusBar barStyle="dark-content" hidden={false} backgroundColor="transparent" translucent={true} />
                <Navbar left={left} title='Paid Ticket' bg='#101023' />
                <Content>
                    <ScrollView>
                    <>
                    {this.renderUpcomming()}
                    <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 10, marginBottom: 10, }}>
                        <TouchableOpacity onPress={() => this.incrememntTicketCount()} style={styles.enablebutton} block iconLeft>
                            <Text style={{ color: color.secondary_color, marginTop: 10, marginBottom: 10, fontSize: 14, fontWeight: '200', fontFamily: 'NunitoSans', }}>Add</Text>
                        </TouchableOpacity>
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

                    <View style={{ height: 400 }} >

                    </View>
                    </>
                    </ScrollView>

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
                        <Text style={{ color: '#fff', fontSize: 14, fontFamily: 'NunitoSans-Bold', flex: 1 }}>TICKET {i + 1}</Text>
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


                    <View style={styles.oneRow}>

                        <View style={{ marginLeft: 30, flex: 1 }}>

                            <View style={{ flexDirection: 'row', marginTop: 10 }}>


                                <View style={{ flex: 1 }}>
                                    <View>
                                        <Text style={[styles.hintText]}>Price </Text>
                                    </View>
                                    <View style={styles.item}>
                                        <TextInput
                                            placeholder="N5,000"
                                            placeholderTextColor='#6d706e'
                                            returnKeyType="next"
                                            keyboardType='numeric'
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            style={styles.menu}
                                            onChangeText={text => this.onChangeText(text, lol, 'price')}
                                        />
                                    </View>
                                </View>

                                <View style={{ flex: 1 }}>
                                    <View>
                                        <Text style={[styles.hintText]}>Your buyers pay </Text>
                                    </View>
                                    <View style={styles.item}>
                                        <TextInput
                                            placeholder="N5,000"
                                            placeholderTextColor='#6d706e'
                                            returnKeyType="next"
                                            keyboardType='numeric'
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            style={styles.menu}
                                            onChangeText={text => this.onChangeText(text, lol, 'bprice')}
                                        />
                                    </View>
                                    <Text style={[styles.hintText, { color: '#F7A400', marginTop: 12 }]}>View fee Breakdown </Text>
                                </View>

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
                                        this.onChangeText(value, lol, 'visibility')
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

PaidTicket;

const styles = StyleSheet.create({
    main_container: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
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
        fontFamily: 'NunitoSans-Light',
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
        bottom: 370,
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

