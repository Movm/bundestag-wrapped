const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Watch the parent src/ directory for DOM components
config.watchFolders = [
  path.resolve(__dirname, "../src"),
  path.resolve(__dirname, "../public"),
];

// Resolve path aliases
// @/ -> ../src/ (shared web source)
// ~/ -> ./    (local mobile files)
config.resolver.alias = {
  "@": path.resolve(__dirname, "../src"),
  "~": path.resolve(__dirname),
};

// Allow importing from parent directory
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, "node_modules"),
  path.resolve(__dirname, "../node_modules"),
];

module.exports = withNativeWind(config, { input: "./global.css" });
