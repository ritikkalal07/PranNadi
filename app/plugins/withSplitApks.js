const { withAppBuildGradle } = require('@expo/config-plugins');

module.exports = function withSplitApks(config) {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language === 'groovy') {
      const buildGradle = config.modResults.contents;
      
      // Inject ABI splits block if it doesn't exist
      if (!buildGradle.includes('splits {')) {
        const splitsBlock = `
    splits {
        abi {
            reset()
            enable true
            universalApk false
            include "armeabi-v7a", "arm64-v8a", "x86", "x86_64"
        }
    }`;
        
        // Insert right inside android { ... }
        config.modResults.contents = buildGradle.replace(
          /android\s*\{/,
          `android {${splitsBlock}`
        );
      }
    }
    return config;
  });
};
