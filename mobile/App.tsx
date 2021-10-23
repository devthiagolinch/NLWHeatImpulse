import React from 'react';
import AppLoading from 'expo-app-loading';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/hooks/auth'

import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold
} from '@expo-google-fonts/roboto'
import { Home } from './src/screens/home';


export default function App() {
  const [fonsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });

  if(!fonsLoaded) {
    return <AppLoading />
  }

  return (
    <AuthProvider>
      <StatusBar style="light" translucent backgroundColor="transparent" />  
      <Home />
    </AuthProvider>
  );
}
