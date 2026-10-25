import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';
import { AuthProvider } from '@/contexts/AuthContext';
import { BooksProvider } from '@/contexts/BooksContext';

import { HomeScreen } from '@/screens/HomeScreen';
import { LoginScreen } from '@/screens/LoginScreen';
import { RegisterScreen } from '@/screens/RegisterScreen';
import { ListScreen } from '@/screens/ListScreen';
import { DetailScreen } from '@/screens/DetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <BooksProvider>
          <NavigationContainer>
            <StatusBar style="light" />
            <Stack.Navigator
              initialRouteName="Home"
              screenOptions={{
                headerStyle: {
                  backgroundColor: '#0f172a',
                },
                headerTintColor: '#ffffff',
                headerTitleStyle: {
                  fontWeight: '700',
                },
              }}
            >
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ title: 'Đăng nhập' }}
              />
              <Stack.Screen
                name="Register"
                component={RegisterScreen}
                options={{ title: 'Đăng ký' }}
              />
              <Stack.Screen
                name="List"
                component={ListScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Detail"
                component={DetailScreen}
                options={{ title: 'Chi tiết sách' }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </BooksProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
