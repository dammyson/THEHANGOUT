import React, { Component } from "react";
import { Alert, Dimensions, TouchableOpacity, StatusBar, StyleSheet, AsyncStorage } from "react-native";
import { Container, Content, View, Text, Button, Left, Right, Body, Title, List, ListItem, } from 'native-base';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Card, Icon, SocialIcon } from 'react-native-elements'
import RNPickerSelect from 'react-native-picker-select';
import { Actions } from 'react-native-router-flux';
const URL = require("../../component/server");
import color from '../../component/color';
const { width: screenWidth } = Dimensions.get('window')
import Navbar from '../../component/Navbar';
import {
    BarIndicator,
} from 'react-native-indicators';

import Moment from 'moment';


const sports = [
    {
        label: '2 ',
        value: '2',
        color: '#000',
    },
    {
        label: '3 ',
        value: '3',
        color: '#000',
    },
    {
        label: '4 ',
        value: '4',
        color: '#000',
    },
    {
        label: '5 ',
        value: '5',
        color: '#000',
    },
    {
        label: '5 ',
        value: '5',
        color: '#000',
    },
    {
        label: '6 ',
        value: '6',
        color: '#000',
    },

];

export default class ReserveTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            titleText: '',
            data: '',
            count: 140,
            startdate: new Date(),
            loading: false,
            done: false,
            resturant: {},
            adults: '1',
            show_from_picker: false,
        };
    }



    componentDidMount() {
        this.setState({ resturant: this.props.resturant });
        console.warn(this.props.resturant)
        AsyncStorage.getItem('data').then((value) => {
            if (value == '') { } else {
                this.setState({ data: JSON.parse(value) })
                this.setState({ user: JSON.parse(value).user })
            }
        })

    }


    countChange(text) {
        this.setState({ count: 140 - text.length })

    }



    processReserveTable() {
        Moment.locale('en');
        const { data, resturant, adults, startdate } = this.state
        console.warn(adults)

        this.setState({ loading: true })
        fetch(URL.url + 'restaurants/reserve-table', {
            method: 'POST', headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': 'Bearer ' + data.token,
            }, body: JSON.stringify({
                Date: Moment(startdate).format("YYYY-MM-DD HH:mm"),
                Spaces: adults,
                RestaurantId: resturant.id,

            }),
        })
            .then(res => res.json())
            .then(res => {
                console.warn("kaikkk", res);
                if (res.status) {
                    this.setState({ loading: false, done: true })
                    // Actions.restaurants({ type: 'replace' });
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


    render() {
        const { resturant, } = this.state

        Moment.locale('en');

        const ticketVisibility = {
            label: '1 ',
            value: 1,
            color: '#000',
        };

        var left = (
            <Left style={{ flex: 1 }}>
                <Button transparent onPress={() => Actions.pop()}>
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
                        <Text style={{ fontSize: 12, color: '#fff' }}>reserving table </Text>
                        <BarIndicator count={4} color={color.primary_color} />
                        <Text style={{ fontSize: 10, flex: 1, color: '#fff', opacity: 0.6 }}>Please wait...</Text>
                    </View>
                </View>
            );
        }


        if (this.state.done) {
            return (
                <Container style={{ backgroundColor: '#000' }}>
                    <StatusBar barStyle="dark-content" hidden={false} backgroundColor="transparent" translucent={true} />

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
                                    <Text style={{ textAlign: 'center', color: '#fff', fontSize: 12, fontWeight: '200', fontFamily: 'NunitoSans', opacity: 0.8 }}>Your Table has been successfully reserved.</Text>
                                </View>

                                <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20, marginBottom: 20, }}>
                                    <TouchableOpacity onPress={() => Actions.table({ type: 'replace' })} style={styles.enablebutton} block iconLeft>
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
                <Navbar left={left} title="" bg='#101023' />
                <Content>
                    <View style={styles.container}>
                        <View >

                            <Text style={styles.titleText}>RESERVE A TABLE</Text>
                        </View>

                        <View style={styles.main_content}>
                            <Text style={styles.title}>{resturant.name}</Text>
                            <Text style={styles.date}>Open {Moment(new Date('2019/02/28 ' + resturant.openingTime)).format('LT')} - {Moment(new Date('2019/02/28 ' + resturant.closingTime)).format('LT')}</Text>

                            <View style={{ flexDirection: 'row', marginTop: 20, marginBottom: 10 }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.date, {}]}>Number of Adults</Text>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row', borderColor: '#fff', alignItems: 'center', borderWidth: 1, paddingLeft: 10, marginRight: 20 }}>
                                    <RNPickerSelect
                                        placeholder={ticketVisibility}
                                        placeholderTextColor='#fff'
                                        items={sports}
                                        onValueChange={value => {
                                            this.setState({
                                                adults: value,
                                            });
                                        }}
                                        style={pickerSelectStyles}

                                        value={this.state.visibility}
                                        useNativeAndroidPickerStyle={false}

                                    />

                                </View>

                            </View>
                            <View style={{ flexDirection: 'row', paddingLeft: 10, marginTop: 20, marginBottom: 10 }}>
                                <Icon
                                    active
                                    name="calendar"
                                    type='entypo'
                                    color='#FFF'
                                />

                                <View style={{ flex: 1, borderBottomWidth: 0.5, borderBottomColor: '#fff', paddingBottom: 2, marginLeft: 5, marginRight: 20, marginBottom: 20 }}>
                                    <Text style={[styles.label, {}]}>When</Text>

                                    <TouchableOpacity onPress={() => this.setState({ show_from_picker: true })}>
                                        <Text style={styles.date_text}>{Moment(this.state.startdate).format('llll')} </Text>
                                    </TouchableOpacity>

                                    <DateTimePickerModal
                                        isVisible={this.state.show_from_picker}
                                        mode="datetime"
                                        onConfirm={(date) => this.setState({ show_from_picker: false, startdate: date })}
                                        onCancel={() => this.setState({ show_from_picker: false })}
                                    />
                                </View>
                            </View>



                        </View>


                        <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>

                            <TouchableOpacity onPress={() => this.processReserveTable()} style={{ height: 45, flexDirection: 'row', paddingRight: 30, paddingLeft: 30, marginTop: 20, marginBottom: 20, margin: 10, alignItems: 'center', justifyContent: 'center', borderRadius: 5, backgroundColor: 'red' }}>
                                <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>RESERVE NOW</Text>
                            </TouchableOpacity>
                        </View>




                    </View>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height - 80,
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
    date_text:{
      color: '#fff',
      fontSize: 18,
      marginLeft:20
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