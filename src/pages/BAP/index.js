import axios from '../../utils/api';
import React, { useState } from 'react';
import moment from 'moment-timezone';
import { DatePickerInput } from 'react-native-paper-dates';

import {
    Button,
    Card,
    DataTable
} from 'react-native-paper';

import {
    ScrollView,
    StyleSheet,
    View,
    Alert
} from 'react-native';

const BAP = ({ navigation }) => {
    const [date, setDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = React.useState(null);

    const handleGetBAP = async () => {
        setIsLoading(true);
        setData(null);
        await axios.get('/api/seelabs/bap', { params: { date: moment.utc(date).tz('Asia/Jakarta').format('YYYY-MM-DD') } })
            .then(async ({ data }) => {
                setData(data.data);
            })
            .catch(({ response }) => {
                console.log(response.data)
                Alert.alert("Error", response.data.message)
            });
        setIsLoading(false)
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.formContainer}>
                <DatePickerInput
                    locale='en'
                    label='Date'
                    style={{ marginBottom: 10 }}
                    value={date}
                    onChange={setDate}
                    inputMode='start'
                    mode='outlined'
                />
                <Button
                    mode="contained"
                    onPress={handleGetBAP}
                    disabled={isLoading}
                    loading={isLoading}>
                    Submit
                </Button>
            </View>
            {data && <Card mode='outlined' style={{ margin: 20 }}>
                <Card.Content>
                    <DataTable>
                        <DataTable.Header style={styles.header}>
                            <DataTable.Title style={styles.title}>No</DataTable.Title>
                            <DataTable.Title style={[styles.title, { flex: 3 }]}>Date</DataTable.Title>
                            <DataTable.Title style={styles.title}>Module</DataTable.Title>
                            <DataTable.Title style={styles.title}>Shift</DataTable.Title>
                        </DataTable.Header>
                        {data.map((item, index) => (
                            <DataTable.Row key={index}>
                                <DataTable.Cell style={styles.title}>{index + 1}</DataTable.Cell>
                                <DataTable.Cell style={[styles.title, { flex: 3 }]}>{item.date}</DataTable.Cell>
                                <DataTable.Cell style={styles.title}>{item.module}</DataTable.Cell>
                                <DataTable.Cell style={styles.title}>{item.shift}</DataTable.Cell>
                            </DataTable.Row>
                        ))}
                    </DataTable>
                </Card.Content>
            </Card>}

        </ScrollView>
    )
};

export default BAP;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center'
    },
    formContainer: {
        width: '80%',
        alignSelf: 'center',
        marginTop: 15,
    },
    title: {
        justifyContent: 'center',
    }
})