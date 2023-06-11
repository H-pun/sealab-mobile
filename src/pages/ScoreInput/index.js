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

const ScoreInput = ({ route, navigation }) => {
    const [module, setModule] = useState('');
    const [date, setDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [dialogVisible, setDialogVisible] = React.useState(false);
    const [scores, setScores] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const { day, shift, group } = route.params;
    const scoreField = ['TP', 'TA', 'D', 'I1', 'I2'];

    const updateScore = (propertyName, value) => {
        setScores(prevScores => {
            const updatedScores = [...prevScores];
            updatedScores[currentIndex][propertyName] = value;
            updatedScores[currentIndex].status = updatedScores[currentIndex].D != 0;
            return updatedScores;
        });
    };

    const handleInputScore = async () => {
        setBtnLoading(true);
        var dateNow = moment.utc(date).tz('Asia/Jakarta').format('YYYY-MM-DD');
        console.log({ day, shift, group, module, date: dateNow, scores });

        await axios.post('/api/seelabs/score', { day, shift, group, module, date: dateNow, scores })
            .then(({ data }) => {
                console.log(data);
                setDialogVisible(true);
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
                        TP: 0,
                        TA: 0,
                        I1: 0,
                        I2: 0,
                        D: 0
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
                <Dialog visible={dialogVisible} onDismiss={() => { setDialogVisible(false) }}>
                    <Dialog.Title>Alert</Dialog.Title>
                    <Dialog.Content>
                        <Text variant="bodyMedium">Input Success</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => { setDialogVisible(false) }}>Done</Button>
                    </Dialog.Actions>
                </Dialog>
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
                                    label={item}
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
                            <DataTable.Header style={styles.header}>
                                <DataTable.Title style={styles.title}>TP</DataTable.Title>
                                <DataTable.Title style={styles.title}>TA</DataTable.Title>
                                <DataTable.Title style={styles.title}>D</DataTable.Title>
                                <DataTable.Title style={styles.title}>I1</DataTable.Title>
                                <DataTable.Title style={styles.title}>I2</DataTable.Title>
                            </DataTable.Header>

                            <DataTable.Row>
                                <DataTable.Cell style={styles.title}>{item.TP}</DataTable.Cell>
                                <DataTable.Cell style={styles.title}>{item.TA}</DataTable.Cell>
                                <DataTable.Cell style={styles.title}>{item.D}</DataTable.Cell>
                                <DataTable.Cell style={styles.title}>{item.I1}</DataTable.Cell>
                                <DataTable.Cell style={styles.title}>{item.I2}</DataTable.Cell>
                            </DataTable.Row>
                        </DataTable>
                    </Card.Content>
                    <Card.Actions>
                        <Button icon="pencil" mode="contained" style={{ margin: 5 }} loading={isLoading} onPress={() => {
                            setModalVisible(true);
                            setCurrentIndex(index);
                        }}>
                            Input
                        </Button>
                    </Card.Actions>
                </Card>
            ))}
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
                <TextInput
                    style={{ marginBottom: 20 }}
                    mode='outlined'
                    label='Module'
                    onChangeText={setModule}
                    inputMode='numeric'
                    value={module} />
                <Button
                    style={{ marginBottom: 40 }}
                    mode="contained"
                    onPress={handleInputScore}
                    disabled={btnLoading || isLoading}
                    loading={btnLoading}>
                    Submit
                </Button>
                <ActivityIndicator animating={isLoading} />
                {/* <Menu
                    visible={menuVisible}
                    onDismiss={() => setMenuVisible(false)}
                    style={{ width: '80%' }}
                    anchor={<Divider />}>

                    <Menu.Item onPress={() => { }} title="Item 1" />
                    <Menu.Item onPress={() => { }} title="Item 2" />
                    <Menu.Item onPress={() => { }} title="Item 3" />
                </Menu> */}
            </View>
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
    },
})