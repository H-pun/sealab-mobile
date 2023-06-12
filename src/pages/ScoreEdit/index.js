import axios from '../../utils/api';
import moment from 'moment-timezone';
import React, { useState, useEffect } from 'react';

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

const ScoreEdit = ({ route, navigation }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [dialogVisible, setDialogVisible] = React.useState(false);
    const [scores, setScores] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const { module, group } = route.params;
    const scoreField = ['tp', 'ta', 'd', 'i1', 'i2'];

    const updateScore = (propertyName, value) => {
        setScores(prevScores => {
            const updatedScores = [...prevScores];
            updatedScores[currentIndex][propertyName] = value;
            updatedScores[currentIndex].status = updatedScores[currentIndex].D != 0;
            return updatedScores;
        });
    };

    const handleUpdateScore = async () => {
        setBtnLoading(true);

        await axios.put('/api/seelabs/score', { group, module, scores })
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
        await axios.post('/api/seelabs/score/detail', { module, group })
            .then(({ data }) => {
                setScores(data.data.scores);
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
                                    label={item?.toUpperCase()}
                                    onChangeText={value => updateScore(item, value)}
                                    inputMode='numeric'
                                    value={scores[currentIndex]?.[item] != 0 ? scores[currentIndex]?.[item]?.toString() : ''}
                                />
                            ))
                        }
                    </View>
                </Modal>
            </Portal>
            {scores.map((item, index) => (
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
                            Edit
                        </Button>
                    </Card.Actions>
                </Card>
            ))}
            {scores.length > 0 && <View style={styles.formContainer}>
                <Button
                    style={{ marginBottom: 40 }}
                    mode="contained"
                    onPress={handleUpdateScore}
                    disabled={btnLoading || isLoading}
                    loading={btnLoading}>
                    Save
                </Button>
            </View>}
            <ActivityIndicator animating={isLoading} />
        </ScrollView>
    )
};

export default ScoreEdit;

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