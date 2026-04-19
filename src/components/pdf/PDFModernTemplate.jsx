import React from 'react'
import { Page, View, Text, StyleSheet } from '@react-pdf/renderer'
import { formatDateRange, isEmpty } from '../../lib/resumeUtils'

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: '#1e293b',
    padding: '15mm 18mm',
    backgroundColor: '#ffffff',
  },
  header: {
    borderBottomWidth: 2,
    borderBottomColor: '#4f6ef7',
    borderBottomStyle: 'solid',
    paddingBottom: 10,
    marginBottom: 4,
  },
  name: {
    fontSize: 22,
    fontWeight: 700,
    color: '#0f172a',
    marginBottom: 5,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  contactItem: {
    fontSize: 8,
    color: '#64748b',
    marginRight: 4,
  },
  contactDot: {
    fontSize: 8,
    color: '#64748b',
    marginRight: 4,
  },
  sectionContainer: {
    marginTop: 10,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 7.5,
    fontWeight: 700,
    color: '#4f6ef7',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginRight: 8,
  },
  sectionLine: {
    flex: 1,
    height: 0.5,
    backgroundColor: '#c7d7fe',
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
    color: '#0f172a',
  },
  entryDate: {
    fontSize: 8,
    color: '#94a3b8',
  },
  entrySubtitle: {
    fontSize: 8.5,
    color: '#475569',
    fontStyle: 'italic',
    marginBottom: 2,
  },
  entryDescription: {
    fontSize: 8.5,
    color: '#334155',
    lineHeight: 1.5,
  },
  summaryText: {
    fontSize: 9,
    color: '#475569',
    lineHeight: 1.6,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillPill: {
    backgroundColor: '#ede9fe',
    borderWidth: 0.5,
    borderColor: '#c4b5fd',
    borderRadius: 99,
    paddingVertical: 2,
    paddingHorizontal: 7,
    marginRight: 4,
    marginBottom: 4,
  },
  skillText: {
    fontSize: 7.5,
    color: '#5b21b6',
    fontWeight: 700,
  },
})

export default function PDFModernTemplate({ data }) {
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
  ].filter(val => val && val.trim().length > 0)

  return (
    <Page size="A4" style={styles.page}>
      <View style={[styles.header, { borderBottomColor: accentColor }]}>
        <Text style={styles.name}>{contact.fullName || 'Your Name'}</Text>
        <View style={styles.contactRow}>
          {contactFields.map((val, idx) => (
            <React.Fragment key={idx}>
              <Text style={styles.contactItem}>{val}</Text>
              {idx < contactFields.length - 1 && <Text style={styles.contactDot}>·</Text>}
            </React.Fragment>
          ))}
        </View>
      </View>

      {!isEmpty(summary) && (
        <View style={styles.sectionContainer}>
          <View style={styles.sectionTitleRow}>
            <Text style={[styles.sectionTitle, { color: accentColor }]}>Professional Summary</Text>
            <View style={styles.sectionLine} />
          </View>
          <Text style={styles.summaryText}>{summary}</Text>
        </View>
      )}

      {!isEmpty(experience) && (
        <View style={styles.sectionContainer}>
          <View style={styles.sectionTitleRow}>
            <Text style={[styles.sectionTitle, { color: accentColor }]}>Work Experience</Text>
            <View style={styles.sectionLine} />
          </View>
          {experience.map(item => (
            <View key={item.id} style={styles.entryContainer}>
              <View style={styles.entryHeaderRow}>
                <Text style={styles.entryTitle}>
                  {item.jobTitle}{item.company ? ` at ${item.company}` : ''}
                </Text>
                <Text style={styles.entryDate}>{formatDateRange(item.startDate, item.endDate, item.current)}</Text>
              </View>
              {item.location && <Text style={styles.entrySubtitle}>{item.location}</Text>}
              {item.description && <Text style={styles.entryDescription}>{item.description}</Text>}
            </View>
          ))}
        </View>
      )}

      {!isEmpty(education) && (
        <View style={styles.sectionContainer}>
          <View style={styles.sectionTitleRow}>
            <Text style={[styles.sectionTitle, { color: accentColor }]}>Education</Text>
            <View style={styles.sectionLine} />
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
          <View style={styles.sectionTitleRow}>
            <Text style={[styles.sectionTitle, { color: accentColor }]}>Skills</Text>
            <View style={styles.sectionLine} />
          </View>
          <View style={styles.skillsRow}>
            {skills.map(skill => (
              <View key={skill.id} style={styles.skillPill}>
                <Text style={styles.skillText}>{skill.name}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </Page>
  )
}
