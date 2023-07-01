import { User } from './models/user';
import { useEffect, useState } from "react";
import * as UserApi from "./network/user_api";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignUpSignInScreen from './screens/SignUpSignInScreen';
import LoggedInScreen from './screens/LoggedInScreen';
import LogInScreen from './screens/LogInScreen';
import { View, Text } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AppLoader from './components/AppLoader';

const Stack = createNativeStackNavigator();

export default function App() {
  const [loggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLoggedInUser() {
      try {
        const user = await UserApi.getLoggedInUser()
        if (!user) await SecureStore.deleteItemAsync('userInfo'); setIsLoggedIn(false);
        await SecureStore.setItemAsync('userInfo', JSON.stringify(user))
        setIsLoggedIn(true);
        setIsLoading(false);

      } catch (error) {
        setIsLoading(false);
        console.log(error)
        if (await SecureStore.getItemAsync('userInfo')) await SecureStore.deleteItemAsync('userInfo');
        setIsLoggedIn(false);

      }
    }
    fetchLoggedInUser()
  }, []);

  if (isLoading) {
    return (
      <>
        <AppLoader />
      </>
    );

  }

  return (

    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={loggedIn ? 'LoggedInScreen' : 'SignUpSignInScreen'} screenOptions={{ headerShown: false }} >
          <Stack.Screen name="SignUpSignInScreen" component={SignUpSignInScreen} />
          <Stack.Screen name="LoggedInScreen" component={LoggedInScreen} />
          <Stack.Screen name="LogInScreen" component={LogInScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>

  );
}