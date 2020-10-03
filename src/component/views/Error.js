import React from 'react'
import { StyleSheet, Text, Dimensions, View, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types';
import { Icon } from 'react-native-elements'
import { Container, Content, Button, Left, } from 'native-base';

const width = Dimensions.get('window').width


export default class Error extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            code: [],
            auth: '',
            loading: false,
            lname: '',
            fname: ''

        };
    }

    async componentWillMount() {
        const name = JSON.parse(await getData())
        this.setState({
            fname: name.first_name,
            lname: name.last_name
        })
    }

    render() {
        const { name, message, onPress } = this.props;
        const { fname, lname, } = this.state
        return (
            <>
                <View
                    style={{
                        backgroundColor:'red',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                    }}
                   
                >

                </View>

                <View
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                    }}

                >
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ margin:30, paddingTop: 30, paddingBottom: 20, paddingLeft:10, paddingRight:10, backgroundColor:'#fff', borderRadius:10 }}>

                            <View style={{ alignItems: 'center', paddingTop: 1, paddingBottom: 10 }}>

                                <TouchableOpacity onPress={() => onPress()}>
                                    <Icon
                                        name="closecircleo"
                                        size={40}
                                        type='antdesign'
                                        color={'red'}
                                    />

                                </TouchableOpacity>
                              
                            </View>


                            <View style={{ paddingTop: 1, paddingBottom: 10 }}>
                            </View>

                        </View>
                    </View>
                </View>
            </>
        )
    }

}

Error;

const styles = StyleSheet.create({
    backgroundImage: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    buttonContainer: {
        height: 65,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 20,
        marginRight: 20,
        marginTop: 30,
        borderRadius: 5,
    },
    modalTansButtonContainer: {
        height: 42,
        backgroundColor: 'blue',
        borderWidth: 1,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 3,
        marginTop: 5,
        marginBottom: 30,

    },
});
