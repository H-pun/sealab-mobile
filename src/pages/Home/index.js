import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CommonActions } from '@react-navigation/native';
import { BottomNavigation, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

import {
    ListGroup, ScoreResult, BAP
} from '../'

const Tab = createBottomTabNavigator();

const Home = () => {
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

export default Home;