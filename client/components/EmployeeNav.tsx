import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Profile from '../screens/users/admins/Profile';
import { Ionicons } from '@expo/vector-icons';
import ManageItems from '../screens/users/admins/ManageItems';
import ManageSelfCheckout from '../screens/users/admins/ManageSelfCheckout';
import Statistics from '../screens/users/admins/Statistics';
import ManageStock from '../screens/users/employees/ManageStock';
import CameraScreen from '../screens/users/employees/Camera';

const Tab = createBottomTabNavigator();

const EmployeeNav = () => {
    return (
        <Tab.Navigator screenOptions={{ tabBarLabelStyle: { color: '#72063c' } }}>
            <Tab.Screen name="ManageStock" component={ManageStock} options={{
                tabBarLabel: 'Stock',
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="ios-folder" color={'#72063c'} size={size} />
                ),
            }} />
            <Tab.Screen
                name="Camera"
                component={CameraScreen}
                options={{
                    headerShown: false,
                    tabBarLabel: 'Attendance',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="ios-camera" color={'#72063c'} size={size} />
                    ),
                }}
            />
            <Tab.Screen name="Profile" component={Profile} options={{
                headerShown: false,
                tabBarLabel: 'Profile',
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="person" color={'#72063c'} size={size} />
                ),
            }} />
        </Tab.Navigator>
    );
};

export default EmployeeNav;
