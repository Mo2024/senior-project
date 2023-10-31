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
import CreateBusiness from "./screens/users/owner/CreateBusiness";
import EditBusiness from "./screens/users/owner/EditBusiness";
import ManageBranches from "./screens/users/owner/ManageBranches";
import CreateBranch from "./screens/users/owner/CreateBranch";
import EditBranch from "./screens/users/owner/EditBranch";
import ManageEmployee from "./screens/users/owner/ManageEmployee";
import ManageBranch from "./screens/users/owner/ManageBranch";
import ForgetPasswordScreen from "./screens/ForgetPasswordScreen";
import ChangePasswordScreen from "./screens/ChangePasswordScreen";
import AdminNav from "./components/AdminNav";
import CreateCategory from "./screens/users/admins/CreateCategory";

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
          <Stack.Screen name="ForgetPasswordScreen" component={ForgetPasswordScreen} />
          <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
          <Stack.Screen name="ManageBranches" component={ManageBranches} />
          <Stack.Screen name="ManageBranch" component={ManageBranch} />
          <Stack.Screen name="ManageEmployee" component={ManageEmployee} />
          <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
          <Stack.Screen name="CreateBusiness" component={CreateBusiness} />
          <Stack.Screen name="CreateBranch" component={CreateBranch} />
          <Stack.Screen name="CreateCategory" component={CreateCategory} />
          <Stack.Screen name="EditBusiness" component={EditBusiness} initialParams={{ businessId: '', name: '', description: '' }} />
          <Stack.Screen name="EditBranch" component={EditBranch} initialParams={{ businessId: '', name: '', description: '' }} />
          <Stack.Screen name='OwnerNav' component={OwnerNav} />
          <Stack.Screen name='AdminNav' component={AdminNav} />
        </Stack.Navigator>

      </NavigationContainer>
    </>

  );
}