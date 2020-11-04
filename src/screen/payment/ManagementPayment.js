import React, { Component } from "react";
import { Alert, Dimensions, TouchableOpacity, TextInput, StyleSheet, AsyncStorage, StatusBar, ScrollView, } from "react-native";
import { Container, Content, View, Text, Button, Left, Right, Body, Title, List, ListItem, } from 'native-base';
import { Avatar, Icon, } from 'react-native-elements';
const deviceHeight = Dimensions.get("window").height;
const URL = require("../../component/server");
import QRCode from 'react-native-qrcode-svg';
import color from '../../component/color';
const { width: screenWidth } = Dimensions.get('window')
import Modal, { SlideAnimation, ModalContent } from 'react-native-modals';
import {
    BarIndicator,
} from 'react-native-indicators';
	
import { Base64 } from 'js-base64';

import Navbar from '../../component/Navbar';
import Balance from "../../component/views/Balance";

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

export default class ManagementPayment extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: '',
            name: '',
            id: '',
            details: {},
            user:{profilePicture:'jjjjjjj'},
            condition: true,
            activeIndex: 0,
            more: false,
            qr_generated: false,
            cost:0,
            event_code:'',
            cashier:'',
            description:'',
            qrCodeData:'',
            ref_number:'',
            bal:'',


        };
    }



    componentDidMount() {
       
        AsyncStorage.getItem('data').then((value) => {
            if (value == '') { } else {
                this.setState({ data: JSON.parse(value) })
                this.setState({ user: JSON.parse(value).user })
            }
           console.warn(JSON.parse(value).user )
        })

        AsyncStorage.getItem('bal').then((value) => {
            if (value == '') { } else {
                this.setState({ bal:  value})
            }
        })


    }


