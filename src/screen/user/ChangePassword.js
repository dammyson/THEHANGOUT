// React native and others libraries imports
import React, { Component } from 'react';
import { Alert, TextInput, ImageBackground, View, Dimensions, ActivityIndicator, Image, StyleSheet, TouchableOpacity} from 'react-native';
import { Container, Content, Text, Icon, Toast, Button, Left, } from 'native-base';
import {
  BarIndicator,
} from 'react-native-indicators';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';
const URL = require("../../component/server");

import Navbar from '../../component/Navbar';
import color from '../../component/color';


export default class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      loading: false,
      confirm_password: '',
      password: '',
      token:'llll'
     
    };
  }

  componentDidMount() {
   const {token} = this.props.route.params;
   console.warn(token)
   this.setState({token: token}) 
  }



  changePassword(){

    const {confirm_password, token, password}=this.state

    if(confirm_password !== password){
        Alert.alert('Login failed', 'Passwords does not match', [{ text: 'Okay' }])
                return
    }

     console.warn(URL.url+ 'passwordreset/');
    this.setState({ loading: true })
    fetch(URL.url + 'passwordreset/', {
      method: 'POST', headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Authorization': 'Bearer ' + token,
      }, body: JSON.stringify({
        password: password,
       
      }),
    })
      .then(res => res.json())
      .then(res => {
          console.warn(res)
        if (res.status) {
            Toast.show({
                text: 'Password change was successful !',
                position: 'bottom',
                type: 'success',
                buttonText: 'Dismiss',
                duration: 2500
            });
          this.setState({ loading: false })
          this.props.navigation.goBack();
        
        } else {
          Alert.alert('Operation failed', res.message, [{ text: 'Okay' }])
          this.setState({ loading: false })
        }
      }).catch((error) => {
        this.setState({ loading: false })
        console.warn(error);
        alert(error.message);
      });

  }



  

  render() {
    const { state, goBack } = this.props.navigation;
    var left = (
      <Left style={{ flex: 1 }}>
        <Button transparent onPress={() => goBack(null)}>
          <Icon name='ios-arrow-back' size={30} style={{ color: '#fdfdfd' }} />
        </Button>
      </Left>
    );

    if (this.state.gettingLoginStatus) {
      return (
        <View style={styles.gcontainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
    if (this.state.userInfo != null) {

    }
    return (
      
      <ImageBackground
        source={require('../../assets/backgd.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <Container style={{ backgroundColor: 'transparent' }}>
          <Navbar left={left} title="" />
          <Content>
            <View style={styles.body}>
              <View style={styles.top}>
                <Image
                  style={styles.logo}
                  source={require('../../assets/logo.png')} />
              </View>
              <Text style={{ color: '#FFF', margin: 20, fontFamily:'NunitoSans-Bold', fontWeight: '900', fontSize: 25, }}>HELLO! </Text>
              <View style={styles.bottom}>
                <View style={{ flexDirection: "row", margin: 20, }}>
                  <Text style={{ color: "#000", fontWeight: '500', fontSize: 20, flex: 1 }}>Change Password</Text>
                  <TouchableOpacity onPress={()=> goBack()} style={styles.circlet} >
                    <Text style={{ color: "#FFFFFF", fontWeight: '900', fontSize: 16, }}>X</Text>
                  </TouchableOpacity>

                </View>
                <Text style={styles.actionbutton}>Password</Text>
                <TextInput
                  placeholder="Enter your New Password"
                  placeholderTextColor='#3E3E3E'
                  secureTextEntry
                  returnKeyType="next"
                  onSubmitEditing={() => this.passwordInput.focus()}
                  keyboardType='password'
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.input}
                  inlineImageLeft='ios-call'
                  onChangeText={text => this.setState({ password: text })}
                />

                <Text style={styles.actionbutton}>Confirm Password</Text>
                <TextInput
                  placeholder="Confirm Your New Password"
                  placeholderTextColor='#3E3E3E'
                  secureTextEntry
                  returnKeyType="next"
                  onSubmitEditing={() => this.changePassword()}
                  keyboardType='password'
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.input}
                  inlineImageLeft='ios-call'
                  onChangeText={text => this.setState({ confirm_password: text })}
                  ref={(input)=> this.passwordInput = input}
                />
               
                {
                  this.state.loading ?
                    <View>
                      <Button style={styles.buttonContainer} block iconLeft>
                        <BarIndicator count={4} color={color.primary_color} />
                      </Button>
                    </View>
                    :
                    <View>
                      <Button onPress={() => this.changePassword()} style={styles.buttonContainer} block iconLeft>
                        <Text style={{ color: '#fdfdfd', fontWeight: '600' }}>Proceed </Text>
                      </Button>
                    </View>
                }

              
              </View>

            </View>
          </Content>
        </Container>
      </ImageBackground>
    );
  }





}
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  gcontainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  body: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  buttonContainer: {
    backgroundColor: '#000000',
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 1,
    marginTop: 20,
  },
  whiteButtonContainer: {
    backgroundColor: '#FFFFFF',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    borderRadius: 1,
  },
  top: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  bottom: {
    flex: 4,
    backgroundColor: color.primary_color
  },
  input: {
    height: 40,
    color: '#3E3E3E',
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
    borderBottomColor: '#000000',
    borderBottomWidth: 0.2,
    marginTop: 1,
    fontFamily:'NunitoSans-Regular',
  },
  actionbutton: {
    marginTop: 2,
    marginRight: 13,
    marginLeft: 20,
    fontSize: 12,
    color: '#3E3E3E',
    textAlign: 'left',
    fontWeight: '200',
    fontFamily:'NunitoSans-Bold',
  },
  inputContainer: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: 'center',
    marginLeft: 20,
    marginRight: 20,
  },
  countryCode: {
    borderBottomColor: '#3E3E3E',
    borderBottomWidth: 1,
    flexDirection: "row",
  },
  lineStyle: {
    height: 0.2,
    flex: 1,
    marginTop: 20,
    backgroundColor: '#000000',

  },
  circlet: {
    width: 30,
    height: 30,
    backgroundColor: '#000000',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },
  logo: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    resizeMode: 'contain'
  }
});



