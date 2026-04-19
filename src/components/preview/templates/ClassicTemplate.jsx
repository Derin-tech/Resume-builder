import React from 'react';
import { isEmpty, formatDateRange } from '../../../lib/resumeUtils';

const SectionTitle = ({ children, color }) => (
  <div className="mt-5 mb-2">
    <h2 className="text-[11px] font-bold tracking-[0.12em] uppercase pb-1 border-b-2" style={{ color: color, borderColor: color }}>
      {children}
    </h2>
  </div>
);

export default function ClassicTemplate({ data, accentColor = '#111827' }) {
  const contactFields = [
    data.contact.email,
    data.contact.phone,
    data.contact.location,
    data.contact.linkedin,
    data.contact.website,
  ].filter(item => !isEmpty(item));

  return (
    <div id="resume-for-export" className="a4-page bg-white font-resume text-[13px] leading-relaxed text-gray-900 overflow-hidden px-[18mm] py-[15mm]">
      <div className="text-center border-b border-gray-300 pb-4 mb-2">
        <h1 className="text-[26px] font-bold text-gray-900 tracking-wide mb-2 uppercase font-resume">
          {data.contact.fullName || 'Your Name'}
        </h1>
        {contactFields.length > 0 && (
          <p className="text-[11px] text-gray-600 tracking-wide">
            {contactFields.join('  |  ')}
          </p>
        )}
      </div>

      {!isEmpty(data.summary) && (
        <div>
          <SectionTitle color={accentColor}>Summary</SectionTitle>
          <p className="text-[12.5px] text-gray-800 leading-relaxed whitespace-pre-line">{data.summary}</p>
        </div>
      )}

      {!isEmpty(data.experience) && (
        <div>
          <SectionTitle color={accentColor}>Experience</SectionTitle>
          {data.experience.map((item) => (
            <div key={item.id} className="mb-4 last:mb-0">
              <div className="flex justify-between items-baseline w-full">
                <span className="font-bold text-[13px] text-gray-900">{item.jobTitle}</span>
                <span className="text-[11px] text-gray-600 whitespace-nowrap">
                  {formatDateRange(item.startDate, item.endDate, item.current)}
                </span>
              </div>
              <div className="flex justify-between items-baseline w-full">
                <span className="text-[12px] text-gray-700 italic">{item.company}</span>
                <span className="text-[11px] text-gray-500 whitespace-nowrap">{item.location}</span>
              </div>
              {!isEmpty(item.description) && (
                <p className="text-[12px] text-gray-700 leading-relaxed whitespace-pre-line mt-1.5">{item.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {!isEmpty(data.education) && (
        <div>
          <SectionTitle color={accentColor}>Education</SectionTitle>
          {data.education.map((item) => (
            <div key={item.id} className="mb-3 last:mb-0">
              <div className="flex justify-between items-baseline w-full">
                <span className="font-bold text-[13px]">
                  {item.degree}{item.fieldOfStudy ? `, ${item.fieldOfStudy}` : ''}
                </span>
                <span className="text-[11px] text-gray-600 whitespace-nowrap">{item.graduationYear}</span>
              </div>
              <p className="text-[12px] text-gray-700 italic">{item.institution}</p>
            </div>
          ))}
        </div>
      )}

      {!isEmpty(data.skills) && (
        <div>
          <SectionTitle color={accentColor}>Skills</SectionTitle>
          <p className="text-[12px] text-gray-800">
            {data.skills.map(s => s.name).join('  ·  ')}
          </p>
        </div>
      )}
    </div>
  );
}
