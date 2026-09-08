import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'react-native': path.resolve(__dirname, './src/test/react-native-mock.tsx'),
      'expo-router': path.resolve(__dirname, './src/test/expo-router-mock.tsx'),
      'expo-status-bar': path.resolve(__dirname, './src/test/expo-status-bar-mock.tsx'),
      'react': path.resolve(__dirname, '../../node_modules/react'),
      'react-dom': path.resolve(__dirname, '../../node_modules/react-dom')
    },
    dedupe: ['react', 'react-dom']
  }
});
