import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'TestApp',
  webDir: 'dist',
  server: {
    androidScheme: 'http'
  },
  android: {
    allowMixedContent: true
  }
};

export default config;
