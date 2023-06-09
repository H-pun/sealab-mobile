import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider, DefaultTheme } from 'react-native-paper';

import Router from './src/router/index.js';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#24A9E1', // Ganti dengan warna primer yang diinginkan
    primaryContainer: 'black',
    secondaryContainer: "#C9EBF5",
  },
};

function App(): JSX.Element {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Router />
      </NavigationContainer>
    </PaperProvider>
  );
}

export default App;
