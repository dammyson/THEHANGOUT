import React, { Component } from "react";
import { Alert, Dimensions, TouchableOpacity, StatusBar, StyleSheet, AsyncStorage } from "react-native";
import { Container, Content, View, Text, Button, Left, CheckBox, } from 'native-base';
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

import Moment from 'moment';
import { getUser, getData } from '../../component/utilities';

const sports = [
    {
        label: 'Table for 2      ',
        value: '2',
        color: '#000',
    },
    {
        label: 'Table for 4      ',
        value: '4',
        color: '#000',
    },
    {
        label: 'Table for 6     ',
        value: '6',
        color: '#000',
    }, {
        label: 'Table for 8      ',
        value: '8',
        color: '#000',
    },
    {
        label: 'Table for 8 and above  ',
        value: '10',
        color: '#000',
    },
   

];

export default class ReserveSpot extends Component {
    constructor(props) {
        super(props);
        this.state = {
            titleText: '',
            data: '',
            count: 140,
            startdate: new Date(),
            loading: false,
            done: false,
            club: {},
            Spots: '1',
            show_from_picker: false,
            type: 'Regular'
        };
    }



    async componentDidMount() {
        const { club } = this.props.route.params;
        this.setState({ club: club });

        this.setState({
            data: JSON.parse(await getData()),
            user: JSON.parse(await getUser()),
        })

    }


    countChange(text) {
        this.setState({ count: 140 - text.length })

    }

    segmentClicked = (index) => {
        this.setState({
            type: index
        })
    }

    processReserveTable() {
        Moment.locale('en');
        const { data, club, Spots, startdate, type } = this.state
        console.warn(Spots)

        this.setState({ loading: true })
        fetch(URL.url + 'clubs/reserve-table', {
            method: 'POST', headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': 'Bearer ' + data.token,
            }, body: JSON.stringify({
                Date: Moment(club.date).format("YYYY-MM-DD HH:mm"),
                Spaces: Spots,
                ClubId: club.id,
                Type: club.type,
                TableType: type

            }),
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


    render() {
        const { club, } = this.state

        Moment.locale('en');

        const ticketVisibility = {
            label: 'Table for 1       ',
            value: 1,
            color: '#000',
        };

        var left = (
            <Left style={{ flex: 1 }}>
                <Button  style={{ height: 40, width:40, justifyContent:'center' }} transparent onPress={() => this.props.navigation.goBack()}>
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
                                    <TouchableOpacity style={{ backgroundColor: color.club_color, height: 74, width: 74, borderRadius: 37, justifyContent: 'center', alignItems: 'center', }}>
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
                                    <TouchableOpacity onPress={() => this.props.navigation.replace('spotsC')} style={styles.enablebutton} block iconLeft>
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
                        <View>
                            <Text style={styles.titleText}>RESERVE A TABLE</Text>
                        </View>

                        <View style={styles.main_content}>
                            <Text style={styles.title}>{club.name}</Text>
                            <Text style={styles.date}>{Moment(club.date).format('llll')}</Text>

                            <View style={{ flexDirection: 'row', marginTop: 20, marginBottom: 10 }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.date, {}]}>Number of Tables</Text>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row', borderColor: '#fff', alignItems: 'center', borderWidth: 1, paddingLeft: 10, marginRight: 20 }}>
                                    <RNPickerSelect
                                        placeholder={ticketVisibility}
                                        placeholderTextColor='#fff'
                                        items={sports}
                                        onValueChange={value => {
                                            this.setState({
                                                Spots: value,
                                            });
                                        }}
                                        style={pickerSelectStyles}

                                        value={this.state.visibility}
                                        useNativeAndroidPickerStyle={false}

                                    />

                                </View>

                            </View>
                            <View style={{ paddingLeft: 10, marginTop: 20, marginBottom: 10 }}>
                                <Text style={[styles.label, { fontSize: 15 }]}>When</Text>
                            </View>



                            <View style={{ flexDirection: 'row', paddingLeft: 10, marginTop: 20, marginBottom: 10, }}>

                                <TouchableOpacity onPress={() => this.segmentClicked('Vip')} style={{ height: 25, width: 25, justifyContent: 'center', alignItems: 'center', borderRadius: 40, borderColor: '#fff', borderWidth: 2 }}>
                                    {
                                        this.state.type == 'Vip' ?
                                            <View style={{ height: 15, width: 15, borderRadius: 40, backgroundColor: '#fff', }} />
                                            : null
                                    }
                                </TouchableOpacity>
                                <Text style={{ color: '#fff', fontSize: 15, marginLeft: 15, marginRight: 35, fontFamily: 'NunitoSans-Bold' }}>VIP</Text>

                                <TouchableOpacity onPress={() => this.segmentClicked('Regular')} style={{ height: 25, width: 25, justifyContent: 'center', alignItems: 'center', borderRadius: 40, borderColor: '#fff', borderWidth: 2 }}>
                                    {
                                        this.state.type == 'Regular' ?
                                            <View style={{ height: 15, width: 15, borderRadius: 40, backgroundColor: '#fff', }} />
                                            : null
                                    }
                                </TouchableOpacity>
                                <Text style={{ color: '#fff', fontSize: 15, marginLeft: 15, fontFamily: 'NunitoSans-Bold' }}>REGULAR</Text>
                            </View>



                        </View>


                        <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>

                            <TouchableOpacity onPress={() => this.processReserveTable()} style={{ height: 45, flexDirection: 'row', paddingRight: 30, paddingLeft: 30, marginTop: 20, marginBottom: 20, margin: 10, alignItems: 'center', justifyContent: 'center', borderRadius: 5, backgroundColor: color.club_color }}>
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
        backgroundColor: '#101023',
        paddingBottom: 30

    },
    date: {
        marginTop: 10,
        marginBottom: 10,
        marginRight: 13,
        marginLeft: 13,
        fontSize: 13,
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
        fontSize: 13,
        color: '#ffffff50',
        textAlign: 'left',
        fontFamily: 'NunitoSans-Bold'
    },
    welcome: {
        height: 90,
        alignItems: 'center',
        justifyContent: 'center',
    },
    enablebutton: {
        backgroundColor: color.club_color,
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