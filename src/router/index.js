import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CommonActions } from '@react-navigation/native';

import Icon from 'react-native-vector-icons/FontAwesome';

import {
    Login, ListGroup, ScoreInput, ScoreResult, ScoreDetail, BAP, ScoreEdit
} from '../pages'

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

import { BottomNavigation, useTheme } from 'react-native-paper';

function Home() {
    const { colors } = useTheme();
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: true,
            }}
            tabBar={({ navigation, state, descriptors, insets }) => (
                <BottomNavigation.Bar
                    navigationState={state}
                    safeAreaInsets={insets}
                    activeColor={colors.primary}
                    style={{ backgroundColor: 'white' }}
                    onTabPress={({ route, preventDefault }) => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });
                        if (event.defaultPrevented) {
                            preventDefault();
                        } else {
                            navigation.dispatch({
                                ...CommonActions.navigate(route.name, route.params),
                                target: state.key,
                            });
                        }
                    }}
                    renderIcon={({ route, focused, color }) => {
                        const { options } = descriptors[route.key];
                        if (options.tabBarIcon) {
                            return options.tabBarIcon({ focused, color, size: 24 });
                        }

                        return null;
                    }}
                    getLabelText={({ route }) => {
                        const { options } = descriptors[route.key];
                        const label =
                            options.tabBarLabel !== undefined
                                ? options.tabBarLabel
                                : options.title !== undefined
                                    ? options.title
                                    : route.title;

                        return label;
                    }}
                />
            )}
        >
            <Tab.Screen
                name="List Group"
                component={ListGroup}
                options={{
                    tabBarLabel: 'Input',
                    tabBarIcon: ({ color, size }) => {
                        return <Icon name="vcard" size={size} color={color} />;
                    },
                }}
            />
            <Tab.Screen
                name="Result"
                component={ScoreResult}
                options={{
                    tabBarLabel: 'Result',
                    tabBarIcon: ({ color, size }) => {
                        return <Icon name="bar-chart" size={size} color={color} />;
                    },
                }}
            />
            <Tab.Screen
                name="BAP"
                component={BAP}
                options={{
                    tabBarLabel: 'BAP',
                    tabBarIcon: ({ color, size }) => {
                        return <Icon name="clipboard" size={size} color={color} />;
                    },
                }}
            />
        </Tab.Navigator>
    );
}

function Router() {
    return (
        <Stack.Navigator initialRouteName='Login'>
            <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="Score Input" component={ScoreInput} />
            <Stack.Screen name="Score Detail" component={ScoreDetail} />
            <Stack.Screen name="Score Edit" component={ScoreEdit} />
        </ Stack.Navigator>
    );
}

export default Router;