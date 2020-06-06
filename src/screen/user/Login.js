// React native and others libraries imports
import React, { Component } from 'react';
import { Alert, TextInput, ImageBackground, View, Dimensions, ActivityIndicator, Image, StyleSheet , AsyncStorage} from 'react-native';
import { Container, Content, Text, Icon, Button, Left, } from 'native-base';
import { Actions } from 'react-native-router-flux';
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


export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      loading: false,
      email: '',
      password: '',
      GuserInfo: {},
     // gettingLoginStatus: true,
    };
  }

  componentDidMount() {
    //initial configuration
    GoogleSignin.configure({
      //It is mandatory to call this method before attempting to call signIn()
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      // Repleace with your webClientId generated from Firebase console
      webClientId: '823628556250-7nebjfacok8lcef9brdfe7j69i6u9uc1.apps.googleusercontent.com',
    });
    //Check if user is already signed in
   // this._isSignedIn();

    
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
      this.setState({ guserInfo: userInfo });
      this._signInRequest(userInfo.user.email , userInfo.user.email , true);
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
      this.setState({ guserInfo: userInfo });
      this._signInRequest(userInfo.user.email , userInfo.user.email , true);
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

  processLogin() {
    const {email, password } = this.state
    if (email == "" || password == "") {
      Alert.alert('Validation failed', 'field(s) cannot be empty', [{ text: 'Okay' }])
      return;
    }
    this._signInRequest(email, password, false);

  }

  _signInRequest(email, password, social){
     console.warn(URL.url);
    this.setState({ loading: true })
    fetch(URL.url + 'users/authenticate', {
      method: 'POST', headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }, body: JSON.stringify({
        Username: email,
        Password: password,
        IsSocial: social
      }),
    })
      .then(res => res.json())
      .then(res => {

        if (res.status) {
          this.setState({ loading: false })
          AsyncStorage.setItem('login', 'true');
          AsyncStorage.setItem('data', JSON.stringify(res));
          AsyncStorage.setItem('bal', this.currencyFormat(res.balance));
          AsyncStorage.setItem('social', JSON.stringify(social));
          AsyncStorage.setItem('role', res.user.role);
          AsyncStorage.setItem('token', res.token);
          AsyncStorage.setItem('user', res.user);

          if(social){
            this._updateProfileRequest(res)
          }else{
            AsyncStorage.setItem('user', JSON.stringify(res.user));
            if(res.user.role == 'Customer'){
              Actions.home({type: 'replace'});
             }else{
              Actions.merchant_home({type: 'replace'});
             }

          }
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



  _updateProfileRequest(data){
    const {guserInfo } = this.state

   this.setState({ loading: true })
   fetch(URL.url + 'users/'+ data.user.id, {
     method: 'PUT', headers: {
       'Content-Type': 'application/json',
       Accept: 'application/json',
       'Authorization': 'Bearer ' + data.token,
     }, body: JSON.stringify({
      Username: guserInfo.user.email,
      Firstname: guserInfo.user.givenName,
      Lastname: guserInfo.user.familyName,
      profilePicture: guserInfo.user.photo
     }),
   })
     .then(res => res.json())
     .then(res => {
      console.warn(res);
       if (res.status) {
         this.setState({ loading: false })
         AsyncStorage.setItem('user', JSON.stringify(res.user));
         if(res.user.role == 'Customer'){
          Actions.home({type: 'replace'});
         }else{
          Actions.merchant_home({type: 'replace'});
         }
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


  currencyFormat(n) {
    return  n.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
 }

  

  render() {
    var left = (
      <Left style={{ flex: 1 }}>
        <Button transparent onPress={() => Actions.pop()}>
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
              <Text style={{ color: '#FFF', margin: 20, fontWeight: '900', fontSize: 25, }}>HELLO! </Text>
              <View style={styles.bottom}>
                <View style={{ flexDirection: "row", margin: 20, }}>
                  <Text style={{ color: "#000", fontWeight: '500', fontSize: 20, flex: 1 }}>LOGIN</Text>
                  <View style={styles.circlet} >
                    <Text style={{ color: "#FFFFFF", fontWeight: '900', fontSize: 16, }}>X</Text>
                  </View>

                </View>
                <Text style={styles.actionbutton}>Email</Text>
                <TextInput
                  placeholder="Enter your email address"
                  placeholderTextColor='#3E3E3E'
                  returnKeyType="next"
                  onSubmitEditing={() => this.passwordInput.focus()}
                  keyboardType='email-address'
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.input}
                  inlineImageLeft='ios-call'
                  onChangeText={text => this.setState({ email: text })}
                />
                <Text style={styles.actionbutton}>Password</Text>
                <TextInput
                  placeholder="Enter your password"
                  placeholderTextColor='#3E3E3E'
                  secureTextEntry
                  returnKeyType="next"
                  onSubmitEditing={() => this.processLogin()}
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
                      <Button onPress={() => this.processLogin()} style={styles.buttonContainer} block iconLeft>
                        <Text style={{ color: '#fdfdfd', fontWeight: '600' }}>SIGN IN </Text>
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
              </View>

            </View>
          </Content>
        </Container>
      </ImageBackground>
    );
  }



  itemClicked(item) {
    Actions.product();
  }



}
const styles = StyleSheet.create({
  backgroundImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
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
    marginTop: 1
  },
  actionbutton: {
    marginTop: 2,
    marginRight: 13,
    marginLeft: 20,
    fontSize: 12,
    color: '#3E3E3E',
    textAlign: 'left',
    fontWeight: '200'
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