generateQrCode(){
    const { cost, event_code, cashier, description, user } = this.state
    var ran = Math.floor(100000000 + Math.random() * 900000000)
    const total_cost = cost + (cost  * 0.05)
   this.setState({ ref_number: ran})
    const details = user.id+'|'+total_cost+'|'+description +'|'+cashier+'|'+event_code+'|'+ran;
    var temp = Base64.encode(details);
    this.setState({ qrCodeData: temp })
   
    this.setState({ qr_generated: true })
    console.warn();
}

 
    segmentClicked = (index) => {
        this.setState({
            activeIndex: index
        })
    }
    currencyFormat(n) {
        return  n.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");


     }
    render() {
        const { user, } = this.state
      


        var left = (
            <Left style={{ flex: 1 }}>
                <Button transparent onPress={() => this.props.navigation.goBack()}>
                <Avatar
                        rounded
                        source={{
                            uri:this.state.user.profilePicture
                           ,
                        }}
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
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000000' }}>
                    <View style={styles.welcome}>
                        <Text style={{ fontSize: 12, color: '#fff' }}>Getting details </Text>
                        <BarIndicator count={4} color={color.primary_color} />
                        <Text style={{ fontSize: 10, flex: 1, color: '#fff', opacity: 0.6 }}>Please wait...</Text>
                    </View>
                </View>
            );
        }

        return (
            <Container style={{ backgroundColor: '#000' }}>
                <Navbar left={left} right={right} title='Manage Payments' bg='#111124' />
                <Content>
                    <View style={styles.container}>
                        <View style={{ flex: 1, }}>
                            <Balance 
                                OnButtonPress={()=> this.props.navigation.navigate('fundW')} 
                                buttonColor={color.primary_color} 
                                textColor={'#000'}
                                buttonText={'Fund Wallet'}
                                textColor={'#000'}
                                balTextColor={'#000'}
                                commentTextColor={'#000'}
                                backgroundColor={'#fff'}Z
                                />

                            <View style={{ flexDirection: 'row', marginTop: 15, marginLeft: 20, marginRight: 20 }}>

                                <TouchableOpacity style={[styles.activeType, this.state.activeIndex == 0 ? { borderBottomColor: color.primary_color, } : {}]}
                                    onPress={() => this.segmentClicked(0)}
                                    active={this.state.activeIndex == 0}
                                >
                                    <Text style={[styles.toggleText, this.state.activeIndex == 0 ? { color: color.primary_color, } : {}]}>Scan To Pay</Text>
                                </TouchableOpacity>
                                <View style={{ backgroundColor: '#5F5C7F', width: 1, marginBottom: 3 }} />
                                <TouchableOpacity style={[styles.activeType, this.state.activeIndex == 1 ? { borderBottomColor: color.primary_color, } : {}]}
                                    onPress={() => this.segmentClicked(1)}
                                    active={this.state.activeIndex == 1}>
                                    <Text style={[styles.toggleText, this.state.activeIndex == 1 ? { color: color.primary_color, } : {}]}>Generate QR</Text>
                                </TouchableOpacity>

                            </View>


                            {
                                this.state.activeIndex == 0 ?
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
                                                <Text style={{ color: '#1E1E1E', fontSize: 12, margin: 20, marginLeft: 30, marginRight: 30, fontWeight: '400', opacity: 0.7 }}> Please scan Barcode for payment </Text>

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
                                                <Text onPress={()=> this.props.navigation.navigate('qr')} style={{ color: "#010113", marginLeft: 5, marginTop: 15, marginBottom: 15, fontSize: 16, fontWeight: '500', fontFamily: 'NunitoSans', opacity: 0.77 }}>SCAN QRCODE</Text>
                                            </TouchableOpacity>

                                        </View>
                                    </ScrollView>

                                    :

                                    <ScrollView style={{ flex: 1, }}>
                                        <View style={{ flex: 1, marginLeft: 20, marginRight: 20, }}>
                                            <Text style={styles.title}> GENERATE QR CODE </Text>
                                            <Text style={{ marginLeft: 2, textAlign: 'left', color: '#fff', fontSize: 12, fontWeight: '100', marginTop: 10, opacity: 0.59 }}>Generate a payment invoice using QR Code. Your customer would have to scan QR code for payments and funds will be credited to your wallet.   </Text>

                                            <View style={styles.inputView}>
                                                <Text style={{ color: '#fff', fontSize: 12, fontWeight: '200', margin: 10, fontFamily: 'NunitoSans', }}>Generated QR code attracts a VAT of 5%</Text>
                                            </View>
                                            <Text style={{ marginLeft: 2, textAlign: 'left', color: '#fff', fontSize: 12, fontWeight: '100', marginTop: 10, opacity: 0.59 }}>This is calculated automatically.</Text>

                                            <View style={styles.inputTextView}>
                                                <TextInput
                                                    placeholder="Enter total invoice amount to be received"
                                                    placeholderTextColor={'#bbb'}
                                                    returnKeyType="next"
                                                    keyboardType='numeric'
                                                    autoCapitalize="none"
                                                    autoCorrect={false}
                                                    inlineImageLeft='ios-call'
                                                    style={{color:'#fff', flex: 1, fontSize: 12 }}
                                                    onChangeText={text => this.setState({ cost: parseInt(text) })}
                                                />
                                            </View>

                                            {!this.state.more ?
                                                <TouchableOpacity onPress={() => this.setState({ more: true })} style={{ marginTop: 15 }} >
                                                    <Text style={{ color: color.primary_color, fontSize: 10, fontWeight: '200', fontFamily: 'NunitoSans', }}>Show More</Text>
                                                </TouchableOpacity>
                                                :
                                                <TouchableOpacity onPress={() => this.setState({ more: false })} style={{ marginTop: 15 }} >
                                                    <Text style={{ color: color.primary_color, fontSize: 10, fontWeight: '200', fontFamily: 'NunitoSans', }}>Hide More</Text>
                                                </TouchableOpacity>
                                            }



                                            {this.state.more ?


                                                <View>


                                                    <View style={styles.inputTextView}>
                                                        <TextInput
                                                            placeholder="Enter cashier code"
                                                            placeholderTextColor={'#bbb'}
                                                            returnKeyType="next"
                                                           
                                                            keyboardType='email-address'
                                                            autoCapitalize="none"
                                                            autoCorrect={false}
                                                            inlineImageLeft='ios-call'
                                                            style={{ color:'#fff',flex: 1, fontSize: 12 }}
                                                            onChangeText={text => this.setState({ cashier: text })}
                                                        />
                                                    </View>


                                                    <View style={styles.inputTextView}>
                                                        <TextInput
                                                            placeholder="Enter Event code"
                                                            placeholderTextColor={'#bbb'}
                                                            returnKeyType="next"
                                                            keyboardType='email-address'
                                                            autoCapitalize="none"
                                                            autoCorrect={false}
                                                            inlineImageLeft='ios-call'
                                                            style={{ color:'#fff',flex: 1, fontSize: 12 }}
                                                            onChangeText={text => this.setState({ event_code: text })}
                                                        />
                                                    </View>

                                                    <View style={styles.inputTextView}>
                                                        <TextInput
                                                            placeholder="Enter Description"
                                                            placeholderTextColor={'#bbb'}
                                                            returnKeyType="next"
                                                            onSubmitEditing={() => this.generateQrCode() }
                                                            keyboardType='email-address'
                                                            autoCapitalize="none"
                                                            autoCorrect={false}
                                                            inlineImageLeft='ios-call'
                                                            style={{ color:'#fff',flex: 1, fontSize: 12 }}
                                                            onChangeText={text => this.setState({ description: text })}
                                                        />
                                                    </View>
                                                </View>




                                                : null



                                            }


                                            <View style={{ alignItems: 'center', justifyContent: 'center' ,  marginBottom:100}}>
                                                <TouchableOpacity  onPress={()=>this.generateQrCode() } style={{ flexDirection: 'row', backgroundColor: color.primary_color, alignItems: 'center', alignContent: 'space-around', paddingLeft: 19, paddingRight: 19, borderRadius: 5, marginTop: 20 }} block iconLeft>

                                                    <Text style={{ color: "#010113", marginLeft: 5, marginTop: 15, marginBottom: 15, fontSize: 16, fontWeight: '500', fontFamily: 'NunitoSans', opacity: 0.77 }}>GENERATA QR</Text>
                                                </TouchableOpacity>


                                                <View style={{  height:100}}></View>
                                            </View>
                                        </View>

                                    </ScrollView>

                            }




                        </View>

                    </View>



                    <Modal
                        visible={this.state.qr_generated}
                        modalAnimation={new SlideAnimation({
                            slideFrom: 'right',
                        })}
                    >
                        <ModalContent style={styles.modal}>
                            <View style={{ flex: 1 }}>

                                <View style={{ flexDirection: 'row', backgroundColor: "#FFF",  marginTop: 1, marginLeft: 10, marginRight: 10, }}>
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
                                            <Text style={{ marginLeft: 2, color: '#1e1e1e', fontSize: 12, fontWeight: '400', opacity: 0.6 , flex:1}}> Amount </Text>
                                            <Text style={{ marginLeft: 2, color: '#000', fontSize: 12, fontWeight: '600' , flex:1}}>₦{ this.currencyFormat(this.state.cost)} </Text>
                                        </View>

                                        <View style={{ flexDirection: 'row', marginTop:20 }}>
                                            <Text style={{ marginLeft: 2, color: '#1e1e1e', fontSize: 12, fontWeight: '400', opacity: 0.6 , flex:1}}> VAT (5%) </Text>
                                            <Text style={{ marginLeft: 2, color: '#000', fontSize: 12, fontWeight: '600' , flex:1}}>₦{this.currencyFormat(this.state.cost * 0.05)}  </Text>
                                        </View>

                                        <View style={styles.lineStyle} />
                                        <View style={{ flexDirection: 'row', marginTop:20 }}>
                                            <Text style={{ marginLeft: 2, color: '#1e1e1e', fontSize: 12, fontWeight: '400', opacity: 0.6 , flex:1}}> Invoice Total </Text>
                                            <Text style={{ marginLeft: 2, color: '#000', fontSize: 12, fontWeight: '600' , flex:1}}>₦{ this.currencyFormat(this.state.cost + (this.state.cost * 0.05))} </Text>
                                        </View>
                                    </View>

                                   

                                    <View style={{ alignItems: 'flex-end' }}>
                                        <TouchableOpacity  onPress={()=> this.setState({qr_generated: false})}>
                                            <Icon
                                                active
                                                name="close"
                                                type='antdesign'
                                                color='red'
                                                size={20}
                                            />
                                        </TouchableOpacity>


                                    </View>


                                </View>


                                <View  style={{ flexDirection:'row', marginBottom: 20, marginLeft:10}}>
                                <Text style={{ marginTop: 7, color: '#000', fontSize: 16, fontWeight: '900' }}> #{this.state.ref_number}</Text>
                                <View style={{ flex: 1, alignItems:'flex-end' }}>
                                <Text style={{ marginLeft: 2, color: '#1e1e1e', fontSize: 12, fontWeight: '400', opacity: 0.6 ,}}>27/10/9 11:45 AM </Text>
                                          
                                </View>
                                </View>
                            </View>
                        </ModalContent>
                    </Modal>

                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
       
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

