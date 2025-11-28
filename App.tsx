import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ErrorBoundary } from './components/ErrorBoundary';
import ConverterScreen from './screens/ConverterScreen';
import CalculatorScreen from './screens/CalculatorScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  useEffect(() => {
    // Allow all orientations, but prefer landscape for calculator
    ScreenOrientation.unlockAsync();
  }, []);

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName: keyof typeof Ionicons.glyphMap;

                if (route.name === 'Converter') {
                  iconName = focused ? 'swap-horizontal' : 'swap-horizontal-outline';
                } else {
                  iconName = focused ? 'calculator' : 'calculator-outline';
                }

                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: '#6366f1',
              tabBarInactiveTintColor: '#94a3b8',
              headerStyle: {
                backgroundColor: '#ffffff',
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: 0,
                height: 0,
              },
              headerTitleStyle: {
                display: 'none',
              },
              tabBarStyle: {
                backgroundColor: '#ffffff',
                borderTopWidth: 1,
                borderTopColor: '#e5e7eb',
                paddingBottom: 8,
                paddingTop: 8,
                height: 60,
              },
              tabBarHideOnKeyboard: true,
            })}
          >
          <Tab.Screen
            name="Converter"
            component={ConverterScreen}
            options={{
              title: 'Currency Converter',
              headerTitle: 'Currency Converter',
            }}
            listeners={{
              focus: () => {
                // Lock to portrait for converter
                ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
              },
            }}
          />
          <Tab.Screen
            name="Calculator"
            component={CalculatorScreen}
            options={{
              title: 'Calculator',
              headerTitle: 'Calculator',
            }}
            listeners={{
              focus: () => {
                // Allow landscape for calculator
                ScreenOrientation.unlockAsync();
              },
            }}
          />
          </Tab.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
