import { useEffect, useState } from "react";
import * as UserApi from "./network/user_api";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignUpSignInScreen from './screens/SignUpSignInScreen';
import LogInScreen from './screens/LogInScreen';
import * as SecureStore from 'expo-secure-store';
import AppLoader from './components/AppLoader';
import SignUpScreen from './screens/SignUpScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import OwnerNav from './components/OwnerNav';
import { userRouter } from "./utils/functions";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [loggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userTypeNav, setUserTypeNav] = useState<string>('')

  useEffect(() => {
    async function fetchLoggedInUser() {
      try {
        const user = await UserApi.getLoggedInUser()
        if (!user) await SecureStore.deleteItemAsync('userInfo'); setIsLoggedIn(false);
        // setUserType(user.__t)
        setUserTypeNav(await userRouter(user.__t) as string)
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
        <Stack.Navigator initialRouteName={loggedIn ? userTypeNav : 'SignUpSignInScreen'} screenOptions={{ headerShown: false }} >
          <Stack.Screen name="SignUpSignInScreen" component={SignUpSignInScreen} />
          <Stack.Screen name="LogInScreen" component={LogInScreen} />
          <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
          <Stack.Screen name='OwnerNav' component={OwnerNav} />
        </Stack.Navigator>

      </NavigationContainer>
    </>

  );
}