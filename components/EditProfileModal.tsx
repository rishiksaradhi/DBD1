
import React, { useState, useRef } from 'react';
import { X, User as UserIcon, GraduationCap, Hash, Save, Image as ImageIcon, Upload, Calendar, Sparkles, Fingerprint, AlignLeft, Globe, Github, Instagram, Linkedin, Camera } from 'lucide-react';
import { User } from '../types';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSave: (updatedUser: User) => void;
  isInitialSetup?: boolean;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, user, onSave, isInitialSetup = false }) => {
  const [activeSection, setActiveSection] = useState<'identity' | 'academic' | 'social'>('identity');
  const [name, setName] = useState(isInitialSetup ? '' : user.name);
  const [rollNumber, setRollNumber] = useState(isInitialSetup ? 'AP' : user.rollNumber);
  const [major, setMajor] = useState(isInitialSetup ? '' : user.major);
  const [age, setAge] = useState(user.age || 18);
  const [bio, setBio] = useState(user.bio || '');
  const [interests, setInterests] = useState(isInitialSetup ? '' : user.interests.join(', '));
  const [avatar, setAvatar] = useState(user.avatar);
  const [github, setGithub] = useState(user.socialLinks?.github || '');
  const [instagram, setInstagram] = useState(user.socialLinks?.instagram || '');
  const [linkedin, setLinkedin] = useState(user.socialLinks?.linkedin || '');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...user,
      name: name || 'Anonymous Student',
      rollNumber: rollNumber || 'AP-TBD',
      major: major || 'Undeclared',
      age,
      avatar,
      bio,
      interests: interests.split(',').map(i => i.trim()).filter(i => i.length > 0),
      socialLinks: { github, instagram, linkedin }
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRollChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase();
    if (!value.startsWith('AP')) value = 'AP' + value;
    setRollNumber(value);
  };

  const sectionStyles = (id: string) => `
    flex-1 py-3 px-1 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative
    ${activeSection === id ? 'text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}
  `;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md transition-all">
      <div className="bg-white dark:bg-[#0b0f1a] w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.4)] animate-in fade-in zoom-in duration-500 border border-white/10 flex flex-col h-[90vh] md:h-auto md:max-h-[85vh]">
        
        {/* Header */}
        <div className="p-8 pb-4 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/20 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-[var(--primary)] flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
              <Sparkles size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                {isInitialSetup ? 'Initialize Profile' : 'Edit Pulse Profile'}
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Student Identity System</p>
            </div>
          </div>
          {!isInitialSetup && (
            <button onClick={onClose} className="p-3 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-2xl transition-all text-slate-400 group">
              <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
          )}
        </div>

        {/* Section Tabs */}
        <div className="flex border-b border-slate-100 dark:border-white/5 bg-white dark:bg-black/10 px-8">
          <button onClick={() => setActiveSection('identity')} className={sectionStyles('identity')}>
            Identity
            {activeSection === 'identity' && <div className="absolute bottom-0 left-0 w-full h-1 bg-[var(--primary)] rounded-full"></div>}
          </button>
          <button onClick={() => setActiveSection('academic')} className={sectionStyles('academic')}>
            Academic
            {activeSection === 'academic' && <div className="absolute bottom-0 left-0 w-full h-1 bg-[var(--primary)] rounded-full"></div>}
          </button>
          <button onClick={() => setActiveSection('social')} className={sectionStyles('social')}>
            Network
            {activeSection === 'social' && <div className="absolute bottom-0 left-0 w-full h-1 bg-[var(--primary)] rounded-full"></div>}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto no-scrollbar p-10 space-y-10">
          
          {activeSection === 'identity' && (
            <div className="space-y-8 animate-in slide-in-from-left-4 duration-300">
              <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
                {/* Visual Avatar Editor */}
                <div className="relative shrink-0">
                  <div className="w-40 h-40 rounded-[2.5rem] border-[6px] border-slate-50 dark:border-slate-800 shadow-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    {avatar ? (
                      <img src={avatar} alt="Avatar" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <UserIcon size={64} strokeWidth={1} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                      <Camera size={32} className="text-white" />
                      <span className="text-[10px] text-white font-black uppercase tracking-widest">Update Photo</span>
                    </div>
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                </div>

                <div className="flex-1 space-y-6 w-full">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2 block px-1">Full Identity Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        value={name} onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Alex Johnson"
                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl py-4 pl-12 pr-6 focus:border-[var(--primary)] transition-all outline-none text-slate-900 dark:text-white font-bold"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2 block px-1">Institutional Roll Number</label>
                    <div className="relative">
                      <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        value={rollNumber} onChange={handleRollChange}
                        placeholder="AP21-CS-XXX"
                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl py-4 pl-12 pr-6 focus:border-[var(--primary)] transition-all outline-none text-slate-900 dark:text-white font-bold"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2 block px-1">Profile Biography</label>
                <div className="relative">
                  <AlignLeft className="absolute left-4 top-4 text-slate-400" size={16} />
                  <textarea 
                    value={bio} onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell your peers about your goals, energy, and background..."
                    rows={4}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-3xl py-4 pl-12 pr-6 focus:border-[var(--primary)] transition-all outline-none text-slate-900 dark:text-white font-bold resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'academic' && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2 block px-1">Academic Major</label>
                  <div className="relative">
                    <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      value={major} onChange={(e) => setMajor(e.target.value)}
                      placeholder="e.g. Computer Science"
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl py-4 pl-12 pr-6 focus:border-[var(--primary)] transition-all outline-none text-slate-900 dark:text-white font-bold"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2 block px-1">Identity Age</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="number" value={age} onChange={(e) => setAge(parseInt(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl py-4 pl-12 pr-6 focus:border-[var(--primary)] transition-all outline-none text-slate-900 dark:text-white font-bold"
                      required min="16" max="99"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2 block px-1">Competencies & Interests (Comma Separated)</label>
                <div className="relative">
                  <Hash className="absolute left-4 top-4 text-slate-400" size={16} />
                  <textarea 
                    value={interests} onChange={(e) => setInterests(e.target.value)}
                    placeholder="e.g. Basketball, Python, UI Design, Chess"
                    rows={3}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-3xl py-4 pl-12 pr-6 focus:border-[var(--primary)] transition-all outline-none text-slate-900 dark:text-white font-bold resize-none"
                  />
                </div>
                <p className="mt-3 text-[9px] font-black uppercase tracking-widest text-slate-400 italic">These help our matching engine align you with elite pulses.</p>
              </div>
            </div>
          )}

          {activeSection === 'social' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-300">
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2 block px-1">Personal GitHub Profile</label>
                  <div className="relative">
                    <Github className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      value={github} onChange={(e) => setGithub(e.target.value)}
                      placeholder="username"
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl py-4 pl-12 pr-6 focus:border-[var(--primary)] transition-all outline-none text-slate-900 dark:text-white font-bold"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2 block px-1">Instagram Handle</label>
                  <div className="relative">
                    <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      value={instagram} onChange={(e) => setInstagram(e.target.value)}
                      placeholder="@username"
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl py-4 pl-12 pr-6 focus:border-[var(--primary)] transition-all outline-none text-slate-900 dark:text-white font-bold"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2 block px-1">LinkedIn URL</label>
                  <div className="relative">
                    <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      value={linkedin} onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="linkedin.com/in/username"
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl py-4 pl-12 pr-6 focus:border-[var(--primary)] transition-all outline-none text-slate-900 dark:text-white font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 dark:bg-black/20 rounded-3xl border border-dashed border-slate-200 dark:border-white/10 text-center">
                <Globe className="mx-auto text-[var(--primary)] mb-4" size={32} />
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                  Connecting these platforms enables trusted cross-campus verification and faster networking opportunities.
                </p>
              </div>
            </div>
          )}

        </form>

        {/* Footer Actions */}
        <div className="p-8 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/20 flex gap-5">
          {!isInitialSetup && (
            <button 
              type="button" onClick={onClose}
              className="flex-1 py-4 font-black text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors uppercase text-[10px] tracking-[0.3em]"
            >
              Discard
            </button>
          )}
          <button 
            onClick={handleSubmit}
            className="flex-[2] py-4 bg-[var(--primary)] text-white font-black rounded-2xl shadow-xl shadow-indigo-500/20 uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Save size={16} />
            {isInitialSetup ? 'Establish Identity' : 'Sync Pulse Profile'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditProfileModal;
