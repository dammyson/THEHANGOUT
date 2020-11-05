
import React, { Component } from 'react';
import { Platform, StyleSheet, AsyncStorage, Image, Dimensions, TouchableOpacity } from 'react-native';
import { Container, Content, View, Text, Button, Left, Right, Body, Title, List, ListItem, Thumbnail, Grid, Col, Separator } from 'native-base';

import { Avatar, Badge, } from 'react-native-elements';
import { Icon, } from 'react-native-elements'
import color from '../../component/color';

import Navbar from '../../component/Navbar';
import Modal, { ModalContent } from 'react-native-modals';
import { getData } from '../../component/utilities';

export default class Manage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: '',
            user: { profilePicture: 'll' },
            visible_log_merchant: false

        };
    }


    async componentWillMount() {
        this.setState({
            data: JSON.parse(await getData()),
            user: JSON.parse(await getData()).user
        })

    }

    logOut() {
        try {
            this.setState({ visible_log_merchant: false })
            AsyncStorage.removeItem('login');
            AsyncStorage.removeItem('data');
            AsyncStorage.removeItem('bal');
            AsyncStorage.removeItem('user');
            setTimeout(() => {
                this.props.navigation.replace('intro')
            }, 2000);
            return true;
        }
        catch (exception) {
            return false;
        }

    }

    render() {
        const { user } = this.state

        var left = (
            <Left style={{ flex: 1 }}>
                <Button transparent onPress={() => this.props.navigation.navigate('profile')}>
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
                        name="notifications-active"
                        type='material-icons'
                        color='#FFF'
                    />
                </Button>
            </Right>
        );

        return (
            <Container style={{ backgroundColor: color.secondary_color }}>
                <Navbar left={left} right={right} title="Manage" bg='#101023' />
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
                                    icon={{ name: 'user-circle', color: 'white', type: 'font-awesome' }}
                                    overlayContainerStyle={{ backgroundColor: 'white', borderColor: color.primary_color, borderWidth: 2 }}
                                    editButton={{ name: 'pluscircle', type: 'antdesign', color: color.primary_color, underlayColor: '#000' }}
                                />
                                

                            </View>
                            <Text style={{ fontSize: 14, margin: 15, marginTop: 10, textAlign: 'left', fontWeight: '800', color: "#ffffff", }}>{user.userName}</Text>
                            <Text style={{ fontSize: 11, marginTop: 1, textAlign: 'left', fontWeight: '200', color: "#ffffff", }}>Manage all your activities here</Text>

                        </View>


                        <View style={styles.body}>
                            <View>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('withdraw')} style={{ flexDirection: 'row', justifyContent: 'center', marginRight: 20, marginLeft: 20, }}>
                                    <Avatar
                                        rounded
                                        size="small"
                                        icon={{ name: 'wallet-outline', type: 'material-community', color: '#fff' }}
                                        overlayContainerStyle={{ backgroundColor: color.green }}
                                        onPress={() => console.log("Works!")}
                                        activeOpacity={0.7}
                                        containerStyle={{}}
                                    />
                                    <Text style={{ flex: 1, fontSize: 14, alignSelf: "center", marginLeft: 15, textAlign: 'left', fontWeight: '800', color: "#ffffff", }}> Withdraw from wallet</Text>

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

                            <View style={{ marginTop: 20, }}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('transaction')} style={{ flexDirection: 'row', justifyContent: 'center', marginRight: 20, marginLeft: 20, }}>
                                    <Avatar
                                        rounded
                                        size="small"
                                        icon={{ name: 'update', type: 'material-community', color: '#fff' }}
                                        overlayContainerStyle={{ backgroundColor: '#05356b' }}
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
                                <View style={{ flexDirection: 'row', justifyContent: 'center', marginRight: 20, marginLeft: 20, }}>
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
                                </View>
                            </View>

                        </View>



                    </View>

                    <Modal
                        visible={this.state.visible_log_merchant}
                    >
                        <ModalContent style={styles.modal}>
                            <View>

                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', paddingTop: 1, paddingBottom: 10 }}>
                                    <TouchableOpacity onPress={() => this.setState({ visible_log_merchant: false })} style={{ marginLeft: 10, backgroundColor: '#000' }}>
                                        <Icon
                                            name="close"
                                            size={20}
                                            type='antdesign'
                                            color="#fff"
                                        />
                                    </TouchableOpacity>

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
                                    <Button onPress={() => this.logOut()} style={styles.modalbuttonContainer} block iconLeft>
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
        height: 0.9,
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
