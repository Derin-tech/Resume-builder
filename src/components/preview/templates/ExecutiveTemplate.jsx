import React from 'react';
import { isEmpty, formatDateRange } from '../../../lib/resumeUtils';
import { Mail as MailIcon, Phone as PhoneIcon, MapPin as MapPinIcon, Link as LinkedinIcon, Globe as GlobeIcon } from 'lucide-react';

export default function ExecutiveTemplate({ data, accentColor = '#4f6ef7' }) {
  const contactFields = [
    { value: data.contact.email, icon: MailIcon },
    { value: data.contact.phone, icon: PhoneIcon },
    { value: data.contact.location, icon: MapPinIcon },
    { value: data.contact.linkedin, icon: LinkedinIcon },
    { value: data.contact.website, icon: GlobeIcon },
  ].filter(item => !isEmpty(item.value));

  const SectionTitle = ({ children }) => (
    <div className="flex items-center gap-2 mb-2 mt-4 first:mt-0">
      <h2 style={{color: accentColor}} className="text-[8px] font-bold tracking-widest uppercase whitespace-nowrap">{children}</h2>
      <div className="flex-1 h-px" style={{backgroundColor: accentColor, opacity: 0.2}} />
    </div>
  );

  return (
    <div id="resume-for-export" className="a4-page bg-white font-resume overflow-hidden flex" style={{padding: 0, display: 'flex'}}>
      <div className="w-[35%] min-h-full flex flex-col" style={{backgroundColor: accentColor, padding: '20mm 8mm'}}>
        <h1 className="text-[20px] font-bold text-white leading-tight mb-1">{data.contact.fullName || 'Your Name'}</h1>
        
        <div className="mt-2 mb-4 space-y-1.5">
          {contactFields.map((item, index) => {
            const Icon = item.icon;
            return (
              <p key={index} className="text-[9px] text-white/70 flex items-center gap-1.5 leading-tight">
                <Icon size={9} /> {item.value}
              </p>
            );
          })}
        </div>

        <div className="w-8 h-0.5 bg-white/30 my-4" />

        {!isEmpty(data.skills) && (
          <div>
            <p className="text-[8px] font-bold text-white/60 uppercase tracking-widest mb-2">Skills</p>
            {data.skills.map(skill => (
              <div key={skill.id} className="mb-1">
                <p className="text-[9px] text-white font-medium">{skill.name}</p>
                <div className="h-0.5 bg-white/20 rounded-full mt-0.5">
                  <div className="h-full bg-white/60 rounded-full" style={{width: '80%'}} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col" style={{padding: '20mm 10mm 20mm 8mm'}}>
        {!isEmpty(data.summary) && (
          <div>
            <SectionTitle>Summary</SectionTitle>
            <p className="text-[10px] text-surface-700 leading-relaxed whitespace-pre-line">{data.summary}</p>
          </div>
        )}

        {!isEmpty(data.experience) && (
          <div>
            <SectionTitle>Experience</SectionTitle>
            {data.experience.map(item => (
              <div key={item.id} className="mb-3 last:mb-0">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-[11px] text-surface-900">{item.jobTitle}</span>
                    {item.company && <span className="text-[10px] text-surface-500 italic"> at {item.company}</span>}
                  </div>
                  <span className="text-[9px] text-surface-400">{formatDateRange(item.startDate, item.endDate, item.current)}</span>
                </div>
                {item.location && <p className="text-[9px] text-surface-400 mb-0.5">{item.location}</p>}
                {!isEmpty(item.description) && (
                  <p className="text-[10px] text-surface-700 leading-relaxed whitespace-pre-line mt-1">{item.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {!isEmpty(data.education) && (
          <div>
            <SectionTitle>Education</SectionTitle>
            {data.education.map(item => (
              <div key={item.id} className="mb-2 last:mb-0">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-[11px] text-surface-900">
                    {item.degree}{item.fieldOfStudy ? `, ${item.fieldOfStudy}` : ''}
                  </span>
                  <span className="text-[9px] text-surface-400">{item.graduationYear}</span>
                </div>
                {item.institution && <p className="text-[10px] text-surface-600 italic">{item.institution}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
