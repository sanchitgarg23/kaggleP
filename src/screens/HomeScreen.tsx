import { useCallback, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Button } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';

import { checkOllamaStatus } from '../services/gemma';
import { useAppStore } from '../store/useAppStore';
import { colors } from '../theme';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const isOllamaOnline = useAppStore((state) => state.isOllamaOnline);
  const setOllamaOnline = useAppStore((state) => state.setOllamaOnline);
  const loadHistory = useAppStore((state) => state.loadHistory);

  const refreshStatus = useCallback(async () => {
    setOllamaOnline(await checkOllamaStatus());
  }, [setOllamaOnline]);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  useFocusEffect(
    useCallback(() => {
      void refreshStatus();
    }, [refreshStatus]),
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <PillIcon />
            <Text style={styles.title}>RxRight</Text>
          </View>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: isOllamaOnline ? colors.primary : '#A7B1AD' }]} />
            <Text style={styles.statusText}>{isOllamaOnline ? 'Local Gemma ready' : 'Ollama offline'}</Text>
          </View>
        </View>

        <View style={styles.center}>
          <Text style={styles.tagline}>Smarter prescribing. Offline. Always.</Text>
          <Button mode="contained" onPress={() => navigation.navigate('Assessment')} style={styles.primaryButton} contentStyle={styles.buttonContent}>
            New Patient Assessment
          </Button>
          <Button mode="text" onPress={() => navigation.navigate('History')} labelStyle={styles.link}>
            View History
          </Button>
        </View>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>Powered by Gemma 4 E4B · Offline</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

function PillIcon() {
  return (
    <Svg width={36} height={36} viewBox="0 0 36 36">
      <Path
        d="M12.2 27.4a7.1 7.1 0 0 1 0-10l5.2-5.2a7.08 7.08 0 1 1 10 10l-5.2 5.2a7.1 7.1 0 0 1-10 0Zm2.2-2.2a4 4 0 0 0 5.6 0l2.6-2.6-5.6-5.6-2.6 2.6a4 4 0 0 0 0 5.6Zm5-10.4 5.6 5.6.2-.2a4 4 0 0 0-5.6-5.6l-.2.2Z"
        fill={colors.primary}
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: colors.background,
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
  },
  header: {
    gap: 14,
  },
  logoRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  title: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 0,
  },
  statusRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  statusDot: {
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  statusText: {
    color: colors.muted,
    fontSize: 14,
  },
  center: {
    gap: 18,
  },
  tagline: {
    color: colors.text,
    fontSize: 25,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 32,
  },
  primaryButton: {
    borderRadius: 10,
  },
  buttonContent: {
    minHeight: 56,
  },
  link: {
    color: colors.primary,
    fontWeight: '800',
  },
  badge: {
    alignSelf: 'center',
    backgroundColor: '#EAF7F2',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  badgeText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '800',
  },
});
