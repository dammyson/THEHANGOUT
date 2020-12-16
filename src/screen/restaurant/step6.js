import React, { Component } from "react";
import { Image, Dimensions, ImageBackground, NativeModules, TouchableOpacity, TextInput, AsyncStorage, StyleSheet, Alert, ScrollView } from "react-native";
import { Container, Content, View, Text, Button, Left, Right, Body, Toast, List, ListItem, } from 'native-base';
import { Avatar, Badge, } from 'react-native-elements';
import { Card, Icon, SocialIcon } from 'react-native-elements'
import Carousel, { Pagination, ParallaxImage } from 'react-native-snap-carousel';
const deviceHeight = Dimensions.get("window").height;

import {
    BarIndicator,
} from 'react-native-indicators';


import color from '../../component/color';
const { width: screenWidth } = Dimensions.get('window')
const URL = require("../../component/server");

import RNPickerSelect from 'react-native-picker-select';
var ImagePicker = NativeModules.ImageCropPicker;

import Navbar from '../../component/Navbar';



export default class step6 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            details: '',
            data: '',
            name: '',
            description: '',
            startdate: " 2016 1:42 AM",
            enddate: "2016 1:42 AM",
            venue: 'L Lagos LA ',
            img_url: null,
            image: null,
            images_list: [],
            images_list_url: [],
            processing_images: false,
            latitude: 6.5244,
            longitude: 3.3792,

        };
    }


    goBack() {
        const {  goBack } = this.props.navigation; 
        goBack(null)
      }


    componentWillMount() {
        AsyncStorage.getItem('data').then((value) => {
            if (value == '') { } else {
                this.setState({ data: JSON.parse(value) })
                this.setState({ user: JSON.parse(value).user })
            }

        })

        const { data_moving } = this.props.route.params;
        console.warn(data_moving)

        this.setState({
            name: data_moving.title,
            description: data_moving.description,
            startdate: data_moving.startdate,
            enddate: data_moving.enddate,
            venue: data_moving.venue,
            cat: data_moving.category,
            latitude: data_moving.latitude,
            longitude: data_moving.longitude,

        })
    }



    pickSingle(banner) {
        ImagePicker.openPicker({
            width: 500,
            height: 300,
            cropping: true,
            cropperCircleOverlay: false,
            sortOrder: 'none',
            compressImageMaxWidth: 1000,
            compressImageMaxHeight: 1000,
            compressImageQuality: 1,
            includeExif: true,
        }).then(image => {
            if (banner) {
                this.setState({
                    image: { uri: image.path, width: image.width, height: image.height, mime: image.mime },
                });
                this.uploadPhoto({ uri: image.path, width: image.width, height: image.height, mime: image.mime }, banner, URL.url + 'events/upload-banner');
            } else {
                var instant_array = []
                instant_array = this.state.images_list
                instant_array.push(image)
                this.setState({ images_list: instant_array })
                this.uploadPhoto({ uri: image.path, width: image.width, height: image.height, mime: image.mime }, banner, URL.url + 'restaurants/upload-image');
            }

        }).catch(e => {
            console.log(e);
            Alert.alert(e.message ? e.message : e);
        });
    }


    uploadPhoto = (image, banner, url) => {

        const { data, name } = this.state
        this.setState({ processing_images: true })
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

        return fetch(url, postData)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({ processing_images: false })
                console.warn('responseJson', responseJson.data);
                if (banner) {
                    this.setState({
                        img_url: URL.img + responseJson.data.replace("Resources", "assets"),
                    });
                } else {
                    var instant_url = []
                    instant_url = this.state.images_list_url
                    instant_url.push(responseJson.data.id)
                    this.setState({ images_list_url: instant_url })
                }
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

    processCreateEvent() {

        const {data, name, description, startdate, enddate,  venue, cat,img_url, images_list_url, image ,latitude, longitude, processing_images} = this.state
        console.warn( name, description, startdate, enddate,  venue, cat, img_url, images_list_url, image )
       

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

        if(processing_images){
            Alert.alert('Alert', 'Please Wait for image to uploade,  its in progress', [{ text: 'Okay' }])
            return;
        }

        this.setState({ loading: true })
        fetch(URL.url + 'restaurants/create', {
            method: 'POST', headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': 'Bearer ' + data.token,
            }, body: JSON.stringify({

                Name: name,
                Location: venue,
                Description: description,
                OpeningTime: startdate,
                ClosingTime: enddate,
                Banner: img_url,
                latitude: latitude,
                longitude: longitude,
                Category: cat.toString(),
                Gallery: images_list_url.toString(),
            }),
        })
            .then(res => res.json())
            .then(res => {
                console.warn("kaikkk", res);
                if (res.status) {
                    this.setState({ loading: false })
                    Toast.show({
                        text: 'Resturant added sucessfully !',
                        position: 'bottom',
                        type: 'success',
                        buttonText: 'Dismiss',
                        duration: 3000
                    });
                   
                    this.props.navigation.replace('merchant_home')
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
                <Button transparent onPress={()=>this.goBack()}>
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
                        <Text style={{ fontSize: 15, color: '#fff' }}>Adding Restaurant</Text>
                        <BarIndicator count={4} color={color.primary_color} />
                        <Text style={{ fontSize: 13, flex: 1, color: '#fff' }}>Please wait...</Text>
                    </View>
                </View>
            );
        }

        return (
            <Container style={{ backgroundColor:  "#010113" }}>
                <Navbar left={left} title='Confirm Details' bg='#101023' />
                <Content>
                    <View style={styles.container}>
                        <View >

                            <Text style={styles.titleText}>CONFIRM RESTAURANT DETAILS</Text>
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

                                <Text style={{ fontSize: 14, color: '#000', }}>Add Restaurant Poster/Image </Text>
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

                                <Text style={{ fontSize: 14, color: '#000', }}>Add Restaurant Poster/Image </Text>
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
                                    <Text style={styles.hintText}> Restaurant Name </Text>
                                </View>
                                <View style={styles.item}>
                                    <TextInput
                                        placeholder="Enter Resturant name"
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
                                <View style={styles.item}>
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
                                    name="time-slot"
                                    type='entypo'
                                    color='#FFF'
                                    size={35}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <View>
                                    <Text style={styles.hintText}>Opening Time </Text>
                                </View>
                                <View style={styles.itemTwo}>
                                    <Text style={{ color: '#fff', marginBottom: 10, marginTop: 10 }}> {this.state.startdate} </Text>
                                </View>
                            </View>
                        </View>


                        <View style={styles.oneRow}>

                            <View style={{ marginLeft: 75, flex: 1 }}>
                                <View>
                                    <Text style={styles.hintText}>Closing Time </Text>
                                </View>
                                <View style={styles.itemTwo}>
                                    <Text style={{ color: '#fff', marginBottom: 10, marginTop: 10 }}>  {this.state.enddate} </Text>
                                </View>
                            </View>
                        </View>
                        <View style={[styles.oneRow, { marginTop: 20 }]}>
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
                                    <Text style={styles.hintText}>Restaurant Address </Text>
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

                        <ScrollView horizontal style={{ marginRight: 20, marginLeft: 20, marginBottom: 60 }}>
                            {this.renderResuts(this.state.images_list)}

                            <TouchableOpacity onPress={() => this.pickSingle(false)} style={{ height: 100, width: 100, borderColor: '#fff', borderWidth: 1, alignItems: 'center', justifyContent: 'center' }}>

                                <Icon
                                    active
                                    name="plus-circle"
                                    type='material-community'
                                    color='#FFF'
                                    size={30}
                                />
                                <Text style={styles.hintText}>choose </Text>
                            </TouchableOpacity>
                        </ScrollView>



                        <View>
                        </View>


                    </View>


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


    renderResuts(data) {

        let cat = [];
        for (var i = 0; i < data.length; i++) {
            cat.push(

                <ImageBackground
                    source={{ uri: data[i].path }}
                    style={{ height: 100, width: 150, marginLeft: 10, marginRight: 10 }}>

                </ImageBackground>



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

