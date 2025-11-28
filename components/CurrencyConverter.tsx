import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Modal,
  Animated,
  Keyboard,
  Pressable,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { apiService } from '../services/api';
import { POPULAR_CURRENCIES, POPULAR_CRYPTO, ALL_CURRENCIES } from '../constants/currencies';
import { Currency } from '../types';
import { useConverterStore } from '../store/useConverterStore';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { useHistoryStore } from '../store/useHistoryStore';
import { useToast } from '../hooks/useToast';
import { colors, gradients, shadows, typography } from '../constants/theme';
import Toast from './Toast';

export default function CurrencyConverter() {
  const {
    fromCurrency,
    toCurrency,
    amount,
    result,
    loading,
    error,
    setFromCurrency,
    setToCurrency,
    setAmount,
    setResult,
    setLoading,
    setError,
    swapCurrencies: swapCurrenciesStore,
  } = useConverterStore();

  const [showFromModal, setShowFromModal] = useState(false);
  const [showToModal, setShowToModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const amountInputRef = useRef<TextInput>(null);
  const convertTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const { isConnected } = useNetworkStatus();
  const { favoriteCurrencies, toggleFavorite, isFavorite } = useFavoritesStore();
  const { addConversion, getRecentConversions } = useHistoryStore();
  const [showHistory, setShowHistory] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleConvert = useCallback(async (silent = false) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      if (!silent) {
        setError('Please enter a valid amount');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      return;
    }

    if (!isConnected) {
      setError('No internet connection. Please check your network and try again.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const conversion = await apiService.convertCurrency(
        fromCurrency.code,
        toCurrency.code,
        numAmount
      );
      setResult(conversion);
      // Always save conversion to history
      addConversion(conversion);
      if (!silent) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        showToast('Conversion successful!', 'success');
      }
    } catch (err) {
      const errorMessage = 'Failed to convert. Please check your connection and try again.';
      setError(errorMessage);
      console.error(err);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      if (!silent) {
        showToast(errorMessage, 'error');
      }
    } finally {
      setLoading(false);
    }
  }, [amount, fromCurrency.code, toCurrency.code, isConnected, setError, setLoading, setResult, addConversion, showToast]);

  // Auto-convert on amount or currency change
  useEffect(() => {
    if (convertTimeoutRef.current) {
      clearTimeout(convertTimeoutRef.current);
    }

    const numAmount = parseFloat(amount);
    if (!isNaN(numAmount) && numAmount > 0 && amount.trim() !== '') {
      convertTimeoutRef.current = setTimeout(() => {
        handleConvert(true);
      }, 500);
    } else {
      setResult(null);
    }

    return () => {
      if (convertTimeoutRef.current) {
        clearTimeout(convertTimeoutRef.current);
      }
    };
  }, [amount, fromCurrency.code, toCurrency.code, handleConvert]);

  useEffect(() => {
    if (!showFromModal && !showToModal) {
      setSearchQuery('');
    }
  }, [showFromModal, showToModal]);

  const handleAmountChange = useCallback((text: string) => {
    const cleaned = text.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    if (parts.length > 2) return;
    setAmount(cleaned);
    setError(null);
  }, []);

  const swapCurrencies = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    swapCurrenciesStore();
    showToast('Currencies swapped', 'info');
  }, [swapCurrenciesStore, showToast]);

  const CurrencySelector = ({
    currency,
    onSelect,
    visible,
    onClose,
  }: {
    currency: Currency;
    onSelect: (currency: Currency) => void;
    visible: boolean;
    onClose: () => void;
  }) => {
    const allCurrencies = [...POPULAR_CURRENCIES, ...POPULAR_CRYPTO];
    const favorites = allCurrencies.filter((curr) => isFavorite(curr.code));
    const filteredCurrencies = searchQuery
      ? allCurrencies.filter(
          (curr) =>
            curr.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            curr.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : allCurrencies;

    const handleSelect = (curr: Currency) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onSelect(curr);
      onClose();
    };

    const handleToggleFavorite = (curr: Currency, e: any) => {
      e.stopPropagation();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      toggleFavorite(curr.code);
    };

    return (
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <Pressable style={styles.modalOverlay} onPress={onClose}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Currency</Text>
              <TouchableOpacity
                onPress={onClose}
                accessibilityLabel="Close modal"
                accessibilityRole="button"
              >
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color={colors.textTertiary} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search currencies..."
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
                </TouchableOpacity>
              )}
            </View>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={true}
            >
              {!searchQuery && (
                <>
                  {favorites.length > 0 && (
                    <>
                      <Text style={styles.sectionTitle}>⭐ Favorites</Text>
                      {favorites.map((curr) => (
                        <TouchableOpacity
                          key={curr.code}
                          style={[
                            styles.currencyItem,
                            currency.code === curr.code && styles.selectedCurrency,
                          ]}
                          onPress={() => handleSelect(curr)}
                          accessibilityLabel={`Select ${curr.name}`}
                          accessibilityRole="button"
                        >
                          <View style={styles.currencyItemLeft}>
                            <Text style={styles.currencyCode}>{curr.code}</Text>
                            <Text style={styles.currencyName}>{curr.name}</Text>
                          </View>
                          <View style={styles.currencyItemRight}>
                            {currency.code === curr.code && (
                              <Ionicons name="checkmark-circle" size={24} color={colors.primaryLight} />
                            )}
                            <TouchableOpacity
                              onPress={(e) => {
                                e.stopPropagation();
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                toggleFavorite(curr.code);
                              }}
                              style={styles.favoriteButton}
                              accessibilityLabel={
                                isFavorite(curr.code) ? 'Remove from favorites' : 'Add to favorites'
                              }
                            >
                              <Ionicons
                                name={isFavorite(curr.code) ? 'star' : 'star-outline'}
                                size={20}
                                color={isFavorite(curr.code) ? '#fbbf24' : colors.textTertiary}
                              />
                            </TouchableOpacity>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </>
                  )}
                  <Text style={styles.sectionTitle}>Popular Currencies</Text>
                  {POPULAR_CURRENCIES.filter((curr) => !isFavorite(curr.code)).map((curr) => (
                    <TouchableOpacity
                      key={curr.code}
                      style={[
                        styles.currencyItem,
                        currency.code === curr.code && styles.selectedCurrency,
                      ]}
                      onPress={() => handleSelect(curr)}
                      accessibilityLabel={`Select ${curr.name}`}
                      accessibilityRole="button"
                    >
                      <View style={styles.currencyItemLeft}>
                        <Text style={styles.currencyCode}>{curr.code}</Text>
                        <Text style={styles.currencyName}>{curr.name}</Text>
                      </View>
                      <View style={styles.currencyItemRight}>
                        {currency.code === curr.code && (
                          <Ionicons name="checkmark-circle" size={24} color="#6366f1" />
                        )}
                        <TouchableOpacity
                          onPress={(e) => handleToggleFavorite(curr, e)}
                          style={styles.favoriteButton}
                          accessibilityLabel={
                            isFavorite(curr.code) ? 'Remove from favorites' : 'Add to favorites'
                          }
                        >
                          <Ionicons
                            name={isFavorite(curr.code) ? 'star' : 'star-outline'}
                            size={20}
                            color={isFavorite(curr.code) ? '#fbbf24' : '#999'}
                          />
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  ))}
                  <Text style={styles.sectionTitle}>Cryptocurrencies</Text>
                </>
              )}
              {filteredCurrencies
                .filter((curr) => !searchQuery || curr.isCrypto)
                .map((curr) => (
                  <TouchableOpacity
                    key={curr.code}
                    style={[
                      styles.currencyItem,
                      currency.code === curr.code && styles.selectedCurrency,
                    ]}
                    onPress={() => handleSelect(curr)}
                    accessibilityLabel={`Select ${curr.name}`}
                    accessibilityRole="button"
                  >
                    <View style={styles.currencyItemLeft}>
                      <Text style={styles.currencyCode}>{curr.code}</Text>
                      <Text style={styles.currencyName}>{curr.name}</Text>
                    </View>
                    <View style={styles.currencyItemRight}>
                      {currency.code === curr.code && (
                        <Ionicons name="checkmark-circle" size={24} color="#6366f1" />
                      )}
                      <TouchableOpacity
                        onPress={(e) => {
                          e.stopPropagation();
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          toggleFavorite(curr.code);
                        }}
                        style={styles.favoriteButton}
                        accessibilityLabel={
                          isFavorite(curr.code) ? 'Remove from favorites' : 'Add to favorites'
                        }
                      >
                        <Ionicons
                          name={isFavorite(curr.code) ? 'star' : 'star-outline'}
                          size={20}
                          color={isFavorite(curr.code) ? '#fbbf24' : '#999'}
                        />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                ))}
              {filteredCurrencies.length === 0 && (
                <View style={styles.emptyState}>
                  <Ionicons name="search-outline" size={48} color={colors.textTertiary} />
                  <Text style={styles.emptyStateText}>No currencies found</Text>
                </View>
              )}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    );
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      padding: isLandscape ? 16 : 20,
      backgroundColor: colors.background,
      paddingTop: 0,
    },
    inputRow: {
      flexDirection: isLandscape ? 'row' : 'column',
      gap: isLandscape ? 20 : 0,
      paddingHorizontal: 20,
      alignItems: isLandscape ? 'flex-start' : 'stretch',
    },
    inputContainer: {
      marginBottom: isLandscape ? 0 : 24,
      flex: isLandscape ? 1 : 0,
      minWidth: isLandscape ? 200 : '100%',
    },
  });

  return (
    <Animated.View style={[dynamicStyles.container, { opacity: fadeAnim }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowHistory(!showHistory);
            }}
            style={styles.historyButton}
            accessibilityLabel="View conversion history"
          >
            <Ionicons
              name={showHistory ? 'time' : 'time-outline'}
              size={24}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>

        <View style={dynamicStyles.inputRow}>
            <View style={dynamicStyles.inputContainer}>
              <Text style={styles.label}>From</Text>
              <TouchableOpacity
                style={styles.currencyButton}
                onPress={() => {
                  Keyboard.dismiss();
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowFromModal(true);
                }}
                accessibilityLabel={`Select from currency, currently ${fromCurrency.name}`}
                accessibilityRole="button"
              >
                <View style={styles.currencyButtonContent}>
                  <View>
                    <Text style={styles.currencyButtonText}>{fromCurrency.code}</Text>
                    <Text style={styles.currencyButtonSubtext}>{fromCurrency.name}</Text>
                  </View>
                  <Ionicons name="chevron-down" size={20} color={colors.textTertiary} />
                </View>
              </TouchableOpacity>
              <TextInput
                ref={amountInputRef}
                style={styles.input}
                value={amount}
                onChangeText={handleAmountChange}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor="#999"
                selectTextOnFocus
                accessibilityLabel="Amount to convert"
                accessibilityHint="Enter the amount you want to convert"
              />
            </View>

            <View style={[styles.swapButtonContainer, isLandscape && styles.swapButtonContainerLandscape]}>
              <TouchableOpacity
                style={styles.swapButton}
                onPress={swapCurrencies}
                accessibilityLabel="Swap currencies"
                accessibilityRole="button"
              >
                <LinearGradient
                  colors={gradients.primary}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                  borderRadius={28}
                />
                <Ionicons
                  name={isLandscape ? 'swap-horizontal' : 'swap-vertical'}
                  size={26}
                  color={colors.white}
                />
              </TouchableOpacity>
            </View>

            <View style={dynamicStyles.inputContainer}>
              <Text style={styles.label}>To</Text>
              <TouchableOpacity
                style={styles.currencyButton}
                onPress={() => {
                  Keyboard.dismiss();
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowToModal(true);
                }}
                accessibilityLabel={`Select to currency, currently ${toCurrency.name}`}
                accessibilityRole="button"
              >
                <View style={styles.currencyButtonContent}>
                  <View>
                    <Text style={styles.currencyButtonText}>{toCurrency.code}</Text>
                    <Text style={styles.currencyButtonSubtext}>{toCurrency.name}</Text>
                  </View>
                  <Ionicons name="chevron-down" size={20} color={colors.textTertiary} />
                </View>
              </TouchableOpacity>
              <View style={styles.resultContainer}>
                {loading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#6366f1" />
                    <Text style={styles.loadingText}>Converting...</Text>
                  </View>
                ) : result ? (
                  <Text
                    style={styles.resultText}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.5}
                  >
                    {result.result.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 8,
                    })}
                  </Text>
                ) : (
                  <Text style={styles.resultPlaceholder}>0.00</Text>
                )}
              </View>
            </View>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={20} color={colors.error} />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                onPress={() => setError(null)}
                style={styles.errorClose}
                accessibilityLabel="Dismiss error"
              >
                <Ionicons name="close" size={18} color={colors.error} />
              </TouchableOpacity>
            </View>
          )}


          {!isConnected && (
            <View style={styles.networkWarning}>
              <Ionicons name="cloud-offline-outline" size={16} color={colors.error} />
              <Text style={styles.networkWarningText}>
                No internet connection. Using cached rates if available.
              </Text>
            </View>
          )}
          {showHistory && (
            <View style={styles.historyContainer}>
              <Text style={styles.historyTitle}>Recent Conversions</Text>
              {getRecentConversions(5).length > 0 ? (
                getRecentConversions(5).map((conv, index) => (
                  <TouchableOpacity
                    key={`${conv.timestamp}-${index}`}
                    style={styles.historyItem}
                    onPress={() => {
                      setAmount(conv.amount.toString());
                      setFromCurrency(
                        ALL_CURRENCIES.find((c) => c.code === conv.from) || fromCurrency
                      );
                      setToCurrency(
                        ALL_CURRENCIES.find((c) => c.code === conv.to) || toCurrency
                      );
                      setShowHistory(false);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                  >
                    <View style={styles.historyItemLeft}>
                      <Text style={styles.historyAmount}>
                        {conv.amount} {conv.from}
                      </Text>
                      <Text style={styles.historyResult}>
                        = {conv.result.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 6,
                        })}{' '}
                        {conv.to}
                      </Text>
                    </View>
                    <Ionicons name="arrow-forward" size={16} color={colors.textTertiary} />
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.emptyHistoryState}>
                  <Ionicons name="time-outline" size={48} color={colors.textTertiary} />
                  <Text style={styles.emptyHistoryText}>No conversion history yet</Text>
                </View>
              )}
            </View>
          )}
          {result && (
            <View style={styles.rateInfo}>
              <Ionicons name="information-circle-outline" size={16} color={colors.info} />
              <Text style={styles.rateText}>
                1 {fromCurrency.code} = {result.rate.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 6,
                })} {toCurrency.code}
              </Text>
            </View>
          )}
      </ScrollView>

      <CurrencySelector
        currency={fromCurrency}
        onSelect={setFromCurrency}
        visible={showFromModal}
        onClose={() => setShowFromModal(false)}
      />
      <CurrencySelector
        currency={toCurrency}
        onSelect={setToCurrency}
        visible={showToModal}
        onClose={() => setShowToModal(false)}
      />
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={hideToast}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  currencyButton: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
    ...shadows.medium,
  },
  currencyButtonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currencyButtonText: {
    ...typography.h3,
    color: colors.textPrimary,
    fontSize: 18,
  },
  currencyButtonSubtext: {
    ...typography.small,
    color: colors.textTertiary,
    marginTop: 4,
  },
  input: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 16,
    padding: 20,
    ...typography.h2,
    fontSize: 24,
    color: colors.textPrimary,
    borderWidth: 2,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    ...shadows.small,
  },
  swapButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  swapButtonContainerLandscape: {
    marginVertical: 0,
    marginHorizontal: 12,
    alignSelf: 'center',
  },
  swapButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    ...shadows.glow,
  },
  resultContainer: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 16,
    padding: 20,
    minHeight: 64,
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(99, 102, 241, 0.4)',
    ...shadows.medium,
  },
  resultText: {
    ...typography.h1,
    fontSize: 32,
    color: colors.primaryLight,
    fontWeight: '700',
  },
  resultPlaceholder: {
    ...typography.h2,
    color: colors.textTertiary,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    ...typography.body,
    color: colors.primaryLight,
  },
  convertButton: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginTop: 12,
    ...shadows.glow,
    overflow: 'hidden',
  },
  convertButtonDisabled: {
    opacity: 0.5,
  },
  convertButtonText: {
    ...typography.h3,
    color: colors.white,
    fontSize: 18,
  },
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  errorText: {
    ...typography.body,
    color: colors.error,
    flex: 1,
  },
  errorClose: {
    padding: 4,
  },
  rateInfo: {
    marginTop: 20,
    padding: 16,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  rateText: {
    ...typography.body,
    color: colors.info,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: '85%',
    paddingTop: 24,
    borderWidth: 1,
    borderColor: colors.surfaceElevated,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceElevated,
  },
  modalTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderRadius: 16,
    marginHorizontal: 24,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
    ...shadows.small,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    paddingVertical: 4,
  },
  sectionTitle: {
    ...typography.bodyBold,
    color: colors.textSecondary,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceElevated,
  },
  selectedCurrency: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  currencyItemLeft: {
    flex: 1,
  },
  currencyItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  favoriteButton: {
    padding: 6,
  },
  currencyCode: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    marginBottom: 4,
    fontSize: 17,
  },
  currencyName: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  emptyState: {
    padding: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    marginTop: 20,
    ...typography.body,
    color: colors.textTertiary,
  },
  networkWarning: {
    marginTop: 16,
    padding: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  networkWarningText: {
    ...typography.small,
    color: colors.error,
    flex: 1,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  pageTitle: {
    ...typography.h1,
    fontSize: 28,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  historyButton: {
    padding: 8,
    borderRadius: 12,
  },
  historyContainer: {
    marginTop: 12,
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
    ...shadows.medium,
  },
  historyTitle: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: colors.surface,
    ...shadows.small,
  },
  historyItemLeft: {
    flex: 1,
  },
  historyAmount: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  historyResult: {
    ...typography.caption,
    color: colors.primaryLight,
  },
  emptyHistoryState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyHistoryText: {
    marginTop: 16,
    ...typography.body,
    color: colors.textTertiary,
  },
});
