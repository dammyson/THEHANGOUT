import React, { Component } from "react";
import { Image, Dimensions, ImageBackground, NativeModules, TouchableOpacity, TextInput, AsyncStorage, StyleSheet, Alert, FlatList } from "react-native";
import { Container, Content, View, Text, Button, Left, Right, Body, Toast, List, ListItem, } from 'native-base';
import { Avatar, Badge, } from 'react-native-elements';
import { Card, Icon, SocialIcon } from 'react-native-elements'
import Carousel, { Pagination, ParallaxImage } from 'react-native-snap-carousel';
import { Actions } from 'react-native-router-flux';
const deviceHeight = Dimensions.get("window").height;

import Modal, { SlideAnimation, ModalContent } from 'react-native-modals';
import {
    BarIndicator,
} from 'react-native-indicators';


import color from '../../component/color';
const { width: screenWidth } = Dimensions.get('window')
const URL = require("../../component/server");

import RNPickerSelect from 'react-native-picker-select';
var ImagePicker = NativeModules.ImageCropPicker;

import Navbar from '../../component/Navbar';


const type = [
    {
        label: 'Free',
        value: 'Free',
    },
    {
        label: 'Paid',
        value: 'Paid',
    },
    {
        label: 'Donation',
        value: 'Donation',
    },
];

const cat = [
    {
        label: 'Movies',
        value: 'Movies',
    },
    {
        label: 'Clubs ',
        value: 'Clubs ',
    },
    {
        label: 'Party',
        value: 'Party',
    },
    {
        label: 'Music ',
        value: 'Music ',
    }
];

