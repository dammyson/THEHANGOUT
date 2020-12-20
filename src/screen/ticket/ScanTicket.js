import React, { Component } from "react";
import { Alert, Dimensions, TouchableOpacity, TextInput, StyleSheet, AsyncStorage, StatusBar, ScrollView, } from "react-native";
import { Container, Content, View, Text, Button, Left, Right, Body, Title, List, ListItem, } from 'native-base';
import { Avatar, Icon, } from 'react-native-elements';
const deviceHeight = Dimensions.get("window").height;
const URL = require("../../component/server");
import { getBalance, getData } from '../../component/utilities';
import QRCode from 'react-native-qrcode-svg';
import color from '../../component/color';
import Moment from 'moment';
import Navbar from '../../component/Navbar';
import Balance from "../../component/views/Balance";
import Scan from "../../component/views/Scan";
import ActivityIndicator from "../../component/views/ActivityIndicator";

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

export default class ScanTicket extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: '',
            name: '',
            id: '',
            activeIndex: 0,
            more: false,
            scan_qr: false,
            show_generated: false,
            cost: 1000,
            details:{}



        };
    }



    async componentDidMount() {
        this.setState({
            data: JSON.parse(await getData())
        })

    }


    currencyFormat(n) {
        return n.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

    }


    processGetEventTickets(result) {
        const { data, } = this.state
        this.setState({ loading: true })

        console.warn(URL.url + 'tickets/verify/'+result)

        fetch(URL.url + 'tickets/verify/'+result, {
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
                        details: res.data,
                        show_generated: true
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

    render() {
     
        var left = (
            <Left style={{ flex: 1 }}>
                <Button transparent onPress={() => this.props.navigation.goBack()}>
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
              <ActivityIndicator message={'Verify tickets'} color={color.primary_color} /> 
            );
        }

        return (
            <Container style={{ backgroundColor: '#000' }}>
                <Navbar left={left} right={right} title='Scan Qrcode' bg='#111124' />
                <Content>
                    <View style={styles.container}>
                        <View style={{ flex: 1, }}>
                            <View>
                                <Text style={{ color: '#fff', fontFamily: 'NunitoSans-Bold', fontSize: 16, marginTop: 20, marginLeft: 20, marginRight: 30, }}> SCAN TICKET FOR VERIFICATION </Text>
                                <Text style={{ color: '#fff', fontFamily: 'NunitoSans-Bold', fontSize: 12, margin: 20, marginLeft: 30, marginRight: 30, opacity: 0.7 }}>  </Text>

                            </View>

                            {
                                this.state.show_generated == 0 ?
                                    <ScrollView style={{ flex: 1, }}>

                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>


                                            <View style={{ backgroundColor: '#fff', marginTop: 24, justifyContent: 'center', alignItems: 'center', paddingBottom: 30, paddingTop: 30 }}>
                                                <Icon
                                                    active
                                                    name="camera"
                                                    type='simple-line-icon'
                                                    color='#000'
                                                    size={40}
                                                />
                                                <Text style={{ color: '#1E1E1E', fontSize: 12, margin: 20, marginLeft: 30, marginRight: 30, fontWeight: '400', opacity: 0.7 }}> Please scan qrcode for verification </Text>

                                                <Icon
                                                    active
                                                    name="qrcode-scan"
                                                    type='material-community'
                                                    color='#000'
                                                    size={140}
                                                />
                                            </View>

                                            <TouchableOpacity style={{ flexDirection: 'row', backgroundColor: color.primary_color, alignItems: 'center', alignContent: 'space-around', paddingLeft: 19, paddingRight: 19, borderRadius: 5, marginTop: 20 }} block iconLeft>
                                                <Icon
                                                    active
                                                    name="camera"
                                                    type='simple-line-icon'
                                                    color='#000'
                                                    size={20}
                                                />
                                                <Text onPress={() => this.setState({ scan_qr: true })} style={{ color: "#010113", marginLeft: 5, marginTop: 15, marginBottom: 15, fontSize: 16, fontWeight: '500', fontFamily: 'NunitoSans', opacity: 0.77 }}>SCAN QRCODE</Text>
                                            </TouchableOpacity>

                                        </View>
                                    </ScrollView>
                                    :
                                    this.renderModal()
                            }
                        </View>
                    </View>

                </Content>

                {this.state.scan_qr ? this.renderScan() : null}
            </Container>
        );
    }


    renderScan() {
        return (
            <Scan
                onClose={() => this.setState({ scan_qr: false })}
                onScan={(data) => this.onScan(data)} />
        )
    }

    onScan(data) {
        console.warn(data);
        this.setState({ scan_qr: false, })
        this.processGetEventTickets(data);
    }

    renderModal() {
        const { details, } = this.state
        return (
            <View style={{ justifyContent: 'center', marginHorizontal: 10 }}>
                <View style={{ backgroundColor: "#FFF", marginTop: 1, marginLeft: 10, marginRight: 10, borderRadius: 5, padding: 5 }}>
                    <View style={{ alignItems: 'flex-end', flexDirection: 'row', marginRight: 10, marginVertical: 10 }}>
                        <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: 'NunitoSans-Bold', marginLeft: 10, color: '#1e1e1e', fontSize: 18, fontWeight: '400', }}>{details.eventTitle}</Text>
                        </View>
                        <TouchableOpacity style={{ height: 40, width: 40 }} onPress={() => this.setState({ show_generated: false })}>
                            <Icon
                                active
                                name="close"
                                type='antdesign'
                                color='red'
                                size={20}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ backgroundColor: "#FFF", marginTop: 1, marginLeft: 10, marginRight: 10, marginBottom: 15 }}>
                        <View style={{ backgroundColor: "#FFF", marginTop: 1,marginRight: 10, }}>
                        <Text style={{ fontFamily: 'NunitoSans-SemiBold', marginLeft: 2, color: '#1e1e1e', fontSize: 15, fontWeight: '400', }}>{details.name} | {Moment(details.startDate).format('Do MMM')} -  {Moment(details.endDate).format('Do MMM YYYY')} </Text>
                        <Text style={{ fontFamily: 'NunitoSans-SemiBold', marginLeft: 2, color: '#1e1e1e', fontSize: 15, fontWeight: '400', }}> Single Ticket </Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', backgroundColor: "#FFF", marginTop: 1, marginLeft: 10, marginRight: 10, }}>
                        <View style={{}}>
                            <View style={styles.Qrcontainer}>
                                <QRCode
                                    value={this.state.qrCodeData}
                                    size={120}
                                    color="#000"
                                    backgroundColor='#fff'
                                />
                            </View>

                        </View>
                        <View style={{ flex: 1, marginLeft: 20 }}>

                            <View style={{ flexDirection: 'row', }}>
                                <Text style={{ marginLeft: 2, color: '#1e1e1e', fontSize: 12, fontWeight: '400', opacity: 0.6, flex: 1 }}> Amount </Text>
                                <Text style={{ marginLeft: 2, color: '#000', fontSize: 12, fontWeight: '600', flex: 1 }}>₦{details.amount} </Text>
                            </View>

                            <View style={{ flexDirection: 'row', marginTop: 15 }}>
                                <Text style={{ marginLeft: 2, color: '#1e1e1e', fontSize: 12, fontWeight: '400', opacity: 0.6, flex: 1 }}> VAT (5%) </Text>
                                <Text style={{ marginLeft: 2, color: '#000', fontSize: 12, fontWeight: '600', flex: 1 }}>₦{this.currencyFormat(parseInt(details.amount.replace(",", "")) * 0.05)}  </Text>
                            </View>

                            <View style={styles.lineStyle} />
                            <View style={{ flexDirection: 'row', marginTop: 15 }}>
                                <Text style={{ marginLeft: 2, color: '#1e1e1e', fontSize: 12, fontWeight: '400', opacity: 0.6, flex: 1 }}> Invoice Total </Text>
                                <Text style={{ marginLeft: 2, color: '#000', fontSize: 12, fontWeight: '600', flex: 1 }}>₦{this.currencyFormat(parseInt(details.amount.replace(",", "")) + (parseInt(details.amount.replace(",", "")) * 0.05))} </Text>
                            </View>
                        </View>





                    </View>


                    <View style={{ flexDirection: 'row', marginBottom: 15, marginLeft: 20, marginRight: 20 }}>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <Text style={{ marginLeft: 2, color: '#1e1e1e', fontSize: 12, fontWeight: '400', opacity: 0.6, }}>{Moment(details.datePurchased).format('llll')} </Text>

                        </View>
                    </View>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity style={{ flexDirection: 'row', backgroundColor: color.primary_color, alignItems: 'center', alignContent: 'space-around', paddingLeft: 19, paddingRight: 19, borderRadius: 5, marginTop: 20 }} block iconLeft>
                        <Icon
                            active
                            name="camera"
                            type='simple-line-icon'
                            color='#000'
                            size={20}
                        />
                        <Text onPress={() => this.setState({ scan_qr: true })} style={{ color: "#010113", marginLeft: 5, marginTop: 15, marginBottom: 15, fontSize: 16, fontWeight: '500', fontFamily: 'NunitoSans', opacity: 0.77 }}>SCAN ANOTHER</Text>
                    </TouchableOpacity>
                </View>
            </View>

        );
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
    inputView: {
        backgroundColor: 'rgba(247,164,0,0.3)',
        marginTop: 15,
        marginBottom: 5,
        justifyContent: "flex-start",
        borderColor: '#F7A400',
        borderWidth: 1,
        borderRadius: 5,
    },
    inputTextView: {
        marginTop: 20,
        marginBottom: 5,
        justifyContent: "flex-start",
        borderColor: '#BBB',
        borderWidth: 0.8,
        borderRadius: 5,

        paddingLeft: 10,
    },
    modal: {
        width: Dimensions.get('window').width - 40,
        backgroundColor: "#fff",
        height: 200,


    },
    Qrcontainer: {
        margin: 3

    },
    lineStyle: {
        height: 0.8,
        marginTop: 20,
        opacity: 0.5,
        backgroundColor: '#1e1e1e',

    },

});

