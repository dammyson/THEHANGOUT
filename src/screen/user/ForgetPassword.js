// React native and others libraries imports
import React, { Component } from 'react';
import { Alert, TextInput, ImageBackground, View, Dimensions, ActivityIndicator, Image, StyleSheet , AsyncStorage, TouchableOpacity} from 'react-native';
import { Container, Content, Text, Icon, Button, Left, } from 'native-base';
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


export default class ForgetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      loading: false,
      email: '',
      password: '',
      enter_code:false
     // gettingLoginStatus: true,
    };
  }

  componentDidMount() {
   
    
  }


 
  buttonClickAction() {
    const {enter_code } = this.state
    if (enter_code) {
        this.continueProcessing();
    }else{
        this.startProcessing();
    }
  }

  startProcessing(){
    const {email } = this.state
      console.warn(URL.url + 'passwordreset/send-otp?email=' + email);
    this.setState({ loading: true })
    fetch(URL.url + 'passwordreset/send-otp?email=' + email, {
      method: 'GET', headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then(res => res.json())
      .then(res => {
        console.warn(res)
        if (res.status) {
          this.setState({ loading: false, enter_code: true })
          Toast.show({
            text: 'Code has been sent to your mail !',
            position: 'bottom',
            type: 'success',
            buttonText: 'Dismiss',
            duration: 2500
        });
          
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


  continueProcessing(){
  
    const {email, code } = this.state

    this.setState({ loading: true })
    fetch(URL.url + 'passwordreset/verify-otp?email=' + email+'&otp='+code, {
      method: 'GET', headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then(res => res.json())
      .then(res => {
        if (res.status) {
          this.setState({ loading: false })
          this.props.navigation.replace('change_password', {token: res.data});
          
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
              <Text style={{ color: '#FFF', margin: 20,fontFamily:'NunitoSans-ExtraBold', fontSize: 25, }}>HELLO! </Text>
              <View style={styles.bottom}>
                <View style={{ flexDirection: "row", margin: 20, }}>
                  <Text style={{ color: "#000", fontFamily:'NunitoSans-Bold', fontSize: 20, flex: 1 }}>Forgot Password?</Text>
                  <TouchableOpacity onPress={()=> goBack()} style={styles.circlet} >
                    <Text style={{ color: "#FFFFFF", fontWeight: '900', fontSize: 16, }}>X</Text>
                  </TouchableOpacity>

                </View>
                <Text style={styles.actionbutton}>Email</Text>
                <TextInput
                  placeholder="Enter your email address"
                  placeholderTextColor='#3E3E3E'
                  returnKeyType="next"
                  keyboardType='email-address'
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.input}
                  inlineImageLeft='ios-call'
                  onChangeText={text => this.setState({ email: text })}
                />

                {this.state.enter_code ? <View>
                    
                    <Text style={styles.actionbutton}>Code</Text>
                <TextInput
                  placeholder="Enter code sent to your mail"
                  placeholderTextColor='#3E3E3E'
                  returnKeyType="next"
                  keyboardType='email-address'
                  onSubmitEditing={() => this.buttonClickAction()}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.input}
                  inlineImageLeft='ios-call'
                  onChangeText={text => this.setState({ code: text })}
                />
                </View> : null}
               
                {
                  this.state.loading ?
                    <View>
                      <Button style={styles.buttonContainer} block iconLeft>
                        <BarIndicator count={4} color={color.primary_color} />
                      </Button>
                    </View>
                    :
                    <View>
                      <Button onPress={() => this.buttonClickAction()} style={styles.buttonContainer} block iconLeft>
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



