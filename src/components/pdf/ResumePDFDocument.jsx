import React from 'react'
import { Document } from '@react-pdf/renderer'
import PDFModernTemplate from './PDFModernTemplate'
import PDFClassicTemplate from './PDFClassicTemplate'
import PDFExecutiveTemplate from './PDFExecutiveTemplate'

export default function ResumePDFDocument({ resumeData, activeTemplate }) {
  return (
    <Document
      title={resumeData?.contact?.fullName ? `${resumeData.contact.fullName} — Resume` : 'Resume'}
      author={resumeData?.contact?.fullName || ''}
      subject="Resume"
      creator="ResumeBuilder"
    >
      {activeTemplate === 'classic'
        ? <PDFClassicTemplate data={resumeData} />
        : activeTemplate === 'executive'
        ? <PDFExecutiveTemplate data={resumeData} />
        : <PDFModernTemplate data={resumeData} />
      }
    </Document>
  )
}
