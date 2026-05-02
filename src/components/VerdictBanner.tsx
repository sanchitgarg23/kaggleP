import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme';
import { Verdict } from '../types';

const verdictCopy: Record<Verdict, string> = {
  ANTIBIOTIC_RECOMMENDED: 'Antibiotic Recommended',
  NO_ANTIBIOTIC_MONITOR: 'Monitor - Antibiotic Not Indicated Yet',
  NO_ANTIBIOTIC_VIRAL: 'NO ANTIBIOTIC - Likely Viral',
  REFER_IMMEDIATELY: 'REFER IMMEDIATELY - Do not treat here',
};

export function VerdictBanner({ verdict }: { verdict: Verdict }) {
  const style =
    verdict === 'ANTIBIOTIC_RECOMMENDED'
      ? styles.green
      : verdict === 'NO_ANTIBIOTIC_MONITOR'
        ? styles.amber
        : verdict === 'NO_ANTIBIOTIC_VIRAL'
          ? styles.redOutline
          : styles.darkRed;

  const textStyle = verdict === 'NO_ANTIBIOTIC_MONITOR' ? styles.darkText : styles.lightText;

  return (
    <View style={[styles.banner, style]}>
      <Text style={[styles.title, textStyle]}>{verdictCopy[verdict]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: 0,
    padding: 20,
    width: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0,
    textAlign: 'center',
  },
  green: {
    backgroundColor: colors.primary,
  },
  amber: {
    backgroundColor: colors.warning,
  },
  redOutline: {
    backgroundColor: '#FFFFFF',
    borderColor: colors.danger,
    borderWidth: 2,
  },
  darkRed: {
    backgroundColor: colors.darkRed,
  },
  lightText: {
    color: '#FFFFFF',
  },
  darkText: {
    color: '#2F2414',
  },
});
