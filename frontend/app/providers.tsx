import { PropsWithChildren } from 'react';
import { PaperProvider, MD3DarkTheme, configureFonts } from 'react-native-paper';
import { AuthProvider } from '../contexts/AuthContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

const fontConfig = {
  displayLarge: { fontSize: 57 },
  displayMedium: { fontSize: 45 },
  displaySmall: { fontSize: 36 },
  headlineLarge: { fontSize: 32 },
  headlineMedium: { fontSize: 28 },
  headlineSmall: { fontSize: 24 },
  titleLarge: { fontSize: 22 },
  titleMedium: { fontSize: 16 },
  titleSmall: { fontSize: 14 },
  bodyLarge: { fontSize: 16 },
  bodyMedium: { fontSize: 14 },
  bodySmall: { fontSize: 12 },
  labelLarge: { fontSize: 14 },
  labelMedium: { fontSize: 12 },
  labelSmall: { fontSize: 11 },
};

const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#4CAF50',
    secondary: '#2196F3',
    background: '#121212',
    surface: '#1C1C1E',
  },
  fonts: configureFonts({ config: fontConfig }),
};

export default function Providers({ children }: PropsWithChildren) {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <AuthProvider>
          <PaperProvider theme={theme}>
            {children}
          </PaperProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 