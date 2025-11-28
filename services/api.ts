import axios from 'axios';
import { ConversionResult, ExchangeRate } from '../types';

// Using ExchangeRate-API (free, no API key required)
const EXCHANGE_API_BASE = 'https://api.exchangerate-api.com/v4/latest';
const CRYPTO_API_BASE = 'https://api.coingecko.com/api/v3';

class ApiService {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 60000; // 1 minute cache

  private getCached(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  async getExchangeRates(baseCurrency: string): Promise<Record<string, number>> {
    const cacheKey = `rates_${baseCurrency}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(`${EXCHANGE_API_BASE}/${baseCurrency}`);
      const rates = response.data.rates;
      this.setCache(cacheKey, rates);
      return rates;
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      throw new Error('Failed to fetch exchange rates');
    }
  }

  async getCryptoRates(cryptoIds: string[]): Promise<Record<string, number>> {
    const cacheKey = `crypto_${cryptoIds.join(',')}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      // Map crypto codes to CoinGecko IDs
      const cryptoIdMap: Record<string, string> = {
        BTC: 'bitcoin',
        ETH: 'ethereum',
        BNB: 'binancecoin',
        SOL: 'solana',
        ADA: 'cardano',
        XRP: 'ripple',
        DOGE: 'dogecoin',
        DOT: 'polkadot',
        MATIC: 'matic-network',
        LTC: 'litecoin',
      };

      const ids = cryptoIds.map(code => cryptoIdMap[code] || code.toLowerCase()).join(',');
      const response = await axios.get(
        `${CRYPTO_API_BASE}/simple/price?ids=${ids}&vs_currencies=usd`
      );

      const rates: Record<string, number> = {};
      Object.entries(response.data).forEach(([id, data]: [string, any]) => {
        const code = Object.keys(cryptoIdMap).find(
          key => cryptoIdMap[key] === id
        ) || id.toUpperCase();
        rates[code] = data.usd;
      });

      this.setCache(cacheKey, rates);
      return rates;
    } catch (error) {
      console.error('Error fetching crypto rates:', error);
      throw new Error('Failed to fetch cryptocurrency rates');
    }
  }

  async convertCurrency(
    from: string,
    to: string,
    amount: number
  ): Promise<ConversionResult> {
    try {
      let rate: number;

      // Check if both are crypto
      const fromIsCrypto = ['BTC', 'ETH', 'BNB', 'SOL', 'ADA', 'XRP', 'DOGE', 'DOT', 'MATIC', 'LTC'].includes(from);
      const toIsCrypto = ['BTC', 'ETH', 'BNB', 'SOL', 'ADA', 'XRP', 'DOGE', 'DOT', 'MATIC', 'LTC'].includes(to);

      if (fromIsCrypto && toIsCrypto) {
        // Crypto to crypto: convert via USD
        const fromRates = await this.getCryptoRates([from]);
        const toRates = await this.getCryptoRates([to]);
        rate = fromRates[from] / toRates[to];
      } else if (fromIsCrypto) {
        // Crypto to fiat: convert via USD
        const cryptoRates = await this.getCryptoRates([from]);
        const fiatRates = await this.getExchangeRates('USD');
        rate = cryptoRates[from] * (fiatRates[to] || 1);
      } else if (toIsCrypto) {
        // Fiat to crypto: convert via USD
        const fiatRates = await this.getExchangeRates('USD');
        const cryptoRates = await this.getCryptoRates([to]);
        rate = (1 / fiatRates[from]) * (1 / cryptoRates[to]);
      } else {
        // Fiat to fiat
        const rates = await this.getExchangeRates(from);
        rate = rates[to] || 1;
      }

      const result = amount * rate;

      return {
        from,
        to,
        amount,
        result,
        rate,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error('Error converting currency:', error);
      throw new Error('Failed to convert currency');
    }
  }
}

export const apiService = new ApiService();

