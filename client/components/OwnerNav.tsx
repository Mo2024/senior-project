import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Profile from '../screens/Profile';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const OwnerNav = () => {
    return (
        <Tab.Navigator screenOptions={{ tabBarLabelStyle: { color: '#72063c' }, tabBarActiveTintColor: 'grey' }}>
            <Tab.Screen name="Profile" component={Profile} options={{
                tabBarLabel: 'Profile',
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="person" color={'#72063c'} size={size} />
                ),
                tabBarActiveTintColor: '#72063c',
                tabBarInactiveTintColor: 'grey'
            }} />
        </Tab.Navigator>
    );
};

export default OwnerNav;
