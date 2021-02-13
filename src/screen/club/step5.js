import React, { Component } from "react";
import { Image, Dimensions, ImageBackground, NativeModules, TouchableOpacity, TextInput, StatusBar, ScrollView, StyleSheet, Alert, FlatList } from "react-native";
import { Container, Content, View, Text, Button, Left, Right, Body, Toast, List, ListItem, } from 'native-base';
import { Avatar, Badge, } from 'react-native-elements';
import { Card, Icon, SocialIcon } from 'react-native-elements'
import { getSaveRestaurant, getData } from '../../component/utilities';
const deviceHeight = Dimensions.get("window").height;

import Modal, { SlideAnimation, ModalContent } from 'react-native-modals';
import {
    BarIndicator,
} from 'react-native-indicators';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Moment from 'moment';

import color from '../../component/color';
const { width: screenWidth } = Dimensions.get('window')
const URL = require("../../component/server");

import RNPickerSelect from 'react-native-picker-select';
var ImagePicker = NativeModules.ImageCropPicker;

import Navbar from '../../component/Navbar';
import PaidTicket from "../../component/views/PaidTicket";
import TicketType from "../../component/views/TicketType";
import SelectOrganizer from "../../component/views/SelectOrganizer";
import AddSpecial from "./AddSpecial";


const type = [
    {
        label: 'Free                             ',
        value: 'Free',
    },
    {
        label: 'Paid                            ',
        value: 'Paid',
    },
    {
        label: 'Donation                     ',
        value: 'Donation',
    },
];


