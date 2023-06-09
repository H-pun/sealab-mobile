import axios from '../../utils/api';
import React, { useState, useEffect } from 'react';

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
    const [day, setDay] = React.useState(1);
    const [shift, setShift] = React.useState(1);
    const [data, setData] = React.useState(null);
    const [isLoading, setIsLoading] = useState(false);
    // const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    // const shiftOfDay = ['Shift 1 (06:30 - 09:00)', 'Shift 2 (09:30 - 12:00)', 'Shift 3 (12:30 - 15:00)', 'Shift 1 (15:30 - 18:00)']

    const handleGetGroup = async () => {
        setIsLoading(true);
        setData(null);
        await axios.post('/api/seelabs/score/list-group', { day, shift })
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
            <View style={styles.contentContainer}>
                <View style={{ width: '80%', alignSelf: 'center' }}>
                    <RadioButton.Group onValueChange={value => { setDay(value); setData([]) }} value={day}>
                        <RadioButton.Item label='Monday' value={1} mode='ios' disabled={isLoading} />
                        <RadioButton.Item label='Tuesday' value={2} mode='ios' disabled={isLoading} />
                        <RadioButton.Item label='Wednesday' value={3} mode='ios' disabled={isLoading} />
                        <RadioButton.Item label='Thursday' value={4} mode='ios' disabled={isLoading} />
                        <RadioButton.Item label='Friday' value={5} mode='ios' disabled={isLoading} />
                        <RadioButton.Item label='Saturday' value={6} mode='ios' disabled={isLoading} />
                    </RadioButton.Group>
                </View>
                <Divider bold style={{ margin: 20 }} />
                <SegmentedButtons
                    style={styles.input}
                    density='small'
                    value={shift}
                    onValueChange={value => { setShift(value); setData([]) }}
                    buttons={[
                        {
                            value: 1,
                            label: 'Shift 1',
                            disabled: isLoading
                        },
                        {
                            value: 2,
                            label: 'Shift 2',
                            disabled: isLoading
                        },
                        {
                            value: 3,
                            label: 'Shift 3',
                            disabled: isLoading
                        },
                        {
                            value: 4,
                            label: 'Shift 4',
                            disabled: isLoading
                        },
                    ]}
                />
                <Button
                    mode='contained'
                    style={styles.button}
                    labelStyle={styles.buttonText}
                    onPress={handleGetGroup}
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
                        // subtitle={`${daysOfWeek[day - 1]}, ${shiftOfDay[shift - 1]}`}
                        subtitle="Algorithms and Programming"
                        right={(props) =>
                            <IconButton {...props}
                                icon='lead-pencil'
                                style={{ marginEnd: 10 }}
                                onPress={() => {
                                    var group = item.id_group
                                    navigation.navigate('Score Input', { day, shift, group });
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
                </Card>
            ))}
        </ScrollView>
    )
};

export default ListGroup;

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
})