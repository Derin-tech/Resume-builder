import React from 'react';
import { isEmpty, formatDateRange } from '../../../lib/resumeUtils';
import { Mail as MailIcon, Phone as PhoneIcon, MapPin as MapPinIcon, Link as LinkedinIcon, Globe as GlobeIcon } from 'lucide-react';

const SectionTitle = ({ children, color }) => (
  <div className="flex items-center gap-3 mb-3 mt-5">
    <h2 className="text-[10px] font-bold tracking-[0.15em] uppercase whitespace-nowrap" style={{ color }}>{children}</h2>
    <div className="flex-1 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
  </div>
);

export default function ModernTemplate({ data, accentColor = '#4f6ef7' }) {
  const contactFields = [
    { value: data.contact.email, icon: MailIcon },
    { value: data.contact.phone, icon: PhoneIcon },
    { value: data.contact.location, icon: MapPinIcon },
    { value: data.contact.linkedin, icon: LinkedinIcon },
    { value: data.contact.website, icon: GlobeIcon },
  ].filter(item => !isEmpty(item.value));

  return (
    <div id="resume-for-export" className="a4-page bg-white font-resume text-[13px] leading-relaxed text-surface-900 overflow-hidden px-[18mm] py-[15mm]">
      <div className="pb-4 border-b-2 mb-1" style={{ borderColor: accentColor }}>
        <h1 className="text-[28px] font-bold text-surface-900 leading-none mb-2 font-resume">
          {data.contact.fullName || 'Your Name'}
        </h1>
        {contactFields.length > 0 && (
          <div className="flex flex-wrap gap-x-4 gap-y-1 font-sans">
            {contactFields.map((item, index) => {
              const Icon = item.icon;
              return (
                <span key={index} className="text-[11px] text-surface-500 flex items-center gap-1">
                  <Icon size={11} />
                  {item.value}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {!isEmpty(data.summary) && (
        <div>
          <SectionTitle color={accentColor}>Professional Summary</SectionTitle>
          <p className="text-[12.5px] text-surface-700 leading-relaxed whitespace-pre-line">{data.summary}</p>
        </div>
      )}

      {!isEmpty(data.experience) && (
        <div>
          <SectionTitle color={accentColor}>Work Experience</SectionTitle>
          {data.experience.map((item) => (
            <div key={item.id} className="mb-4 last:mb-0">
              <div className="flex justify-between items-baseline font-sans">
                <div>
                  <span className="font-bold text-[13px] text-surface-900">{item.jobTitle}</span>
                  <span className="text-surface-500 text-[12px]"> at {item.company}</span>
                </div>
                <span className="text-[11px] text-surface-400 whitespace-nowrap">
                  {formatDateRange(item.startDate, item.endDate, item.current)}
                </span>
              </div>
              {item.location && <p className="text-[11px] text-surface-400 mb-1 font-sans">{item.location}</p>}
              {!isEmpty(item.description) && (
                <p className="text-[12px] text-surface-700 leading-relaxed whitespace-pre-line mt-1">{item.description}</p>
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
              <div className="flex justify-between items-baseline font-sans">
                <div className="font-bold text-[13px]">
                  {item.degree} {item.fieldOfStudy ? `in ${item.fieldOfStudy}` : ''}
                </div>
                <span className="text-[11px] text-surface-400">{item.graduationYear}</span>
              </div>
              <p className="text-[12px] text-surface-500 font-sans">{item.institution}</p>
            </div>
          ))}
        </div>
      )}

      {!isEmpty(data.skills) && (
        <div>
          <SectionTitle color={accentColor}>Skills</SectionTitle>
          <div className="flex flex-wrap gap-2 font-sans">
            {data.skills.map((skill) => (
              <span key={skill.id} className="text-[11px] bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-3 py-0.5 font-medium">
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
