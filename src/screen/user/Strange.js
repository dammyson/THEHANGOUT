
import React from 'react';
import { AppRegistry, StyleSheet, View, Text } from 'react-native';
import { appleAuth, AppleButton } from '@invertase/react-native-apple-authentication';


export default  class Strange extends React.Component {
  constructor() {
    super();
    this.authCredentialListener = null;
    this.user = null;
    this.state = {
      credentialStateForUser: -1,
    }
  }
  componentDidMount() {
    /**
     * subscribe to credential updates.This returns a function which can be used to remove the event listener
     * when the component unmounts.
     */

     if(Platform.OS === 'ios'){
        this.authCredentialListener = appleAuth.onCredentialRevoked(async () => {
            console.warn('Credential Revoked');
            this.fetchAndUpdateCredentialState().catch(error =>
              this.setState({ credentialStateForUser: `Error: ${error.code}` }),
            );
          });
      
          this.fetchAndUpdateCredentialState()
            .then(res => this.setState({ credentialStateForUser: res }))
            .catch(error => this.setState({ credentialStateForUser: `Error: ${error.code}` }))
     }
 
  }

  componentWillUnmount() {
    /**
     * cleans up event listener
     */
    this.authCredentialListener();
  }

  signIn = async () => {
    console.warn('Beginning Apple Authentication');

    // start a login request
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [
          appleAuth.Scope.EMAIL,
          appleAuth.Scope.FULL_NAME,
        ],
      });

      console.warn('appleAuthRequestResponse', appleAuthRequestResponse);

      const {
        user: newUser,
        email,
        nonce,
        identityToken,
        realUserStatus /* etc */,
      } = appleAuthRequestResponse;

      this.user = newUser;

      this.fetchAndUpdateCredentialState()
        .then(res => this.setState({ credentialStateForUser: res }))
        .catch(error =>
          this.setState({ credentialStateForUser: `Error: ${error.code}` }),
        );

      if (identityToken) {
        // e.g. sign in with Firebase Auth using `nonce` & `identityToken`
        console.warn(nonce, identityToken);
      } else {
        // no token - failed sign-in?
      }

      if (realUserStatus === appleAuth.UserStatus.LIKELY_REAL) {
        console.warn("I'm a real person!");
      }

      console.warn(`Apple Authentication Completed, ${this.user}, ${email}`);
    } catch (error) {
      if (error.code === appleAuth.Error.CANCELED) {
        console.warn('User canceled Apple Sign in.');
      } else {
        console.error(error);
      }
    }
  };

  fetchAndUpdateCredentialState = async () => {
    if (this.user === null) {
      this.setState({ credentialStateForUser: 'N/A' });
    } else {
      const credentialState = await appleAuth.getCredentialStateForUser(this.user);
      if (credentialState === appleAuth.State.AUTHORIZED) {
        this.setState({ credentialStateForUser: 'AUTHORIZED' });
      } else {
        this.setState({ credentialStateForUser: credentialState });
      }
    }
  }

  render() {
    return (
      <View style={[styles.container, styles.horizontal]}>
       
        <AppleButton
          style={styles.appleButton}
          cornerRadius={5}
          buttonStyle={AppleButton.Style.BLACK}
          buttonType={AppleButton.Type.SIGN_IN}
          onPress={() => this.signIn()}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  appleButton: {
    width: 200,
    height: 60,
    margin: 10,
  },
  header: {
    margin: 10,
    marginTop: 30,
    fontSize: 18,
    fontWeight: '600',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'pink',
  },
  horizontal: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
});
