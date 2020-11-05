import React, { Component } from 'react';
import { Alert, TextInput, AsyncStorage,ImageBackground, View, Dimensions, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Container, Content, Text, Icon, Button, Left, Right, Body, Title, List, ListItem, Thumbnail, Grid, Col } from 'native-base';
import {
  BarIndicator,
} from 'react-native-indicators';
const URL = require("../../component/server");
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from  '@react-native-community/google-signin';
import Navbar from '../../component/Navbar';
import color from '../../component/color';
import { getToken } from '../../component/utilities';



export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      loading: false,
      email: '',
      phone: '',
      password: '',
      name: '',
      role: 'Customer',
      userInfo: null,
      gettingLoginStatus: true,
      token:''
    };
  }


  async componentDidMount() {
    this.setState({token: await getToken() })
    console.warn( await getToken())
    //initial configuration
    GoogleSignin.configure({
      //It is mandatory to call this method before attempting to call signIn()
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      // Repleace with your webClientId generated from Firebase console
      webClientId: '823628556250-7nebjfacok8lcef9brdfe7j69i6u9uc1.apps.googleusercontent.com',
    });
    //Check if user is already signed in
    //this._isSignedIn();

    
  }

  currencyFormat(n) {
    return  n.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
 }

  _isSignedIn = async () => {
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (isSignedIn) {
      alert('User is already signed in');
      //Get the User details as user is already signed in
      this._getCurrentUserInfo();
    } else {
      //alert("Please Login");
      console.log('Please Login');
    }
    this.setState({ gettingLoginStatus: false });
  };

  _getCurrentUserInfo = async () => {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      console.log('User Info --> ', userInfo);
      this.setState({ userInfo: userInfo });
      this._signInRequest(userInfo.user);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        alert('User has not signed in yet');
        console.log('User has not signed in yet');
      } else {
        alert("Something went wrong. Unable to get user's info");
        console.log("Something went wrong. Unable to get user's info");
      }
    }
  };

  _signIn = async () => {
    //Prompts a modal to let the user sign in into your application.
    try {
      await GoogleSignin.hasPlayServices({
        //Check if device has Google Play Services installed.
        //Always resolves to true on iOS.
        showPlayServicesUpdateDialog: true,
      });
      const userInfo = await GoogleSignin.signIn();
      console.warn('User Info --> ', userInfo);
      this._signInRequest(userInfo.user);
    } catch (error) {
      console.warn('Message', error.message);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.warn('User Cancelled the Login Flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.warn('Signing In');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.warn('Play Services Not Available or Outdated');
      } else {
        console.warn('Some Other Error Happened');
      }
    }
  };

  _signOut = async () => {
    //Remove user session from the device.
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      this.setState({ userInfo: null }); // Remove the user from your app's state as well
    } catch (error) {
      console.error(error);
    }
  };



  _signInRequest(user){
    const { role, token } = this.state
     console.warn(URL.url);
    this.setState({ loading: true })
    fetch(URL.url + 'users/register', {
      method: 'POST', headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }, body: JSON.stringify({
        Firstname: user.givenName,
        Username: user.email,
        Phone: '',
        Password: user.email,
        Token:token,
        Lastname: user.familyName,
        ProfilePicture: user.photo,
        Role: role,

      }),
    })
      .then(res => res.json())
      .then(res => {

        if (res.status) {
          this.setState({ loading: false })
          AsyncStorage.setItem('login', 'true');
          AsyncStorage.setItem('data', JSON.stringify(res));
          AsyncStorage.setItem('bal', this.currencyFormat(res.balance));
          AsyncStorage.setItem('social', JSON.stringify(false));
          AsyncStorage.setItem('role', res.user.role);
          AsyncStorage.setItem('token', res.token);
          AsyncStorage.setItem('user',  JSON.stringify(res.user));
          this.props.navigation.navigate('category')
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

  processRegistration() {

    const { email, password, name, role, phone, token } = this.state
    console.warn(email, password, name, role);


    if (email == "" || password == "") {
      Alert.alert('Validation failed', 'field(s) cannot be empty', [{ text: 'Okay' }])
      return
    }
    this.setState({ loading: true })
    console.warn(URL.url + 'register');

    fetch(URL.url + 'users/register', {
      method: 'POST', headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }, body: JSON.stringify({
        Firstname:name,
        Username: email,
        Phone: phone,
        Password: password,
        Token: token,
        Role: role,
      }),
    })
      .then(res => res.json())
      .then(res => {
        console.warn(res);
        if (res.status) {
          this.setState({ loading: false })
          AsyncStorage.setItem('login', 'true');
          AsyncStorage.setItem('data', JSON.stringify(res));
          AsyncStorage.setItem('bal', this.currencyFormat(res.balance));
          AsyncStorage.setItem('social', JSON.stringify(false));
          AsyncStorage.setItem('role', res.user.role);
          AsyncStorage.setItem('token', res.token);
          AsyncStorage.setItem('user',  JSON.stringify(res.user));
          this.props.navigation.navigate('category');
        } else {
          Alert.alert('Registration failed', res.message, [{ text: 'Okay' }])
          this.setState({ loading: false })
        }
      }).catch((error) => {
        this.setState({ loading: false })
        console.warn(error);
        alert(error.message);
      });

  }

  currencyFormat(n) {
    return  n.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
 }



  render() {
    var left = (
      <Left style={{ flex: 1 }}>
        <Button transparent onPress={() => this.props.navigation.goBack()}>
          <Icon name='ios-arrow-back' size={30} style={{ color: '#fdfdfd' }} />
        </Button>
      </Left>
    );
    return (
      <ImageBackground
        source={require('../../assets/backgd.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
         <Container style={{ backgroundColor: 'transparent' }}>

          <Content>
        <View style={styles.body}>
          <View style={styles.top}>
            <Image
              style={styles.logo}
              source={require('../../assets/logo.png')} />
          </View>
          <Text style={{ color: '#FFF', margin: 15,fontFamily:'NunitoSans-ExtraBold',  fontSize: 25, }}>HELLO! </Text>
          <View style={styles.bottom}>
            <View style={{ flexDirection: "row", margin: 10, }}>
              <Text style={{ color: "#000", fontFamily:'NunitoSans-Bold', fontSize: 20, flex: 1 }}>LET'S GET STARTED</Text>
              <TouchableOpacity onPress={()=> this.props.navigation.goBack()}  style={styles.circlet} >
                <Text style={{ color: "#FFFFFF", fontWeight: '900', fontSize: 16, }}>X</Text>
              </TouchableOpacity>

            </View>
            <Text style={styles.actionbutton}>Name</Text>
            <TextInput
              placeholder="Enter your Name"
              placeholderTextColor='#3E3E3E'
              returnKeyType="next"
              onSubmitEditing={() => this.emailInput.focus()}
              keyboardType='email-address'
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
              inlineImageLeft='ios-call'
              onChangeText={text => this.setState({ name: text })}
            />
            <Text style={styles.actionbutton}>Email</Text>
            <TextInput
              placeholder="Enter your email address"
              placeholderTextColor='#3E3E3E'
              returnKeyType="next"
              onSubmitEditing={() => this.phoneInput.focus()}
              keyboardType='email-address'
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
              inlineImageLeft='ios-call'
              onChangeText={text => this.setState({ email: text })}
              ref={(input)=> this.emailInput = input}
            />
             <Text style={styles.actionbutton}>Phone</Text>
            <TextInput
              placeholder="Enter your phone number"
              placeholderTextColor='#3E3E3E'
              returnKeyType="next"
              onSubmitEditing={() => this.passwordInput.focus()}
              keyboardType='email-address'
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
              inlineImageLeft='ios-call'
              onChangeText={text => this.setState({ phone: text })}
              ref={(input)=> this.phoneInput = input}
            />
            <Text style={styles.actionbutton}>Password</Text>
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor='#3E3E3E'
              returnKeyType="next"
              secureTextEntry
              onSubmitEditing={() => this.processRegistration()}
              keyboardType='password'
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
              inlineImageLeft='ios-call'
              onChangeText={text => this.setState({ password: text })}
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
                  <Button onPress={() => this.processRegistration()} style={styles.buttonContainer} block iconLeft>
                    <Text style={{ color: '#fdfdfd', fontWeight: '400' }}>SIGN UP </Text>
                  </Button>
                </View>
            }
          <View style={styles.inputContainer}>
                  <View style={styles.lineStyle} />
                  <Text style={{ color: 'black', margin: 10, fontSize: 15, fontWeight: '200' }}>or</Text>
                  <View style={styles.lineStyle} />
                </View>
         <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                  <GoogleSigninButton
                    style={{ width: 312, height: 48 }}
                    size={GoogleSigninButton.Size.Wide}
                    color={GoogleSigninButton.Color.Light}
                    onPress={this._signIn}
                  />

                </View>
                <View style={{ justifyContent: 'center', flexDirection:'row', alignItems: 'center', marginTop: 15}}>

            {
              this.state.role == 'Customer' ?
              <TouchableOpacity onPress={() => this.setState({ role: 'Vendor' })} style={[{
                height: 16,
                width: 16,
                borderWidth: 1,
                borderColor: '#000',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 3
            }]}>
               
                </TouchableOpacity>
                :
                <TouchableOpacity onPress={() => this.setState({ role: 'Customer' })} style={[{
                  height: 16,
                  width: 16,
                  borderWidth: 1,
                  borderColor: '#000',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 3
              }]}>
                <View style={{
                          height: 12,
                          width: 12,
                          backgroundColor: '#000',
                      }} />
                </TouchableOpacity>

            }


            <Text style={{ fontSize: 12, color: '#3E3E3E',}}>Register as a Merchant</Text>
          </View>


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
    marginTop: 10,
  },
  whiteButtonContainer: {
    backgroundColor: '#FFFFFF',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
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
    marginBottom: 8,
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