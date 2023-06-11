import axios from '../../utils/api';
import moment from 'moment-timezone';
import React, { useState, useEffect } from 'react';
import { DatePickerInput } from 'react-native-paper-dates';


import {
    ActivityIndicator,
    Button,
    Divider,
    Badge,
    Text,
    TextInput,
    DataTable,
    Modal,
    Dialog,
    Portal,
    Card
} from 'react-native-paper';

import {
    ScrollView,
    StyleSheet,
    View,
    Alert,
} from 'react-native';

const ScoreDetail = ({ route, navigation }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const [shift, setShift] = useState([]);

    const { module, group } = route.params;

    const handleGetScore = async () => {
        setIsLoading(true);
        await axios.post('/api/seelabs/score/detail', { module, group })
            .then(({ data }) => {
                setShift(data.data.shift);
                setData(data.data.scores);
            })
            .catch(({ response }) => {
                console.log(response.data)
                Alert.alert("Error", response.data.message)
            });
        setIsLoading(false)
    };

    useEffect(() => {
        const fetchData = async () => {
            await handleGetScore();
        }
        fetchData();
    }, [])

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={{ marginVertical: 30 }}>
                {data && data.map((item, index) => (
                    <Card style={{ marginHorizontal: 20, marginBottom: 20 }} mode='outlined' key={index}>
                        <Card.Title
                            title={item.name}
                            subtitle={`Date: ${item.date}`}
                            right={() => <Badge size={25} style={{ marginRight: 15, backgroundColor: item.d1 != 0 ? 'green' : 'maroon' }}> {item.d1 != 0 ? 'Present' : 'Absent'} </Badge>}
                        />
                        <Divider bold />
                        <Card.Content style={{ flexDirection: 'row' }}>
                            <DataTable>
                                <DataTable.Header style={styles.header}>
                                    <DataTable.Title style={styles.title}>TP</DataTable.Title>
                                    <DataTable.Title style={styles.title}>TA</DataTable.Title>
                                    <DataTable.Title style={styles.title}>D1</DataTable.Title>
                                    <DataTable.Title style={styles.title}>D2</DataTable.Title>
                                    <DataTable.Title style={styles.title}>D3</DataTable.Title>
                                    <DataTable.Title style={styles.title}>D4</DataTable.Title>
                                    <DataTable.Title style={styles.title}>I1</DataTable.Title>
                                    <DataTable.Title style={styles.title}>I2</DataTable.Title>
                                </DataTable.Header>

                                <DataTable.Row>
                                    <DataTable.Cell style={styles.title}>{item.tp}</DataTable.Cell>
                                    <DataTable.Cell style={styles.title}>{item.ta}</DataTable.Cell>
                                    <DataTable.Cell style={styles.title}>{item.d1}</DataTable.Cell>
                                    <DataTable.Cell style={styles.title}>{item.d2}</DataTable.Cell>
                                    <DataTable.Cell style={styles.title}>{item.d3}</DataTable.Cell>
                                    <DataTable.Cell style={styles.title}>{item.d4}</DataTable.Cell>
                                    <DataTable.Cell style={styles.title}>{item.i1}</DataTable.Cell>
                                    <DataTable.Cell style={styles.title}>{item.i2}</DataTable.Cell>
                                </DataTable.Row>
                            </DataTable>
                        </Card.Content>
                    </Card>
                ))}
                <ActivityIndicator animating={isLoading} />
            </View>
        </ScrollView>
    )
};

export default ScoreDetail;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent:'center'
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        paddingTop: 30,
        paddingBottom: 30
    },
    formContainer: {
        width: '80%',
        alignSelf: 'center',
        marginTop: 15,
    },
    title: {
        justifyContent: 'center',
    },
    subTitle: {
        width: '80%',
        marginBottom: 10,
        marginTop: 10,
    },
})