import axios from '../../utils/api';
import React, { useState } from 'react';
import { Button, TextInput, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    Image,
    KeyboardAvoidingView,
    StyleSheet,
    View,
    Alert
} from 'react-native';

const Login = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        setIsLoading(true);
        await axios.post('/api/user/login', { username, password })
            .then(async ({ data }) => {
                await AsyncStorage.setItem('user', JSON.stringify(data))
                await AsyncStorage.setItem('app_token', data.data.appToken)
                navigation.replace('Home')
            })
            .catch(({ response }) => {
                console.log(response.data)
                Alert.alert("Error", response.data.message)
            });
        setIsLoading(false)
    };

    return (
        <KeyboardAvoidingView style={styles.container} enabled>
            <View style={styles.imgContainer}>
                <Text variant='displayMedium' style={styles.welcome}>Welcome to SEA Laboratory! 👋🏻</Text>
                <Image style={styles.imgContainer.image}
                    source={require('../../assets/chibi1.png')}
                />
            </View>
            <View style={styles.contentContainer}>
                <Text variant='titleLarge' style={styles.title}>Seelabs Login 🚀</Text>
                <Text variant='bodyMedium' style={styles.subTitle}>Please sign-in to your account and start the adventure</Text>

                <TextInput
                    style={styles.input}
                    mode='outlined'
                    label='NIM/Username'
                    onChangeText={setUsername}
                    value={username}
                    disabled={isLoading}
                />
                <TextInput
                    style={styles.input}
                    mode='outlined'
                    label='Password'
                    secureTextEntry={true}
                    onChangeText={setPassword}
                    value={password}
                    disabled={isLoading}
                />
                <Button
                    mode="contained"
                    style={styles.button}
                    labelStyle={styles.buttonText}
                    onPress={handleLogin}
                    disabled={isLoading}
                    loading={isLoading}>
                    Login
                </Button>
            </View>
        </KeyboardAvoidingView>
    )
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#24A9E1',
    },
    imgContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#24A9E1',
        image: {
            height: 200,
            width: 200,
            resizeMode: 'contain',
            borderRadius: 100,
            backgroundColor: 'white'
        }
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    input: {
        width: '80%',
        marginBottom: 10,
        borderRadius: 8,
    },
    button: {
        marginTop: 30,
        width: '80%',
    },
    buttonText: {
        fontSize: 20
    },
    title: {
        width: '80%',
        marginBottom: 18,
        fontWeight: 'bold'
    },
    subTitle: {
        width: '80%',
        marginBottom: 10,
    },
    welcome: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center'
    }
})