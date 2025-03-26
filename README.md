# Lockbox - Secure Password Manager

A modern, secure password manager built with React Native and Electron, supporting desktop, web, and mobile platforms.

## Features

- 🔒 Strong encryption using AES-256 or ChaCha20
- 📱 Cross-platform support (Desktop, Web, iOS & Android)
- 🔑 KeePass database format (.kdbx) compatibility
- 🎨 Modern, user-friendly interface
- 🔄 Password history and secure storage
- 📎 File attachments support
- 📲 Biometric authentication on mobile

## Development Requirements

- Node.js 18+ 
- npm 8+
- Git
- For iOS:
  - macOS
  - Xcode 14+
  - CocoaPods
- For Android:
  - Android Studio
  - JDK 11+
  - Android SDK 33+

## Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/lockbox.git
cd lockbox

# Install dependencies
npm install

# Install iOS dependencies (macOS only)
cd ios && pod install && cd ..

# Start development server (Web + Electron)
npm run electron-dev

# Start development server (Mobile)
npm start
```

## Build Instructions

### Mobile Apps

#### iOS
```bash
# Install dependencies
npm install
cd ios && pod install && cd ..

# Run in development
npm run ios

# Build for release
cd ios
xcodebuild -workspace Lockbox.xcworkspace -scheme Lockbox -configuration Release -sdk iphoneos build
```

#### Android
```bash
# Install dependencies
npm install

# Run in development
npm run android

# Build APK
cd android
./gradlew assembleRelease

# Build App Bundle
./gradlew bundleRelease
```

### Web Version

```bash
# Build for web
npm run build

# Preview web build
npm run preview
```

### Desktop Version (Electron)

```bash
# Development
npm run electron-dev

# Build for current platform
npm run electron-build

# Build specific formats
npm run electron:build:dir      # Unpacked directory
npm run electron:build:appimage # Linux AppImage
```

### Platform-Specific Desktop Builds

#### Windows
```bash
# Install dependencies
npm install

# Build Windows executable
npm run electron-build -- --win
```

#### macOS
```bash
# Install dependencies
npm install

# Build macOS app
npm run electron-build -- --mac
```

#### Linux
```bash
# Install dependencies
npm install

# Build Linux package
npm run electron-build -- --linux

# Build specific formats
npm run electron-build -- --linux deb
npm run electron-build -- --linux rpm
npm run electron-build -- --linux AppImage
```

## Project Structure

```
lockbox/
├── android/          # Android specific code
├── ios/             # iOS specific code
├── electron/        # Electron main process code
├── src/
│   ├── components/  # React Native components
│   ├── contexts/    # React contexts
│   ├── screens/     # Screen components
│   ├── services/    # Business logic
│   └── types/       # TypeScript types
├── public/          # Static assets
└── dist/           # Build output
```

## Development Notes

- The app uses React Native for mobile and web platforms
- Electron's IPC for secure file system operations on desktop
- All cryptographic operations are performed using the KeePass-compatible libraries
- The UI is built with React Native components
- Database operations are handled securely per platform
- Mobile platforms use secure storage and biometric authentication

## Security

- Uses KeePass-compatible encryption
- Implements secure password storage
- Biometric authentication on mobile devices
- Secure enclave usage on iOS
- Android Keystore integration
- No telemetry or data collection
- Regular security updates

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
