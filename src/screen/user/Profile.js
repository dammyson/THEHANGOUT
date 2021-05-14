
import React, { Component } from 'react';
import { Platform, StyleSheet, AsyncStorage, Image, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { Container, Content, View, Text, Button, Left, Right, Body, Title, List, ListItem, Thumbnail, Grid, Col, Separator } from 'native-base';
import { Avatar, Badge, } from 'react-native-elements';
import { Card, Icon, SocialIcon } from 'react-native-elements' 
import {
    BarIndicator,
} from 'react-native-indicators';

import color from '../../component/color';
import Modal, { ModalContent } from 'react-native-modals';
import {getUser, getData, getIsGuest, getHeaders  } from '../../component/utilities';
import Navbar from '../../component/Navbar';
import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
} from '@react-native-community/google-signin';
import IsGuest from "../../component/views/IsGuest";

export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: '',
            user: '',
            is_guest: true,
            visible_log_merchant: false,
            social: ''

        };
    }


    async componentWillMount() {
        console.warn( await getIsGuest())
        this.setState({ is_guest: await getIsGuest() =="YES" ? true : false})
        this.setState({
            data: JSON.parse(await getData()),
            user: JSON.parse(await getUser()),
        })

        AsyncStorage.getItem('social').then((value) => {
            if (value == '') { } else {
                this.setState({ social: JSON.parse(value) })
                console.warn(value)
            }
        })

        GoogleSignin.configure({
            //It is mandatory to call this method before attempting to call signIn()
            scopes: ['https://www.googleapis.com/auth/drive.readonly'],
            // Repleace with your webClientId generated from Firebase console
            webClientId: '823628556250-7nebjfacok8lcef9brdfe7j69i6u9uc1.apps.googleusercontent.com',
        });

    }


    handleLogout() {
        this.setState({ visible_log_merchant: false })
        if (this.state.social) {
            this.signOut()
        } else {
            this.logOut()
        }

    }

    signOut = async () => {
        try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
            this.logOut()
        } catch (error) {
            console.error(error);
        }
    };


    logOut() {
        this.setState({ visible_log_merchant: false })
        try {
            AsyncStorage.removeItem('login');
            AsyncStorage.removeItem('data');
            AsyncStorage.removeItem('bal');
            AsyncStorage.removeItem('user');
            setTimeout(() => {
                this.props.navigation.reset({
                    index: 0,
                    routes: [{ name: 'intro' }],
                });
            }, 1000);

            return true;
        }
        catch (exception) {
            return false;
        }

    }

    render() {
        const { user } = this.state
        if (this.state.is_guest) {
            return (
                <IsGuest onPress={()=>  this.props.navigation.reset({
                    index: 0,
                    routes: [{ name: 'intro' }],
                })} />
            );
        }
        var left = (
            <Left style={{ flex: 1 }}>
                <Button transparent >
                    <Avatar
                        rounded
                        source={{
                            uri: user.profilePicture,
                        }}
                    />
                </Button>
            </Left>
        );
        var right = (
            <Right>
                <Button transparent>
                    <Icon
                        active
                        name="dots-vertical"
                        type='material-community'
                        color='#FFF'
                    />
                </Button>
            </Right>
        );

        return (
            <Container style={{ backgroundColor: color.secondary_color }}>
                 <StatusBar translucent barStyle="light-content" hidden={false} backgroundColor="#101023" />
                <Navbar left={left} right={right} title="Profile" bg='#101023' />
                <Content>
                    <View style={styles.container}>
                        <View style={styles.header}>

                            <View>

                                <Avatar
                                    rounded
                                    source={{
                                        uri: user.profilePicture,
                                    }}
                                    showEditButton={true}
                                    size="large"
                                    icon={{ name: 'user-circle', color: 'black', type: 'font-awesome' }}
                                    overlayContainerStyle={{ backgroundColor: 'white', borderColor: color.primary_color, borderWidth: 2 }}

                                    editButton={{ name: 'pluscircle', type: 'antdesign', color: color.primary_color, underlayColor: '#000' }}
                                />

                            </View>
                            <Text style={{ fontSize: 14, margin: 15, marginTop: 10, textAlign: 'left', fontWeight: '800', color: "#ffffff", }}>{user.userName}</Text>

                        </View>


                        <View style={styles.body}>
                            {/** 
                            <View>
                                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', marginRight: 20, marginLeft: 20, }}>
                                    <Avatar
                                        rounded
                                        size="small"
                                        icon={{ name: 'edit-2', type: 'feather', color: '#000' }}
                                        overlayContainerStyle={{ backgroundColor: color.primary_color }}
                                        onPress={() => console.log("Works!")}
                                        activeOpacity={0.7}
                                        containerStyle={{}}
                                    />
                                    <Text style={{ flex: 1, fontSize: 14, alignSelf: "center", marginLeft: 15, textAlign: 'left', fontWeight: '800', color: "#ffffff", }}> Change Password</Text>

                                    <View style={{ alignSelf: "center", }}>
                                        <Icon
                                            active
                                            name="right"
                                            type='antdesign'
                                            color='#D3D3D3'
                                        />
                                    </View>
                                </TouchableOpacity>
                                <View style={styles.lineStyle} />
                            </View>
*/}
                            <View style={{ marginTop: 20 }}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('update_user')} style={{ flexDirection: 'row', justifyContent: 'center', marginRight: 20, marginLeft: 20, }}>
                                    <Avatar
                                        rounded
                                        size="small"
                                        icon={{ name: 'user', type: 'entypo', color: '#FFF' }}
                                        overlayContainerStyle={{ backgroundColor: 'orange' }}
                                        onPress={() => console.log("Works!")}
                                        activeOpacity={0.7}
                                        containerStyle={{}}
                                    />
                                    <Text style={{ flex: 1, fontSize: 14, alignSelf: "center", marginLeft: 15, textAlign: 'left', fontWeight: '800', color: "#ffffff", }}>Update Profile</Text>

                                    <View style={{ alignSelf: "center", }}>
                                        <Icon
                                            active
                                            name="right"
                                            type='antdesign'
                                            color='#D3D3D3'
                                        />
                                    </View>
                                </TouchableOpacity>
                                <View style={styles.lineStyle} />
                            </View>

                            <View style={{ marginTop: 20 }}>
                                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', marginRight: 20, marginLeft: 20, }}>
                                    <Avatar
                                        rounded
                                        size="small"
                                        icon={{ name: 'ticket', type: 'entypo', color: '#FFF' }}
                                        overlayContainerStyle={{ backgroundColor: color.red }}
                                        onPress={() => console.log("Works!")}
                                        activeOpacity={0.7}
                                        containerStyle={{}}
                                    />
                                    <Text style={{ flex: 1, fontSize: 14, alignSelf: "center", marginLeft: 15, textAlign: 'left', fontWeight: '800', color: "#ffffff", }}> My Event Statistics</Text>

                                    <View style={{ alignSelf: "center", }}>
                                        <Icon
                                            active
                                            name="right"
                                            type='antdesign'
                                            color='#D3D3D3'
                                        />
                                    </View>
                                </TouchableOpacity>
                                <View style={styles.lineStyle} />
                            </View>




                            <View>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('transaction')} style={{ flexDirection: 'row', justifyContent: 'center', marginRight: 20, marginLeft: 20, marginTop: 20 }}>
                                    <Avatar
                                        rounded
                                        size="small"
                                        icon={{ name: 'history', type: 'material-community', color: '#000' }}
                                        overlayContainerStyle={{ backgroundColor: '#32a852' }}
                                        onPress={() => console.log("Works!")}
                                        activeOpacity={0.7}
                                        containerStyle={{}}
                                    />
                                    <Text style={{ flex: 1, fontSize: 14, alignSelf: "center", marginLeft: 15, textAlign: 'left', fontWeight: '800', color: "#ffffff", }}> Transaction History</Text>

                                    <View style={{ alignSelf: "center", }}>
                                        <Icon
                                            active
                                            name="right"
                                            type='antdesign'
                                            color='#D3D3D3'
                                        />
                                    </View>
                                </TouchableOpacity>
                                <View style={styles.lineStyle} />
                            </View>




                            <View style={{ marginTop: 20 }}>
                                <TouchableOpacity onPress={() => this.setState({ visible_log_merchant: true })} style={{ flexDirection: 'row', justifyContent: 'center', marginRight: 20, marginLeft: 20, }}>
                                    <Avatar
                                        rounded
                                        size="small"
                                        icon={{ name: 'log-out', type: 'feather', color: '#FFF' }}
                                        overlayContainerStyle={{ backgroundColor: '#0974ed' }}
                                        onPress={() => console.log("Works!")}
                                        activeOpacity={0.7}
                                        containerStyle={{}}
                                    />
                                    <Text style={{ flex: 1, fontSize: 14, alignSelf: "center", marginLeft: 15, textAlign: 'left', fontWeight: '800', color: "#ffffff", }}>Logout</Text>

                                    <View style={{ alignSelf: "center", }}>
                                        <Icon
                                            active
                                            name="right"
                                            type='antdesign'
                                            color='#D3D3D3'
                                        />
                                    </View>
                                </TouchableOpacity>
                                <View style={styles.lineStyle} />
                            </View>

                            <View style={{ marginTop: 20 }}>
                                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', marginRight: 20, marginLeft: 20, }}>
                                    <Avatar
                                        rounded
                                        size="small"
                                        icon={{ name: 'delete', type: 'antdesign', color: '#FFF' }}
                                        overlayContainerStyle={{ backgroundColor: '#05356b' }}
                                        onPress={() => console.log("Works!")}
                                        activeOpacity={0.7}
                                        containerStyle={{}}
                                    />
                                    <Text style={{ flex: 1, fontSize: 14, alignSelf: "center", marginLeft: 15, textAlign: 'left', fontWeight: '800', color: "#ffffff", }}>Deactivate Account</Text>

                                    <View style={{ alignSelf: "center", }}>
                                        <Icon
                                            active
                                            name="right"
                                            type='antdesign'
                                            color='#D3D3D3'
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>


                        </View>


                    </View>

                    <Modal
                        visible={this.state.visible_log_merchant}
                    >
                        <ModalContent style={styles.modal}>
                            <View>

                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', paddingTop: 1, paddingBottom: 10 }}>

                                </View>
                                <View style={styles.delavartar}>
                                    <Avatar
                                        size="large"
                                        icon={{ name: 'log-out', type: 'feather', color: '#FFF' }}
                                        overlayContainerStyle={{ backgroundColor: '#0974ed' }}
                                        onPress={() => console.log("Works!")}
                                        activeOpacity={0.7}
                                        containerStyle={{}}
                                    />
                                </View>


                                <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: 17, textAlign: 'center', paddingBottom: 10, marginTop: 25, }}>Leaving so soon ?</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                    <Button onPress={() => this.handleLogout()} style={styles.modalbuttonContainer} block iconLeft>
                                        <Text style={{ color: '#fdfdfd', fontWeight: '400' }}>Yes </Text>
                                    </Button>
                                    <Button onPress={() => this.setState({ visible_log_merchant: false })} style={styles.modalTansButtonContainer} block iconLeft>
                                        <Text style={{ color: color.button_blue, fontWeight: '400' }}>No </Text>
                                    </Button>
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
    welcome: {
        height: 90,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backgroundImage: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    logo: {
        width: 300,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    slider: {
        backgroundColor: '#fff'
    },
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        margin: 40
    },
    body: {
    },
    lineStyle: {
        height: 0.7,
        marginRight: 20,
        marginLeft: 20,
        marginTop: 12,
        backgroundColor: '#D3D3D3',

    },
    modal: {
        width: Dimensions.get('window').width - 60,

    },
    modalbuttonContainer: {
        backgroundColor: color.slide_color_dark,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 15,
        marginTop: 15,
        marginBottom: 30,
        flex: 1
    },
    modalTansButtonContainer: {
        borderColor: color.button_blue,
        borderWidth: 1,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 15,
        marginTop: 15,
        marginBottom: 30,
        backgroundColor: 'transparent',
        flex: 1
    },

    borderStyleHighLighted: {
        borderColor: "red",
    },
    delavartar: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
    },
});
