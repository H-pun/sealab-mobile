import axios from '../../utils/api';
import moment from 'moment-timezone';
import React, { useState, useEffect } from 'react';
import { DatePickerInput } from 'react-native-paper-dates';
import { DropDown } from '../../components';

import {
    ActivityIndicator,
    Button,
    Divider,
    Badge,
    Text,
    TextInput,
    DataTable,
    Modal,
    Portal,
    Card
} from 'react-native-paper';

import {
    ScrollView,
    StyleSheet,
    View,
    Alert
} from 'react-native';

const ScoreInput = ({ route, navigation }) => {
    const [module, setModule] = useState('1');
    const [date, setDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [scores, setScores] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const { day, shift, group } = route.params;
    const scoreField = ['tp', 'ta', 'd', 'i1', 'i2'];

    const updateScore = (propertyName, value) => {
        setScores(prevScores => {
            const updatedScores = [...prevScores];
            updatedScores[currentIndex][propertyName] = value;
            updatedScores[currentIndex].status = updatedScores[currentIndex].d != 0;
            return updatedScores;
        });
    };

    const handleInputScore = async () => {
        setBtnLoading(true);
        var dateNow = moment.utc(date).tz('Asia/Jakarta').format('YYYY-MM-DD');
        console.log({ day, shift, group, module, date: dateNow, scores });

        await axios.post('/api/seelabs/score', { day, shift, group, module, date: dateNow, scores })
            .then(({ data }) => {
                Alert.alert("Success", "Input successfull!")
            })
            .catch(({ response }) => {
                console.log(response.data)
                Alert.alert("Error", response.data.message)
            });
        setBtnLoading(false);
    };

    const handleGetSheet = async () => {
        setIsLoading(true);
        await axios.post('/api/seelabs/score/list-group', { day, shift, group })
            .then(({ data }) => {
                var temp = [];
                data.data.forEach((item) => {
                    temp.push({
                        name: item.name,
                        uid: item.uid,
                        status: false,
                        tp: 0,
                        ta: 0,
                        i1: 0,
                        i2: 0,
                        d: 0
                    })
                });
                setScores(temp);
            })
            .catch(({ response }) => {
                console.log(response.data)
                Alert.alert("Error", response.data.message)
            });
        setIsLoading(false)
    };

    useEffect(() => {
        const fetchData = async () => {
            await handleGetSheet();
        }
        fetchData();
    }, [])

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Portal>
                <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalContainer}>
                    <View style={styles.formContainer} enabled>
                        <Text variant='titleLarge' numberOfLines={1} style={styles.title}>{scores[currentIndex]?.name}</Text>
                        <Text variant='bodyMedium' style={styles.subTitle}>UID: {scores[currentIndex]?.uid}</Text>
                        {
                            scoreField.map((item, index) => (
                                <TextInput
                                    key={index}
                                    style={{ marginBottom: 10 }}
                                    mode='outlined'
                                    label={item?.toUpperCase()}
                                    onChangeText={value => updateScore(item, value)}
                                    inputMode='numeric'
                                    value={scores[currentIndex]?.[item] != 0 ? scores[currentIndex]?.[item].toString() : ''}
                                />
                            ))
                        }
                    </View>
                </Modal>
            </Portal>
            {scores && scores.map((item, index) => (
                <Card style={{ margin: 20 }} mode='outlined' key={item.uid}>
                    <Card.Title
                        title={item.name}
                        subtitle={`UID: ${item.uid}`}
                        right={() => <Badge size={25} style={{ marginRight: 15, backgroundColor: item.status ? 'green' : 'maroon' }}> {item.status ? 'Present' : 'Absent'} </Badge>}
                    />
                    <Divider bold />
                    <Card.Content style={{ flexDirection: 'row' }}>
                        <DataTable>
                            <DataTable.Header>
                                <DataTable.Title style={styles.title}>TP</DataTable.Title>
                                <DataTable.Title style={styles.title}>TA</DataTable.Title>
                                <DataTable.Title style={styles.title}>D</DataTable.Title>
                                <DataTable.Title style={styles.title}>I1</DataTable.Title>
                                <DataTable.Title style={styles.title}>I2</DataTable.Title>
                            </DataTable.Header>

                            <DataTable.Row>
                                <DataTable.Cell style={styles.title}>{item.tp}</DataTable.Cell>
                                <DataTable.Cell style={styles.title}>{item.ta}</DataTable.Cell>
                                <DataTable.Cell style={styles.title}>{item.d}</DataTable.Cell>
                                <DataTable.Cell style={styles.title}>{item.i1}</DataTable.Cell>
                                <DataTable.Cell style={styles.title}>{item.i2}</DataTable.Cell>
                            </DataTable.Row>
                        </DataTable>
                    </Card.Content>
                    <Card.Actions>
                        <Button icon="pencil" mode="contained" style={{ margin: 5 }} disabled={isLoading} onPress={() => {
                            setModalVisible(true);
                            setCurrentIndex(index);
                        }}>
                            Input
                        </Button>
                    </Card.Actions>
                </Card>
            ))}
            {scores.length > 0 && <View style={styles.formContainer}>

                <DropDown
                    style={{ width: '80%' }}
                    contentStyle={{ height: 100 }}
                    value={module}
                    label='Module'
                    loading={isLoading}
                    onValueChange={setModule}
                    list={[
                        {
                            value: 1,
                            title: 'Module 1'
                        },
                        {
                            value: 2,
                            title: 'Module 2'
                        },
                        {
                            value: 3,
                            title: 'Module 3'
                        },
                        {
                            value: 4,
                            title: 'Module 4'
                        },
                        {
                            value: 5,
                            title: 'Module 5'
                        },
                        {
                            value: 6,
                            title: 'Module 6'
                        },
                    ]}
                />
                <DatePickerInput
                    locale='en'
                    label='Date'
                    style={{ marginVertical: 20 }}
                    value={date}
                    disabled={isLoading}
                    onChange={setDate}
                    inputMode='start'
                    mode='outlined'
                />
                <Button
                    style={{ marginBottom: 40, marginTop: 10 }}
                    mode="contained"
                    onPress={handleInputScore}
                    disabled={btnLoading || isLoading}
                    loading={btnLoading}>
                    Submit
                </Button>
            </View>}
            <ActivityIndicator animating={isLoading} />
        </ScrollView>
    )
};

export default ScoreInput;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center'
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
    }
})