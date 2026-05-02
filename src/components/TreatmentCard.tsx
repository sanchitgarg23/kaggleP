import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AwareBadge } from './AwareBadge';
import { colors } from '../theme';
import { GemmaResponse } from '../types';

interface Props {
  treatment: NonNullable<GemmaResponse['treatment']>;
}

export function TreatmentCard({ treatment }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Recommended treatment</Text>
      <View style={styles.titleRow}>
        <Text style={styles.drug}>{treatment.drug_name}</Text>
        <AwareBadge category={treatment.aware_category} />
      </View>

      <InfoLine label="Dose" value={treatment.dose} />
      <InfoLine label="Frequency" value={treatment.frequency} />
      <InfoLine label="Duration" value={treatment.duration} />
      <InfoLine label="Route" value={treatment.route} />

      {!!treatment.weight_based_note && (
        <View style={styles.note}>
          <Text style={styles.noteText}>{treatment.weight_based_note}</Text>
        </View>
      )}

      <Pressable onPress={() => setExpanded((value) => !value)} style={styles.expandButton}>
        <Text style={styles.expandText}>Why not a stronger antibiotic?</Text>
        <Text style={styles.expandIcon}>{expanded ? '-' : '+'}</Text>
      </Pressable>
      {expanded && <Text style={styles.body}>{treatment.why_not_stronger}</Text>}
    </View>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.line}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    elevation: 1,
    gap: 10,
    padding: 16,
  },
  heading: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  drug: {
    color: colors.text,
    flexShrink: 1,
    fontSize: 24,
    fontWeight: '900',
  },
  line: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  label: {
    color: colors.muted,
    fontSize: 14,
  },
  value: {
    color: colors.text,
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'right',
  },
  note: {
    backgroundColor: '#EAF7F2',
    borderRadius: 8,
    padding: 12,
  },
  noteText: {
    color: colors.text,
    lineHeight: 20,
  },
  expandButton: {
    alignItems: 'center',
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
  },
  expandText: {
    color: colors.primary,
    flex: 1,
    fontWeight: '800',
  },
  expandIcon: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: '700',
  },
  body: {
    color: colors.text,
    lineHeight: 21,
  },
});
