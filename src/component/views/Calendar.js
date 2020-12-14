import React, { Component } from "react";
import { Alert, Dimensions, TouchableOpacity, TextInput, StyleSheet, AsyncStorage, StatusBar, ScrollView, } from "react-native";
import { Container, Content, View, Text, Button, Left, Right, Body, Title, List, ListItem, } from 'native-base';
import { Avatar, Icon, } from 'react-native-elements';
const deviceHeight = Dimensions.get("window").height;
const URL = require("../../component/server");

import color from '../../component/color';
const { width: screenWidth } = Dimensions.get('window')
import CalendarPicker from 'react-native-calendar-picker';
import Moment from 'moment';
Moment.locale('en');

import Navbar from '../../component/Navbar';
import colors from "../../component/color";


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

export default class Calendar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedStartDate: null,
            selectedEndDate: null,
            preMont: Moment(Moment(new Date).subtract(1, 'months').calendar()).format('MMM'),
            nextMont: Moment(Moment(new Date).add(1, 'months').calendar()).format('MMM')
        };
        this.onDateChange = this.onDateChange.bind(this);
        this.onMonthChange = this.onMonthChange.bind(this);
    }


    onDateChange(date, type) {
        if (type === 'END_DATE') {
            this.setState({
                selectedEndDate: date,
            });
        } else {
            this.setState({
                selectedStartDate: date,
                selectedEndDate: null,
            });
        }
    }


    onMonthChange(data) {
        let pre = Moment(Moment(data).subtract(1, 'months').calendar()).format('MMM')
        let nextMont = Moment(Moment(data).add(1, 'months').calendar()).format('MMM')

        this.setState({
            preMont: pre,
            nextMont: nextMont,
        })
    }


    async componentWillMount() {
    }

    handleButtonClick() {
        const { onComplete } = this.props;
        const { selectedStartDate, selectedEndDate } = this.state
        if (selectedStartDate == null || selectedStartDate == null) {
            Alert.alert('Error', "Kindly select a start data and end date", [{ text: 'Okay' }])
            return
        }
        var data = {
            start: selectedStartDate,
            end: selectedEndDate
        }
        onComplete(data)
    }

    render() {

        return (
            <>
                {this.Body()}
            </>
        );
    }

    Body() {
        const { onClose } = this.props;
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
        const minDate = new Date(); // Today
        const maxDate = new Date(2030, 6, 3);



        return (
            <>
                <Container style={styles.container}>
                    <StatusBar backgroundColor='#101023' barStyle="light-content" />
                    <Navbar left={left} title='Sort Calendar' bg='#111124' />
                    <Content>
                        <View style={styles.body}>
                            <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginVertical: 20 }}>
                                <View style={{ flex: 1 }} />
                                <TouchableOpacity onPress={() => onClose()} style={{ marginHorizontal: 10, padding: 6, marginRight: 30 }} block iconLeft>
                                    <Icon
                                        active
                                        name="ios-close"
                                        type='ionicon'
                                        size={30}
                                        color='#FFF'
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={{ marginTop: 30 }}>
                                <CalendarPicker
                                    startFromMonday={false}
                                    allowRangeSelection={true}
                                    minDate={minDate}
                                    maxDate={maxDate}
                                    previousTitle={this.state.preMont}
                                    nextTitle={this.state.nextMont}
                                    todayBackgroundColor={colors.primary_color}
                                    selectedDayColor={colors.primary_color}
                                    selectedDayTextColor="#FFFFFF"
                                    onDateChange={this.onDateChange}
                                    onMonthChange={this.onMonthChange}
                                    textStyle={{
                                        fontFamily: 'Cochin',
                                        color: '#fff',
                                    }}
                                />

                            </View>
                            <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                                <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 10, marginBottom: 10, }}>
                                    <TouchableOpacity onPress={() => this.handleButtonClick()} style={styles.enablebutton} block iconLeft>
                                        <Text style={{ color: color.secondary_color, marginTop: 10, marginBottom: 10, fontSize: 14, fontWeight: '200', fontFamily: 'NunitoSans', }}>Done </Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </View>
                    </Content>
                </Container>
            </>);
    }


}

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        position: "absolute",
        flex: 1,
        backgroundColor: 'transparent',
        backgroundColor: '#00000098'

    },
    body: {
        flex: 1,
        height: Dimensions.get('window').height,
        backgroundColor: '#00000098'

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
    enablebutton: {
        backgroundColor: color.primary_color,
        alignItems: 'center',
        alignContent: 'space-around',
        paddingLeft: 53,
        paddingRight: 53,
        borderRadius: 5,
    },

});