export default class step5 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show_ticket_paid: false,
            show_ticket_type: false,
            details: '',
            data: '',
            show_special_app: false,
            name: '',
            description: '',
            startdate: "2016 1:42 AM",
            enddate: "2016 1:42 AM",
            venue: 'L Lagos LA ',
            img_url: null,
            image: null,
            type: 'Free',
            cat: '',
            cat_list: [],
            show_from_picker: false,
            show_to_picker: false,
            latitude: 6.5244,
            longitude: 3.3792,
            special_app:[]
        };
    }



    goBack() {
        const { goBack } = this.props.navigation;
        goBack(null)
    }

    async componentWillMount() {
        this.setState({
            data: JSON.parse(await getData()),
            user: JSON.parse(await getData()).user
        })
        const { data_moving } = this.props.route.params;
console.warn(data_moving)
        this.setState({
            name: data_moving.title,
            description: data_moving.description,
            startdate: data_moving.startdate,
            enddate: data_moving.enddate,
            venue: data_moving.venue,
            latitude: data_moving.latitude,
            longitude: data_moving.longitude,

        })

        this.getCategoryRequest()
    }



    getCategoryRequest() {
        const { data } = this.state
        fetch(URL.url + 'categories/Events', {
            method: 'GET', headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': 'Bearer ' + data.token,
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.status) {
                    this.sortCategories(res.data)
                } else {
                    this.setState({
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


    sortCategories(list) {

        let instant_array = [];
        for (let i = 0; i < list.length; i++) {
            instant_array.push(

                {
                    label: list[i].name,
                    value: list[i].name,
                },
            )
        }

        this.setState({ cat_list: instant_array })
    }


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
                    img_url: URL.img + responseJson.data.replace("Resources", "assets"),
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

        const { data, name, description, startdate, venue, type, cat, img_url, special_app, image,latitude, longitude } = this.state
       
        if (image == null) {
            Alert.alert('Validation failed', 'Please select and image for the organizer', [{ text: 'Okay' }])
            return;
        } else {
            if (img_url == "") {
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
        fetch(URL.url + 'clubs/create', {
            method: 'POST', headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': 'Bearer ' + data.token,
            }, body: JSON.stringify({
                Name: name,
                Location: venue,
                Description: description,
                Category: cat,
                Date: startdate,
                Type: type,
                ImageUrl: img_url,
                Starring: special_app,
                latitude: latitude,
                longitude: longitude
            }),
        })
            .then(res => res.json())
            .then(res => {
                console.warn("kaikkk", res);
                if (res.status) {
                    this.setState({ loading: false })
                    Toast.show({
                        text: 'Club added sucessfully !',
                        position: 'bottom',
                        type: 'success',
                        buttonText: 'Dismiss',
                        duration: 3000
                    });
                    this.props.navigation.replace('merchant_home');
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
                        <Text style={{ fontSize: 15, color: '#fff' }}>Adding Club</Text>
                        <BarIndicator count={4} color={color.primary_color} />
                        <Text style={{ fontSize: 13, flex: 1, color: '#fff' }}>Please wait...</Text>
                    </View>
                </View>
            );
        }

        return (
            <Container style={{ backgroundColor: "#010113" }}>
                <StatusBar barStyle="dark-content" hidden={false} backgroundColor="transparent" />
                <Navbar left={left} title='Confirm Details' bg='#101023' />
                <Content>
                    {this.renderBody()}
                </Content>
                <TouchableOpacity style={styles.fab} onPress={() => this.processCreateEvent()}>
                    <Icon
                        active
                        name="check"
                        type='feather'
                        color='green'
                        size={25}
                    />
                </TouchableOpacity>
                {this.state.show_special_app ? this.renderAddSpecial() : null}
            </Container>
        );
    }



    renderBody() {


        const catPlaceholder = {
            label: 'Select a category...',
            value: null,
            color: '#000',
        };
        const typePlaceholder = {
            label: 'Select type...             ',
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

        return (
            <>

                <View style={styles.container}>
                    <View>
                        <Text style={styles.titleText}>CONFIRM CLUB DETAILS</Text>
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

                            <Text style={{ fontSize: 14, color: '#000', }}>Add Club Poster/Image </Text>
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

                            <Text style={{ fontSize: 14, color: '#000', }}>Add Club Poster/Image </Text>
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
                                <Text style={styles.hintText}> Club Name </Text>
                            </View>
                            <View style={styles.item}>
                                <TextInput
                                    placeholder="Enter Club name"
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
                                <Text style={styles.hintText}>Club Starts </Text>
                            </View>
                            <TouchableOpacity onPress={() => this.setState({ show_from_picker: true })} style={styles.itemTwo}>
                                <Text style={{ color: '#fff', marginBottom: 10, marginTop: 10 }}> {this.state.startdate} </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <DateTimePickerModal
                        isVisible={this.state.show_from_picker}
                        mode="datetime"
                        onConfirm={(date) => this.setState({ show_from_picker: false, startdate: Moment(date).format('llll') })}
                        onCancel={() => this.setState({ show_from_picker: false })}
                    />
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
                                <Text style={styles.hintText}>Club Venue </Text>
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

                    <View style={styles.oneRow}>
              <View style={{ marginLeft: 75, flex: 1 }}>
                <View style={{ flexDirection: 'row', marginRight: 55, marginBottom: 10 }}>
                  <View style={{ flex: 1, }}>
                    <Text style={styles.hintText}>Special appearance </Text>
                  </View>
                  <TouchableOpacity onPress={() => this.setState({ show_special_app: true })} ><Icon
                    active
                    name="pluscircle"
                    type='antdesign'
                    color='#fff'

                  /></TouchableOpacity>
                </View>

                <ScrollView style={{}}>

                  {this.renderResuts(this.state.special_app)}

                </ScrollView>
              </View>
            </View>
                    <View style={[styles.oneRow, { marginTop: 30 }]}>
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
                                <Text style={styles.hintText}>Club Type </Text>
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
                                <Text style={styles.hintText}>Club Category </Text>
                            </View>
                            <View style={styles.item}>
                                <RNPickerSelect
                                    placeholder={catPlaceholder}
                                    items={this.state.cat_list}
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
                    <View>
                    </View>
                </View>
            </>);
    }

    onComplete(operation) {
        console.warn(operation)
        var instant_array = []
        instant_array = this.state.special_app
        instant_array.push(operation)
        this.setState({
            special_app: instant_array,
            show_special_app: false,
        })
        console.warn(this.state.special_app)
    }

    renderAddSpecial() {
        return (
            <AddSpecial
            onSelected={(res) => this.onComplete(res)}
                onClose={() => this.setState({ show_special_app: false })} />
        )
    }


    renderResuts(data) {

        let cat = [];
        for (var i = 0; i < data.length; i++) {
          cat.push(
            <View style={[styles.terms_container]}>
              {!this.state.agree ?
                <TouchableOpacity onPress={() => this.setState({ agree: true })} style={[{
                }]}>
                  <Icon
                    name="check-square"
                    type='feather'
                    size={18}
                    color={color.white}
                  />
                </TouchableOpacity>
                :
                <TouchableOpacity onPress={() => this.setState({ agree: false })} style={[{
                }]}>
    
                  <Icon
                    name="check-square"
                    type='feather'
                    size={18}
                    color={color.green}
                  />
                </TouchableOpacity>
    
              }
    
              <Text style={{ color: color.white, fontSize: 12, fontWeight: '200', marginLeft: 5 }}>{data[i]} </Text>
    
            </View>
    
          );
        }
        return cat;
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
    terms_container: {
        flexDirection: 'row',

        marginRight: 10,
        marginTop: 10,
        marginBottom: 10,
    },
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
