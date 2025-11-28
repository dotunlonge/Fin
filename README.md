# Fin - Currency & Crypto Converter + Calculator 💰🧮

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React_Native-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000020?style=flat&logo=expo&logoColor=white)](https://expo.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A beautiful, production-ready mobile app built with React Native and Expo that combines currency/cryptocurrency conversion with a full-featured calculator. The app demonstrates modern software engineering practices with real-time API integration, smooth animations, and an intuitive user interface.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## ✨ Features

### 💱 Currency & Crypto Converter
- **Real-time Exchange Rates**: Fetches live exchange rates from reliable APIs
- **Multi-Currency Support**: Convert between 10+ popular fiat currencies (USD, EUR, GBP, JPY, etc.)
- **Cryptocurrency Support**: Convert between 10+ major cryptocurrencies (BTC, ETH, SOL, etc.)
- **Cross-Conversion**: Seamlessly convert between fiat currencies and cryptocurrencies
- **Smart Caching**: Implements intelligent caching to reduce API calls and improve performance
- **Favorites System**: Save frequently used currencies for quick access (persisted locally)
- **Conversion History**: View and reuse recent conversions (up to 50 saved)
- **Auto-Conversion**: Automatically converts as you type (with smart debouncing)
- **Search Functionality**: Quickly find currencies with real-time search
- **Network Awareness**: Detects offline status and uses cached rates
- **Beautiful UI**: Modern, clean interface with smooth animations and intuitive controls

### 🧮 Calculator
- **Full-Featured**: Supports all basic arithmetic operations (+, -, ×, ÷)
- **Advanced Controls**: Clear (C), Clear Entry (CE), and Delete (DEL) functions
- **Landscape Mode**: Automatically rotates to landscape orientation for better usability
- **Modern Design**: Sleek, iOS-inspired calculator interface

### 🎨 User Experience
- **Smooth Animations**: Fade-in animations and transitions throughout the app
- **Responsive Design**: Optimized for various screen sizes
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Loading States**: Clear visual feedback during API calls
- **Tab Navigation**: Easy navigation between converter and calculator

## 🛠️ Technology Stack

- **Framework**: React Native with Expo SDK 54
- **Language**: TypeScript
- **Navigation**: React Navigation v7
- **State Management**: Zustand
- **API Integration**: Axios
- **Animations**: React Native Reanimated
- **Icons**: Expo Vector Icons
- **Screen Orientation**: Expo Screen Orientation
- **Haptic Feedback**: Expo Haptics
- **Network Status**: Expo Network
- **Persistence**: AsyncStorage (for favorites & history)
- **Error Handling**: Error Boundaries
- **Performance**: React.memo, useMemo, useCallback optimizations
- **User Feedback**: Toast notifications

## 📦 APIs Used

1. **ExchangeRate-API** (https://api.exchangerate-api.com)
   - Free, no API key required
   - Provides real-time fiat currency exchange rates

2. **CoinGecko API** (https://api.coingecko.com)
   - Free tier available
   - Provides real-time cryptocurrency prices

## 🚀 Getting Started

### Prerequisites

- Node.js (v20.19.4 or higher recommended)
- npm or yarn
- Expo CLI (installed globally or via npx)
- iOS Simulator (for Mac) or Android Emulator, or Expo Go app on your physical device

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Fin
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on your preferred platform**
   - **iOS**: Press `i` in the terminal or run `npm run ios`
   - **Android**: Press `a` in the terminal or run `npm run android`
   - **Web**: Press `w` in the terminal or run `npm run web`
   - **Physical Device**: Scan the QR code with Expo Go app

## 📱 Usage

### Currency Converter

1. Select the source currency (From) by tapping the currency button
2. Enter the amount you want to convert
3. Select the target currency (To)
4. Tap "Convert" to see the result
5. Use the swap button (↕️) to quickly swap currencies

### Calculator

1. Navigate to the Calculator tab
2. Rotate your device to landscape mode for optimal experience
3. Use the calculator as you would any standard calculator
4. Operations supported:
   - Basic arithmetic: +, -, ×, ÷
   - Clear (C): Clears everything
   - Clear Entry (CE): Clears current entry
   - Delete (DEL): Removes last digit

## 📁 Project Structure

```
Fin/
├── components/          # Reusable UI components
│   ├── Calculator.tsx
│   └── CurrencyConverter.tsx
├── screens/            # Screen components
│   ├── CalculatorScreen.tsx
│   └── ConverterScreen.tsx
├── services/           # API and business logic
│   └── api.ts
├── utils/              # Utility functions
│   └── calculator.ts
├── constants/          # App constants
│   └── currencies.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── store/              # Zustand state management
│   ├── useConverterStore.ts
│   └── useCalculatorStore.ts
├── hooks/              # Custom React hooks
│   ├── useNetworkStatus.ts
│   └── useToast.ts
├── utils/              # Utility functions
│   ├── calculator.ts
│   ├── formatNumber.ts
│   └── performance.ts
├── App.tsx             # Main app component
├── app.json            # Expo configuration
└── package.json        # Dependencies
```

## 🎯 Key Features & Best Practices

### Code Quality
- **TypeScript**: Full type safety throughout the application
- **Modular Architecture**: Clean separation of concerns
- **Error Handling**: Comprehensive error handling with user feedback
- **Performance**: Intelligent caching to minimize API calls

### User Experience
- **Loading States**: Visual feedback during async operations
- **Error Messages**: Clear, actionable error messages with toast notifications
- **Animations**: Smooth transitions and fade-in effects
- **Responsive Design**: Works on various screen sizes
- **Toast Notifications**: Non-intrusive feedback for user actions
- **Haptic Feedback**: Tactile responses for better UX
- **Performance Optimized**: Memoization and callback optimization

### API Integration
- **Caching Strategy**: 1-minute cache to reduce API calls
- **Error Recovery**: Graceful error handling with retry capability
- **Rate Limiting**: Respects API rate limits through caching

## 🔧 Configuration

The app is configured to:
- Support both portrait and landscape orientations
- Lock to portrait mode in the converter screen
- Allow landscape mode in the calculator screen
- Use safe area insets for proper display on notched devices

## 📝 Notes

- The app uses free-tier APIs that don't require API keys
- Exchange rates are cached for 1 minute to improve performance
- The calculator automatically handles edge cases (division by zero, etc.)
- All currency codes follow ISO 4217 standard

## 📚 Documentation

- [Architecture Overview](./ARCHITECTURE.md) - Detailed architecture and design decisions
- [Contributing Guide](./CONTRIBUTING.md) - How to contribute to this project
- [Changelog](./CHANGELOG.md) - Version history and changes

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 📄 License

This project is open source and available for educational purposes.

## 🙏 Acknowledgments

- ExchangeRate-API for providing free currency exchange rates
- CoinGecko for providing cryptocurrency price data
- Expo team for the excellent development platform
- React Navigation for the navigation solution

---

Built with ❤️ using React Native and Expo

# Fin
