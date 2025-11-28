import { Currency } from '../types';

export const POPULAR_CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
];

export const POPULAR_CRYPTO: Currency[] = [
  { code: 'BTC', name: 'Bitcoin', symbol: '₿', isCrypto: true },
  { code: 'ETH', name: 'Ethereum', symbol: 'Ξ', isCrypto: true },
  { code: 'BNB', name: 'Binance Coin', symbol: 'BNB', isCrypto: true },
  { code: 'SOL', name: 'Solana', symbol: 'SOL', isCrypto: true },
  { code: 'ADA', name: 'Cardano', symbol: 'ADA', isCrypto: true },
  { code: 'XRP', name: 'Ripple', symbol: 'XRP', isCrypto: true },
  { code: 'DOGE', name: 'Dogecoin', symbol: 'Ð', isCrypto: true },
  { code: 'DOT', name: 'Polkadot', symbol: 'DOT', isCrypto: true },
  { code: 'MATIC', name: 'Polygon', symbol: 'MATIC', isCrypto: true },
  { code: 'LTC', name: 'Litecoin', symbol: 'Ł', isCrypto: true },
];

export const ALL_CURRENCIES = [...POPULAR_CURRENCIES, ...POPULAR_CRYPTO];

