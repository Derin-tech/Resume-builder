import { create } from 'zustand';

const pushHistory = (state) => {
  const newHistory = state.history.slice(0, state.historyIndex + 1);
  newHistory.push(JSON.parse(JSON.stringify(state.resumeData)));
  return {
    history: newHistory.slice(-50),
    historyIndex: Math.min(newHistory.length - 1, 49)
  };
};

export const useResumeStore = create((set, get) => ({
  resumeData: {
    contact: { fullName: '', email: '', phone: '', location: '', linkedin: '', website: '' },
    summary: '',
    experience: [],
    education: [],
    skills: [],
  },
  activeTemplate: 'modern',
  isSaving: false,
  lastSaved: null,
  accentColor: '#4f6ef7',
  history: [],
  historyIndex: -1,

  setAccentColor: (color) => set({ accentColor: color }),

  updateContact: (field, value) => 
    set((state) => ({ 
      ...pushHistory(state),
      resumeData: { 
        ...state.resumeData, 
        contact: { ...state.resumeData.contact, [field]: value } 
      } 
    })),
  
  updateSummary: (value) =>
    set((state) => ({
      ...pushHistory(state),
      resumeData: {
        ...state.resumeData,
        summary: value
      }
    })),
    
  addExperience: () =>
    set((state) => ({
      ...pushHistory(state),
      resumeData: {
        ...state.resumeData,
        experience: [
          ...state.resumeData.experience,
          { id: crypto.randomUUID(), jobTitle: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '' }
        ]
      }
    })),
    
  updateExperience: (id, field, value) =>
    set((state) => ({
      ...pushHistory(state),
      resumeData: {
        ...state.resumeData,
        experience: state.resumeData.experience.map(exp => 
          exp.id === id ? { ...exp, [field]: value } : exp
        )
      }
    })),
    
  removeExperience: (id) =>
    set((state) => ({
      ...pushHistory(state),
      resumeData: {
        ...state.resumeData,
        experience: state.resumeData.experience.filter(exp => exp.id !== id)
      }
    })),

  reorderExperience: (newArray) =>
    set((state) => ({
      ...pushHistory(state),
      resumeData: {
        ...state.resumeData,
        experience: newArray
      }
    })),

  addEducation: () =>
    set((state) => ({
      ...pushHistory(state),
      resumeData: {
        ...state.resumeData,
        education: [
          ...state.resumeData.education,
          { id: crypto.randomUUID(), institution: '', degree: '', fieldOfStudy: '', graduationYear: '' }
        ]
      }
    })),

  updateEducation: (id, field, value) =>
    set((state) => ({
      ...pushHistory(state),
      resumeData: {
        ...state.resumeData,
        education: state.resumeData.education.map(edu => 
          edu.id === id ? { ...edu, [field]: value } : edu
        )
      }
    })),

  removeEducation: (id) =>
    set((state) => ({
      ...pushHistory(state),
      resumeData: {
        ...state.resumeData,
        education: state.resumeData.education.filter(edu => edu.id !== id)
      }
    })),

  reorderEducation: (newArray) =>
    set((state) => ({
      ...pushHistory(state),
      resumeData: {
        ...state.resumeData,
        education: newArray
      }
    })),

  addSkill: (name) =>
    set((state) => {
      const trimmedName = name.trim();
      if (!trimmedName || state.resumeData.skills.some(skill => skill.name === trimmedName)) return state;
      return {
        ...pushHistory(state),
        resumeData: {
          ...state.resumeData,
          skills: [...state.resumeData.skills, { id: crypto.randomUUID(), name: trimmedName }]
        }
      };
    }),

  removeSkill: (id) =>
    set((state) => ({
      ...pushHistory(state),
      resumeData: {
        ...state.resumeData,
        skills: state.resumeData.skills.filter(skill => skill.id !== id)
      }
    })),

  undo: () => set(state => {
    if (state.historyIndex < 0) return state;
    const newIndex = state.historyIndex - 1;
    const resumeData = newIndex >= 0 ? state.history[newIndex] : state.resumeData;
    return { historyIndex: newIndex, resumeData: JSON.parse(JSON.stringify(resumeData)) };
  }),

  redo: () => set(state => {
    if (state.historyIndex >= state.history.length - 1) return state;
    const newIndex = state.historyIndex + 1;
    return { historyIndex: newIndex, resumeData: JSON.parse(JSON.stringify(state.history[newIndex])) };
  }),

  setTemplate: (name) => set({ activeTemplate: name }),
  setIsSaving: (bool) => set({ isSaving: bool }),
  loadFullResume: (data) => set({ resumeData: data }),
  getSnapshot: () => JSON.parse(JSON.stringify(get().resumeData))
}));
