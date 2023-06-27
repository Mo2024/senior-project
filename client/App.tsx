import { User } from './models/user';
import { useEffect, useState } from "react";
import * as UserApi from "./network/user_api";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignUpSignInScreen from './screens/SignUpSignInScreen';
import LoggedInScreen from './screens/LoggedInScreen';
import LogInScreen from './screens/LogInScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null)

  useEffect(() => {
    async function fetchLoggedInUser() {
      try {
        const user = await UserApi.getLoggedInUser()
        setLoggedInUser(user)
      } catch (error) {
        console.log(error)
      }
    }
    fetchLoggedInUser()
  }, []);

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={loggedInUser == null ? 'SignUpSignInScreen' : 'LoggedInScreen'} screenOptions={{ headerShown: false }} >
          <Stack.Screen name="SignUpSignInScreen" component={SignUpSignInScreen} />
          <Stack.Screen name="LoggedInScreen" component={LoggedInScreen} />
          <Stack.Screen name="LogInScreen" component={LogInScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}