import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme';
import { GemmaResponse } from '../types';

type AwareCategory = NonNullable<GemmaResponse['treatment']>['aware_category'];

interface Props {
  category: AwareCategory;
}

export function AwareBadge({ category }: Props) {
  const backgroundColor =
    category === 'ACCESS' ? colors.primary : category === 'WATCH' ? colors.warning : colors.danger;

  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <Text style={styles.text}>{category}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0,
  },
});
