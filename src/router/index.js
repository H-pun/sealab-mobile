import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
    Login, Home, ScoreInput, ScoreDetail, ScoreEdit
} from '../pages'

const Stack = createNativeStackNavigator();

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