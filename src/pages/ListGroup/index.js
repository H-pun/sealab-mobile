import axios from 'axios';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import env from '../../../env';

import {
    Button,
    IconButton,
    List,
    Divider,
    SegmentedButtons,
    RadioButton,
    Card
} from 'react-native-paper';

import {
    ScrollView,
    StyleSheet,
    View,
    Alert
} from 'react-native';

const ListGroup = ({ navigation }) => {
    const [day, setDay] = React.useState('3');
    const [shift, setShift] = React.useState('3');
    const [data, setData] = React.useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleGetGroup = async () => {
        setIsLoading(true);
        setData(null);
        try {
            axios.interceptors.request.use(async (config) => {
                const token = await AsyncStorage.getItem('app_token');
                if (token)
                    config.headers.Authorization = `Bearer ${token}`;
                return config;
            });

            await axios.post(env.API_URL + '/api/Seelabs/score/list-group', { day, shift })
                .then(async ({ data }) => {
                    setData(data.data);
                });
        } catch (error) {
            console.log(error)
            Alert.alert('Invalid Token', 'Session Expired');
        }
        setIsLoading(false)
    };

    useEffect(() => {
        // const fetchData = async () => {
        // }

        // fetchData();
        // console.log(data)
    })

    return (
        <ScrollView style={styles.container}>
            <View style={styles.contentContainer}>
                <RadioButton.Group onValueChange={setDay} value={day}>
                    <RadioButton.Item label="Senin" value="1" mode='ios' />
                    <RadioButton.Item label="Selasa" value="2" mode='ios' />
                    <RadioButton.Item label="Rabu" value="3" mode='ios' />
                    <RadioButton.Item label="Kamis" value="4" mode='ios' />
                    <RadioButton.Item label="Jumat" value="5" mode='ios' />
                    <RadioButton.Item label="Sabtu" value="6" mode='ios' />
                </RadioButton.Group>
                <Divider bold style={{ margin: 20 }} />
                <SegmentedButtons
                    style={styles.input}
                    density='small'
                    value={shift}
                    onValueChange={setShift}
                    buttons={[
                        {
                            value: '1',
                            label: 'Shift 1',
                        },
                        {
                            value: '2',
                            label: 'Shift 2',
                        },
                        {
                            value: '3',
                            label: 'Shift 3',
                        },
                        {
                            value: '4',
                            label: 'Shift 4',
                        },
                    ]}
                />
                <Button
                    mode="contained"
                    style={styles.button}
                    labelStyle={styles.buttonText}
                    onPress={handleGetGroup}
                    disabled={isLoading}
                    loading={isLoading}>
                    Get List
                </Button>

            </View>
            <Divider bold style={{ margin: 20 }} />
            {data && data.map((item, index) => (
                <Card style={{ margin: 20 }} mode='outlined' key={item.id_group}>
                    <Card.Title
                        title={`Group ${item.id_group}`}
                        subtitle="Monday, Shift 2 (09:30-12:00)"
                        right={(props) =>
                            <IconButton {...props}
                                icon="lead-pencil"
                                onPress={() => {
                                    var group = item.id_group
                                    navigation.navigate('ScoreInput', { day, shift, group });
                                }} />}
                    />
                    <Divider bold />
                    <Card.Content>
                        <List.Section>
                            {item.names.map((name, index) => (
                                <View>
                                    <List.Item title={name} key={index} left={() => <List.Icon icon="chevron-right-circle-outline" />} />
                                    <Divider />
                                </View>
                            ))}
                        </List.Section>
                    </Card.Content>
                </Card>
            ))}
        </ScrollView>
    )
};

export default ListGroup;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        marginTop: 15,
    },
    input: {
        width: '80%',
        alignSelf: 'center'
    },
    button: {
        marginTop: 20,
        width: '60%',
        alignSelf: 'center'
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