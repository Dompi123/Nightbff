module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect', './jest.setup.js'],
  // Optional: Add transformIgnorePatterns if needed for specific libraries later
  // transformIgnorePatterns: [
  //   'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  // ],
  // Optional: Configure coverage reports later
  // collectCoverage: true,
  // coverageReporters: ["json", "lcov", "text", "clover"],
};
