import React, { useState, useEffect } from 'react';
import { buildApiUrl } from './api';

export default function Admin() {
  const [data, setData] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeLang, setActiveLang] = useState<'en' | 'fr'>('en');
  const [activeTab, setActiveTab] = useState<'content' | 'bookings' | 'profile'>('content');
  const [expandedService, setExpandedService] = useState<number | null>(null);
  const [expandedClient, setExpandedClient] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Auth state
  const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'));
  const [loginStep, setLoginStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState(localStorage.getItem('admin_email') || 'admin@widea.center');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [authError, setAuthError] = useState('');
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordChangeStatus, setPasswordChangeStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [passwordChangeMessage, setPasswordChangeMessage] = useState('');

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordChangeStatus('error');
      setPasswordChangeMessage('New passwords do not match');
      return;
    }
    
    setPasswordChangeStatus('submitting');
    try {
      const res = await fetch(buildApiUrl('/change-password'), {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email, currentPassword, newPassword }) // Using the email from login state
      });
      const json = await res.json();
      if (json.success) {
        setPasswordChangeStatus('success');
        setPasswordChangeMessage('Password changed successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordChangeStatus('error');
        setPasswordChangeMessage(json.error || 'Failed to change password');
      }
    } catch (err) {
      setPasswordChangeStatus('error');
      setPasswordChangeMessage('Network error');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch(buildApiUrl('/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const json = await res.json();
      if (json.success) {
        setLoginStep(2);
      } else {
        setAuthError(json.error || 'Login failed');
      }
    } catch (err) {
      setAuthError('Network error');
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch(buildApiUrl('/verify'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });
      const json = await res.json();
      if (json.success) {
        setToken(json.token);
        localStorage.setItem('admin_token', json.token);
        localStorage.setItem('admin_email', email);
      } else {
        setAuthError(json.error || 'Verification failed');
      }
    } catch (err) {
      setAuthError('Network error');
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_email');
    setLoginStep(1);
    setPassword('');
    setCode('');
    window.location.assign('/');
  };

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    Promise.all([
      fetch(buildApiUrl('/content')).then(res => res.json()),
      fetch(buildApiUrl('/bookings'), { headers: { 'Authorization': `Bearer ${token}` } }).then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
    ])
    .then(([contentData, bookingsData]) => {
      setData(contentData);
      setBookings(bookingsData);
      setIsLoading(false);
    })
    .catch(err => {
      console.error(err);
      handleLogout();
    });
  }, [token]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(buildApiUrl('/content'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to save');
      alert('Saved successfully!');
    } catch (e) {
      alert('Failed to save. Your session might have expired.');
      handleLogout();
    }
    setIsSaving(false);
  };

  const handleSaveAndLogout = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(buildApiUrl('/content'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to save');
      handleLogout();
    } catch (e) {
      alert('Failed to save. Your session might have expired.');
      handleLogout();
    }
    setIsSaving(false);
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-mono">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 shadow-2xl">
          <h1 className="text-2xl font-bold text-white mb-6">Admin Access</h1>
          {authError && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 mb-6 text-sm">{authError}</div>}
          
          {loginStep === 1 ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 p-3 text-white focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 p-3 text-white focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-cyan-500 text-slate-950 font-bold py-3 uppercase tracking-wider hover:bg-cyan-400 transition-colors">
                Continue
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="text-sm text-cyan-400 mb-4">2FA Code sent to your device. (Hint: 123456)</div>
              <div>
                <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Verification Code</label>
                <input 
                  type="text" 
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 p-3 text-white focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-cyan-500 text-slate-950 font-bold py-3 uppercase tracking-wider hover:bg-cyan-400 transition-colors">
                Verify & Login
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  if (isLoading) return <div className="p-10 text-cyan-500 bg-slate-950 min-h-screen font-mono">Initializing...</div>;

  if (!data || !data[activeLang]) {
    return <div className="p-10 text-red-500 bg-slate-950 min-h-screen font-mono">Error loading data. Please refresh.</div>;
  }

  const currentData = data[activeLang];

  const updateField = (section: string, field: string, value: string) => {
    setData((prev: any) => ({
      ...prev,
      [activeLang]: {
        ...prev[activeLang],
        [section]: {
          ...prev[activeLang][section],
          [field]: value
        }
      }
    }));
  };

  const updateService = (index: number, field: string, value: string) => {
    setData((prev: any) => {
      const newServices = [...prev[activeLang].services];
      newServices[index] = { ...newServices[index], [field]: value };
      return {
        ...prev,
        [activeLang]: {
          ...prev[activeLang],
          services: newServices
        }
      };
    });
  };

  const updateServiceLink = (serviceIndex: number, linkIndex: number, field: string, value: string) => {
    setData((prev: any) => {
      const newServices = [...prev[activeLang].services];
      const newLinks = [...newServices[serviceIndex].links];
      newLinks[linkIndex] = { ...newLinks[linkIndex], [field]: value };
      newServices[serviceIndex] = { ...newServices[serviceIndex], links: newLinks };
      return {
        ...prev,
        [activeLang]: {
          ...prev[activeLang],
          services: newServices
        }
      };
    });
  };

  const addServiceLink = (serviceIndex: number) => {
    setData((prev: any) => {
      const newServices = [...prev[activeLang].services];
      newServices[serviceIndex].links.push({ name: 'New Link', url: '#', icon: 'ExternalLink' });
      return {
        ...prev,
        [activeLang]: {
          ...prev[activeLang],
          services: newServices
        }
      };
    });
  };

  const removeServiceLink = (serviceIndex: number, linkIndex: number) => {
    setData((prev: any) => {
      const newServices = [...prev[activeLang].services];
      newServices[serviceIndex].links.splice(linkIndex, 1);
      return {
        ...prev,
        [activeLang]: {
          ...prev[activeLang],
          services: newServices
        }
      };
    });
  };

  const addService = () => {
    setData((prev: any) => {
      const newServices = [...prev[activeLang].services];
      newServices.push({
        name: 'New Venture',
        tagline: 'Tagline',
        description: 'Description',
        story: 'Story',
        website: '',
        links: []
      });
      setExpandedService(newServices.length - 1);
      return {
        ...prev,
        [activeLang]: {
          ...prev[activeLang],
          services: newServices
        }
      };
    });
  };

  const removeService = (index: number) => {
    if (!confirm('Are you sure you want to delete this venture?')) return;
    setData((prev: any) => {
      const newServices = [...prev[activeLang].services];
      newServices.splice(index, 1);
      return {
        ...prev,
        [activeLang]: {
          ...prev[activeLang],
          services: newServices
        }
      };
    });
  };

  const updateClient = (index: number, field: string, value: string) => {
    setData((prev: any) => {
      const newClients = [...(prev[activeLang].clients || [])];
      newClients[index] = { ...newClients[index], [field]: value };
      return {
        ...prev,
        [activeLang]: {
          ...prev[activeLang],
          clients: newClients
        }
      };
    });
  };

  const addClient = () => {
    setData((prev: any) => {
      const newClients = [...(prev[activeLang].clients || [])];
      newClients.push({ name: 'New Client', logoUrl: '' });
      return {
        ...prev,
        [activeLang]: {
          ...prev[activeLang],
          clients: newClients
        }
      };
    });
  };

  const removeClient = (index: number) => {
    if (!confirm('Are you sure you want to delete this client?')) return;
    setData((prev: any) => {
      const newClients = [...(prev[activeLang].clients || [])];
      newClients.splice(index, 1);
      return {
        ...prev,
        [activeLang]: {
          ...prev[activeLang],
          clients: newClients
        }
      };
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, section: string, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(buildApiUrl('/upload'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const json = await res.json();
      if (json.url) {
        updateField(section, field, json.url);
      } else {
        alert('Upload failed: ' + (json.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Upload failed due to network error');
    }
    setIsUploading(false);
  };

  const handleServiceFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, serviceIndex: number, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(buildApiUrl('/upload'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const json = await res.json();
      if (json.url) {
        updateService(serviceIndex, field, json.url);
      } else {
        alert('Upload failed: ' + (json.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Upload failed due to network error');
    }
    setIsUploading(false);
  };

  const handleClientFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, clientIndex: number, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(buildApiUrl('/upload'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const json = await res.json();
      if (json.url) {
        updateClient(clientIndex, field, json.url);
      } else {
        alert('Upload failed: ' + (json.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Upload failed due to network error');
    }
    setIsUploading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 p-8 font-mono">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
            <div className="flex gap-4 text-sm">
              <button 
                onClick={() => setActiveTab('content')} 
                className={`${activeTab === 'content' ? 'text-cyan-400 font-bold border-b border-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Content Editor
              </button>
              <button 
                onClick={() => setActiveTab('bookings')} 
                className={`${activeTab === 'bookings' ? 'text-cyan-400 font-bold border-b border-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Meeting Requests ({bookings.length})
              </button>
              <button 
                onClick={() => setActiveTab('profile')} 
                className={`${activeTab === 'profile' ? 'text-cyan-400 font-bold border-b border-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Profile
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {activeTab === 'content' && (
              <div className="flex bg-slate-900 rounded overflow-hidden border border-slate-800">
                <button 
                  className={`px-4 py-2 text-sm ${activeLang === 'en' ? 'bg-cyan-500 text-slate-950 font-bold' : 'hover:bg-slate-800'}`}
                  onClick={() => setActiveLang('en')}
                >
                  EN
                </button>
                <button 
                  className={`px-4 py-2 text-sm ${activeLang === 'fr' ? 'bg-cyan-500 text-slate-950 font-bold' : 'hover:bg-slate-800'}`}
                  onClick={() => setActiveLang('fr')}
                >
                  FR
                </button>
              </div>
            )}
            {activeTab === 'content' && (
              <div className="flex gap-2">
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-cyan-500 text-slate-950 px-6 py-2 rounded-none font-bold hover:bg-cyan-400 disabled:opacity-50 text-sm uppercase tracking-wider"
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
                <button 
                  onClick={handleSaveAndLogout}
                  disabled={isSaving}
                  className="bg-slate-800 text-white border border-slate-700 px-6 py-2 rounded-none font-bold hover:bg-slate-700 disabled:opacity-50 text-sm uppercase tracking-wider"
                >
                  {isSaving ? 'Saving...' : 'Save & Logout'}
                </button>
              </div>
            )}
            <button onClick={handleLogout} className="text-slate-500 hover:text-white text-sm underline">Logout</button>
          </div>
        </div>

        {activeTab === 'bookings' && (
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <div className="text-slate-500 italic">No meeting requests yet.</div>
            ) : (
              bookings.map((b, i) => (
                <div key={i} className="bg-slate-900 border border-slate-800 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">{b.name}</h3>
                      <a href={`mailto:${b.email}`} className="text-cyan-400 hover:underline">{b.email}</a>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold">{b.date}</div>
                      <div className="text-slate-400">{b.time}</div>
                    </div>
                  </div>
                  <div className="bg-slate-950 p-4 border-l-2 border-cyan-500 text-slate-300">
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Topic</div>
                    {b.topic}
                  </div>
                  <div className="text-xs text-slate-600 mt-4">Requested on: {new Date(b.created_at).toLocaleString()}</div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-4 max-w-md">
            <div className="bg-slate-900 border border-slate-800 p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-cyan-500 inline-block"></span>
                Change Password
              </h2>
              {passwordChangeMessage && (
                <div className={`p-3 mb-6 text-sm border ${passwordChangeStatus === 'success' ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-red-500/10 border-red-500/50 text-red-400'}`}>
                  {passwordChangeMessage}
                </div>
              )}
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Current Password</label>
                  <input 
                    type="password" 
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 p-3 text-white focus:border-cyan-400 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">New Password</label>
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 p-3 text-white focus:border-cyan-400 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Confirm New Password</label>
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 p-3 text-white focus:border-cyan-400 focus:outline-none"
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={passwordChangeStatus === 'submitting'}
                  className="w-full bg-cyan-500 text-slate-950 font-bold py-3 uppercase tracking-wider hover:bg-cyan-400 transition-colors disabled:opacity-50"
                >
                  {passwordChangeStatus === 'submitting' ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-8">
            {/* Contacts / Socials */}
            <section className="bg-slate-900 p-6 border border-slate-800">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-cyan-500 inline-block"></span>
                Contacts & Socials
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(currentData.socials || {}).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-xs mb-1 text-cyan-400 uppercase tracking-wider">{key}</label>
                    <input 
                      className="w-full bg-slate-950 border border-slate-700 p-3 text-white focus:border-cyan-400 focus:outline-none"
                      value={value as string}
                      onChange={e => updateField('socials', key, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Hero Section */}
            <section className="bg-slate-900 p-6 border border-slate-800">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-cyan-500 inline-block"></span>
                Hero Section
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs mb-1 text-cyan-400 uppercase tracking-wider">Profile Picture</label>
                  <div className="flex gap-4 items-center">
                    <input 
                      className="flex-1 bg-slate-950 border border-slate-700 p-3 text-white focus:border-cyan-400 focus:outline-none"
                      value={currentData.hero.profilePicUrl || ''}
                      onChange={e => updateField('hero', 'profilePicUrl', e.target.value)}
                      placeholder="/uploads/photo.jpg or https://example.com/photo.jpg"
                    />
                    <div className="relative">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'hero', 'profilePicUrl')}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={isUploading}
                      />
                      <button 
                        type="button" 
                        className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-3 border border-slate-700 whitespace-nowrap"
                        disabled={isUploading}
                      >
                        {isUploading ? 'Uploading...' : 'Upload Image'}
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs mb-1 text-cyan-400 uppercase tracking-wider">Title (use \n for line breaks)</label>
                  <textarea 
                    className="w-full bg-slate-950 border border-slate-700 p-3 text-white focus:border-cyan-400 focus:outline-none"
                    value={currentData.hero.title}
                    onChange={e => updateField('hero', 'title', e.target.value)}
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1 text-cyan-400 uppercase tracking-wider">Subtitle</label>
                  <textarea 
                    className="w-full bg-slate-950 border border-slate-700 p-3 text-white focus:border-cyan-400 focus:outline-none"
                    value={currentData.hero.subtitle}
                    onChange={e => updateField('hero', 'subtitle', e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1 text-cyan-400 uppercase tracking-wider">Contact Button Text</label>
                  <input 
                    className="w-full bg-slate-950 border border-slate-700 p-3 text-white focus:border-cyan-400 focus:outline-none"
                    value={currentData.hero.contactText}
                    onChange={e => updateField('hero', 'contactText', e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* About Section */}
            <section className="bg-slate-900 p-6 border border-slate-800">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-cyan-500 inline-block"></span>
                About Section
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs mb-1 text-cyan-400 uppercase tracking-wider">Title</label>
                  <input 
                    className="w-full bg-slate-950 border border-slate-700 p-3 text-white focus:border-cyan-400 focus:outline-none"
                    value={currentData.about.title}
                    onChange={e => updateField('about', 'title', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1 text-cyan-400 uppercase tracking-wider">Paragraph 1</label>
                  <textarea 
                    className="w-full bg-slate-950 border border-slate-700 p-3 text-white focus:border-cyan-400 focus:outline-none"
                    value={currentData.about.p1}
                    onChange={e => updateField('about', 'p1', e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1 text-cyan-400 uppercase tracking-wider">Paragraph 2</label>
                  <textarea 
                    className="w-full bg-slate-950 border border-slate-700 p-3 text-white focus:border-cyan-400 focus:outline-none"
                    value={currentData.about.p2}
                    onChange={e => updateField('about', 'p2', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </section>

            {/* Services / Ventures */}
            <section className="bg-slate-900 p-6 border border-slate-800">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 bg-cyan-500 inline-block"></span>
                  Ventures & Services
                </h2>
                <button 
                  onClick={addService}
                  className="bg-cyan-500 text-slate-950 px-4 py-2 font-bold hover:bg-cyan-400 text-sm uppercase tracking-wider"
                >
                  + Add Venture
                </button>
              </div>
              <div className="space-y-4">
                {currentData.services?.map((service: any, sIdx: number) => {
                  const isExpanded = expandedService === sIdx;
                  return (
                  <div key={sIdx} className="bg-slate-950 border border-slate-800 relative">
                    <div 
                      className="p-4 flex justify-between items-center cursor-pointer hover:bg-slate-900/50 transition-colors"
                      onClick={() => setExpandedService(isExpanded ? null : sIdx)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-cyan-500 font-bold w-6">{isExpanded ? '▼' : '▶'}</div>
                        <h3 className="text-lg font-bold text-white">{service.name || 'Unnamed Venture'}</h3>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-xs text-slate-500">Venture {sIdx + 1}</div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); removeService(sIdx); }}
                          className="text-red-400 hover:text-red-300 text-xs uppercase tracking-wider px-2 py-1 border border-red-900 hover:bg-red-900/30"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    
                    {isExpanded && (
                    <div className="p-6 border-t border-slate-800">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-xs mb-1 text-cyan-400 uppercase tracking-wider">Name / Title</label>
                          <input 
                            className="w-full bg-slate-900 border border-slate-700 p-3 text-white focus:border-cyan-400 focus:outline-none"
                            value={service.name}
                            onChange={e => updateService(sIdx, 'name', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-xs mb-1 text-cyan-400 uppercase tracking-wider">Tagline</label>
                          <input 
                            className="w-full bg-slate-900 border border-slate-700 p-3 text-white focus:border-cyan-400 focus:outline-none"
                            value={service.tagline}
                            onChange={e => updateService(sIdx, 'tagline', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-xs mb-1 text-cyan-400 uppercase tracking-wider">Website Link *</label>
                        <input 
                          className="w-full bg-slate-900 border border-slate-700 p-3 text-white focus:border-cyan-400 focus:outline-none"
                          placeholder="e.g. example.com"
                          value={service.website || ''}
                          onChange={e => updateService(sIdx, 'website', e.target.value)}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-xs mb-1 text-cyan-400 uppercase tracking-wider">Logo</label>
                        <div className="flex gap-4 items-center">
                          <input 
                            className="flex-1 bg-slate-900 border border-slate-700 p-3 text-white focus:border-cyan-400 focus:outline-none"
                            placeholder="/uploads/logo.png or https://example.com/logo.png"
                            value={service.logoUrl || ''}
                            onChange={e => updateService(sIdx, 'logoUrl', e.target.value)}
                          />
                          <div className="relative">
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={(e) => handleServiceFileUpload(e, sIdx, 'logoUrl')}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              disabled={isUploading}
                            />
                            <button 
                              type="button" 
                              className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-3 border border-slate-700 whitespace-nowrap"
                              disabled={isUploading}
                            >
                              {isUploading ? 'Uploading...' : 'Upload Logo'}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-xs mb-1 text-cyan-400 uppercase tracking-wider">Description</label>
                        <textarea 
                          className="w-full bg-slate-900 border border-slate-700 p-3 text-white focus:border-cyan-400 focus:outline-none"
                          value={service.description}
                          onChange={e => updateService(sIdx, 'description', e.target.value)}
                          rows={3}
                        />
                      </div>
                      <div className="mb-6">
                        <label className="block text-xs mb-1 text-cyan-400 uppercase tracking-wider">Story Quote</label>
                        <textarea 
                          className="w-full bg-slate-900 border border-slate-700 p-3 text-white focus:border-cyan-400 focus:outline-none"
                          value={service.story}
                          onChange={e => updateService(sIdx, 'story', e.target.value)}
                          rows={2}
                        />
                      </div>
                      
                      <div className="border-t border-slate-800 pt-4">
                        <div className="flex justify-between items-center mb-4">
                          <label className="block text-xs text-cyan-400 uppercase tracking-wider">Links (Social Media, Website, Email)</label>
                          <button 
                            onClick={() => addServiceLink(sIdx)}
                            className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-3 py-1"
                          >
                            + Add Link
                          </button>
                        </div>
                        <div className="space-y-2">
                          {service.links.map((link: any, lIdx: number) => (
                            <div key={lIdx} className="flex gap-2 items-center">
                              <input 
                                className="w-1/4 bg-slate-900 border border-slate-700 p-2 text-white text-sm focus:border-cyan-400 focus:outline-none"
                                placeholder="Name (e.g. Website)"
                                value={link.name}
                                onChange={e => updateServiceLink(sIdx, lIdx, 'name', e.target.value)}
                              />
                              <input 
                                className="w-2/4 bg-slate-900 border border-slate-700 p-2 text-white text-sm focus:border-cyan-400 focus:outline-none"
                                placeholder="example.com or email@example.com"
                                value={link.url}
                                onChange={e => updateServiceLink(sIdx, lIdx, 'url', e.target.value)}
                              />
                              <input 
                                className="w-1/4 bg-slate-900 border border-slate-700 p-2 text-white text-sm focus:border-cyan-400 focus:outline-none"
                                placeholder="Icon (e.g. Globe, Mail)"
                                value={link.icon}
                                onChange={e => updateServiceLink(sIdx, lIdx, 'icon', e.target.value)}
                              />
                              <button 
                                onClick={() => removeServiceLink(sIdx, lIdx)}
                                className="p-2 text-red-400 hover:bg-red-400/10 border border-transparent hover:border-red-400/50 transition-colors"
                                title="Remove link"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                          {service.links.length === 0 && (
                            <div className="text-sm text-slate-500 italic">No links added.</div>
                          )}
                        </div>
                      </div>
                    </div>
                    )}
                  </div>
                )})}
              </div>
            </section>

            {/* Clients / Trusted By */}
            <section className="bg-slate-900 p-6 border border-slate-800">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 bg-cyan-500 inline-block"></span>
                  Trusted By / Collaborators
                </h2>
                <button 
                  onClick={addClient}
                  className="bg-cyan-500 text-slate-950 px-4 py-2 font-bold hover:bg-cyan-400 text-sm uppercase tracking-wider"
                >
                  + Add Client
                </button>
              </div>
              <div className="space-y-4">
                {(currentData.clients || []).map((client: any, cIdx: number) => {
                  const isExpanded = expandedClient === cIdx;
                  return (
                  <div key={cIdx} className="bg-slate-950 border border-slate-800 relative">
                    <div 
                      className="p-4 flex justify-between items-center cursor-pointer hover:bg-slate-900/50 transition-colors"
                      onClick={() => setExpandedClient(isExpanded ? null : cIdx)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-cyan-500 font-bold w-6">{isExpanded ? '▼' : '▶'}</div>
                        <h3 className="text-lg font-bold text-white">{client.name || 'Unnamed Client'}</h3>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-xs text-slate-500">Client {cIdx + 1}</div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); removeClient(cIdx); }}
                          className="text-red-400 hover:text-red-300 text-xs uppercase tracking-wider px-2 py-1 border border-red-900 hover:bg-red-900/30"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    
                    {isExpanded && (
                    <div className="p-6 border-t border-slate-800 flex flex-col md:flex-row gap-4 items-start md:items-center">
                      <div className="flex-1">
                        <label className="block text-xs mb-1 text-cyan-400 uppercase tracking-wider">Client Name</label>
                        <input 
                          className="w-full bg-slate-900 border border-slate-700 p-3 text-white focus:border-cyan-400 focus:outline-none"
                          value={client.name}
                          onChange={e => updateClient(cIdx, 'name', e.target.value)}
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs mb-1 text-cyan-400 uppercase tracking-wider">Logo URL</label>
                        <div className="flex gap-2">
                          <input 
                            className="flex-1 bg-slate-900 border border-slate-700 p-3 text-white focus:border-cyan-400 focus:outline-none"
                            value={client.logoUrl}
                            onChange={e => updateClient(cIdx, 'logoUrl', e.target.value)}
                          />
                          <div className="relative">
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={(e) => handleClientFileUpload(e, cIdx, 'logoUrl')}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              disabled={isUploading}
                            />
                            <button 
                              type="button" 
                              className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-3 border border-slate-700 whitespace-nowrap"
                              disabled={isUploading}
                            >
                              Upload
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    )}
                  </div>
                )})}
                {(!currentData.clients || currentData.clients.length === 0) && (
                  <div className="text-slate-500 italic">No clients added yet.</div>
                )}
              </div>
            </section>

            {/* Footer */}
            <section className="bg-slate-900 p-6 border border-slate-800">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-cyan-500 inline-block"></span>
                Footer
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs mb-1 text-cyan-400 uppercase tracking-wider">Bio</label>
                  <textarea 
                    className="w-full bg-slate-950 border border-slate-700 p-3 text-white focus:border-cyan-400 focus:outline-none"
                    value={currentData.footer.bio}
                    onChange={e => updateField('footer', 'bio', e.target.value)}
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1 text-cyan-400 uppercase tracking-wider">Tagline</label>
                  <input 
                    className="w-full bg-slate-950 border border-slate-700 p-3 text-white focus:border-cyan-400 focus:outline-none"
                    value={currentData.footer.tagline}
                    onChange={e => updateField('footer', 'tagline', e.target.value)}
                  />
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
