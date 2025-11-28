# Contributing to Fin

Thank you for your interest in contributing to Fin! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/Fin.git`
3. Install dependencies: `npm install`
4. Create a new branch: `git checkout -b feature/your-feature-name`

## Development

### Running the App

```bash
npm start
```

Then press:
- `i` for iOS simulator
- `a` for Android emulator
- `w` for web browser
- Scan QR code with Expo Go app

### Code Style

- Follow TypeScript best practices
- Use functional components with hooks
- Maintain consistent naming conventions
- Add comments for complex logic
- Keep components small and focused

### Project Structure

```
Fin/
├── components/     # Reusable UI components
├── screens/        # Screen components
├── store/          # Zustand state management
├── services/       # API and business logic
├── hooks/          # Custom React hooks
├── utils/          # Utility functions
├── constants/      # App constants
└── types/          # TypeScript definitions
```

## Making Changes

1. Make your changes in a feature branch
2. Test thoroughly on iOS and Android
3. Ensure TypeScript compiles without errors
4. Update documentation if needed
5. Commit with clear, descriptive messages

### Commit Message Format

```
type(scope): subject

body (optional)
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Example:
```
feat(converter): add currency favorites feature
```

## Pull Requests

1. Update the CHANGELOG.md
2. Ensure all tests pass (if applicable)
3. Update README.md if adding new features
4. Request review from maintainers
5. Address any feedback

## Reporting Issues

When reporting issues, please include:
- Device/OS version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Error messages/logs

## Feature Requests

For feature requests:
- Check existing issues first
- Describe the use case
- Explain the expected behavior
- Consider implementation complexity

Thank you for contributing! 🎉

