import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.grea.greasanatomy',
  appName: "GREA's Anatomy",
  webDir: 'dist',
  server: {
    url: 'https://human-atlas-temp.pages.dev'
  }
};

export default config;
