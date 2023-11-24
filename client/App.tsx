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
import EditCategory from "./screens/users/admins/EditCategory";
import ViewCategory from "./screens/users/admins/ViewCategory";
import EditItem from "./screens/users/admins/EditItem";
import EmployeeNav from "./components/EmployeeNav";
import ItemsInCategories from "./screens/users/employees/ItemsInCategories";
import AddProductItem from "./screens/users/employees/AddProductItem";
import EditProductItem from "./screens/users/employees/EditProductItem";
import AttendanceQrCode from "./screens/AttendanceQrCode";
import Checkout from "./screens/users/employees/Checkout";
import ViewOrderDetails from "./screens/users/employees/ViewOrderDetails";
import SelfCheckout from "./screens/SelfCheckout";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [loggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userTypeNav, setUserTypeNav] = useState<string>('')

  useEffect(() => {
    async function fetchLoggedInUser() {
      try {
        console.log('a')
        const user = await UserApi.getLoggedInUser()
        console.log('b')
        if (!user) await SecureStore.deleteItemAsync('userInfo'); setIsLoggedIn(false);
        // setUserType(user.__t)
        console.log(user)
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
          <Stack.Screen name="SelfCheckout" component={SelfCheckout} />
          <Stack.Screen name="AttendanceQrCode" component={AttendanceQrCode} />
          <Stack.Screen name="ManageBranches" component={ManageBranches} />
          <Stack.Screen name="ManageBranch" component={ManageBranch} />
          <Stack.Screen name="ManageEmployee" component={ManageEmployee} />
          <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
          <Stack.Screen name="CreateBusiness" component={CreateBusiness} />
          <Stack.Screen name="ViewCategory" component={ViewCategory} />
          <Stack.Screen name="CreateBranch" component={CreateBranch} />
          <Stack.Screen name="CreateCategory" component={CreateCategory} />
          <Stack.Screen name="EditProductItem" component={EditProductItem} initialParams={{ categoryId: '', itemId: '', quantity: '' }} />
          <Stack.Screen name="AddProductItem" component={AddProductItem} initialParams={{ categoryId: '' }} />
          <Stack.Screen name="Checkout" component={Checkout} initialParams={{ currentCustomerIndex: '' }} />
          <Stack.Screen name="ItemsInCategories" component={ItemsInCategories} initialParams={{ categoryId: '', isOrder: '', currentCustomerIndex: '' }} />
          <Stack.Screen name="EditCategory" component={EditCategory} initialParams={{ name: '', categoryId: '' }} />
          <Stack.Screen name="ViewOrderDetails" component={ViewOrderDetails} initialParams={{ order: '' }} />
          <Stack.Screen name="EditBusiness" component={EditBusiness} initialParams={{ businessId: '', name: '', description: '' }} />
          <Stack.Screen name="EditBranch" component={EditBranch} initialParams={{ businessId: '', name: '', description: '' }} />
          <Stack.Screen name="EditItem" component={EditItem} initialParams={{ itemId: "", name: "", price: "", description: "", categoryId: "" }} />
          <Stack.Screen name='OwnerNav' component={OwnerNav} />
          <Stack.Screen name='AdminNav' component={AdminNav} />
          <Stack.Screen name='EmployeeNav' component={EmployeeNav} />
        </Stack.Navigator>

      </NavigationContainer>
    </>

  );
}