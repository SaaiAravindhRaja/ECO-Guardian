# ECO-Guardian 🌱

A gamified Augmented Reality creature collection app that promotes sustainable behaviors aligned with Singapore's Green Plan 2030.

## Features

- **AR Creature Collection**: Discover and collect Singapore-themed creatures through AR
- **Location-Based Spawning**: Creatures spawn at eco-friendly locations (parks, EV stations, recycling centers)
- **Sustainability Challenges**: Complete daily and weekly eco-friendly tasks
- **Social Sharing**: Share AR photos and achievements on social media
- **Progress Tracking**: Monitor your environmental impact and sustainability streak
- **Evolution System**: Evolve creatures based on sustained eco-habits

## Tech Stack

- **Frontend**: React Native with Expo
- **AR Framework**: ARCore/ARKit via react-native-arcore
- **Backend**: Firebase (Realtime Database, Authentication, Cloud Functions, Storage)
- **State Management**: Redux Toolkit
- **Location Services**: OneMap API (Singapore)
- **Environmental Data**: NEA API, PUB API, Smart Nation Sensors

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/eco-guardian-app.git
cd eco-guardian-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your Firebase and API keys
```

4. Start the development server:
```bash
npm start
```

5. Run on device/simulator:
```bash
npm run ios    # for iOS
npm run android # for Android
```

## Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (Auth, etc.)
├── navigation/         # Navigation configuration
├── screens/           # Screen components
│   ├── ar/           # AR camera and related screens
│   ├── auth/         # Authentication screens
│   ├── challenges/   # Challenge screens
│   ├── creatures/    # Creature collection screens
│   ├── map/          # Map and location screens
│   └── profile/      # User profile screens
├── services/          # API services and business logic
├── store/            # Redux store and slices
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## Green Plan 2030 Integration

The app aligns with Singapore's Green Plan 2030 through five key pillars:

1. **City in Nature** 🌳 - Nature parks and community gardens spawn Greenie creatures
2. **Energy Reset** ⚡ - EV charging stations spawn Sparkie creatures  
3. **Sustainable Living** ♻️ - Recycling centers spawn Binities creatures
4. **Green Economy** 💚 - Green business locations spawn special creatures
5. **Resilient Future** 💧 - ABC Waters sites spawn Drippies creatures

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Testing

```bash
npm test              # Run unit tests
npm run test:watch    # Run tests in watch mode
npm run lint          # Run ESLint
npm run type-check    # Run TypeScript type checking
```

## Deployment

The app can be deployed using Expo's build service:

```bash
expo build:ios        # Build for iOS
expo build:android    # Build for Android
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Singapore's Green Plan 2030 initiative
- OneMap API for Singapore location data
- NEA for environmental data APIs
- Firebase for backend infrastructure