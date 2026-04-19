import React from 'react'
import { Page, View, Text, StyleSheet } from '@react-pdf/renderer'
import { formatDateRange, isEmpty } from '../../lib/resumeUtils'

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: '#111827',
    padding: '15mm 18mm',
    backgroundColor: '#ffffff',
  },
  header: {
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
    borderBottomStyle: 'solid',
    paddingBottom: 8,
    marginBottom: 4,
    alignItems: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: 700,
    color: '#111827',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 4,
  },
  contactLine: {
    fontSize: 8,
    color: '#4b5563',
    letterSpacing: 0.5,
  },
  sectionContainer: {
    marginTop: 10,
  },
  sectionTitleRow: {
    borderBottomWidth: 1.5,
    borderBottomColor: '#111827',
    borderBottomStyle: 'solid',
    paddingBottom: 2,
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 8,
    fontWeight: 700,
    color: '#111827',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  entryContainer: {
    marginBottom: 8,
  },
  entryHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 1,
  },
  entryTitle: {
    fontSize: 9.5,
    fontWeight: 700,
    color: '#111827',
  },
  entryDate: {
    fontSize: 8,
    color: '#6b7280',
  },
  entrySubRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  entrySubtitle: {
    fontSize: 8.5,
    color: '#374151',
    fontStyle: 'italic',
  },
  entryLocation: {
    fontSize: 8,
    color: '#9ca3af',
  },
  entryDescription: {
    fontSize: 8.5,
    color: '#374151',
    lineHeight: 1.5,
  },
  summaryText: {
    fontSize: 9,
    color: '#374151',
    lineHeight: 1.6,
  },
  skillsText: {
    fontSize: 9,
    color: '#1f2937',
    lineHeight: 1.6,
  },
})

export default function PDFClassicTemplate({ data }) {
  const contact = data?.contact || {}
  const summary = data?.summary || ''
  const experience = data?.experience || []
  const education = data?.education || []
  const skills = data?.skills || []
  const accentColor = data?.accentColor || '#111827'

  const contactFields = [
    contact.email,
    contact.phone,
    contact.location,
    contact.linkedin,
    contact.website
  ].filter(val => val && val.trim().length > 0)

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.name}>{contact.fullName || 'YOUR NAME'}</Text>
        <Text style={styles.contactLine}>{contactFields.join('  |  ')}</Text>
      </View>

      {!isEmpty(summary) && (
        <View style={styles.sectionContainer}>
          <View style={[styles.sectionTitleRow, { borderBottomColor: accentColor }]}>
            <Text style={[styles.sectionTitle, { color: accentColor }]}>Professional Summary</Text>
          </View>
          <Text style={styles.summaryText}>{summary}</Text>
        </View>
      )}

      {!isEmpty(experience) && (
        <View style={styles.sectionContainer}>
          <View style={[styles.sectionTitleRow, { borderBottomColor: accentColor }]}>
            <Text style={[styles.sectionTitle, { color: accentColor }]}>Work Experience</Text>
          </View>
          {experience.map(item => (
            <View key={item.id} style={styles.entryContainer}>
              <View style={styles.entryHeaderRow}>
                <Text style={styles.entryTitle}>{item.jobTitle}</Text>
                <Text style={styles.entryDate}>{formatDateRange(item.startDate, item.endDate, item.current)}</Text>
              </View>
              <View style={styles.entrySubRow}>
                <Text style={styles.entrySubtitle}>{item.company}</Text>
                <Text style={styles.entryLocation}>{item.location}</Text>
              </View>
              {item.description && <Text style={styles.entryDescription}>{item.description}</Text>}
            </View>
          ))}
        </View>
      )}

      {!isEmpty(education) && (
        <View style={styles.sectionContainer}>
          <View style={[styles.sectionTitleRow, { borderBottomColor: accentColor }]}>
            <Text style={[styles.sectionTitle, { color: accentColor }]}>Education</Text>
          </View>
          {education.map(item => (
            <View key={item.id} style={styles.entryContainer}>
              <View style={styles.entryHeaderRow}>
                <Text style={styles.entryTitle}>
                  {item.degree}{item.fieldOfStudy ? ` in ${item.fieldOfStudy}` : ''}
                </Text>
                <Text style={styles.entryDate}>{item.graduationYear}</Text>
              </View>
              {item.institution && <Text style={styles.entrySubtitle}>{item.institution}</Text>}
            </View>
          ))}
        </View>
      )}

      {!isEmpty(skills) && (
        <View style={styles.sectionContainer}>
          <View style={[styles.sectionTitleRow, { borderBottomColor: accentColor }]}>
            <Text style={[styles.sectionTitle, { color: accentColor }]}>Skills</Text>
          </View>
          <Text style={styles.skillsText}>
            {skills.map(s => s.name).join('   ·   ')}
          </Text>
        </View>
      )}
    </Page>
  )
}