export default class step5 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            details: '',
            data: '',
            org: 'Select Organizer',
            org_name:'Select Organizer',
            view_organizer: false,
            view_ticket: false,
            name: '',
            description: '',
            startdate: " 2016 1:42 AM",
            enddate: "2016 1:42 AM",
            venue: 'L Lagos LA ',
            img_url: null,
            image: null,
            type: '',
            cat: '',
            ticket: null
        };
    }



    goBack() {
        const { back } = this.props;
        back();
    }



    countChange(text) {
        this.setState({ count: 140 - text.length })
    }

    componentWillMount() {
        AsyncStorage.getItem('data').then((value) => {
            if (value == '') { } else {
                this.setState({ data: JSON.parse(value) })
                this.setState({ user: JSON.parse(value).user })
            }

            this.getOrganizersRequest()
        })

        const { getState } = this.props;
        const state = getState();

        this.setState({
            name: state.title,
            description: state.description,
            startdate: state.startdate,
            enddate: state.enddate,
            venue: state.venue,

        })
    }

    getOrganizersRequest() {
        const { data } = this.state
        fetch(URL.url + 'organizers', {
            method: 'GET', headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': 'Bearer ' + data.token,
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.status) {
                    this.setState({
                        details: res.data,
                        loading: false
                    })
                }
            })
            .catch(error => {
                alert(error.message);
                console.warn(error);
                this.setState({ loading: false })
            });
    };

    refreshOrganizersRequest() {
        const { data } = this.state
        console.warn(URL.url + 'organizers');

        fetch(URL.url + 'organizers', {
            method: 'GET', headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': 'Bearer ' + data.token,
            }
        })
            .then(res => res.json())
            .then(res => {
                console.warn(res);
                if (res.status) {
                    this.setState({
                        details: res.data,
                    })
                }
            })
            .catch(error => {
                console.warn(error);
                this.setState({ loading: false })
            });
    };


    pickSingle(cropit, circular = false, mediaType) {
        ImagePicker.openPicker({
            width: 500,
            height: 300,
            cropping: cropit,
            cropperCircleOverlay: circular,
            sortOrder: 'none',
            compressImageMaxWidth: 1000,
            compressImageMaxHeight: 1000,
            compressImageQuality: 1,
            includeExif: true,
        }).then(image => {
            console.log('received image', image);
            this.setState({
                image: { uri: image.path, width: image.width, height: image.height, mime: image.mime },
            });
            this.uploadPhoto();
        }).catch(e => {
            console.log(e);
            Alert.alert(e.message ? e.message : e);
        });
    }


    uploadPhoto = () => {


        const { image, data, name } = this.state

        if (image == null || name == "") {
            Alert.alert('Validation failed', 'Select atleast a picture and enter name', [{ text: 'Okay' }])
            return
        }
        Toast.show({
            text: 'uploading picture... !',
            position: 'bottom',
            type: 'warning',
            buttonText: 'Dismiss',
            duration: 2500
        });
        const datab = new FormData();

        datab.append('uploadedFile', {
            uri: image.uri,
            type: image.mime,
            name: 'uploadedFile',
        });
        datab.append('Content-Type', image.mime);

        //build payload packet
        var postData = {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + data.token,
            },
            body: datab,
        }

        return fetch(URL.url + 'events/upload-banner', postData)
            .then((response) => response.json())
            .then((responseJson) => {

                console.warn('responseJson', responseJson.data);
                this.setState({
                    img_url: 'http://hg.freewave.ng/' + responseJson.data.replace("Resources", "assets"),
                });
                Toast.show({
                    text: 'Picture uploaded sucessfully !',
                    position: 'bottom',
                    type: 'success',
                    buttonText: 'Dismiss',
                    duration: 2500
                });
            })
            .catch((error) => {
                Alert.alert('Login failed', "Something went wrong pls try again", [{ text: 'Okay' }])
                console.warn('error', error);

            });

    }

    async processCreateEvent() {
       
        try {
            const value = await AsyncStorage.getItem('currentT');
              if (value !== null) {
                this.setState({ ticket: JSON.parse(value) })
                 console.warn(value);
              }
           } catch (error) {
            console.warn(error);
         }

         const { data, name, description, startdate, org,org_name, ticket, venue, enddate, type, cat, img_url, image } = this.state
         

         if (org_name == "Select Organizer" || type == null || cat == null) {
            Alert.alert('Validation failed', 'field(s) cannot be empty', [{ text: 'Okay' }])
            return;
          }

         if (ticket == null) {
            Alert.alert('Validation failed', 'field(s) Please add a ticket to save event', [{ text: 'Okay' }])
            return;
          }

         if (image == null ) {
            Alert.alert('Validation failed', 'Please select and image for the organizer', [{ text: 'Okay' }])
            return;
          }else{
            if (img_url == "" ) {
              Toast.show({
                text: 'Please wait forimage to upload !',
                position: 'bottom',
                type: 'error',
                buttonText: 'Dismiss',
                duration: 2500
            });
              return;
            }
          }

       
     
        
        this.setState({ loading: true })
        fetch(URL.url + 'events/create', {
            method: 'POST', headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': 'Bearer ' + data.token,
            }, body: JSON.stringify({
                Title: name,
                Location: venue,
                Description: description,
                Category: cat,
                StartDate: startdate,
                EndDate: enddate,
                Type: type,
                Banner: img_url,
                Tickets: ticket.toString(),
                OrganizerId: org,
                City: venue,
                venue: venue,
            }),
        })
            .then(res => res.json())
            .then(res => {
                console.warn("kaikkk", res);
                if (res.status) {
                    this.setState({ loading: false })
                    Toast.show({
                        text: 'Event added sucessfully !',
                        position: 'bottom',
                        type: 'success',
                        buttonText: 'Dismiss',
                        duration: 3000
                    });
                    Actions.merchant_home({type: 'replace'});
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


        const catPlaceholder = {
            label: 'Select a category...',
            value: null,
            color: '#000',
        };
        const typePlaceholder = {
            label: 'Select type...',
            value: null,
            color: '#000',
        };

        var left = (
            <Left style={{ flex: 1 }}>
                <Button transparent onPress={this.props.back}>
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
                        <Text style={{ fontSize: 15, color: '#fff' }}>Adding Event</Text>
                        <BarIndicator count={4} color={color.primary_color} />
                        <Text style={{ fontSize: 13, flex: 1, color: '#fff' }}>Please wait...</Text>
                    </View>
                </View>
            );
        }

        return (
            <Container style={{ backgroundColor: 'transparent' }}>
                <Navbar left={left} title='Confirm Details' bg='#101023' />
                <Content>
                    <View style={styles.container}>
                        <View >

                            <Text style={styles.titleText}>CONFIRM EVENT DETAILS</Text>
                        </View>

                        {this.state.image == null ?
                            <ImageBackground
                                style={styles.pictureContainer}>
                                <Button transparent onPress={() => this.pickSingle(true)}>
                                    <Icon
                                        active
                                        name="camera"
                                        type='feather'
                                        color='#000'
                                        size={40}
                                    />
                                </Button>

                                <Text style={{ fontSize: 14, color: '#000', }}>Add Event Poster/Image </Text>
                            </ImageBackground>
                            :
                            <ImageBackground
                                opacity={this.state.img_url != null ? 1 : 0.5}
                                source={this.state.img_url != null ? { uri: this.state.img_url } : this.state.image}
                                style={[styles.pictureContainer, { backgroundColor: "#000" }]}>
                                <Button transparent onPress={() => this.pickSingle(true)}>
                                    <Icon
                                        active
                                        name="camera"
                                        type='feather'
                                        color='#000'
                                        size={40}
                                    />
                                </Button>

                                <Text style={{ fontSize: 14, color: '#000', }}>Add Event Poster/Image </Text>
                            </ImageBackground>
                        }

                        <View style={[styles.oneRow, { marginTop: 20 }]}>
                            <View style={{ margin: 20, }}>
                                <Icon
                                    active
                                    name="align-left"
                                    type='feather'
                                    color='#FFF'
                                    size={35}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <View>
                                    <Text style={styles.hintText}> Event Name </Text>
                                </View>
                                <View style={styles.item}>
                                    <TextInput
                                        placeholder="Enter Organizer name"
                                        placeholderTextColor='#fff'
                                        returnKeyType="next"
                                        keyboardType='default'
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        style={styles.menu}
                                        value={this.state.name}
                                        onChangeText={text => this.setState({ name: text })}
                                    />
                                </View>
                            </View>
                        </View>

                        <View style={styles.oneRow}>

                            <View style={{ marginLeft: 75, flex: 1 }}>
                                <View>
                                    <Text style={styles.hintText}>Organizer </Text>
                                </View>
                                <View onPress={() => this.setState({ view_organizer: true })} style={styles.item}>
                                <TouchableOpacity onPress={() => this.setState({ view_organizer: true })}>
                                    <Text style={[styles.menu, { marginBottom: 10, marginTop: 10, flex:1  }]}> {this.state.org_name} </Text>
                                    </TouchableOpacity>
                                    <View style={{ flex: 1}}></View>
                                    <TouchableOpacity  style={{ marginRight: 10, marginRight: 10,}} onPress={() => Actions.creatorganizer()}>
                                    <Icon
                                        active
                                        name="plus"
                                        type='feather'
                                        color='#FFF'
                                        size={15}
                                    />

                                    </TouchableOpacity>
                                   
                                </View>


                            </View>
                        </View>


                        <View style={styles.oneRow}>

                            <View style={{ marginLeft: 75, flex: 1 }}>
                                <View>
                                    <Text style={styles.hintText}>Description </Text>
                                </View>
                                <View style={styles.itemTwo}>
                                    <TextInput
                                        placeholder="Enter description"
                                        placeholderTextColor='#fff'
                                        returnKeyType="next"
                                        keyboardType='default'
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        style={styles.menu}
                                        value={this.state.description}
                                        onChangeText={text => this.setState({ description: text })}
                                    />
                                </View>
                            </View>
                        </View>




                        <View style={[styles.oneRow, { marginTop: 20 }]}>
                            <View style={{ marginLeft: 20, marginRight: 20, }}>
                                <Icon
                                    active
                                    name="calendar"
                                    type='feather'
                                    color='#FFF'
                                    size={35}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <View>
                                    <Text style={styles.hintText}>Event Starts </Text>
                                </View>
                                <View style={styles.itemTwo}>
                                    <Text style={{ color: '#fff', marginBottom: 10, marginTop: 10 }}> {this.state.startdate} </Text>
                                </View>
                            </View>
                        </View>


                        <View style={styles.oneRow}>

                            <View style={{ marginLeft: 75, flex: 1 }}>
                                <View>
                                    <Text style={styles.hintText}>Event End </Text>
                                </View>
                                <View style={styles.itemTwo}>
                                    <Text style={{ color: '#fff', marginBottom: 10, marginTop: 10 }}>  {this.state.enddate} </Text>
                                </View>
                            </View>
                        </View>
                        <View style={[styles.oneRow, { marginTop: 40 }]}>
                            <View style={{ margin: 20, }}>
                                <Icon
                                    active
                                    name="map-pin"
                                    type='feather'
                                    color='#FFF'
                                    size={35}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <View>
                                    <Text style={styles.hintText}>Event Venue </Text>
                                </View>
                                <View style={styles.item}>
                                    <TextInput
                                        placeholder="Enter Venue"
                                        placeholderTextColor='#fff'
                                        returnKeyType="next"
                                        keyboardType='default'
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        style={styles.menu}
                                        value={this.state.venue}
                                        onChangeText={text => this.setState({ venue: text })}
                                    />
                                </View>
                            </View>
                        </View>



                        <View style={[styles.oneRow, { marginTop: 40 }]}>
                            <View style={{ margin: 20, }}>
                                <Icon
                                    active
                                    name="ticket-outline"
                                    type='material-community'
                                    color='#FFF'
                                    size={35}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <View>
                                    <Text style={styles.hintText}>Event Type </Text>
                                </View>
                                <View style={styles.item}>
                                    <RNPickerSelect
                                        placeholder={typePlaceholder}
                                        items={type}
                                        onValueChange={value => {
                                            this.setState({
                                                type: value,
                                            });
                                        }}
                                        style={pickerSelectStyles}
                                        value={this.state.type}
                                        useNativeAndroidPickerStyle={false}

                                    />
                                </View>
                            </View>
                        </View>

                        <View style={styles.oneRow}>

                            <View style={{ marginLeft: 75, flex: 1 }}>
                                <View>
                                    <Text style={styles.hintText}>Event Category </Text>
                                </View>
                                <View style={styles.item}>
                                    <RNPickerSelect
                                        placeholder={catPlaceholder}
                                        items={cat}

                                        onValueChange={value => {
                                            this.setState({
                                                cat: value,
                                            });
                                        }}
                                        style={pickerSelectStyles}

                                        value={this.state.cat}
                                        useNativeAndroidPickerStyle={false}

                                    />
                                </View>
                            </View>
                        </View>

                        <View style={[styles.oneRow, { marginTop: 40 }]}>
                            <View style={{ margin: 20, }}>
                                <Icon
                                    active
                                    name="ticket"
                                    type='entypo'
                                    color='#FFF'
                                    size={35}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <View>
                                    <Text style={styles.hintText}>Tickets </Text>
                                </View>
                                <TouchableOpacity onPress={() => this.setState({ view_ticket: true })} style={styles.item}>
                                    <Text style={[styles.menu, { marginBottom: 10, marginTop: 10 }]}> Select Tickets </Text>

                                    <Icon
                                        active
                                        name="plus"
                                        type='feather'
                                        color='#FFF'
                                        size={15}
                                    />

                                </TouchableOpacity>
                            </View>
                        </View>

                        <View>
                        </View>


                    </View>

                    <Modal
                        visible={this.state.view_organizer}
                        modalAnimation={new SlideAnimation({
                            slideFrom: 'right',
                        })}
                    >
                        <ModalContent style={styles.modal}>
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 1, paddingBottom: 10 }}> 
                                <TouchableOpacity onPress={() => this.refreshOrganizersRequest()} style={{ marginLeft: 10, backgroundColor: '#000' }}>
                                 <Icon
                                            name="refresh"
                                            size={20}
                                            type='material-icon'
                                            color="#fff"
                                            size={30}
                                        />
                                    </TouchableOpacity>
                                    <View style={{ paddingTop: 1, paddingBottom: 10, flex: 1, alignItems:'center' }}>
                                    <Text style={{ fontFamily: 'Montserrat-Bold', color:'#fff', fontSize: 17, textAlign: 'left', paddingBottom: 10, marginTop: 25, }}>All Organizers </Text>
                                    </View> 
                                    <TouchableOpacity onPress={() => this.setState({ view_organizer: false })} style={{ marginLeft: 10, backgroundColor: '#000' }}>
                                        <Icon
                                            name="close"
                                            size={20}
                                            type='antdesign'
                                            color="#fff"
                                        />
                                    </TouchableOpacity>

                                </View>
                                <View style={{ paddingTop: 1, paddingBottom: 10, flex: 1, }}>
                                    <FlatList
                                        style={{ paddingBottom: 5 }}
                                        data={this.state.details}
                                        renderItem={this.renderItem}
                                        keyExtractor={item => item.id}
                                        ItemSeparatorComponent={this.renderSeparator}
                                        ListHeaderComponent={this.renderHeader}
                                    />

                                      <TouchableOpacity style={styles.fab} onPress={() => [ this.setState({ view_organizer: false }),  Actions.creatorganizer()  ]}>
                        <Icon
                            active
                            name="plus"
                            type='feather'
                            color='green'
                            size={25}
                        />
                    </TouchableOpacity>
                                </View>
                            </View>
                        </ModalContent>
                    </Modal>
                    <Modal
                        visible={this.state.view_ticket}
                        modalAnimation={new SlideAnimation({
                            slideFrom: 'bottom',
                        })}
                    >
                        <ModalContent style={styles.modal}>
                            <View style={{ flex: 1 }}>

                                <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 1, paddingBottom: 10 }}>
                                    <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: 17, textAlign: 'left', paddingBottom: 10, marginTop: 25, flex: 1 }}> pin </Text>
                                    <TouchableOpacity onPress={() => this.setState({ view_ticket: false })} style={{ marginLeft: 10, backgroundColor: '#000' }}>
                                        <Icon
                                            name="close"
                                            size={20}
                                            type='antdesign'
                                            color="#fff"
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ paddingTop: 1, paddingBottom: 10, flex: 1, }}>
                                    <View style={{ flexDirection: 'row', marginRight: 20, marginLeft: 20, }}>
                                        <TouchableOpacity onPress={() => [Actions.freeT(), this.setState({ view_ticket: false })]} style={{ flex: 1, }}>

                                            <View elevation={5} style={styles.ticketContainer}>

                                                <View style={{ borderRadius: 10, }}>
                                                    <Avatar
                                                        rounded
                                                        size="small"
                                                        icon={{ name: 'ticket', type: 'entypo', color: '#FFF' }}
                                                        overlayContainerStyle={{ backgroundColor: '#DD352E', }}
                                                        onPress={() => console.log("Works!")}
                                                        activeOpacity={0.7}
                                                        containerStyle={{ marginLeft: 10, marginTop: 10, marginBottom: 40 }}
                                                    />
                                                </View>
                                                <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                                                    <Text style={{ fontSize: 15, textAlign: 'left', marginBottom: 10, fontWeight: '800', color: "#ffffff", }}>Free Tickets</Text>
                                                    <Text style={{ fontSize: 12, textAlign: 'center', marginBottom: 5, fontWeight: '200', color: "#ffffff", margin: 5 }}>My event is totally free and attenders can register for free</Text>
                                                </View>
                                                <View style={{ height: 1, margin: 20, backgroundColor: '#5f5c7f', }}></View>

                                                <Text style={{ fontSize: 12, textAlign: 'center', marginBottom: 16, fontWeight: '200', color: "#ffffff", margin: 5 }}>{'Limited \n '}</Text>
                                            </View>

                                        </TouchableOpacity>



                                        <TouchableOpacity onPress={() => [Actions.paidT(), this.setState({ view_ticket: false })]} style={{ flex: 1, }}>

                                            <View elevation={5} style={styles.ticketContainer}>

                                                <View style={{ borderRadius: 10, }}>
                                                    <Avatar
                                                        rounded
                                                        size="small"
                                                        icon={{ name: 'ticket', type: 'entypo', color: '#FFF' }} ß
                                                        overlayContainerStyle={{ backgroundColor: '#F7A400', }}
                                                        onPress={() => console.log("Works!")}
                                                        activeOpacity={0.7}
                                                        containerStyle={{ marginLeft: 10, marginTop: 10, marginBottom: 40 }}
                                                    />
                                                </View>
                                                <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                                                    <Text style={{ fontSize: 15, textAlign: 'left', marginBottom: 10, fontWeight: '800', color: "#ffffff", }}>Paid Event</Text>
                                                    <Text style={{ fontSize: 12, textAlign: 'center', marginBottom: 5, fontWeight: '200', color: "#ffffff", margin: 5 }}>My event is a paid event and the attenders will purchase tickets</Text>
                                                </View>
                                                <View style={{ height: 1, margin: 20, backgroundColor: '#5f5c7f', }}></View>

                                                <Text style={{ fontSize: 12, textAlign: 'center', marginBottom: 16, fontWeight: '200', color: "#ffffff", margin: 5 }}>{'We charge 2% on every \n Ticket sales'}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginRight: 20, marginLeft: 20, }}>
                                        <TouchableOpacity style={{ flex: 1, }}>

                                            <View elevation={5} style={styles.ticketContainer}>

                                                <View style={{ borderRadius: 10, }}>
                                                    <Avatar
                                                        rounded
                                                        size="small"
                                                        icon={{ name: 'ticket', type: 'entypo', color: '#FFF' }}
                                                        overlayContainerStyle={{ backgroundColor: '#3A9EFD', }}
                                                        onPress={() => console.log("Works!")}
                                                        activeOpacity={0.7}
                                                        containerStyle={{ marginLeft: 10, marginTop: 10, marginBottom: 40 }}
                                                    />
                                                </View>
                                                <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                                                    <Text style={{ fontSize: 15, textAlign: 'left', marginBottom: 10, fontWeight: '800', color: "#ffffff", }}>Donation</Text>
                                                    <Text style={{ fontSize: 12, textAlign: 'center', marginBottom: 5, fontWeight: '200', color: "#ffffff", margin: 5 }}>My event is a fund-raising event and my attenders will have to bid</Text>
                                                </View>
                                                <View style={{ height: 1, margin: 20, backgroundColor: '#5f5c7f', }}></View>

                                                <Text style={{ fontSize: 12, textAlign: 'center', marginBottom: 16, fontWeight: '200', color: "#ffffff", margin: 5 }}>{'See Pricing within \n '}</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <View style={{ flex: 1, }}>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </ModalContent>
                    </Modal>
                    <TouchableOpacity style={styles.fab} onPress={() => this.processCreateEvent()}>
                        <Icon
                            active
                            name="check"
                            type='feather'
                            color='green'
                            size={25}
                        />
                    </TouchableOpacity>
                </Content>
            </Container>
        );
    }

    _handleCategorySelect = (index) => {
        this.setState({ org: index.id, org_name: index.name, view_organizer: false });

    }
    renderItem = ({ item, }) => {
        return (
            <TouchableOpacity style={{ marginLeft: 20, marginRight: 20, marginBottom: 10 }}
                onPress={() => this._handleCategorySelect(item)} underlayColor="red">
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Text style={styles.nameList}>{item.name}</Text>
                    <Icon
                        active
                        name="dots-vertical"
                        type='material-community'
                        color='#FFF'
                    />
                </View>

            </TouchableOpacity>

        )

    }
}


