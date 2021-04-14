import React, { Component } from "react";
import { Image, Dimensions, ImageBackground, NativeModules, TouchableOpacity, TextInput, AsyncStorage, StyleSheet, Alert, ScrollView } from "react-native";
import { Container, Content, View, Text, Button, Left, Right, Body, Toast, List, ListItem, } from 'native-base';
import { Avatar, Badge, } from 'react-native-elements';
import { Card, Icon, SocialIcon } from 'react-native-elements'
import {getUser, getData } from '../../component/utilities';
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



export default class UpdateProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            details: '',
            data: '',
            image: null,
            processing_images: false,
            userName: '',
            phone: '',
            firstName: '',
            lastName: '',
            profilePicture: null,

        };
    }


    goBack() {
        const { goBack } = this.props.navigation;
        goBack(null)
    }


    async componentWillMount() {
        console.warn(JSON.parse(await getUser()))
        this.setState({
            data: JSON.parse(await getData()),
            user: JSON.parse(await getUser()),
            userName: JSON.parse(await getUser()).userName,
            phone: JSON.parse(await getUser()).phone,
            firstName: JSON.parse(await getUser()).firstName,
            lastName: JSON.parse(await getUser()).lastname,
            profilePicture: JSON.parse(await getUser()).profilePicture,
        })
    }


    pickSingle() {
        ImagePicker.openPicker({
            width: 500,
            height: 300,
            cropping: true,
            cropperCircleOverlay: true,
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

        const { image, data } = this.state

        if (image == null) {
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
                    profilePicture: URL.img + responseJson.data.replace("Resources", "assets"),
                });
               this._updateProfilePictureRequest()

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
    _updateProfilePictureRequest() {
        const {  profilePicture, data } = this.state
          
        this.setState({ loading: true })
        fetch(URL.url + 'users/', {
            method: 'PUT', headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': 'Bearer ' + data.token,
            }, body: JSON.stringify({
                profilePicture: profilePicture
            }),
        })
            .then(res => res.json())
            .then(res => {
                console.warn(res);
                if (res.status) {
                    this.setState({ loading: false })
                    AsyncStorage.setItem('user', JSON.stringify(res.user));
                    Alert.alert('Success', 'Profile updated', [{ text: 'Okay' }])
                } else {
                    Alert.alert('Login failed', res.message, [{ text: 'Okay' }])
                    this.setState({ loading: false })
                }
            }).catch((error) => {
                this.setState({ loading: false })
                console.warn(error);
                alert(error.message);
            });

    }

    _updateProfileRequest() {
        const { phone, lastName, firstName, profilePicture, data } = this.state

        if ( phone =='' || lastName == "" || firstName == "" || profilePicture == "") {
            Alert.alert('Validation failed', 'field(s) cannot be empty', [{ text: 'Okay' }])
            return
          }

          
        this.setState({ loading: true })
        fetch(URL.url + 'users/', {
            method: 'PUT', headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': 'Bearer ' + data.token,
            }, body: JSON.stringify({
                phone:phone,
                Firstname: firstName,
                lastName: lastName,
            }),
        })
            .then(res => res.json())
            .then(res => {
                console.warn(res);
                if (res.status) {
                    this.setState({ loading: false })
                    AsyncStorage.setItem('user', JSON.stringify(res.user));
                    Alert.alert('Success', 'Profile updated', [{ text: 'Okay' }])
                } else {
                    Alert.alert('Login failed', res.message, [{ text: 'Okay' }])
                    this.setState({ loading: false })
                }
            }).catch((error) => {
                this.setState({ loading: false })
                console.warn(error);
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
                        <Text style={{ fontSize: 15, color: '#fff' }}>Updating Profile</Text>
                        <BarIndicator count={4} color={color.primary_color} />
                        <Text style={{ fontSize: 13, flex: 1, color: '#fff' }}>Please wait...</Text>
                    </View>
                </View>
            );
        }

        return (
            <Container style={{ backgroundColor: "#010113" }}>
                <Navbar left={left} title='Update profile' bg='#101023' />
                <Content>
                    <View style={styles.container}>
                        <View style={{ alignItems: 'center' }}>
                            {this.state.profilePicture == null || this.state.profilePicture == 'null' || this.state.profilePicture == ''?
                                <Avatar
                                    rounded
                                    size="xlarge"
                                    icon={{ name: 'camera', color: '#fff', type: 'feather' }}
                                    overlayContainerStyle={{ backgroundColor: '#707070', }}
                                    onPress={() => this.pickSingle(true)}
                                    renderPlaceholderContent={<Icon name="camera" type='feather' color='#fff' size={45} />}

                                />
                                :
                                <Avatar
                                    rounded
                                    size="xlarge"
                                    icon={{ name: 'camera', color: '#fff', type: 'feather' }}
                                    source={this.state.profilePicture != '' ? { uri: this.state.profilePicture } : this.state.image}
                                    overlayContainerStyle={{ backgroundColor: '#707070', }}
                                    onPress={() => this.pickSingle(true)}
                                    renderPlaceholderContent={<Icon name="camera" type='feather' color='#000' size={45} />}
                                />
                            }

                        </View>
                        <View style={[styles.oneRow, { marginTop: 20 }]}>
                            <View style={{ margin: 20, }}>
                                <Icon
                                    active
                                    name="mail"
                                    type='feather'
                                    color='#FFF'
                                    size={35}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <View>
                                    <Text style={styles.hintText}>Email </Text>
                                </View>
                                <View style={styles.item}>
                                    <TextInput
                                        placeholder="Email"
                                        placeholderTextColor='#fff'
                                        returnKeyType="next"
                                        keyboardType='default'
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        editable={false}
                                        style={styles.menu}
                                        value={this.state.userName}
                                        onChangeText={text => this.setState({ name: text })}
                                    />
                                </View>
                            </View>
                        </View>

                        <View style={[styles.oneRow, { marginTop: 20 }]}>
                            <View style={{ margin: 20, }}>
                                <Icon
                                    active
                                    name="smartphone"
                                    type='feather'
                                    color='#FFF'
                                    size={35}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <View>
                                    <Text style={styles.hintText}>Phone </Text>
                                </View>
                                <View style={styles.item}>
                                    <TextInput
                                        placeholder="Enter Phone"
                                        placeholderTextColor='#fff'
                                        returnKeyType="next"
                                        keyboardType='default'
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        style={styles.menu}
                                        defaultValue={this.state.phone}
                                        onChangeText={text => this.setState({ phone: text })}
                                    />
                                </View>
                            </View>
                        </View>

                        <View style={[styles.oneRow, { marginTop: 20 }]}>
                            <View style={{ margin: 20, }}>
                                <Icon
                                    active
                                    name="user"
                                    type='feather'
                                    color='#FFF'
                                    size={35}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <View>
                                    <Text style={styles.hintText}>First Name </Text>
                                </View>
                                <View style={styles.item}>
                                    <TextInput
                                        placeholder="Enter First Name"
                                        placeholderTextColor='#fff'
                                        returnKeyType="next"
                                        keyboardType='default'
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        style={styles.menu}
                                        defaultValue={this.state.firstName}
                                        onChangeText={text => this.setState({ firstName: text })}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={[styles.oneRow, { marginTop: 20 }]}>
                            <View style={{ margin: 20, }}>
                                <Icon
                                    active
                                    name="user"
                                    type='feather'
                                    color='#FFF'
                                    size={35}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <View>
                                    <Text style={styles.hintText}>Last Name </Text>
                                </View>
                                <View style={styles.item}>
                                    <TextInput
                                        placeholder="Enter Last Name"
                                        placeholderTextColor='#fff'
                                        returnKeyType="next"
                                        keyboardType='default'
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        style={styles.menu}
                                        defaultValue={this.state.lastName}
                                        onChangeText={text => this.setState({ last_name: text })}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20, marginBottom: 20, }}>
                            <TouchableOpacity onPress={() => this._updateProfileRequest()} style={styles.enablebutton} block iconLeft>
                                <Text style={{ color: color.secondary_color, marginTop: 15, marginBottom: 15, fontSize: 16, fontWeight: '200', fontFamily: 'NunitoSans', }}>Continue</Text>
                            </TouchableOpacity>
                        </View>
                        <View>
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
        width: Dimensions.get('window').height / 4,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#8d96a6',
        margin: 10,
        borderRadius: Dimensions.get('window').height / 4
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
    enablebutton: {
        backgroundColor: color.primary_color,
        alignItems: 'center',
        alignContent: 'space-around',
        paddingLeft: 53,
        paddingRight: 53,
        borderRadius: 5,
        marginLeft: 30,
        marginRight: 30,
    },
});

