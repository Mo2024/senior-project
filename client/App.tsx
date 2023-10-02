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
import SignUpScreen from './screens/SignUpScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install @expo/vector-icons
import OwnerNav from './components/OwnerNav';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

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
        setIsLoggedIn(false);
        setIsLoading(false);
        console.log(error)
        if (await SecureStore.getItemAsync('userInfo')) await SecureStore.deleteItemAsync('userInfo');

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
        <Stack.Navigator initialRouteName={loggedIn ? 'OwnerNav' : 'SignUpSignInScreen'} screenOptions={{ headerShown: false }} >
          <Stack.Screen name="SignUpSignInScreen" component={SignUpSignInScreen} />
          {/* <Stack.Screen name="LoggedInScreen" component={LoggedInScreen} /> */}
          <Stack.Screen name="LogInScreen" component={LogInScreen} />
          <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
          <Stack.Screen name='OwnerNav' component={OwnerNav} options={{ headerShown: false }} />
        </Stack.Navigator>

        {/* <Tab.Navigator initialRouteName={loggedIn ? 'LoggedInScreen' : 'SignUpSignInScreen'} screenOptions={{ headerShown: false }}>

          {loggedIn ? (

            <>
              <Tab.Screen
                name="Profile"
                component={Profile}
                options={{
                  tabBarLabel: 'Profile',
                  tabBarIcon: ({ color, size }) => (
                    <Ionicons name="home" color={color} size={size} />
                  ),
                }}
              />
            </>
            // <Tab.Screen
            //   name="LoggedInScreen"
            //   component={LoggedInScreen}
            //   options={{
            //     tabBarLabel: 'Home',
            //     tabBarIcon: ({ color, size }) => (
            //       <Ionicons name="home" color={color} size={size} />
            //     ),
            //   }}
            // />
          ) : (
            <>
              <Tab.Screen
                name="SignUpSignInScreen"
                component={SignUpSignInScreen}
                options={{
                  tabBarStyle: { display: 'none' },
                  tabBarLabel: 'Home',
                  tabBarIcon: ({ color, size }) => (
                    <Ionicons name="home" color={color} size={size} />
                  ),
                }}
              />
              <Tab.Screen
                name="LogInScreen"
                component={LogInScreen}
                options={{
                  tabBarStyle: { display: 'none' },
                  tabBarLabel: 'Home',
                  tabBarIcon: ({ color, size }) => (
                    <Ionicons name="home" color={color} size={size} />
                  ),
                }}
              />
              <Tab.Screen
                name="SignUpScreen"
                component={SignUpScreen}
                options={{
                  tabBarStyle: { display: 'none' },
                  tabBarLabel: 'Home',
                  tabBarIcon: ({ color, size }) => (
                    <Ionicons name="home" color={color} size={size} />
                  ),
                }}
              />
            </>
          )
          }

        </Tab.Navigator> */}

      </NavigationContainer>
    </>

  );
}