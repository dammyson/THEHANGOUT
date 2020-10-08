import React, { Component } from "react";
import { Alert, Dimensions, TouchableOpacity, StatusBar, TextInput, AsyncStorage, StyleSheet, } from "react-native";
import { Container, Content, View, Text, Button, Left, Right, Body, Title, List, ListItem, } from 'native-base';

import { Card, Icon, SocialIcon } from 'react-native-elements'
const URL = require("../../component/server");

import color from '../../component/color';
import Navbar from '../../component/Navbar';
import {
  BarIndicator,
} from 'react-native-indicators';



export default class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      agent_count_array: [1],
      form_data: [],
      titleText: '',
      data: '',
      loading: false,
      done: false,

    };
  }




  componentDidMount() {
    AsyncStorage.getItem('data').then((value) => {
      if (value == '') { } else {
        this.setState({ data: JSON.parse(value) })
        this.setState({ user: JSON.parse(value).user })
      }
    })

    AsyncStorage.getItem('bal').then((value) => {
      if (value == '') { } else {
        this.setState({ bal: value })
      }
    })
  }



  processAddAgent() {

    const { form_data, data } = this.state


    if (form_data.length < 1) {
      Alert.alert('Validation failed', "Fields can not be empty", [{ text: 'Okay' }])
      return
    }


    for (let i = 0; i < form_data.length; i++) {
      if (form_data[i].email == null || form_data[i].email == '') {
        Alert.alert('Validation failed', "FirstName field can not be empty", [{ text: 'Okay' }])
        return
      }
    }
    const payload = this.pluck(form_data, 'email')


    this.setState({ loading: true })
    fetch(URL.url + 'agent/add', {
      method: 'POST', headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Authorization': 'Bearer ' + data.token,
      }, body: JSON.stringify({
        emails: payload,
      }),
    })
      .then(res => res.json())
      .then(res => {
        console.warn(res);
        if (res.status) {

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

  pluck(arr, key) {
    return arr.reduce(function (p, v) {
      return p.concat(v[key]);
    }, []);
  }

  onChangeText(text, i) {
    var instant_array = []
    instant_array = this.state.form_data
    var obj;
    if (instant_array[i] == null) {
      obj = {};


      obj.email = text
      instant_array[i] = obj

    } else {

      obj = instant_array[i];
      obj.email = text
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


  delete(i) {

    var instant_array_count = []
    instant_array_count = this.state.agent_count_array
    instant_array_count.splice(i, 1);
    this.setState({ ticket_count_array: instant_array_count })


    var instant_array = []
    instant_array = this.state.form_data
    instant_array.splice(i, 1);
    this.setState({ form_data: instant_array })

  }

  render() {


    if (this.state.loading) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000000' }}>
          <View style={styles.welcome}>
            <Text style={{ fontSize: 15, color: '#fff' }}>adding agents</Text>
            <BarIndicator count={4} color={color.primary_color} />
            <Text style={{ fontSize: 13, flex: 1, color: '#fff' }}>Please wait...</Text>
          </View>
        </View>
      );
    }

    if (this.state.done) {
      return (
        <Container style={{ backgroundColor: '#000' }}>
          <StatusBar barStyle="dark-content" hidden={false} backgroundColor="transparent" translucent={true} />

          <Navbar left={left} title='' bg='#000' />
          <Content>
            <View style={styles.container}>


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
                  <Text style={{ textAlign: 'center', color: '#fff', fontSize: 12, fontWeight: '200', fontFamily: 'NunitoSans', opacity: 0.8 }}>You've added an agent successfully</Text>
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


    return (
      <Container style={{ backgroundColor: '#000' }}>
        <Navbar left={left} title="Add a new agent" bg='#000' />
        <Content>
          <View style={styles.container}>
            <Text style={styles.titlesubText}>Add a new agent</Text>

            {this.renderAgentForm()}

            <TouchableOpacity onPress={() => this.incrememntTicketCount()} style={{ marginLeft: 20, marginRight: 20, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
              <Icon
                active
                name="plus"
                type='antdesign'
                color='red'
                size={18}
              />
              <Text style={{ marginLeft: 10, fontSize: 12, color: 'red' }}>Add another agent</Text>

            </TouchableOpacity>


            <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20, marginBottom: 20, }}>
              <TouchableOpacity onPress={() => this.processAddAgent()} style={styles.enablebutton} block iconLeft>
                <Text style={{ color: '#000', marginTop: 10, marginBottom: 10, fontSize: 16, fontWeight: '200', fontFamily: 'NunitoSans', }}>Continue</Text>
              </TouchableOpacity>
            </View>

            <View style={{ backgroundColor: '#8d96a6', height: 1, margin: 20, }} />


            <View style={{ alignItems: 'flex-start', justifyContent: 'center', margin: 20, }}>
              <Text style={{ color: '#fff', marginTop: 10, marginBottom: 10, fontSize: 16, fontFamily: 'NunitoSans-bold', }}>CHOOSE FROM PREVIOUS</Text>
            </View>

          </View>
        </Content>
      </Container>
    );
  }

  renderAgentForm() {
    let items = [];
    for (let i = 0; i < this.state.agent_count_array.length; i++) {

      items.push(
        <View style={styles.item}>

          <TextInput
            placeholder="Enter agent email"
            placeholderTextColor='#8d96a6'
            returnKeyType="next"
            onSubmitEditing={() => this.nextStep()}
            keyboardType='default'
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.menu}
            onChangeText={text => this.onChangeText(text, i)}
          />

          <TouchableOpacity onPress={() => this.delete(i)} style={{ marginLeft: 20, marginRight: 20, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
            <Icon
              active
              name="close"
              type='antdesign'
              color='red'
              size={18}
            />


          </TouchableOpacity>

        </View>


      );
    };
    return items;
  }
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 80,
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
    marginTop: 2,
    margin: 15,
    borderColor: '#5F5C7F',
    borderBottomWidth: 2,
    alignItems: 'center',
    paddingRight: 15,
    marginLeft: 20,
    marginRight: 20
  },
  menu: {
    flex: 1,
    marginRight: 13,
    marginLeft: 13,
    fontSize: 20,
    color: '#ffffff',
    textAlign: 'left',
    fontFamily: 'NunitoSans-Bold'
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
  nextContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',

    paddingBottom: 20
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
  welcome: {
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
});