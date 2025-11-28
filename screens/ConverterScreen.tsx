import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CurrencyConverter from '../components/CurrencyConverter';

export default function ConverterScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CurrencyConverter />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

