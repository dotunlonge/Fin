import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  useWindowDimensions,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { calculate, CalculatorOperation, formatNumber } from '../utils/calculator';
import { useCalculatorStore } from '../store/useCalculatorStore';
import { colors, gradients, shadows, typography } from '../constants/theme';

export default function Calculator() {
  const { state, setState, reset, memory, setMemory } = useCalculatorStore();
  const [fadeAnim] = useState(new Animated.Value(0));
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  
  // Calculate available height for landscape mode
  const screenHeight = Dimensions.get('window').height;
  const availableHeight = isLandscape ? screenHeight - 60 : screenHeight; // Account for tab bar

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleInput = (input: string | CalculatorOperation) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Memory operations
    if (input === 'M+') {
      setMemory(memory + parseFloat(state.display));
      return;
    }
    if (input === 'M-') {
      setMemory(memory - parseFloat(state.display));
      return;
    }
    if (input === 'MR') {
      setState({
        ...state,
        display: formatNumber(memory),
        waitingForNewValue: true,
      });
      return;
    }
    if (input === 'MC') {
      setMemory(0);
      return;
    }
    
    const newState = calculate(state, input, memory);
    setState(newState);
    if (input === 'C') {
      reset();
    }
  };
  

  const Button = ({
    label,
    onPress,
    style,
    textStyle,
    accessibilityLabel,
  }: {
    label: string;
    onPress: () => void;
    style?: any;
    textStyle?: any;
    accessibilityLabel?: string;
  }) => {
    return (
      <TouchableOpacity
        style={[styles.button, isLandscape && styles.buttonLandscape, style]}
        onPress={onPress}
        activeOpacity={0.7}
        accessibilityLabel={accessibilityLabel || label}
        accessibilityRole="button"
      >
        <Text style={[styles.buttonText, isLandscape && styles.buttonTextLandscape, textStyle]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  const buttonSize = isLandscape ? Math.min(width * 0.12, 75) : Math.min(width * 0.22, 85);
  const fontSize = isLandscape ? 22 : 26;
  const displayFontSize = isLandscape ? 40 : 56;

  // Calculate compact sizes based on available height
  const getCompactSize = (baseSize: number, landscapeSize: number) => {
    if (!isLandscape) return baseSize;
    const heightRatio = availableHeight / 600; // Base reference height
    return Math.max(landscapeSize * heightRatio, landscapeSize * 0.7);
  };

  const dynamicCalculatorStyles = StyleSheet.create({
    container: {
      flex: 1,
      padding: isLandscape ? 8 : 20,
      backgroundColor: colors.background,
      justifyContent: isLandscape ? 'flex-start' : 'center',
    },
    calculator: {
      backgroundColor: colors.surface,
      borderRadius: isLandscape ? 20 : 24,
      padding: isLandscape ? 16 : 20,
      ...shadows.large,
      maxWidth: isLandscape ? '100%' : 500,
      alignSelf: 'center',
      width: '100%',
    },
    landscapeLayout: {
      flexDirection: 'row',
      gap: 12,
    },
    landscapeLeft: {
      flex: 1,
      minWidth: 0,
    },
    landscapeRight: {
      flex: 1.2,
      minWidth: 0,
    },
  });

  const calculatorContent = (
    <View style={dynamicCalculatorStyles.calculator}>
      {isLandscape ? (
        <View style={dynamicCalculatorStyles.landscapeLayout}>
          {/* Left Column: Scientific Functions */}
          <View style={dynamicCalculatorStyles.landscapeLeft}>
            <View style={[styles.displayContainer, styles.displayContainerLandscape]}>
              {state.previousValue !== null && state.operation && (
                <Text style={[styles.previousValue, styles.previousValueLandscape]}>
                  {state.previousValue} {state.operation}
                </Text>
              )}
              <Text
                style={[styles.display, styles.displayLandscape]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.4}
              >
                {state.display}
              </Text>
            </View>

            <View style={styles.sectionLabel}>
              <Text style={styles.sectionLabelText}>Scientific</Text>
            </View>

            <View style={styles.scientificGrid}>
              <View style={styles.scientificRow}>
                <Button
                  label="sin"
                  onPress={() => handleInput('sin')}
                  style={styles.scientificButton}
                  textStyle={styles.scientificButtonText}
                  accessibilityLabel="Sine"
                />
                <Button
                  label="cos"
                  onPress={() => handleInput('cos')}
                  style={styles.scientificButton}
                  textStyle={styles.scientificButtonText}
                  accessibilityLabel="Cosine"
                />
                <Button
                  label="tan"
                  onPress={() => handleInput('tan')}
                  style={styles.scientificButton}
                  textStyle={styles.scientificButtonText}
                  accessibilityLabel="Tangent"
                />
              </View>
              <View style={styles.scientificRow}>
                <Button
                  label="log"
                  onPress={() => handleInput('log')}
                  style={styles.scientificButton}
                  textStyle={styles.scientificButtonText}
                  accessibilityLabel="Logarithm base 10"
                />
                <Button
                  label="ln"
                  onPress={() => handleInput('ln')}
                  style={styles.scientificButton}
                  textStyle={styles.scientificButtonText}
                  accessibilityLabel="Natural logarithm"
                />
                <Button
                  label="√"
                  onPress={() => handleInput('sqrt')}
                  style={styles.scientificButton}
                  textStyle={styles.scientificButtonText}
                  accessibilityLabel="Square root"
                />
              </View>
              <View style={styles.scientificRow}>
                <Button
                  label="x²"
                  onPress={() => handleInput('x²')}
                  style={styles.scientificButton}
                  textStyle={styles.scientificButtonText}
                  accessibilityLabel="Square"
                />
                <Button
                  label="x³"
                  onPress={() => handleInput('x³')}
                  style={styles.scientificButton}
                  textStyle={styles.scientificButtonText}
                  accessibilityLabel="Cube"
                />
                <Button
                  label="x^y"
                  onPress={() => handleInput('pow')}
                  style={styles.scientificButton}
                  textStyle={styles.scientificButtonText}
                  accessibilityLabel="Power"
                />
              </View>
              <View style={styles.scientificRow}>
                <Button
                  label="1/x"
                  onPress={() => handleInput('1/x')}
                  style={styles.scientificButton}
                  textStyle={styles.scientificButtonText}
                  accessibilityLabel="Reciprocal"
                />
                <Button
                  label="π"
                  onPress={() => handleInput('π')}
                  style={styles.scientificButton}
                  textStyle={styles.scientificButtonText}
                  accessibilityLabel="Pi"
                />
                <Button
                  label="e"
                  onPress={() => handleInput('e')}
                  style={styles.scientificButton}
                  textStyle={styles.scientificButtonText}
                  accessibilityLabel="Euler's number"
                />
              </View>
            </View>

            <View style={styles.sectionLabel}>
              <Text style={styles.sectionLabelText}>Memory</Text>
              {memory !== 0 && (
                <Text style={styles.memoryIndicatorInline}>M: {memory.toFixed(2)}</Text>
              )}
            </View>

            <View style={styles.memoryGrid}>
              <Button
                label="MC"
                onPress={() => handleInput('MC')}
                style={styles.memoryButton}
                textStyle={styles.memoryButtonText}
                accessibilityLabel="Memory Clear"
              />
              <Button
                label="MR"
                onPress={() => handleInput('MR')}
                style={styles.memoryButton}
                textStyle={styles.memoryButtonText}
                accessibilityLabel="Memory Recall"
              />
              <Button
                label="M+"
                onPress={() => handleInput('M+')}
                style={styles.memoryButton}
                textStyle={styles.memoryButtonText}
                accessibilityLabel="Memory Add"
              />
              <Button
                label="M-"
                onPress={() => handleInput('M-')}
                style={styles.memoryButton}
                textStyle={styles.memoryButtonText}
                accessibilityLabel="Memory Subtract"
              />
            </View>
          </View>

          {/* Right Column: Main Calculator */}
          <View style={dynamicCalculatorStyles.landscapeRight}>

        <View style={[styles.buttonGrid, isLandscape && styles.buttonGridLandscape]}>
          <View style={[styles.buttonRow, isLandscape && styles.buttonRowLandscape]}>
            <Button
              label="C"
              onPress={() => handleInput('C')}
              style={styles.functionButton}
              textStyle={styles.functionButtonText}
              accessibilityLabel="Clear all"
            />
            <Button
              label="CE"
              onPress={() => handleInput('CE')}
              style={styles.functionButton}
              textStyle={styles.functionButtonText}
              accessibilityLabel="Clear entry"
            />
            <Button
              label="⌫"
              onPress={() => handleInput('DEL')}
              style={styles.functionButton}
              textStyle={styles.functionButtonText}
              accessibilityLabel="Delete"
            />
            {!isLandscape && (
              <TouchableOpacity
                style={[styles.operatorButton, isLandscape && styles.operatorButtonLandscape]}
                onPress={() => handleInput('/')}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={gradients.primary as [string, string]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                  borderRadius={16}
                />
                <Text style={[styles.operatorButtonText, isLandscape && styles.operatorButtonTextLandscape]}>÷</Text>
              </TouchableOpacity>
            )}
            {isLandscape && (
              <>
                <Button
                  label="%"
                  onPress={() => handleInput('%')}
                  style={styles.functionButton}
                  textStyle={styles.functionButtonText}
                  accessibilityLabel="Percent"
                />
                <TouchableOpacity
                  style={[styles.operatorButton, isLandscape && styles.operatorButtonLandscape]}
                  onPress={() => handleInput('/')}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={gradients.primary as [string, string]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFill}
                    borderRadius={16}
                  />
                  <Text style={[styles.operatorButtonText, isLandscape && styles.operatorButtonTextLandscape]}>÷</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          <View style={[styles.buttonRow, isLandscape && styles.buttonRowLandscape]}>
            <Button label="7" onPress={() => handleInput('7')} />
            <Button label="8" onPress={() => handleInput('8')} />
            <Button label="9" onPress={() => handleInput('9')} />
            <TouchableOpacity
              style={styles.operatorButton}
              onPress={() => handleInput('*')}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={gradients.primary as [string, string]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
                borderRadius={16}
              />
              <Text style={[styles.operatorButtonText, isLandscape && styles.operatorButtonTextLandscape]}>×</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.buttonRow, isLandscape && styles.buttonRowLandscape]}>
            <Button label="4" onPress={() => handleInput('4')} />
            <Button label="5" onPress={() => handleInput('5')} />
            <Button label="6" onPress={() => handleInput('6')} />
            <TouchableOpacity
              style={styles.operatorButton}
              onPress={() => handleInput('-')}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={gradients.primary as [string, string]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
                borderRadius={16}
              />
              <Text style={[styles.operatorButtonText, isLandscape && styles.operatorButtonTextLandscape]}>−</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.buttonRow, isLandscape && styles.buttonRowLandscape]}>
            <Button label="1" onPress={() => handleInput('1')} />
            <Button label="2" onPress={() => handleInput('2')} />
            <Button label="3" onPress={() => handleInput('3')} />
            <TouchableOpacity
              style={styles.operatorButton}
              onPress={() => handleInput('+')}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={gradients.primary as [string, string]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
                borderRadius={16}
              />
              <Text style={[styles.operatorButtonText, isLandscape && styles.operatorButtonTextLandscape]}>+</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.buttonRow, isLandscape && styles.buttonRowLandscape]}>
            <Button
              label="0"
              onPress={() => handleInput('0')}
              style={styles.zeroButton}
            />
            <Button label="." onPress={() => handleInput('.')} />
            <TouchableOpacity
              style={[styles.equalsButton, isLandscape && styles.equalsButtonLandscape]}
              onPress={() => handleInput('=')}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={gradients.success as [string, string]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
                borderRadius={16}
              />
              <Text style={[styles.equalsButtonText, isLandscape && styles.equalsButtonTextLandscape]}>=</Text>
            </TouchableOpacity>
          </View>
        </View>
          </View>
        </View>
      ) : (
        <>
          <View style={styles.displayContainer}>
            {state.previousValue !== null && state.operation && (
              <Text style={styles.previousValue}>
                {state.previousValue} {state.operation}
              </Text>
            )}
            <Text
              style={styles.display}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.4}
            >
              {state.display}
            </Text>
          </View>
          <View style={styles.buttonGrid}>
            <View style={styles.buttonRow}>
              <Button
                label="C"
                onPress={() => handleInput('C')}
                style={styles.functionButton}
                textStyle={styles.functionButtonText}
                accessibilityLabel="Clear all"
              />
              <Button
                label="CE"
                onPress={() => handleInput('CE')}
                style={styles.functionButton}
                textStyle={styles.functionButtonText}
                accessibilityLabel="Clear entry"
              />
              <Button
                label="⌫"
                onPress={() => handleInput('DEL')}
                style={styles.functionButton}
                textStyle={styles.functionButtonText}
                accessibilityLabel="Delete"
              />
              <TouchableOpacity
                style={styles.operatorButton}
                onPress={() => handleInput('/')}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={gradients.primary as [string, string]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                  borderRadius={16}
                />
                <Text style={styles.operatorButtonText}>÷</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonRow}>
              <Button label="7" onPress={() => handleInput('7')} />
              <Button label="8" onPress={() => handleInput('8')} />
              <Button label="9" onPress={() => handleInput('9')} />
              <TouchableOpacity
                style={styles.operatorButton}
                onPress={() => handleInput('*')}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={gradients.primary as [string, string]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                  borderRadius={16}
                />
                <Text style={styles.operatorButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonRow}>
              <Button label="4" onPress={() => handleInput('4')} />
              <Button label="5" onPress={() => handleInput('5')} />
              <Button label="6" onPress={() => handleInput('6')} />
              <TouchableOpacity
                style={styles.operatorButton}
                onPress={() => handleInput('-')}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={gradients.primary as [string, string]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                  borderRadius={16}
                />
                <Text style={styles.operatorButtonText}>−</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonRow}>
              <Button label="1" onPress={() => handleInput('1')} />
              <Button label="2" onPress={() => handleInput('2')} />
              <Button label="3" onPress={() => handleInput('3')} />
              <TouchableOpacity
                style={styles.operatorButton}
                onPress={() => handleInput('+')}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={gradients.primary as [string, string]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                  borderRadius={16}
                />
                <Text style={styles.operatorButtonText}>+</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonRow}>
              <Button
                label="0"
                onPress={() => handleInput('0')}
                style={styles.zeroButton}
              />
              <Button label="." onPress={() => handleInput('.')} />
              <TouchableOpacity
                style={styles.equalsButton}
                onPress={() => handleInput('=')}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={gradients.success as [string, string]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                  borderRadius={16}
                />
                <Text style={styles.equalsButtonText}>=</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </View>
  );

  return (
    <Animated.View style={[dynamicCalculatorStyles.container, { opacity: fadeAnim }]}>
      {isLandscape ? (
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          showsVerticalScrollIndicator={false}
        >
          {calculatorContent}
        </ScrollView>
      ) : (
        calculatorContent
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
  },
  calculator: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 20,
    ...shadows.large,
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },
  displayContainer: {
    backgroundColor: '#0a0e27',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    minHeight: 120,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    ...shadows.medium,
  },
  displayContainerLandscape: {
    minHeight: 70,
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
  },
  display: {
    color: '#ffffff',
    fontSize: 56,
    fontWeight: '300',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  displayLandscape: {
    fontSize: 32,
    fontWeight: '400',
  },
  previousValueLandscape: {
    fontSize: 14,
    marginBottom: 4,
  },
  previousValue: {
    color: '#94a3b8',
    fontSize: 18,
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  buttonGrid: {
    gap: 12,
  },
  buttonGridLandscape: {
    gap: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 0,
  },
  buttonRowLandscape: {
    gap: 8,
  },
  button: {
    flex: 1,
    minHeight: 70,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.small,
  },
  buttonLandscape: {
    minHeight: 50,
  },
  buttonText: {
    fontSize: 26,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  buttonTextLandscape: {
    fontSize: 20,
  },
  functionButton: {
    backgroundColor: colors.gray200,
  },
  functionButtonText: {
    color: colors.textSecondary,
    fontSize: 20,
  },
  operatorButton: {
    flex: 1,
    minHeight: 70,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    ...shadows.medium,
  },
  operatorButtonLandscape: {
    minHeight: 50,
  },
  operatorButtonText: {
    fontSize: 28,
    fontWeight: '600',
    color: colors.white,
  },
  operatorButtonTextLandscape: {
    fontSize: 20,
  },
  zeroButton: {
    flex: 2,
  },
  equalsButton: {
    flex: 1,
    minHeight: 70,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    ...shadows.medium,
  },
  equalsButtonLandscape: {
    minHeight: 50,
  },
  equalsButtonText: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.white,
  },
  equalsButtonTextLandscape: {
    fontSize: 22,
  },
  sectionLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  sectionLabelText: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  memoryIndicatorInline: {
    ...typography.caption,
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
  },
  scientificGrid: {
    gap: 6,
  },
  scientificRow: {
    flexDirection: 'row',
    gap: 6,
  },
  scientificButton: {
    flex: 1,
    minHeight: 42,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray200,
    ...shadows.small,
  },
  scientificButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  memoryGrid: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  memoryButton: {
    flex: 1,
    minHeight: 42,
    backgroundColor: colors.gray100,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray200,
    ...shadows.small,
  },
  memoryButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  memoryIndicator: {
    ...typography.caption,
    color: colors.primary,
    marginLeft: 12,
    fontWeight: '600',
  },
});
