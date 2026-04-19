import { pdf } from '@react-pdf/renderer'
import { createElement } from 'react'
import ResumePDFDocument from '../components/pdf/ResumePDFDocument'

export async function exportToPDF(resumeData, activeTemplate, fileName) {
  const safeFileName = (fileName || resumeData.contact?.fullName || 'resume')
    .trim()
    .replace(/[^a-z0-9]/gi, '_')
    .toLowerCase()

  // Deep clone to strip any Zustand proxy wrappers
  const plainData = JSON.parse(JSON.stringify(resumeData))

  const element = createElement(ResumePDFDocument, {
    resumeData: plainData,
    activeTemplate,
  })

  // Debug log to ensure payload looks right before mapping
  console.log('PDF data being passed:', JSON.stringify(plainData, null, 2))

  try {
    const blob = await pdf(element).toBlob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${safeFileName}_resume.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (err) {
    console.error('PDF generation error:', err)
    throw err
  }
}
