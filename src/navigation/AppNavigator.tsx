import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import AddEntryScreen from '../screens/AddEntryScreen';
import ViewEntryScreen from '../screens/ViewEntryScreen';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  AddEntry: undefined;
  ViewEntry: { id: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2c3e50',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'Password Manager' }}
        />
        <Stack.Screen 
          name="AddEntry" 
          component={AddEntryScreen}
          options={{ title: 'Add Entry' }}
        />
        <Stack.Screen 
          name="ViewEntry" 
          component={ViewEntryScreen}
          options={{ title: 'View Entry' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}; 