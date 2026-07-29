const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Allow .tflite model files and .wasm files (for expo-sqlite on web) to be bundled as assets
config.resolver.assetExts.push('tflite', 'wasm');

module.exports = config;
