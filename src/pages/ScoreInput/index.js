import axios from 'axios';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import env from '../../../env';
import Icon from 'react-native-vector-icons/FontAwesome';

import {
    Button,
    IconButton,
    List,
    Chip,
    Divider,
    Badge,
    FAB,
    SegmentedButtons,
    RadioButton,
    DataTable,
    Card
} from 'react-native-paper';

import {
    ScrollView,
    StyleSheet,
    View,
    Alert
} from 'react-native';

const InputScore = ({ route, navigation }) => {
    // const [day, setDay] = React.useState('3');
    // const [shift, setShift] = React.useState('3');
    const [data, setData] = React.useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const request = route.params;

    const handleGetSheet = async () => {
        setIsLoading(true);
        setData(null);
        try {
            axios.interceptors.request.use(async (config) => {
                const token = await AsyncStorage.getItem('app_token');
                if (token)
                    config.headers.Authorization = `Bearer ${token}`;
                return config;
            });

            await axios.post(env.API_URL + '/api/Seelabs/score/list-group', request)
                .then(async ({ data }) => {
                    setData(data.data);
                    console.log(data.data);
                });
        } catch (error) {
            console.log(error)
            Alert.alert('Invalid Token', 'Session Expired');
        }
        setIsLoading(false)
    };

    useEffect(() => {
        const fetchData = async () => {
            await handleGetSheet();
        }

        fetchData();
    }, [])

    return (
        <ScrollView style={styles.container}>
            {data && data.map((item, index) => (
                <Card style={{ margin: 20 }} mode='outlined' key={item.uid}>
                    <Card.Title
                        title={item.name}
                        subtitle={`UID: ${item.uid}`}
                        right={() => <Badge size={25} style={{ marginRight: 15, backgroundColor: 'green' }}> Hadir </Badge>}
                    />
                    <Divider bold />
                    <Card.Content style={{ flexDirection: 'row' }}>
                        <DataTable>
                            <DataTable.Header style={styles.header}>
                                <DataTable.Title style={styles.title}>TP</DataTable.Title>
                                <DataTable.Title style={styles.title}>TA</DataTable.Title>
                                <DataTable.Title style={styles.title}>D</DataTable.Title>
                                <DataTable.Title style={styles.title}>I1</DataTable.Title>
                                <DataTable.Title style={styles.title}>I2</DataTable.Title>
                            </DataTable.Header>

                            <DataTable.Row>
                                <DataTable.Cell style={styles.title}>0</DataTable.Cell>
                                <DataTable.Cell style={styles.title}>0</DataTable.Cell>
                                <DataTable.Cell style={styles.title}>0</DataTable.Cell>
                                <DataTable.Cell style={styles.title}>0</DataTable.Cell>
                                <DataTable.Cell style={styles.title}>0</DataTable.Cell>
                            </DataTable.Row>
                        </DataTable>
                    </Card.Content>
                    <Card.Actions>
                        <Button icon="pencil" mode="contained" style={{alignSelf:'center'}} onPress={() => console.log('Pressed')}>
                            Input
                        </Button>
                    </Card.Actions>
                </Card>
            ))}
        </ScrollView>
    )
};

export default InputScore;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        marginTop: 15,
    },
    title: {
        justifyContent: 'center',
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
    // title: {
    //     width: '80%',
    //     marginBottom: 18,
    //     fontWeight: 'bold'
    // },
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