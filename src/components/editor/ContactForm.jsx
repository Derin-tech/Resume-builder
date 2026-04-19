import React from 'react';
import Input from '../ui/Input';
import { useResumeStore } from '../../store/useResumeStore';

export default function ContactForm() {
  const { resumeData: { contact }, updateContact } = useResumeStore();

  return (
    <div className="p-6 space-y-4">
      <div>
        <h2 className="text-base font-semibold text-surface-900 mb-1">Contact Information</h2>
        <p className="text-xs text-surface-400 mb-5">This appears at the top of your resume</p>
      </div>

      <Input
        label="Full Name"
        id="fullName"
        placeholder="Jane Smith"
        value={contact.fullName}
        onChange={(e) => updateContact('fullName', e.target.value)}
      />
      <Input
        label="Email Address"
        id="email"
        type="email"
        placeholder="jane@example.com"
        value={contact.email}
        onChange={(e) => updateContact('email', e.target.value)}
      />
      <Input
        label="Phone"
        id="phone"
        type="tel"
        placeholder="+1 (555) 000-0000"
        value={contact.phone}
        onChange={(e) => updateContact('phone', e.target.value)}
      />
      <Input
        label="Location"
        id="location"
        placeholder="San Francisco, CA"
        value={contact.location}
        onChange={(e) => updateContact('location', e.target.value)}
      />
      <Input
        label="LinkedIn URL"
        id="linkedin"
        type="url"
        placeholder="linkedin.com/in/jane"
        value={contact.linkedin}
        onChange={(e) => updateContact('linkedin', e.target.value)}
      />
      <Input
        label="Website / Portfolio"
        id="website"
        type="url"
        placeholder="janesmith.dev"
        value={contact.website}
        onChange={(e) => updateContact('website', e.target.value)}
      />
    </div>
  );
}
