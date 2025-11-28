import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Calculator from '../components/Calculator';

export default function CalculatorScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Calculator />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

