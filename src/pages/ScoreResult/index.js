import axios from '../../utils/api';
import React, { useState, useEffect } from 'react';

import {
    Button,
    IconButton,
    List,
    Divider,
    RadioButton,
    TextInput,
    Text,
    Card,
    Portal,
    Dialog
} from 'react-native-paper';

import {
    ScrollView,
    StyleSheet,
    View,
    Alert
} from 'react-native';

const ScoreResult = ({ navigation }) => {
    const [module, setModule] = React.useState(1);
    const [group, setGroup] = React.useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);
    const [data, setData] = React.useState(null);
    const [visible, setVisible] = React.useState(false);

    const handleGetScoreList = async () => {
        setIsLoading(true);
        setData(null);
        await axios.get('/api/seelabs/score', { params: { module } })
            .then(async ({ data }) => {
                setData(data.data);
            })
            .catch(({ response }) => {
                console.log(response.data)
                Alert.alert("Error", response.data.message)
            });
        setIsLoading(false)
    };

    const handleDeleteScore = async () => {
        setBtnLoading(true);
        await axios.delete('/api/seelabs/score', { data: { module, group } })
            .then(async ({ data }) => {
                setVisible(false)
                handleGetScoreList()
            })
            .catch(({ response }) => {
                setVisible(false)
                console.log(response.data)
                Alert.alert("Error", response.data.message)
            });
        setBtnLoading(false)
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Portal>
                <Dialog visible={visible} onDismiss={() => setVisible(false)} style={{ backgroundColor: 'white' }} dismissable={false}>
                    <Dialog.Icon icon="alert" />
                    <Dialog.Title style={[styles.title, { textAlign: 'center' }]}>Delete Record?</Dialog.Title>
                    <Dialog.Content>
                        <Text variant="bodyMedium">Are you absolutely, positively sure you want to delete this? Once it's gone, it's gone forever! This item holds memories and sentimental value, like a rare unicorn sighting. Deleting it would be like erasing a masterpiece. If you're certain, click OK to bid farewell. If you're having second thoughts, click Cancel to keep this treasure safe!</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button style={{ minWidth: 80 }} mode='outlined' disabled={isLoading} onPress={() => setVisible(false)}>Cancel</Button>
                        <Button style={{ minWidth: 80 }} mode='contained' disabled={isLoading} loading={isLoading} onPress={handleDeleteScore}>Ok</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            <View style={styles.contentContainer}>
                <View style={{ width: '80%', alignSelf: 'center' }}>
                    <RadioButton.Group onValueChange={value => { setModule(value); setData([]) }} value={module}>
                        <RadioButton.Item label='Modul 1' value={1} mode='ios' disabled={isLoading} />
                        <RadioButton.Item label='Modul 2' value={2} mode='ios' disabled={isLoading} />
                        <RadioButton.Item label='Modul 3' value={3} mode='ios' disabled={isLoading} />
                        <RadioButton.Item label='Modul 4' value={4} mode='ios' disabled={isLoading} />
                        <RadioButton.Item label='Modul 5' value={5} mode='ios' disabled={isLoading} />
                        <RadioButton.Item label='Modul 6' value={6} mode='ios' disabled={isLoading} />
                    </RadioButton.Group>
                </View>
                <Divider bold style={{ margin: 10 }} />
                <Button
                    mode='contained'
                    style={styles.button}
                    labelStyle={styles.buttonText}
                    onPress={handleGetScoreList}
                    disabled={isLoading}
                    loading={isLoading}>
                    Get List
                </Button>
                <Divider bold style={{ margin: 20 }} />
            </View>
            {data && data.map((item, index) => (
                <Card style={{ margin: 20 }} mode='outlined' key={item.id_group}>
                    <Card.Title
                        title={`Group ${item.id_group}`}
                        subtitle="Algorithms and Programming"
                        right={(props) =>
                            <IconButton {...props}
                                icon='delete'
                                style={{ marginEnd: 10 }}
                                disabled={isLoading}
                                onPress={() => {
                                    setGroup(item.id_group)
                                    setVisible(true)
                                }} />
                        }
                    />
                    <Divider bold />
                    <Card.Content>
                        <List.Section>
                            {item.names.map((name, index) => (
                                <View key={name}>
                                    <List.Item title={name} left={() => <List.Icon icon='chevron-right-circle-outline' />} />
                                    <Divider />
                                </View>
                            ))}
                        </List.Section>
                    </Card.Content>
                    <Card.Actions style={{ marginBottom: 10, marginEnd: 10 }}>
                        <Button>Edit</Button>
                        <Button
                            disabled={isLoading}
                            onPress={() => {
                                navigation.navigate('Score Detail', { module, group: item.id_group });
                            }}>Detail</Button>
                    </Card.Actions>
                </Card>
            ))}
        </ScrollView>
    )
};

export default ScoreResult;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center'
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        marginTop: 15,
    },
    selectContainer: {
        width: '80%',
        alignSelf: 'center',
        flexDirection: 'row',
        backgroundColor: 'yellow',
        justifyContent: 'center',
        height: 300
    },
    input: {
        width: '80%',
        alignSelf: 'center'
    },
    button: {
        marginTop: 10,
        width: '60%',
        alignSelf: 'center'
    },
    buttonText: {
        fontSize: 20
    },
    title: {
        marginBottom: 18,
        fontWeight: 'bold'
    },
    subTitle: {
        width: '80%',
        marginBottom: 10,
    }
})