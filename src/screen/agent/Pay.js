import React, { Component } from "react";
import { Alert, Dimensions, TouchableOpacity, Image, StatusBar, TextInput, StyleSheet, AsyncStorage, ScrollView } from "react-native";
import { Container, Content, View, Text, Button, Left, Right, Body, Title, List, ListItem, } from 'native-base';

import { Card, Icon, SocialIcon, Avatar } from 'react-native-elements'
const URL = require("../../component/server");
import color from '../../component/color';
import Navbar from '../../component/Navbar';
import {
    BarIndicator,
} from 'react-native-indicators';

export default class Pay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: '',
            bal: 0,
            images_list: [],
            user: {},
            form_data: [],
            loading: true,
            done: false,
            general_amount: ''
        };
    }




    componentDidMount() {
        AsyncStorage.getItem('data').then((value) => {
            if (value == '') { } else {
                this.setState({ data: JSON.parse(value) })
                this.setState({ user: JSON.parse(value).user })
            }

            this.getAgentsRequest()
        })

        AsyncStorage.getItem('bal').then((value) => {
            if (value == '') { } else {
                this.setState({ bal: value })
            }
        })
    }


    getAgentsRequest() {
        const { data, user } = this.state


        fetch(URL.url + 'agent/all', {
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
                        loading: false,
                        images_list: res.data
                    })
                } else {
                    this.setState({
                        nodate: true,
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


    processPayAgent() {

        const { form_data, data } = this.state
        console.warn(form_data);

        if (form_data.length < 1) {
            Alert.alert('Validation failed', "Fields can not be empty", [{ text: 'Okay' }])
            return
        }

        var all = [];
        for (let i = 0; i < form_data.length; i++) {
            if (form_data[i].amount == null || form_data[i].amount == '') {
                Alert.alert('Validation failed', "FirstName field can not be empty", [{ text: 'Okay' }])
                return
            }
        }

        this.setState({ loading: true })
        fetch(URL.url + 'agent/pay', {
            method: 'POST', headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': 'Bearer ' + data.token,
            }, body: JSON.stringify({
                agentPayments: form_data,
            }),
        })
            .then(res => res.json())
            .then(res => {
                console.warn(res);
                if (res.status) {
                    AsyncStorage.setItem('bal', this.currencyFormat(res.data.balance));
                    this.setState({ loading: false, done: true })


                } else {
                    Alert.alert('Process failed', res.message, [{ text: 'Okay' }])
                    this.setState({ loading: false })
                }
            }).catch((error) => {
                console.warn(error);
                this.setState({ loading: false })
                alert(error.message);
            });
    }


    processPayALLAgent() {

        const { images_list, data, general_amount } = this.state


        if (images_list.length < 1 || general_amount == "") {
            Alert.alert('Validation failed', "Fields can not be empty", [{ text: 'Okay' }])
            return
        }

        var all = []
        for (let i = 0; i < images_list.length; i++) {
            all.push({ id: images_list[i].id, amount: general_amount })
        }

        console.warn(all)

        this.setState({ loading: true })
        fetch(URL.url + 'agent/pay', {
            method: 'POST', headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': 'Bearer ' + data.token,
            }, body: JSON.stringify({
                agentPayments: all,
            }),
        })
            .then(res => res.json())
            .then(res => {
                console.warn(res);
                if (res.status) {
                    AsyncStorage.setItem('bal', this.currencyFormat(res.data.balance));
                    this.setState({ loading: false, done: true })


                } else {
                    Alert.alert('Process failed', res.message, [{ text: 'Okay' }])
                    this.setState({ loading: false })
                }
            }).catch((error) => {
                console.warn(error);
                this.setState({ loading: false })
                alert(error.message);
            });

    }

    currencyFormat(n) {
        return n.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    }

    onChangeText(text, i) {
        const { images_list } = this.state
        var instant_array = []
        instant_array = this.state.form_data

        var obj;
        if (instant_array[i] == null) {
            obj = {};
            obj.amount = text
            obj.id = images_list[i].id
            instant_array[i] = obj

        } else {
            obj = instant_array[i];
            obj.amount = text
            obj.id = images_list[i].id
            instant_array[i] = obj
        }



        this.setState({ form_data: instant_array })
    }



    incrememntTicketCount() {
        var instant_array_count = []
        instant_array_count = this.state.agent_count_array
        instant_array_count.push(instant_array_count.length + 1);
        this.setState({ agent_count_array: instant_array_count })
    }


  

    render() {


        if (this.state.loading) {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000000' }}>
                    <View style={styles.welcome}>
                        <Text style={{ fontSize: 15, color: '#fff' }}>Fetching all your goodies</Text>
                        <BarIndicator count={4} color={color.primary_color} />
                        <Text style={{ fontSize: 13, flex: 1, color: '#fff' }}>Please wait...</Text>
                    </View>
                </View>
            );
        }


        var left = (
            <Left style={{ flex: 1 }}>
                <Button transparent onPress={() => this.props.navigation.goBack()}>
                    <Icon
                        active
                        name="close"
                        type='antdesign'
                        color='#FFF'
                    />
                </Button>
            </Left>
        );


        if (this.state.done) {
            return (
                <Container style={{ backgroundColor: '#000' }}>
                    <StatusBar barStyle="dark-content" hidden={false} backgroundColor="transparent" translucent={true} />

                    <Navbar left={left} title='' bg='#000' />
                    <Content>
                        <View style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height, }}>


                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

                                <View style={{ alignItems: 'center', margin: 20, }}>
                                    <TouchableOpacity style={{ backgroundColor: 'green', height: 74, width: 74, borderRadius: 37, justifyContent: 'center', alignItems: 'center', }}>
                                        <Icon
                                            active
                                            name="md-checkmark"
                                            type='ionicon'
                                            color='#fff'
                                            size={34}
                                        />
                                    </TouchableOpacity>

                                    <Text style={{ color: '#fff', fontSize: 22, fontWeight: '200', fontFamily: 'NunitoSans-Bold', }}>Success</Text>
                                    <Text style={{ textAlign: 'center', color: '#fff', fontSize: 12, fontWeight: '200', fontFamily: 'NunitoSans', opacity: 0.8 }}>You've Paid agents successfully</Text>
                                </View>




                                <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20, marginBottom: 20, }}>
                                    <TouchableOpacity onPress={() => [this.setState({ done: false }), this.props.navigation.goBack()]} style={styles.enablebutton} block iconLeft>
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
                <Navbar left={left} title="Pay your agents" bg='#000' />
                <Content>
                    <View style={styles.container}>



                        <View style={{ flexDirection: 'row', backgroundColor: '#fff', marginTop: 24, marginBottom: 24, marginLeft: 20, marginRight: 20, borderRadius: 5 }}>
                            <View style={{ marginLeft: 20, flex: 1, alignItems: 'flex-start', marginTop: 10, marginBottom: 10 }}>
                                <Text style={{ color: '#000', fontSize: 16, fontWeight: '200', fontFamily: 'NunitoSans-Bold', }}>₦ {this.state.bal}</Text>
                                <Text style={{ color: '#000', fontSize: 12, fontFamily: 'NunitoSans', opacity: 0.77 }}>My Wallet Balance</Text>

                            </View>
                            <View style={{ alignItems: 'flex-start', marginTop: 10, marginBottom: 10, marginRight: 15 }}>
                                <TouchableOpacity onPress={() => this.props.navigation.naviagete('withdraw')} style={{ backgroundColor: 'green', alignItems: 'center', alignContent: 'space-around', paddingLeft: 13.5, paddingRight: 13.5, borderRadius: 5, }} block iconLeft>
                                    <Text style={{ color: "#fff", marginTop: 7, marginBottom: 7, fontSize: 16, fontWeight: '200', fontFamily: 'NunitoSans', opacity: 0.77 }}>Withdraw Fund</Text>
                                </TouchableOpacity>
                            </View>
                        </View>


                        {this.state.images_list.length ?
                            <View>
                                <View style={styles.main_content}>
                                    <Text style={{ marginLeft: 20, color: '#fff', marginTop: 10, marginBottom: 10, fontSize: 16, fontFamily: 'NunitoSans-bold', }}>Quick Payment</Text>
                                    <View onPress={() => this.incrememntTicketCount()} style={{ marginRight: 20, flexDirection: 'row', }}>
                                        <Text style={{ marginLeft: 20, fontSize: 10, color: '#FFF', opacity: 0.7 }}>Send equal amount to multiple agents</Text>
                                    </View>

                                    <View style={styles.item}>

                                        <TextInput
                                            placeholder="Enter amount"
                                            placeholderTextColor='#8d96a6'
                                            returnKeyType="next"
                                            onSubmitEditing={() => this.processPayALLAgent()}
                                            keyboardType='numeric'
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            style={styles.menu}
                                            onChangeText={text => this.setState({ general_amount: text })}
                                        />


                                    </View>


                                    <View onPress={() => this.incrememntTicketCount()} style={{ marginRight: 20, flexDirection: 'row', }}>
                                        <Text style={{ marginLeft: 20, fontSize: 11, color: '#FFF', opacity: 1 }}>Select agents</Text>
                                    </View>

                                    <ScrollView horizontal style={{ marginRight: 20, marginLeft: 20, marginBottom: 20, marginTop: 15 }}>
                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('agent_create')} style={{ height: 80, width: 80, borderRadius: 5, backgroundColor: '#5F5C7F', borderWidth: 1, alignItems: 'center', justifyContent: 'center' }}>

                                            <Icon
                                                active
                                                name="plus-circle"
                                                type='material-community'
                                                color='#FFF'
                                                size={30}
                                            />
                                            <Text style={{ color: '#fff', textAlign: 'center', fontSize: 12, fontFamily: 'NunitoSans', opacity: 0.77 }}>Add A New Agent</Text>
                                        </TouchableOpacity>
                                        {this.renderResuts(this.state.images_list)}
                                    </ScrollView>

                                    <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20, marginBottom: 20, }}>
                                        <TouchableOpacity onPress={() => this.processPayALLAgent()} style={styles.greenbutton} block iconLeft>
                                            <Text style={{ color: '#fff', marginTop: 10, marginBottom: 10, fontSize: 12, fontWeight: '200', fontFamily: 'NunitoSans', }}>Pay Agents</Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>

                                {this.renderAgents(this.state.images_list)}

                                <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20, marginBottom: 20, }}>
                                    <TouchableOpacity onPress={() => this.processPayAgent()} style={styles.enablebutton} block iconLeft>
                                        <Text style={{ color: '#000', marginTop: 10, marginBottom: 10, fontSize: 16, fontWeight: '200', fontFamily: 'NunitoSans', }}>Pay</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                            :

                            <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20, marginBottom: 20, }}>
                                <Text style={[styles.titlesubText, { marginBottom: 20 }]}>You do not have any agent at the moment</Text>
                                <TouchableOpacity onPress={() => this.props.navigation.replace('agent_create')} style={styles.enablebutton} block iconLeft>
                                    <Text style={{ color: '#000', marginTop: 10, marginBottom: 10, fontSize: 16, fontWeight: '200', fontFamily: 'NunitoSans', }}>Add Agent</Text>
                                </TouchableOpacity>
                            </View>

                        }


                    </View>
                </Content>
            </Container>
        );
    }

    renderResuts(data) {

        let cat = [];
        for (var i = 0; i < data.length; i++) {
            let r = i;
            cat.push(

                <View>
                    <View style={{ backgroundColor: '#fff', height: 80, width: 80, marginLeft: 10, marginRight: 10, borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>

                        <Avatar
                            rounded
                            source={{
                                uri: data[i].imageUrl

                            }}
                            overlayContainerStyle={{ backgroundColor: 'white', borderColor: color.primary_color, borderWidth: 2 }}
                        />
                        <Text style={{ color: '#000', textAlign: 'center', fontSize: 12, fontFamily: 'NunitoSans', opacity: 0.77 }}>{data[i].name}</Text>
                    </View>

                </View>

            );
        }
        return cat;
    }

    renderAgents(data) {

        let cat = [];
        for (var i = 0; i < data.length; i++) {
            let id = i;
            cat.push(

                <View style={{ paddingLeft: 10, backgroundColor: '#fff', height: 90, marginTop: 10, paddingBottom: 10, paddingTop: 13, marginLeft: 20, marginRight: 20, borderRadius: 5, flexDirection: 'row' }}>
                    <Image
                        style={styles.logo}
                        source={{
                            uri: data[i].imageUrl
                        }}
                        overlayContainerStyle={{ marginLeft: 10, backgroundColor: 'white', borderColor: color.primary_color, borderWidth: 2, }}
                    />
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: '#000', marginLeft: 20, fontSize: 12, fontFamily: 'NunitoSans', opacity: 0.77 }}>{data[i].name}</Text>

                        <View style={styles.item_two}>
                            <TextInput
                                placeholder="Enter amount"
                                placeholderTextColor='#8d96a6'
                                returnKeyType="next"
                                onSubmitEditing={() => this.nextStep()}
                                keyboardType='numeric'
                                autoCapitalize="none"
                                autoCorrect={false}
                                style={styles.menu_two}
                                onChangeText={text => this.onChangeText(text, id)}
                            />


                        </View>
                    </View>
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
        fontSize: 13,
        color: '#8d96a6',
        marginTop: 25,
        marginLeft: 15,
        fontFamily: 'NunitoSans-Bold'
    },
    item: {
        flexDirection: 'row',
        marginTop: 10,
        margin: 15,
        borderColor: '#5F5C7F',
        borderWidth: 2,
        alignItems: 'center',
        paddingRight: 15,
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 5
    },
    menu: {
        height: 40,
        marginRight: 13,
        marginLeft: 13,
        fontSize: 12,
        color: '#fff',
        textAlign: 'left',
        fontFamily: 'NunitoSans-Bold',
        flex: 1
    },
    qrbuttonContainer: {
        flexDirection: 'row',
        backgroundColor: color.white,
        marginTop: 1,
        borderRadius: 40,
        padding: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,

    },
    main_content: {
        marginTop: 20,
        marginRight: 10,
        marginLeft: 10,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#101023'

    },
    enablebutton: {
        backgroundColor: '#F7A400',
        alignItems: 'center',
        alignContent: 'space-around',
        paddingLeft: 53,
        paddingRight: 53,
        borderRadius: 5,
        marginLeft: 30,
        marginRight: 30,
    },
    greenbutton: {
        backgroundColor: '#139F2A',
        alignItems: 'center',
        alignContent: 'space-around',
        paddingLeft: 25,
        paddingRight: 25,
        borderRadius: 5,
        marginLeft: 30,
        marginRight: 30,
    },
    item_two: {
        flexDirection: 'row',
        borderColor: '#5F5C7F',
        borderWidth: 2,
        alignItems: 'center',
        paddingRight: 15,
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 5,
        marginTop: 5
    },
    menu_two: {
        height: 35,
        marginRight: 13,
        marginLeft: 13,
        fontSize: 12,
        color: '#000',
        textAlign: 'left',
        fontFamily: 'NunitoSans-Bold',
        flex: 1

    },
    logo: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        borderRadius: 6,
        borderWidth: 2,
        borderColor: color.primary_color,
    },
    welcome: {
        height: 90,
        alignItems: 'center',
        justifyContent: 'center',
    },
});