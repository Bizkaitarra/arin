import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'bizkaitarra.arin',
  appName: 'Arin',
  webDir: 'dist',
  android: {
    versionCode: 1.01
  },
  plugins: {
    AdMob: {
      android: {
        appId: 'ca-app-pub-6441432321179917~5097888783', // Aquí va el Código 1 (ID de la aplicación)
        bannerAdId: 'ca-app-pub-6441432321179917/8474861162', // Aquí va el Código 2 (ID del bloque de anuncios de banner)
        position: 'BOTTOM', // Posición del banner (puedes usar 'BOTTOM' o 'TOP')
      },
    },
  }
};

export default config;
