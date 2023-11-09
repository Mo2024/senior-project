import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Profile from '../screens/users/admins/Profile';
import { Ionicons } from '@expo/vector-icons';
import ManageItems from '../screens/users/admins/ManageItems';
import ManageSelfCheckout from '../screens/users/admins/ManageSelfCheckout';
import CheckAttendance from '../screens/users/admins/CheckAttendance';

const Tab = createBottomTabNavigator();

const AdminNav = () => {
    return (
        <Tab.Navigator screenOptions={{ tabBarLabelStyle: { color: '#72063c' } }}>
            <Tab.Screen name="ManageItems" component={ManageItems} options={{
                tabBarLabel: 'Items & Categories',
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="ios-folder" color={'#72063c'} size={size} />
                ),
            }} />
            <Tab.Screen name="ManageSelfCheckout" component={ManageSelfCheckout} options={{
                tabBarLabel: 'Self-Checkout',
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="ios-basket" color={'#72063c'} size={size} />
                ),
            }} />
            <Tab.Screen name="CheckAttendance" component={CheckAttendance} options={{
                tabBarLabel: 'Check Attendance',
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="bar-chart" color={'#72063c'} size={size} />
                ),
            }} />
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

export default AdminNav;
