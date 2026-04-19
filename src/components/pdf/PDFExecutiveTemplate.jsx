import React from 'react';
import { Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { formatDateRange, isEmpty } from '../../lib/resumeUtils';

const styles = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 9, flexDirection: 'row', backgroundColor: '#ffffff' },
  sidebar: { width: '35%', minHeight: '100%', padding: '15mm 8mm', flexDirection: 'column' },
  content: { flex: 1, padding: '15mm 10mm 15mm 8mm' },
  sidebarName: { fontSize: 16, fontWeight: 700, color: '#ffffff', marginBottom: 8, lineHeight: 1.2 },
  sidebarContact: { fontSize: 7.5, color: 'rgba(255,255,255,0.7)', marginBottom: 4 },
  sidebarDivider: { width: 24, height: 0.5, backgroundColor: 'rgba(255,255,255,0.3)', marginVertical: 10 },
  sidebarSectionLabel: { fontSize: 7, fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 },
  skillRow: { marginBottom: 5 },
  skillName: { fontSize: 8.5, color: '#ffffff', fontWeight: 700, marginBottom: 2 },
  skillBarBg: { height: 1.5, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2 },
  skillBarFill: { height: 1.5, backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 2, width: '75%' },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 4 },
  sectionTitle: { fontSize: 7.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2, marginRight: 6 },
  sectionLine: { flex: 1, height: 0.5, opacity: 0.25 },
  entryContainer: { marginBottom: 7 },
  entryHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 1 },
  entryTitle: { fontSize: 9, fontWeight: 700, color: '#0f172a' },
  entryDate: { fontSize: 7.5, color: '#94a3b8' },
  entrySubtitle: { fontSize: 8, color: '#475569', fontStyle: 'italic', marginBottom: 2 },
  entryDescription: { fontSize: 8, color: '#334155', lineHeight: 1.5 },
  summaryText: { fontSize: 8.5, color: '#475569', lineHeight: 1.6 },
});

export default function PDFExecutiveTemplate({ data }) {
  const contact = data?.contact || {}
  const summary = data?.summary || ''
  const experience = data?.experience || []
  const education = data?.education || []
  const skills = data?.skills || []
  const accentColor = data?.accentColor || '#4f6ef7'

  const contactFields = [
    contact.email,
    contact.phone,
    contact.location,
    contact.linkedin,
    contact.website
  ].filter(val => val && val.trim().length > 0);

  return (
    <Page size="A4" style={styles.page}>
      <View style={[styles.sidebar, { backgroundColor: accentColor }]}>
        <Text style={styles.sidebarName}>{contact.fullName || 'Your Name'}</Text>
        
        {contactFields.map((val, i) => (
          <Text key={i} style={styles.sidebarContact}>{val}</Text>
        ))}

        <View style={styles.sidebarDivider} />

        {!isEmpty(skills) && (
          <View>
            <Text style={styles.sidebarSectionLabel}>Skills</Text>
            {skills.map(skill => (
              <View key={skill.id} style={styles.skillRow}>
                <Text style={styles.skillName}>{skill.name}</Text>
                <View style={styles.skillBarBg}>
                  <View style={styles.skillBarFill} />
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.content}>
        {!isEmpty(summary) && (
          <View>
            <View style={styles.sectionTitleRow}>
              <Text style={[styles.sectionTitle, { color: accentColor }]}>Summary</Text>
              <View style={[styles.sectionLine, { backgroundColor: accentColor }]} />
            </View>
            <Text style={styles.summaryText}>{summary}</Text>
          </View>
        )}

        {!isEmpty(experience) && (
          <View>
            <View style={styles.sectionTitleRow}>
              <Text style={[styles.sectionTitle, { color: accentColor }]}>Experience</Text>
              <View style={[styles.sectionLine, { backgroundColor: accentColor }]} />
            </View>
            {experience.map(item => (
              <View key={item.id} style={styles.entryContainer}>
                <View style={styles.entryHeaderRow}>
                  <Text style={styles.entryTitle}>{item.jobTitle}</Text>
                  <Text style={styles.entryDate}>{formatDateRange(item.startDate, item.endDate, item.current)}</Text>
                </View>
                <Text style={styles.entrySubtitle}>{item.company}{item.location ? ` | ${item.location}` : ''}</Text>
                {item.description && <Text style={styles.entryDescription}>{item.description}</Text>}
              </View>
            ))}
          </View>
        )}

        {!isEmpty(education) && (
          <View>
            <View style={styles.sectionTitleRow}>
              <Text style={[styles.sectionTitle, { color: accentColor }]}>Education</Text>
              <View style={[styles.sectionLine, { backgroundColor: accentColor }]} />
            </View>
            {education.map(item => (
              <View key={item.id} style={styles.entryContainer}>
                <View style={styles.entryHeaderRow}>
                  <Text style={styles.entryTitle}>
                    {item.degree}{item.fieldOfStudy ? `, ${item.fieldOfStudy}` : ''}
                  </Text>
                  <Text style={styles.entryDate}>{item.graduationYear}</Text>
                </View>
                {item.institution && <Text style={styles.entrySubtitle}>{item.institution}</Text>}
              </View>
            ))}
          </View>
        )}
      </View>
    </Page>
  );
}
