import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.niyyah.app',
  appName: 'NIYYAH',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
