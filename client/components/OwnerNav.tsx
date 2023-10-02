import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Profile from '../screens/Profile';
import { Ionicons } from '@expo/vector-icons';
import TransferEmployee from '../screens/users/owner/TransferEmployee';
import ManageEmployee from '../screens/users/owner/ManageEmployee';
import ManageBusinessess from '../screens/users/owner/ManageBusinessess';

const Tab = createBottomTabNavigator();

const OwnerNav = () => {
    return (
        <Tab.Navigator screenOptions={{ tabBarLabelStyle: { color: '#72063c' } }}>
            <Tab.Screen name="ManageEmployee" component={ManageEmployee} options={{
                tabBarLabel: 'Employees',
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="people" color={'#72063c'} size={size} />
                ),
            }} />
            <Tab.Screen name="ManageBusinessess" component={ManageBusinessess} options={{
                tabBarLabel: 'Businessess',
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="business" color={'#72063c'} size={size} />
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

export default OwnerNav;