const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
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
    titlesubText: {
        fontSize: 15,
        color: '#8d96a6',
        marginTop: 25,
        marginLeft: 15,
        fontFamily: 'NunitoSans-Bold'
    },
    pictureContainer: {
        height: Dimensions.get('window').height / 4,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#8d96a6',
        margin: 10,
    },
    oneRow: {
        flexDirection: "row",
        marginBottom: 10,
        width: Dimensions.get('window').width,
    },
    hintText: {
        fontSize: 12,
        color: '#ffffff',
        opacity: 0.6
    },
    importText: {
        fontSize: 12,
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
        fontSize: 15,
        color: '#ffffff',
        textAlign: 'left',
        fontFamily: 'NunitoSans-Bold',
    },
    itemTwo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 30,

    },
    inputPicker: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'purple',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    modal: {
        width: Dimensions.get('window').width,
        height: URL.height,
        backgroundColor: "#010113"

    },
    nameList: {
        fontSize: 17,
        color: '#ffffff',
        flex: 1,
        marginLeft: 10
    },
    ticketContainer: {
        backgroundColor: '#111124',
        borderRadius: 4,
        margin: 10,
        borderWidth: 1,
        borderColor: '#5f5c7f',
        shadowRadius: 2,
        shadowOffset: {
            height: 10,
            width: 10
        }
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
