/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  User, 
  TrendingUp, 
  Phone, 
  Mail, 
  Plus, 
  Filter, 
  Calendar, 
  Check, 
  X, 
  Clock, 
  Search, 
  Database, 
  Layers, 
  PhoneCall, 
  Award, 
  ChevronRight, 
  SlidersHorizontal,
  Briefcase,
  TrendingDown,
  AlertCircle,
  FileSpreadsheet,
  Pencil,
  Shield,
  Sparkles,
  Globe,
  Activity,
  Settings,
  Menu,
  LogOut,
  Star,
  Lock,
  Save
} from 'lucide-react';

// Interfaces
interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: string;
  status: 'new' | 'hot' | 'cold' | 'dead' | 'converted';
  followUpDate?: string; // YYYY-MM-DD
  notes: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

interface Activity {
  id: string;
  leadId: string;
  leadName: string;
  staffName: string;
  action: 'create' | 'status_change' | 'followup' | 'note_add' | 'call';
  details: string;
  date: string; // YYYY-MM-DD
  timestamp: string;
}

interface Staff {
  id: string;
  name: string;
  username: string;
  password?: string;
  avatar: string;
  color: string;
  role: 'staff' | 'admin';
}

interface CrmSettings {
  logoType: 'icon' | 'image';
  logoIcon: 'Database' | 'Shield' | 'Sparkles' | 'Globe' | 'Activity' | 'Award' | 'Briefcase' | 'TrendingUp';
  logoUrl: string;
  faviconUrl?: string;
  crmName: string;
  crmSlogan: string;
  adminName?: string;
  adminEmail?: string;
  adminPassword?: string;
}

const DEFAULT_SETTINGS: CrmSettings = {
  logoType: 'icon',
  logoIcon: 'Database',
  logoUrl: '',
  faviconUrl: '',
  crmName: 'Secure Leads CRM',
  crmSlogan: 'Enterprise CRM Core',
  adminName: 'Super Admin',
  adminEmail: 'admin@admin.com',
  adminPassword: 'admin123'
};

// Fixed Predefined Staff Logins
const DEFAULT_STAFF: Staff[] = [
  { id: 'staff-1', name: 'John Doe', username: 'john', password: '123', avatar: 'JD', color: 'bg-indigo-100 text-indigo-700', role: 'staff' },
  { id: 'staff-2', name: 'Sarah Smith', username: 'sarah', password: '123', avatar: 'SS', color: 'bg-emerald-100 text-emerald-700', role: 'staff' },
  { id: 'staff-3', name: 'Michael Chen', username: 'michael', password: '123', avatar: 'MC', color: 'bg-amber-100 text-amber-700', role: 'staff' },
  { id: 'staff-4', name: 'Emily Davis', username: 'emily', password: '123', avatar: 'ED', color: 'bg-rose-100 text-rose-700', role: 'staff' },
];

const SOURCES = ['Google Ads', 'Facebook Ads', 'Website Contact', 'Referral', 'Cold Outreach', 'Other'];

// Current local date anchor for follow-ups
const TODAY_DATE = '2026-07-15';

// Pre-seed mock database for a beautiful initial experience
const INITIAL_LEADS: Lead[] = [
  {
    id: "lead-1",
    name: "Bruce Wayne",
    phone: "+15550001111",
    email: "bruce@waynecorp.com",
    source: "Google Ads",
    status: "converted",
    followUpDate: "2026-06-06", // Overdue follow-up date (June 6)
    notes: "Converted premium lead. Highly active enterprise account, follow up required for secondary licensing.",
    createdBy: "Sarah Smith",
    createdAt: "2026-06-06T10:30:00.000Z",
    updatedBy: "Sarah Smith",
    updatedAt: "2026-06-06T10:30:00.000Z"
  },
  {
    id: "lead-2",
    name: "Clark Kent",
    phone: "+15552223333",
    email: "clark.kent@dailyplanet.com",
    source: "Facebook Ads",
    status: "hot",
    notes: "Requested a live platform walkthrough for the investigative journalism team.",
    createdBy: "John Doe",
    createdAt: "2026-05-04T15:45:00.000Z",
    updatedBy: "John Doe",
    updatedAt: "2026-05-04T15:45:00.000Z"
  },
  {
    id: "lead-3",
    name: "Diana Prince",
    phone: "+15554445555",
    email: "diana.prince@themscira.org",
    source: "Referral",
    status: "converted",
    notes: "Successfully onboarded. Corporate subscription finalized, loves the multi-user permissions feature.",
    createdBy: "Emily Davis",
    createdAt: "2026-05-04T11:00:00.000Z",
    updatedBy: "Emily Davis",
    updatedAt: "2026-05-04T11:00:00.000Z"
  },
  {
    id: "lead-4",
    name: "Arthur Curry",
    phone: "+15556667777",
    email: "arthur.curry@atlantis.gov",
    source: "Website Contact",
    status: "new",
    notes: "High intent new registration. Left a message stating interest in bulk team workspace licensing.",
    createdBy: "John Doe",
    createdAt: "2026-05-04T08:20:00.000Z",
    updatedBy: "John Doe",
    updatedAt: "2026-05-04T08:20:00.000Z"
  },
  {
    id: "lead-5",
    name: "Alice Johnson",
    phone: "+1 (555) 019-2834",
    email: "alice.j@enterprise.com",
    source: "Google Ads",
    status: "hot",
    followUpDate: "2026-07-15", // Today
    notes: "Wants to join the premium plan. Highly interested, request follow-up callback at noon.",
    createdBy: "Sarah Smith",
    createdAt: "2026-07-14T10:30:00.000Z",
    updatedBy: "Sarah Smith",
    updatedAt: "2026-07-14T10:30:00.000Z"
  },
  {
    id: "lead-6",
    name: "Bob Miller",
    phone: "+1 (555) 028-3948",
    email: "bob.miller@gmail.com",
    source: "Facebook Ads",
    status: "cold",
    followUpDate: "2026-07-16", // Tomorrow
    notes: "Requested a live platform walkthrough for his operations team.",
    createdBy: "John Doe",
    createdAt: "2026-07-14T15:45:00.000Z",
    updatedBy: "John Doe",
    updatedAt: "2026-07-14T15:45:00.000Z"
  },
  {
    id: "lead-7",
    name: "Charlie Davis",
    phone: "+1 (555) 037-4112",
    email: "charlie.d@yahoo.com",
    source: "Organic Search",
    status: "dead",
    notes: "No active budget yet. Keep in newsletter loop for nurtures.",
    createdBy: "Michael Chen",
    createdAt: "2026-07-13T09:15:00.000Z",
    updatedBy: "Michael Chen",
    updatedAt: "2026-07-13T09:15:00.000Z"
  }
];

const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: "act-1",
    leadId: "lead-4",
    leadName: "Diana Prince",
    staffName: "Emily Davis",
    action: "create",
    details: "Created lead via Referral source",
    date: "2026-07-12",
    timestamp: "2026-07-12T11:00:00.000Z"
  },
  {
    id: "act-2",
    leadId: "lead-4",
    leadName: "Diana Prince",
    staffName: "Emily Davis",
    action: "status_change",
    details: "Marked status as Dead (bounced contact info)",
    date: "2026-07-12",
    timestamp: "2026-07-12T11:30:00.000Z"
  },
  {
    id: "act-3",
    leadId: "lead-3",
    leadName: "Charlie Davis",
    staffName: "Michael Chen",
    action: "create",
    details: "Created lead via Organic Search",
    date: "2026-07-13",
    timestamp: "2026-07-13T09:15:00.000Z"
  },
  {
    id: "act-4",
    leadId: "lead-1",
    leadName: "Alice Johnson",
    staffName: "Sarah Smith",
    action: "create",
    details: "Created lead via Google Ads source",
    date: "2026-07-14",
    timestamp: "2026-07-14T10:30:00.000Z"
  },
  {
    id: "act-5",
    leadId: "lead-2",
    leadName: "Bob Miller",
    staffName: "John Doe",
    action: "create",
    details: "Created lead via Facebook Ads source",
    date: "2026-07-14",
    timestamp: "2026-07-14T15:45:00.000Z"
  },
  {
    id: "act-6",
    leadId: "lead-5",
    leadName: "Evan Wright",
    staffName: "John Doe",
    action: "create",
    details: "Created lead via Website source",
    date: "2026-07-15",
    timestamp: "2026-07-15T08:20:00.000Z"
  }
];

export default function App() {
  // Global State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [settings, setSettings] = useState<CrmSettings>(DEFAULT_SETTINGS);

  // CRM Settings Form States
  const [tempLogoType, setTempLogoType] = useState<'icon' | 'image'>('icon');
  const [tempLogoIcon, setTempLogoIcon] = useState<'Database' | 'Shield' | 'Sparkles' | 'Globe' | 'Activity' | 'Award' | 'Briefcase' | 'TrendingUp'>('Database');
  const [tempLogoUrl, setTempLogoUrl] = useState('');
  const [tempFaviconUrl, setTempFaviconUrl] = useState('');
  const [tempCrmName, setTempCrmName] = useState('Secure Leads CRM');
  const [tempCrmSlogan, setTempCrmSlogan] = useState('Enterprise CRM Core');

  // Profile Form States
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePassword, setProfilePassword] = useState('');
  const [profileLogoUrl, setProfileLogoUrl] = useState('');
  const [profileLogoType, setProfileLogoType] = useState<'icon' | 'image'>('icon');
  const [profileLogoIcon, setProfileLogoIcon] = useState<'Database' | 'Shield' | 'Sparkles' | 'Globe' | 'Activity' | 'Award' | 'Briefcase' | 'TrendingUp'>('Database');
  const [profileFaviconUrl, setProfileFaviconUrl] = useState('');

  // Admin Active Tab State
  const [adminTab, setAdminTab] = useState<'overview' | 'leads' | 'staff' | 'settings' | 'profile'>('overview');
  
  // Staff Active Tab State
  const [staffTab, setStaffTab] = useState<'dashboard' | 'leads' | 'add' | 'profile'>('dashboard');
  
  // Custom sidebar layout states
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminAddLeadOpen, setAdminAddLeadOpen] = useState(false);
  const [activeLeadFilter, setActiveLeadFilter] = useState<'all' | 'new' | 'hot' | 'cold' | 'dead' | 'converted'>('all');

  // Auth State
  const [currentUser, setCurrentUser] = useState<Staff | null>(() => {
    const saved = localStorage.getItem('crm_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Login Form States
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginRole, setLoginRole] = useState<'staff' | 'admin'>('staff');
  const [loginError, setLoginError] = useState('');

  // Admin New Staff Form States
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffUsername, setNewStaffUsername] = useState('');
  const [newStaffPassword, setNewStaffPassword] = useState('');

  // Navigation State
  const [activePortal, setActivePortal] = useState<'admin' | 'staff'>('staff');
  
  // Logged-in Staff State
  const [currentStaff, setCurrentStaff] = useState<any>(() => {
    const saved = localStorage.getItem('crm_current_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.role === 'staff') {
        return parsed;
      }
    }
    return DEFAULT_STAFF[0];
  });
  
  // Filtering & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'hot' | 'cold' | 'dead' | 'converted'>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [onlyTodayFollowUp, setOnlyTodayFollowUp] = useState(false);
  
  // New Lead Form State
  const [newLead, setNewLead] = useState({
    name: '',
    phone: '',
    email: '',
    source: 'Google Ads',
    status: 'new' as 'new' | 'hot' | 'cold' | 'dead' | 'converted',
    notes: '',
    followUpDate: ''
  });
  
  // Edit Lead Modal State
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editSource, setEditSource] = useState('');
  const [editStatus, setEditStatus] = useState<'new' | 'hot' | 'cold' | 'dead' | 'converted'>('new');
  const [editFollowUpDate, setEditFollowUpDate] = useState('');
  const [editAppendJournal, setEditAppendJournal] = useState('');
  
  // Notification banner
  const [bannerMsg, setBannerMsg] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  // Initialize from full-stack API database or fallback to seed data
  useEffect(() => {
    fetch('/api/leads-data')
      .then(res => res.json())
      .then(data => {
        if (data.leads && data.leads.length > 0) {
          setLeads(data.leads);
          setActivities(data.activities || []);
          setStaffList(data.staff || DEFAULT_STAFF);
          if (data.settings) {
            setSettings(data.settings);
          } else {
            setSettings(DEFAULT_SETTINGS);
          }
        } else {
          // If server database is empty, seed it
          setLeads(INITIAL_LEADS);
          setActivities(INITIAL_ACTIVITIES);
          setStaffList(DEFAULT_STAFF);
          setSettings(DEFAULT_SETTINGS);
          fetch('/api/leads-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ leads: INITIAL_LEADS, activities: INITIAL_ACTIVITIES, staff: DEFAULT_STAFF, settings: DEFAULT_SETTINGS })
          }).catch(err => console.error("Error seeding backend DB:", err));
        }
      })
      .catch(err => {
        console.error("Failed to connect to backend API database. Using local state fallback.", err);
        // Fallback to local storage if API is offline
        const storedLeads = localStorage.getItem('crm_leads');
        const storedActivities = localStorage.getItem('crm_activities');
        const storedStaff = localStorage.getItem('crm_staff');
        const storedSettings = localStorage.getItem('crm_settings');
        if (storedLeads && storedActivities) {
          setLeads(JSON.parse(storedLeads));
          setActivities(JSON.parse(storedActivities));
          setStaffList(storedStaff ? JSON.parse(storedStaff) : DEFAULT_STAFF);
          setSettings(storedSettings ? JSON.parse(storedSettings) : DEFAULT_SETTINGS);
        } else {
          setLeads(INITIAL_LEADS);
          setActivities(INITIAL_ACTIVITIES);
          setStaffList(DEFAULT_STAFF);
          setSettings(DEFAULT_SETTINGS);
        }
      });
  }, []);

  // Sync settings helper
  useEffect(() => {
    if (settings) {
      setTempLogoType(settings.logoType || 'icon');
      setTempLogoIcon(settings.logoIcon || 'Database');
      setTempLogoUrl(settings.logoUrl || '');
      setTempFaviconUrl(settings.faviconUrl || '');
      setTempCrmName(settings.crmName || 'Secure Leads CRM');
      setTempCrmSlogan(settings.crmSlogan || 'Enterprise CRM Core');

      setProfileName(settings.adminName || 'Super Admin');
      setProfileEmail(settings.adminEmail || 'admin@admin.com');
      setProfileLogoUrl(settings.logoUrl || '');
      setProfileLogoType(settings.logoType || 'icon');
      setProfileLogoIcon(settings.logoIcon || 'Database');
      setProfileFaviconUrl(settings.faviconUrl || '');

      // Dynamically set document title based on CRM Settings
      if (settings.crmName) {
        document.title = settings.crmName;
      }

      // Dynamically set browser favicon if defined
      if (settings.faviconUrl) {
        let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.getElementsByTagName('head')[0].appendChild(link);
        }
        link.href = settings.faviconUrl;
      }
    }
  }, [settings]);

  // Sync current user if they are admin and settings change
  useEffect(() => {
    if (currentUser?.role === 'admin' && settings) {
      const storedAdminName = settings.adminName || 'Super Admin';
      if (currentUser.name !== storedAdminName) {
        const updatedAdmin = {
          ...currentUser,
          name: storedAdminName,
          avatar: storedAdminName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'SA',
        };
        setCurrentUser(updatedAdmin);
        localStorage.setItem('crm_current_user', JSON.stringify(updatedAdmin));
      }
    }
  }, [settings, currentUser]);

  // Save changes helper (persists to backend filesystem DB & localStorage)
  const updateData = (newLeads: Lead[], newActivities: Activity[]) => {
    setLeads(newLeads);
    setActivities(newActivities);
    
    // Save to localStorage
    localStorage.setItem('crm_leads', JSON.stringify(newLeads));
    localStorage.setItem('crm_activities', JSON.stringify(newActivities));

    // Save to backend database server
    fetch('/api/leads-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leads: newLeads, activities: newActivities, staff: staffList, settings })
    }).catch(err => {
      console.error("Failed to save data to backend database server:", err);
    });
  };

  // Helper to render dynamic logo
  const renderLogo = (size: number = 24) => {
    if (settings.logoType === 'image' && settings.logoUrl.trim()) {
      return (
        <img 
          src={settings.logoUrl.trim()} 
          alt="CRM Logo" 
          className="object-contain rounded-lg"
          style={{ width: size, height: size }}
          referrerPolicy="no-referrer"
        />
      );
    }
    
    // Choose Lucide component based on name
    switch (settings.logoIcon) {
      case 'Shield':
        return <Shield size={size} />;
      case 'Sparkles':
        return <Sparkles size={size} />;
      case 'Globe':
        return <Globe size={size} />;
      case 'Activity':
        return <Activity size={size} />;
      case 'Award':
        return <Award size={size} />;
      case 'Briefcase':
        return <Briefcase size={size} />;
      case 'TrendingUp':
        return <TrendingUp size={size} />;
      case 'Database':
      default:
        return <Database size={size} />;
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (loginRole === 'admin') {
      const allowedPassword = settings.adminPassword || 'admin123';
      const allowedName = settings.adminName || 'Super Admin';
      if (loginUsername === 'admin' && loginPassword === allowedPassword) {
        const adminUser: Staff = {
          id: 'admin-super',
          name: allowedName,
          username: 'admin',
          avatar: allowedName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'SA',
          color: 'bg-purple-100 text-purple-700',
          role: 'admin'
        };
        setCurrentUser(adminUser);
        setActivePortal('admin');
        localStorage.setItem('crm_current_user', JSON.stringify(adminUser));
        showBanner(`Successfully logged in as ${allowedName}!`);
        setLoginUsername('');
        setLoginPassword('');
      } else {
        setLoginError('Invalid Administrator username or password.');
      }
    } else {
      // Find staff in staffList
      const foundStaff = staffList.find(
        st => st.username.toLowerCase() === loginUsername.toLowerCase() && st.password === loginPassword
      );
      if (foundStaff) {
        setCurrentUser(foundStaff);
        setCurrentStaff(foundStaff);
        setActivePortal('staff');
        localStorage.setItem('crm_current_user', JSON.stringify(foundStaff));
        showBanner(`Welcome back, ${foundStaff.name}!`);
        setLoginUsername('');
        setLoginPassword('');
      } else {
        setLoginError('Invalid Sales Agent username or passcode.');
      }
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('crm_current_user');
    showBanner('Logged out successfully.', 'info');
  };

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim() || !newStaffUsername.trim() || !newStaffPassword.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    // Check if username already exists
    if (newStaffUsername.toLowerCase() === 'admin' || staffList.some(s => s.username.toLowerCase() === newStaffUsername.toLowerCase())) {
      alert("This username is already taken. Please choose another.");
      return;
    }

    // Generate avatar letters
    const parts = newStaffName.trim().split(' ');
    const avatar = parts.length > 1 
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : parts[0].substring(0, 2).toUpperCase();

    // Select color randomly
    const colors = [
      'bg-indigo-100 text-indigo-700',
      'bg-emerald-100 text-emerald-700',
      'bg-amber-100 text-amber-700',
      'bg-rose-100 text-rose-700',
      'bg-teal-100 text-teal-700',
      'bg-sky-100 text-sky-700',
      'bg-fuchsia-100 text-fuchsia-700',
      'bg-violet-100 text-violet-700',
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];

    const newSt: Staff = {
      id: `staff-${Date.now()}`,
      name: newStaffName,
      username: newStaffUsername,
      password: newStaffPassword,
      avatar,
      color,
      role: 'staff'
    };

    const updatedStaff = [...staffList, newSt];
    setStaffList(updatedStaff);
    localStorage.setItem('crm_staff', JSON.stringify(updatedStaff));

    // Save to server DB as well!
    fetch('/api/leads-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leads, activities, staff: updatedStaff, settings })
    }).then(() => {
      showBanner(`Staff account for "${newStaffName}" registered successfully!`);
      setNewStaffName('');
      setNewStaffUsername('');
      setNewStaffPassword('');
    }).catch(err => {
      console.error("Failed to save new staff to server DB:", err);
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setTempLogoUrl(base64String);
        setTempLogoType('image'); // Automatically switch logo presentation mode to image
        showBanner("Logo image uploaded. Save settings to apply everywhere!", 'info');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setTempFaviconUrl(base64String);
        showBanner("Favicon image uploaded. Save settings to apply to browser tab!", 'info');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const newSettings: CrmSettings = {
      logoType: tempLogoType,
      logoIcon: tempLogoIcon,
      logoUrl: tempLogoUrl,
      faviconUrl: tempFaviconUrl,
      crmName: tempCrmName,
      crmSlogan: tempCrmSlogan
    };
    setSettings(newSettings);
    localStorage.setItem('crm_settings', JSON.stringify(newSettings));
    
    fetch('/api/leads-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leads, activities, staff: staffList, settings: newSettings })
    }).then(() => {
      showBanner("CRM Settings and branding updated successfully!");
    }).catch(err => {
      console.error("Failed to save settings to server:", err);
    });
  };

  const handleProfileLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfileLogoUrl(base64String);
        setProfileLogoType('image');
        showBanner("Logo image loaded in profile preview. Click 'Save Changes' to apply!", 'info');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfileFaviconUrl(base64String);
        showBanner("Favicon image loaded in profile preview. Click 'Save Changes' to apply!", 'info');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim() || !profileEmail.trim()) {
      alert("Name and Email address are required.");
      return;
    }

    if (profilePassword && profilePassword.length < 8) {
      alert("Security rule: New password must be at least 8 characters long.");
      return;
    }

    const newSettings: CrmSettings = {
      ...settings,
      adminName: profileName.trim(),
      adminEmail: profileEmail.trim(),
      logoType: profileLogoType,
      logoIcon: profileLogoIcon,
      logoUrl: profileLogoUrl,
      faviconUrl: profileFaviconUrl,
    };

    if (profilePassword.trim()) {
      newSettings.adminPassword = profilePassword.trim();
    }

    setSettings(newSettings);
    localStorage.setItem('crm_settings', JSON.stringify(newSettings));

    // Update currentUser state and local storage immediately
    if (currentUser?.role === 'admin') {
      const updatedAdmin: Staff = {
        ...currentUser,
        name: profileName.trim(),
        avatar: profileName.trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'SA',
      };
      setCurrentUser(updatedAdmin);
      localStorage.setItem('crm_current_user', JSON.stringify(updatedAdmin));
    }

    // Clear password input field after saving successfully
    setProfilePassword('');

    // Persist everything to the backend API database server
    fetch('/api/leads-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leads, activities, staff: staffList, settings: newSettings })
    }).then(() => {
      showBanner("Admin profile and corporate brand settings updated successfully!");
    }).catch(err => {
      console.error("Failed to save settings to server:", err);
    });
  };

  const showBanner = (text: string, type: 'success' | 'info' = 'success') => {
    setBannerMsg({ text, type });
    setTimeout(() => {
      setBannerMsg(null);
    }, 4000);
  };

  // Add a new lead
  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.name.trim()) return;
    
    const leadId = `lead-${Date.now()}`;
    const timestamp = new Date().toISOString();
    
    const createdLead: Lead = {
      id: leadId,
      name: newLead.name,
      phone: newLead.phone || 'N/A',
      email: newLead.email || 'N/A',
      source: newLead.source,
      status: newLead.status,
      followUpDate: newLead.followUpDate ? newLead.followUpDate : undefined,
      notes: newLead.notes || 'Added to CRM.',
      createdBy: currentStaff.name,
      createdAt: timestamp,
      updatedBy: currentStaff.name,
      updatedAt: timestamp
    };

    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      leadId,
      leadName: newLead.name,
      staffName: currentStaff.name,
      action: 'create',
      details: `Created lead with status: ${newLead.status.toUpperCase()}${newLead.followUpDate ? ` (Follow-up: ${newLead.followUpDate})` : ''}`,
      date: TODAY_DATE,
      timestamp
    };

    const updatedLeads = [createdLead, ...leads];
    const updatedActivities = [newActivity, ...activities];
    
    updateData(updatedLeads, updatedActivities);
    
    // Reset form
    setNewLead({
      name: '',
      phone: '',
      email: '',
      source: 'Google Ads',
      status: 'new',
      notes: '',
      followUpDate: ''
    });
    
    showBanner(`Successfully added lead: "${createdLead.name}"`);
  };

  // Launch Edit Lead Modal
  const startEditLead = (lead: Lead) => {
    setEditingLead(lead);
    setEditName(lead.name);
    setEditPhone(lead.phone || '');
    setEditEmail(lead.email || '');
    setEditSource(lead.source);
    setEditStatus(lead.status);
    setEditFollowUpDate(lead.followUpDate || '');
    setEditAppendJournal('');
  };

  // Handle saving Edited Lead
  const handleSaveEditLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLead) return;

    const timestamp = new Date().toISOString();
    let finalFollowUp: string | undefined = editFollowUpDate || undefined;

    let appendNote = '';
    if (editAppendJournal.trim()) {
      appendNote = `\n[Staff Call Update - ${TODAY_DATE} by ${currentUser?.name || currentStaff.name}]: ${editAppendJournal.trim()}${finalFollowUp ? ` (Scheduled callback date: ${finalFollowUp})` : ''}`;
    }

    // Update Lead list
    const updatedLeads = leads.map(l => {
      if (l.id === editingLead.id) {
        return {
          ...l,
          name: editName.trim(),
          phone: editPhone.trim() || 'N/A',
          email: editEmail.trim() || 'N/A',
          source: editSource,
          status: editStatus,
          followUpDate: finalFollowUp,
          notes: appendNote ? l.notes + appendNote : l.notes,
          updatedBy: currentUser?.name || currentStaff.name,
          updatedAt: timestamp
        };
      }
      return l;
    });

    // Create Activity Record
    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      leadId: editingLead.id,
      leadName: editName.trim(),
      staffName: currentUser?.name || currentStaff.name,
      action: editAppendJournal.trim() ? 'call' : 'status_change',
      details: editAppendJournal.trim() 
        ? `Logged phone call & callback date: "${editAppendJournal.trim()}"${finalFollowUp ? ` (Scheduled callback: ${finalFollowUp})` : ''}`
        : `Edited lead general details. Status: ${editStatus.toUpperCase()}`,
      date: TODAY_DATE,
      timestamp
    };

    updateData(updatedLeads, [newActivity, ...activities]);
    setEditingLead(null);
    showBanner(`Successfully updated lead: "${editName.trim()}"`);
  };

  // Reset demo data to initial state
  const resetDemoData = () => {
    if (window.confirm('Are you sure you want to restore default demo data? All modifications will be reset.')) {
      updateData(INITIAL_LEADS, INITIAL_ACTIVITIES);
      showBanner('Database restored to default demo state.', 'info');
    }
  };

  // Export Master Database Ledger to CSV format
  const exportToCSV = () => {
    if (currentUser?.role !== 'admin') {
      alert("Access Denied: Only Administrators can export lead data.");
      return;
    }
    const headers = ['Name', 'Phone', 'Email', 'Source', 'Status', 'FollowUpDate', 'Notes', 'CreatedBy', 'CreatedAt', 'UpdatedBy', 'UpdatedAt'];
    const rows = leads.map(lead => [
      lead.name,
      lead.phone,
      lead.email,
      lead.source,
      lead.status,
      lead.followUpDate || '',
      lead.notes.replace(/"/g, '""'), // escape quotes
      lead.createdBy,
      lead.createdAt,
      lead.updatedBy,
      lead.updatedAt
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_master_ledger_${TODAY_DATE}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showBanner('Successfully exported Database Master Ledger to CSV.');
  };

  // Safe robust client-side CSV parser
  const parseCSV = (text: string) => {
    const lines: string[] = [];
    let currentLine = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          currentLine += '"';
          i++; // skip next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === '\n' && !inQuotes) {
        lines.push(currentLine);
        currentLine = '';
      } else if (char === '\r' && !inQuotes) {
        // ignore CR
      } else {
        currentLine += char;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }

    return lines.map(line => {
      const fields: string[] = [];
      let field = '';
      let inQuotedField = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];

        if (char === '"') {
          if (inQuotedField && nextChar === '"') {
            field += '"';
            i++;
          } else {
            inQuotedField = !inQuotedField;
          }
        } else if (char === ',' && !inQuotedField) {
          fields.push(field);
          field = '';
        } else {
          field += char;
        }
      }
      fields.push(field);
      return fields;
    });
  };

  // Parse and Import CSV Data
  const handleCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentUser?.role !== 'admin') {
      alert("Access Denied: Only Administrators can import lead data.");
      return;
    }
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      try {
        const parsedRows = parseCSV(text);
        if (parsedRows.length < 2) {
          alert('Invalid CSV structure. Please ensure there is a header row and at least one data row.');
          return;
        }

        const headers = parsedRows[0].map(h => h.trim().toLowerCase());
        
        // Match header keywords
        const nameIdx = headers.indexOf('name');
        const phoneIdx = headers.indexOf('phone');
        const emailIdx = headers.indexOf('email');
        const sourceIdx = headers.indexOf('source');
        const statusIdx = headers.indexOf('status');
        const followUpIdx = headers.findIndex(h => h.includes('follow') || h.includes('date'));
        const notesIdx = headers.indexOf('notes');

        if (nameIdx === -1) {
          alert('Required header "Name" not found in the uploaded CSV. Headers detected: ' + parsedRows[0].join(', '));
          return;
        }

        const importedLeads: Lead[] = [];
        const timestamp = new Date().toISOString();

        for (let i = 1; i < parsedRows.length; i++) {
          const row = parsedRows[i];
          if (row.length === 0 || (row.length === 1 && !row[0])) continue;

          const name = row[nameIdx]?.trim();
          if (!name) continue; // Skip entries without names

          const phone = phoneIdx !== -1 && row[phoneIdx] ? row[phoneIdx].trim() : 'N/A';
          const email = emailIdx !== -1 && row[emailIdx] ? row[emailIdx].trim() : 'N/A';
          const source = sourceIdx !== -1 && row[sourceIdx] ? row[sourceIdx].trim() : 'CSV Import';
          
          let status: 'hot' | 'cold' | 'dead' = 'cold';
          if (statusIdx !== -1 && row[statusIdx]) {
            const rawStatus = row[statusIdx].trim().toLowerCase();
            if (rawStatus.includes('hot')) status = 'hot';
            else if (rawStatus.includes('dead')) status = 'dead';
          }

          const rawFollowUp = followUpIdx !== -1 && row[followUpIdx] ? row[followUpIdx].trim() : '';
          let followUpDate: string | undefined = undefined;
          if (status === 'hot' && rawFollowUp) {
            if (/^\d{4}-\d{2}-\d{2}$/.test(rawFollowUp)) {
              followUpDate = rawFollowUp;
            } else {
              followUpDate = TODAY_DATE;
            }
          }

          const notes = notesIdx !== -1 && row[notesIdx] ? row[notesIdx].trim() : 'Imported via CSV Master List.';

          importedLeads.push({
            id: `lead-import-${Date.now()}-${i}`,
            name,
            phone,
            email,
            source: SOURCES.includes(source) ? source : 'Other',
            status,
            followUpDate,
            notes,
            createdBy: 'Admin (CSV)',
            createdAt: timestamp,
            updatedBy: 'Admin (CSV)',
            updatedAt: timestamp
          });
        }

        if (importedLeads.length === 0) {
          alert('No valid lead records found to import.');
          return;
        }

        const updatedLeads = [...importedLeads, ...leads];
        const newActivity: Activity = {
          id: `act-import-${Date.now()}`,
          leadId: 'all',
          leadName: 'Multiple Leads',
          staffName: 'Admin',
          action: 'create',
          details: `Imported ${importedLeads.length} leads successfully from CSV file.`,
          date: TODAY_DATE,
          timestamp
        };

        updateData(updatedLeads, [newActivity, ...activities]);
        showBanner(`Successfully imported ${importedLeads.length} leads!`);
        e.target.value = '';
      } catch (err) {
        console.error(err);
        alert('Failed to parse CSV. Please check the file formatting.');
      }
    };
    reader.readAsText(file);
  };

  // Filter Leads
  const filteredLeads = leads.filter(lead => {
    // Search filter
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.notes.toLowerCase().includes(searchTerm.toLowerCase());
      
    // Status filter
    const matchesStatus = statusFilter === 'all' ? true : lead.status === statusFilter;
    
    // Source filter
    const matchesSource = sourceFilter === 'all' ? true : lead.source === sourceFilter;
    
    // Scheduled follow up date toggle
    const matchesTodayFollowUp = onlyTodayFollowUp 
      ? (lead.status === 'hot' && lead.followUpDate === TODAY_DATE) 
      : true;

    return matchesSearch && matchesStatus && matchesSource && matchesTodayFollowUp;
  });

  // Sorting Logic: "on the date lead will show at first"
  // Leads with follow-up date matching TODAY are placed first, then other hot leads, then sorted by update time.
  const sortedLeads = [...filteredLeads].sort((a, b) => {
    const isTodayA = a.status === 'hot' && a.followUpDate === TODAY_DATE;
    const isTodayB = b.status === 'hot' && b.followUpDate === TODAY_DATE;
    
    if (isTodayA && !isTodayB) return -1;
    if (!isTodayA && isTodayB) return 1;
    
    // Next, check if any follow up date exists at all (past/future follow ups sorted soon after today)
    const hasFollowUpA = !!a.followUpDate;
    const hasFollowUpB = !!b.followUpDate;
    if (hasFollowUpA && !hasFollowUpB) return -1;
    if (!hasFollowUpA && hasFollowUpB) return 1;
    
    // Finally, sort by updatedAt (latest first)
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  // Format Call Timer (Seconds -> MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Admin Portal Aggregations
  // 1. Core Counts
  const totalLeadCount = leads.length;
  const hotCount = leads.filter(l => l.status === 'hot').length;
  const coldCount = leads.filter(l => l.status === 'cold').length;
  const deadCount = leads.filter(l => l.status === 'dead').length;
  
  // 2. Source Distribution
  const sourceDistribution = SOURCES.map(source => {
    const count = leads.filter(l => l.source === source).length;
    return {
      source,
      count,
      percent: totalLeadCount > 0 ? Math.round((count / totalLeadCount) * 100) : 0
    };
  });

  // 3. Staff Metrics: "how many total leads updated by which staff date wise"
  const staffPerformance = staffList.map(staff => {
    const leadsCreated = leads.filter(l => l.createdBy === staff.name).length;
    // Total actions logged in history
    const totalUpdates = activities.filter(a => a.staffName === staff.name).length;
    const conversions = leads.filter(l => l.status === 'hot' && l.createdBy === staff.name).length;
    
    return {
      ...staff,
      leadsCreated,
      totalUpdates,
      conversionRate: leadsCreated > 0 ? Math.round((conversions / leadsCreated) * 100) : 0
    };
  });

  // 4. Date-wise actions by staff tracker
  // We will pull the unique dates from activities
  const uniqueDates = Array.from(new Set<string>(activities.map(a => a.date)))
    .sort((a, b) => b.localeCompare(a)); // Newest dates first

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" id="login_root">
        {/* Dynamic Alert Banner */}
        {bannerMsg && (
          <div 
            id="system_notification_banner"
            className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border animate-bounce ${
              bannerMsg.type === 'success' 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                : 'bg-indigo-50 border-indigo-200 text-indigo-800'
            }`}
          >
            {bannerMsg.type === 'success' ? (
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            ) : (
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
            )}
            <span className="font-medium text-sm">{bannerMsg.text}</span>
            <button onClick={() => setBannerMsg(null)} className="text-slate-400 hover:text-slate-600">
              <X size={14} />
            </button>
          </div>
        )}

        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl" id="login_card">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              {renderLogo(24)}
            </div>
            <h2 className="mt-6 text-3xl font-black text-slate-900 tracking-tight">{settings.crmName}</h2>
            <p className="mt-2 text-xs text-slate-500 font-medium uppercase tracking-wider">{settings.crmSlogan}</p>
          </div>

          {/* Login Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/60" id="login_role_tabs">
            <button
              onClick={() => { setLoginRole('staff'); setLoginError(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-lg transition-all ${
                loginRole === 'staff'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase size={14} />
              Sales Staff
            </button>
            <button
              onClick={() => { setLoginRole('admin'); setLoginError(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-lg transition-all ${
                loginRole === 'admin'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users size={14} />
              Super Admin
            </button>
          </div>

          {loginError && (
            <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2" id="login_error_msg">
              <AlertCircle size={14} className="shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form className="mt-6 space-y-4" onSubmit={handleLogin} id="login_form">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                {loginRole === 'admin' ? 'Administrator Username' : 'Agent Username'}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-slate-400" size={14} />
                <input
                  type="text"
                  required
                  value={loginUsername}
                  onChange={e => setLoginUsername(e.target.value)}
                  placeholder={loginRole === 'admin' ? 'e.g. admin' : 'e.g. john'}
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Password / Passcode</label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 text-slate-400" size={14} />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-xs font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-md shadow-indigo-100 font-bold"
            >
              Sign In to Portal
            </button>
          </form>

          {/* Quick Info Credentials for easy evaluation */}
          <div className="mt-6 p-4 bg-slate-50 border border-slate-200/60 rounded-2xl text-[11px] text-slate-500 leading-relaxed" id="demo_credentials_tip">
            <span className="font-extrabold text-slate-700 block mb-1">💡 Demo / Setup Access Credentials:</span>
            {loginRole === 'admin' ? (
              <p>Username: <code className="bg-white px-1.5 py-0.5 border rounded font-mono font-bold text-slate-800">admin</code><br />Password: <code className="bg-white px-1.5 py-0.5 border rounded font-mono font-bold text-slate-800">admin123</code></p>
            ) : (
              <p>Username: <code className="bg-white px-1.5 py-0.5 border rounded font-mono font-bold text-slate-800">john</code>, <code className="bg-white px-1.5 py-0.5 border rounded font-mono font-bold text-slate-800">sarah</code>, <code className="bg-white px-1.5 py-0.5 border rounded font-mono font-bold text-slate-800">michael</code>, <code className="bg-white px-1.5 py-0.5 border rounded font-mono font-bold text-slate-800">emily</code><br />Password: <code className="bg-white px-1.5 py-0.5 border rounded font-mono font-bold text-slate-800">123</code></p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Gorgeous Sidebar layout for Admin Console (Fulfilling Redesign Request)
  const renderAdminPortalWithSidebar = () => {
    const totalCount = leads.length;
    const newCount = leads.filter(l => l.status === 'new').length;
    const hotCount = leads.filter(l => l.status === 'hot').length;
    const coldCount = leads.filter(l => l.status === 'cold').length;
    const convertedCount = leads.filter(l => l.status === 'converted').length;
    const deadCount = leads.filter(l => l.status === 'dead').length;

    // Filter leads for master table
    const filteredLeads = leads.filter(l => {
      const s = searchTerm.toLowerCase();
      const matchesSearch = l.name.toLowerCase().includes(s) ||
                           l.phone.toLowerCase().includes(s) ||
                           l.email.toLowerCase().includes(s);
      const matchesFilter = activeLeadFilter === 'all' || l.status === activeLeadFilter;
      return matchesSearch && matchesFilter;
    });

    // Sort leads by creation date descending and slice for "Action Items"
    const recentLeads = [...leads].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 7);

    const formatAddedDate = (dateString: string) => {
      try {
        const d = new Date(dateString);
        return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short' });
      } catch (e) {
        return '04 May';
      }
    };

    return (
      <div className="min-h-screen bg-[#f3f4f6] text-slate-900 font-sans antialiased flex" id="app_root_admin">
        {/* Mobile Sidebar Backdrop */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* PERSISTENT LEFT SIDEBAR */}
        <aside className={`w-64 bg-[#2b3541] text-slate-300 flex flex-col fixed inset-y-0 left-0 z-50 border-r border-slate-700/40 transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`} id="admin_portal_sidebar">
          {/* Logo & Brand Header */}
          <div className="p-4 border-b border-slate-700/60 flex items-center gap-3 bg-[#1e242d]">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-md flex items-center justify-center shrink-0">
              {renderLogo(20)}
            </div>
            <div className="overflow-hidden">
              <h1 className="text-xs font-black text-white tracking-wider uppercase truncate">{settings.crmName}</h1>
              <p className="text-[9px] text-slate-400 font-bold tracking-widest truncate uppercase">{settings.crmSlogan}</p>
            </div>
          </div>

          {/* Master Admin Profile Section */}
          <div className="p-4 border-b border-slate-700/40 bg-[#222a34] flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500 text-white font-black text-sm flex items-center justify-center shrink-0 border border-indigo-400/20 shadow-inner">
              {currentUser?.avatar || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-black text-white truncate">{currentUser?.name || 'Master Admin'}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">Online Mode</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
            
            {/* Main Menu Label */}
            <div className="space-y-1">
              <p className="px-3 text-[9px] font-black text-slate-500 uppercase tracking-widest">Main Console</p>
              <button
                onClick={() => { setAdminTab('overview'); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-bold rounded-xl transition-all duration-150 ${
                  adminTab === 'overview'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <SlidersHorizontal size={14} />
                <span>Dashboard</span>
              </button>
            </div>

            {/* Section: CRM & LEADS */}
            <div className="space-y-1">
              <p className="px-3 text-[9px] font-black text-slate-500 uppercase tracking-widest">CRM & Leads</p>
              
              <button
                onClick={() => { setAdminTab('leads'); setActiveLeadFilter('all'); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-bold rounded-xl transition-all duration-150 ${
                  adminTab === 'leads' && activeLeadFilter === 'all'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Layers size={14} />
                <span>All Leads Ledger</span>
              </button>

              <button
                onClick={() => { setAdminAddLeadOpen(true); setSidebarOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-150"
              >
                <Plus size={14} className="text-emerald-500" />
                <span>Add New Lead</span>
              </button>
            </div>

            {/* Section: ADMINISTRATION */}
            <div className="space-y-1">
              <p className="px-3 text-[9px] font-black text-slate-500 uppercase tracking-widest">Administration</p>
              
              <button
                onClick={() => { setAdminTab('staff'); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-bold rounded-xl transition-all duration-150 ${
                  adminTab === 'staff'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Users size={14} />
                <span>User Management</span>
              </button>

              <button
                onClick={() => { setAdminTab('settings'); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-bold rounded-xl transition-all duration-150 ${
                  adminTab === 'settings'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Settings size={14} />
                <span>CRM Settings</span>
              </button>
            </div>

            {/* Section: MY ACCOUNT */}
            <div className="space-y-1">
              <p className="px-3 text-[9px] font-black text-slate-500 uppercase tracking-widest">Supervisor Account</p>
              
              <button
                onClick={() => { setAdminTab('profile'); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-bold rounded-xl transition-all duration-150 ${
                  adminTab === 'profile'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <User size={14} />
                <span>My Profile Info</span>
              </button>
            </div>

            {/* Staff Switch Panel */}
            <div className="pt-2 border-t border-slate-700/30">
              <button
                onClick={() => { setActivePortal('staff'); }}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold rounded-xl text-indigo-400 hover:bg-slate-800 hover:text-indigo-300 transition-all duration-150"
              >
                <Briefcase size={14} />
                <span>Switch to Staff View</span>
              </button>
            </div>
          </div>

          {/* Solid Red Logout Button at bottom */}
          <div className="p-3 border-t border-slate-700/40 bg-[#1e242d]">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all duration-150 cursor-pointer shadow-md"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* RIGHT HAND CONTENT CONTAINER */}
        <div className="flex-1 md:pl-64 flex flex-col min-h-screen bg-[#f3f4f6]" id="admin_main_pane">
          {/* Top Sticky Header */}
          <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs px-6 py-4 flex items-center justify-between" id="admin_main_header">
            {/* Left: Hamburger and welcome text */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl md:hidden cursor-pointer"
                aria-label="Open Sidebar Menu"
              >
                <Menu size={18} />
              </button>
              <div>
                <h2 className="text-sm font-black text-slate-800 tracking-tight">
                  {settings.crmName} Admin Panel
                </h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider hidden sm:block mt-0.5">
                  Welcome back, <span className="text-indigo-600 font-black">{currentUser?.name}</span> • System Supervisor Desk
                </p>
              </div>
            </div>

            {/* Right: Date Stamp and Logout Button */}
            <div className="flex items-center gap-3">
              <span className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                <Calendar size={12} />
                Calendar: {TODAY_DATE}
              </span>
              
              <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-slate-200 hover:border-rose-200 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut size={12} className="text-rose-500" />
                  Logout
                </button>
              </div>
            </div>
          </header>

          {/* Main Space */}
          <main className="flex-1 p-6 space-y-6" id="admin_workspace_content">
            
            {/* TAB: OVERVIEW */}
            {adminTab === 'overview' && (
              <div className="space-y-6 animate-fade-in" id="admin_tab_overview">
                
                {/* 5 Distinctive Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
                  
                  {/* Card 1: Total Active (Blue) */}
                  <div className="bg-[#007bff] text-white rounded-xl shadow-md overflow-hidden relative group hover:scale-[1.02] transition-transform duration-200">
                    <div className="p-5 pb-8">
                      <p className="text-3xl font-black">{totalCount}</p>
                      <p className="text-xs font-bold uppercase tracking-widest text-blue-100 mt-1">Total Leads</p>
                      <Users className="absolute right-4 top-4 text-white/10 w-20 h-20 pointer-events-none" />
                    </div>
                    <button
                      onClick={() => { setAdminTab('leads'); setActiveLeadFilter('all'); }}
                      className="w-full bg-[#0062cc] hover:bg-[#0056b3] text-[11px] font-bold py-2.5 px-4 flex items-center justify-between text-blue-100 hover:text-white transition-colors cursor-pointer border-none"
                    >
                      <span>View All Ledger</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>

                  {/* Card 2: New Leads (Teal) */}
                  <div className="bg-[#17a2b8] text-white rounded-xl shadow-md overflow-hidden relative group hover:scale-[1.02] transition-transform duration-200">
                    <div className="p-5 pb-8">
                      <p className="text-3xl font-black">{newCount}</p>
                      <p className="text-xs font-bold uppercase tracking-widest text-teal-100 mt-1">New Leads</p>
                      <Star className="absolute right-4 top-4 text-white/10 w-20 h-20 pointer-events-none" />
                    </div>
                    <button
                      onClick={() => { setAdminTab('leads'); setActiveLeadFilter('new'); }}
                      className="w-full bg-[#148ea1] hover:bg-[#117a8b] text-[11px] font-bold py-2.5 px-4 flex items-center justify-between text-teal-100 hover:text-white transition-colors cursor-pointer border-none"
                    >
                      <span>Filter New Leads</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>

                  {/* Card 3: Hot Leads (Red) */}
                  <div className="bg-[#dc3545] text-white rounded-xl shadow-md overflow-hidden relative group hover:scale-[1.02] transition-transform duration-200">
                    <div className="p-5 pb-8">
                      <p className="text-3xl font-black">{hotCount}</p>
                      <p className="text-xs font-bold uppercase tracking-widest text-red-100 mt-1">Hot Leads</p>
                      <TrendingUp className="absolute right-4 top-4 text-white/10 w-20 h-20 pointer-events-none" />
                    </div>
                    <button
                      onClick={() => { setAdminTab('leads'); setActiveLeadFilter('hot'); }}
                      className="w-full bg-[#bd2130] hover:bg-[#b21f2d] text-[11px] font-bold py-2.5 px-4 flex items-center justify-between text-red-100 hover:text-white transition-colors cursor-pointer border-none"
                    >
                      <span>Filter Hot Stage</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>

                  {/* Card 4: Cold Leads (Grey) */}
                  <div className="bg-[#6c757d] text-white rounded-xl shadow-md overflow-hidden relative group hover:scale-[1.02] transition-transform duration-200">
                    <div className="p-5 pb-8">
                      <p className="text-3xl font-black">{coldCount}</p>
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-200 mt-1">Cold Leads</p>
                      <Clock className="absolute right-4 top-4 text-white/10 w-20 h-20 pointer-events-none" />
                    </div>
                    <button
                      onClick={() => { setAdminTab('leads'); setActiveLeadFilter('cold'); }}
                      className="w-full bg-[#5a6268] hover:bg-[#545b62] text-[11px] font-bold py-2.5 px-4 flex items-center justify-between text-slate-200 hover:text-white transition-colors cursor-pointer border-none"
                    >
                      <span>Filter Cold Stage</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>

                  {/* Card 5: Converted (Green) */}
                  <div className="bg-[#28a745] text-white rounded-xl shadow-md overflow-hidden relative group hover:scale-[1.02] transition-transform duration-200">
                    <div className="p-5 pb-8">
                      <p className="text-3xl font-black">{convertedCount}</p>
                      <p className="text-xs font-bold uppercase tracking-widest text-emerald-100 mt-1">Converted</p>
                      <Check className="absolute right-4 top-4 text-white/10 w-20 h-20 pointer-events-none" />
                    </div>
                    <button
                      onClick={() => { setAdminTab('leads'); setActiveLeadFilter('converted'); }}
                      className="w-full bg-[#218838] hover:bg-[#1e7e34] text-[11px] font-bold py-2.5 px-4 flex items-center justify-between text-emerald-100 hover:text-white transition-colors cursor-pointer border-none"
                    >
                      <span>Filter Converted</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>

                </div>

                {/* Grid for: Recent Leads Table & Live Operations Journal */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Action Items & Recent Leads Table */}
                  <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
                    <div className="p-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 bg-yellow-100 text-yellow-700 rounded-lg">
                          <Star size={14} className="fill-yellow-500 text-yellow-600" />
                        </span>
                        <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider">Action Items & Recent Leads</h3>
                      </div>
                      <button
                        onClick={() => { setAdminTab('leads'); setActiveLeadFilter('all'); }}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black rounded-md shadow-sm transition-colors cursor-pointer border-none"
                      >
                        View All
                      </button>
                    </div>

                    <div className="overflow-x-auto flex-1">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-slate-100 bg-slate-50/40 text-slate-500 font-bold">
                            <th className="py-2.5 px-4">Customer Name</th>
                            <th className="py-2.5 px-4">Phone</th>
                            <th className="py-2.5 px-4">Stage</th>
                            <th className="py-2.5 px-4">Schedule / Status</th>
                            <th className="py-2.5 px-4 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {recentLeads.map((lead) => {
                            const isOverdue = lead.followUpDate && lead.followUpDate < TODAY_DATE;
                            return (
                              <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-3 px-4 font-bold text-slate-800">{lead.name}</td>
                                <td className="py-3 px-4 font-mono text-slate-600 text-[11px]">{lead.phone}</td>
                                <td className="py-3 px-4">
                                  <span className={`px-2 py-0.5 rounded-md font-bold text-[9px] uppercase border ${
                                    lead.status === 'new'
                                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                                      : lead.status === 'hot'
                                      ? 'bg-red-50 text-red-700 border-red-200'
                                      : lead.status === 'cold'
                                      ? 'bg-slate-50 text-slate-700 border-slate-200'
                                      : lead.status === 'converted'
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                      : 'bg-rose-50 text-rose-700 border-rose-200'
                                  }`}>
                                    {lead.status}
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  {isOverdue ? (
                                    <span className="flex items-center gap-1 text-[10px] text-rose-600 font-extrabold bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100 w-fit">
                                      <AlertCircle size={10} />
                                      Overdue ({lead.followUpDate})
                                    </span>
                                  ) : lead.followUpDate ? (
                                    <span className="flex items-center gap-1 text-[10px] text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 w-fit">
                                      <Clock size={10} />
                                      Scheduled ({lead.followUpDate})
                                    </span>
                                  ) : (
                                    <span className="flex items-center gap-1 text-[10px] text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100 w-fit">
                                      <Star size={10} className="fill-amber-400 text-amber-500" />
                                      New Lead (Added {formatAddedDate(lead.createdAt)})
                                    </span>
                                  )}
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <button
                                    onClick={() => startEditLead(lead)}
                                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-md shadow-xs transition-colors cursor-pointer border-none"
                                  >
                                    View
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Operational Timeline Feed */}
                  <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/80 shadow-xs p-5 flex flex-col max-h-[360px]">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                      <div className="flex items-center gap-2">
                        <Activity className="text-indigo-600" size={14} />
                        <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider">System Live Journal</h3>
                      </div>
                      <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        Active Feed
                      </span>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-none">
                      {activities.slice(0, 5).map((act) => (
                        <div key={act.id} className="text-xs flex items-start gap-2 border-b border-slate-50 pb-2">
                          <ChevronRight size={10} className="text-indigo-500 mt-1 shrink-0" />
                          <div>
                            <p className="text-slate-800 leading-tight">
                              <span className="font-extrabold text-indigo-700">{act.staffName}</span>{' '}
                              {act.action === 'create' ? 'created' : act.action === 'call' ? 'called' : 'modified'}{' '}
                              <span className="font-extrabold text-slate-900">{act.leadName}</span>
                            </p>
                            <p className="text-[9px] text-slate-400 font-semibold uppercase mt-0.5">
                              ⏱️ {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Additional Performance Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Lead Sources SVG Bar Chart */}
                  <div className="lg:col-span-6 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
                    <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider border-b border-slate-100 pb-3 mb-4">
                      📈 Lead Acquisition Channel Performance
                    </h3>
                    
                    <div className="space-y-4">
                      {['Google Ads', 'Facebook Ads', 'Organic Search', 'Referral', 'Website Contact'].map((source) => {
                        const count = leads.filter(l => l.source === source).length;
                        const percentage = leads.length > 0 ? (count / leads.length) * 100 : 0;
                        return (
                          <div key={source} className="space-y-1">
                            <div className="flex justify-between text-xs font-bold">
                              <span className="text-slate-700">{source}</span>
                              <span className="text-slate-500">{count} Leads ({Math.round(percentage)}%)</span>
                            </div>
                            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/30">
                              <div 
                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500" 
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sales Agent Productivity Leaderboard */}
                  <div className="lg:col-span-6 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
                    <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider border-b border-slate-100 pb-3 mb-4">
                      🏆 Sales Agent Lead Productivity Ledger
                    </h3>
                    
                    <div className="space-y-3">
                      {staffList.map((st) => {
                        const leadCount = leads.filter(l => l.createdBy === st.name).length;
                        const activityCount = activities.filter(a => a.staffName === st.name).length;
                        return (
                          <div key={st.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/30 hover:bg-slate-100/60 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full font-black text-xs flex items-center justify-center shrink-0 ${st.color || 'bg-slate-100 text-slate-700'}`}>
                                {st.avatar}
                              </div>
                              <div>
                                <p className="text-xs font-bold text-slate-800">{st.name}</p>
                                <p className="text-[10px] text-slate-400 font-semibold uppercase">{st.username} • Agent</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-black text-indigo-700">{leadCount} Leads Added</p>
                              <p className="text-[10px] text-slate-500 font-semibold">{activityCount} Calls Logged</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* TAB: LEADS REGISTRY TABLE */}
            {adminTab === 'leads' && (
              <div className="space-y-6 animate-fade-in" id="admin_tab_leads">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4" id="admin_master_table_panel">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        <Database className="text-indigo-600" size={16} />
                        🗄️ Database Master Ledger
                      </h3>
                      <p className="text-xs text-slate-500">Read-write supervisor console showing all system entries</p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3">
                      {/* CSV Export/Import Actions */}
                      {currentUser?.role === 'admin' && (
                        <div className="flex items-center gap-2">
                          <button
                            id="btn_export_csv"
                            onClick={exportToCSV}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-lg border border-emerald-200 transition-all shadow-sm active:scale-95 cursor-pointer border-none"
                            title="Download the full database ledger as CSV"
                          >
                            <FileSpreadsheet size={13} />
                            Export CSV
                          </button>
                          
                          <label
                            id="btn_import_csv_label"
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all active:scale-95 cursor-pointer"
                            title="Upload and merge new leads from a CSV file"
                          >
                            <Plus size={13} />
                            Import CSV
                            <input
                              id="csv_file_input"
                              type="file"
                              accept=".csv"
                              onChange={handleCSVImport}
                              className="hidden"
                            />
                          </label>
                        </div>
                      )}

                      {/* Search in Admin */}
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 text-slate-400" size={12} />
                        <input
                          id="admin_master_search"
                          type="text"
                          placeholder="Search master list..."
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                          className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Chip Filters inside Registry */}
                  <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-50">
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider mr-2">Filter Stage:</span>
                    {[
                      { key: 'all', label: 'All Leads', count: totalCount, color: 'bg-indigo-50 text-indigo-700 border-indigo-150' },
                      { key: 'new', label: 'New', count: newCount, color: 'bg-blue-50 text-blue-700 border-blue-150' },
                      { key: 'hot', label: 'Hot 🔥', count: hotCount, color: 'bg-red-50 text-red-700 border-red-150' },
                      { key: 'cold', label: 'Cold ❄️', count: coldCount, color: 'bg-slate-50 text-slate-700 border-slate-150' },
                      { key: 'converted', label: 'Converted ✅', count: convertedCount, color: 'bg-emerald-50 text-emerald-700 border-emerald-150' },
                      { key: 'dead', label: 'Dead 💀', count: deadCount, color: 'bg-rose-50 text-rose-700 border-rose-150' }
                    ].map((chip) => (
                      <button
                        key={chip.key}
                        onClick={() => setActiveLeadFilter(chip.key as any)}
                        className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                          activeLeadFilter === chip.key
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs scale-105'
                            : `${chip.color} hover:opacity-85`
                        }`}
                      >
                        <span>{chip.label}</span>
                        <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                          activeLeadFilter === chip.key ? 'bg-indigo-700 text-white' : 'bg-white/70'
                        }`}>
                          {chip.count}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Leads Table */}
                  <div className="overflow-x-auto" id="admin_master_table_container">
                    {filteredLeads.length === 0 ? (
                      <div className="p-12 text-center text-slate-400 font-bold space-y-2">
                        <Database size={32} className="mx-auto text-slate-300 animate-pulse" />
                        <p>No records found matching current filters or search query.</p>
                      </div>
                    ) : (
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50/50">
                            <th className="py-2.5 px-3">Lead Details</th>
                            <th className="py-2.5 px-3">Category</th>
                            <th className="py-2.5 px-3">Acquisition Channel</th>
                            <th className="py-2.5 px-3">Callback Schedule</th>
                            <th className="py-2.5 px-3">Assigned/Created By</th>
                            <th className="py-2.5 px-3">Last Active</th>
                            <th className="py-2.5 px-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100" id="admin_master_table_rows">
                          {filteredLeads.map(lead => (
                            <tr key={lead.id} id={`admin_row_${lead.id}`} className="hover:bg-slate-50/50">
                              <td className="py-3 px-3">
                                <div className="font-bold text-slate-800">{lead.name}</div>
                                <div className="text-[10px] text-slate-500 flex flex-col sm:flex-row sm:gap-2">
                                  <span>📞 {lead.phone}</span>
                                  <span className="hidden sm:inline text-slate-300">|</span>
                                  <span>✉️ {lead.email}</span>
                                </div>
                              </td>
                              <td className="py-3 px-3">
                                <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase ${
                                  lead.status === 'new'
                                    ? 'bg-blue-100 text-blue-800'
                                    : lead.status === 'hot' 
                                    ? 'bg-red-100 text-red-800' 
                                    : lead.status === 'cold' 
                                    ? 'bg-slate-100 text-slate-700' 
                                    : lead.status === 'converted'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}>
                                  {lead.status}
                                </span>
                              </td>
                              <td className="py-3 px-3 font-medium text-slate-600">{lead.source}</td>
                              <td className="py-3 px-3 font-semibold text-amber-700">
                                {lead.followUpDate ? `📅 ${lead.followUpDate}` : '--'}
                              </td>
                              <td className="py-3 px-3 font-semibold text-slate-700">{lead.createdBy}</td>
                              <td className="py-3 px-3 text-slate-400 font-medium">
                                {new Date(lead.updatedAt).toLocaleDateString()}
                              </td>
                              <td className="py-3 px-3 text-right space-x-2">
                                <button
                                  onClick={() => startEditLead(lead)}
                                  className="px-2 py-1 text-[10px] bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-md font-bold transition-colors cursor-pointer border-none"
                                >
                                  Edit Info
                                </button>
                                <button
                                  id={`admin_delete_btn_${lead.id}`}
                                  onClick={() => {
                                    if (window.confirm(`Delete lead "${lead.name}"?`)) {
                                      const filtered = leads.filter(l => l.id !== lead.id);
                                      const updatedActs = [{
                                        id: `act-${Date.now()}`,
                                        leadId: lead.id,
                                        leadName: lead.name,
                                        staffName: 'Admin',
                                        action: 'status_change',
                                        details: 'Deleted lead completely from master registry.',
                                        date: TODAY_DATE,
                                        timestamp: new Date().toISOString()
                                      } as Activity, ...activities];
                                      updateData(filtered, updatedActs);
                                      showBanner(`Permanently purged "${lead.name}"`);
                                    }
                                  }}
                                  className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer inline-block border-none bg-transparent"
                                >
                                  <X size={14} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: MANAGE STAFF ACCOUNTS */}
            {adminTab === 'staff' && (
              <div className="space-y-6 animate-fade-in" id="admin_tab_staff">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4" id="manage_staff_panel">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        <Users className="text-indigo-600" size={16} />
                        Staff Accounts Registry
                      </h3>
                      <p className="text-xs text-slate-500">Supervise active agent logins and register new staff members</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Create New Staff Account Form */}
                    <div className="md:col-span-5 bg-slate-50/50 p-4 rounded-xl border border-slate-200/60 space-y-3">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Register New Agent</h4>
                      <form onSubmit={handleCreateStaff} className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Full Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Jack Sparrow"
                            value={newStaffName}
                            onChange={e => setNewStaffName(e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Login Username</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. jack"
                            value={newStaffUsername}
                            onChange={e => setNewStaffUsername(e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Passcode / Password</label>
                          <input
                            type="password"
                            required
                            placeholder="e.g. 1234"
                            value={newStaffPassword}
                            onChange={e => setNewStaffPassword(e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow transition-all active:scale-95 cursor-pointer border-none"
                        >
                          Add Agent Account
                        </button>
                      </form>
                    </div>

                    {/* Current Active Logins List */}
                    <div className="md:col-span-7 space-y-2">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Active Staff Accounts ({staffList.length})</h4>
                      <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-1">
                        {staffList.map((st) => (
                          <div key={st.id} className="flex items-center justify-between py-2.5 first:pt-0">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-8 h-8 rounded-full font-black text-xs flex items-center justify-center shrink-0 ${st.color || 'bg-indigo-100 text-indigo-700'}`}>
                                {st.avatar}
                              </div>
                              <div>
                                <p className="text-xs font-bold text-slate-800">{st.name}</p>
                                <p className="text-[10px] text-slate-400 font-semibold uppercase">ID: {st.id} • Username: <code className="bg-slate-100 px-1 rounded font-mono text-slate-700 font-bold">{st.username}</code></p>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                if (st.id === 'staff-1') {
                                  showBanner("Default seed staff accounts cannot be deleted to prevent lockdown.", 'info');
                                  return;
                                }
                                if (window.confirm(`Are you sure you want to delete staff account for "${st.name}"?`)) {
                                  const updated = staffList.filter(s => s.id !== st.id);
                                  setStaffList(updated);
                                  fetch('/api/leads-data', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ leads, activities, staff: updated, settings })
                                  }).then(() => {
                                    showBanner(`Permanently deleted agent account for "${st.name}"`);
                                  });
                                }
                              }}
                              className="px-2 py-1 border border-rose-100 text-rose-600 hover:bg-rose-50 rounded-lg text-[10px] font-bold transition-all cursor-pointer bg-transparent"
                            >
                              Delete Account
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: SETTINGS & BRAND CUSTOMIZATION */}
            {adminTab === 'settings' && (
              <div className="space-y-6 animate-fade-in" id="admin_tab_settings">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4" id="manage_settings_panel">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        <Settings className="text-indigo-600" size={16} />
                        White-Label Brand Settings
                      </h3>
                      <p className="text-xs text-slate-500">Configure CRM platform naming, corporate logos, and tab favicon files</p>
                    </div>
                  </div>

                  <form onSubmit={handleSaveSettings} className="space-y-5" id="brand_settings_form">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">CRM System Display Name *</label>
                        <input
                          type="text"
                          required
                          value={tempCrmName}
                          onChange={e => setTempCrmName(e.target.value)}
                          placeholder="e.g. Secure Leads CRM"
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Corporate Platform Slogan *</label>
                        <input
                          type="text"
                          required
                          value={tempCrmSlogan}
                          onChange={e => setTempCrmSlogan(e.target.value)}
                          placeholder="e.g. Enterprise CRM Core"
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                        />
                      </div>
                    </div>

                    {/* Logo Customization Toggle */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/50 space-y-4">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">🖼️ Corporate Branding Logo Configuration</h4>
                        <p className="text-[10px] text-slate-500 mb-2">Toggle between built-in clean vector icon, upload a base64 logo file, or specify image web URL</p>
                        
                        <div className="flex bg-white p-1 rounded-lg border border-slate-200 max-w-xs mt-2">
                          <button
                            type="button"
                            onClick={() => setTempLogoType('icon')}
                            className={`flex-1 py-1 text-[10px] font-bold rounded-md ${
                              tempLogoType === 'icon' ? 'bg-indigo-600 text-white border-none' : 'text-slate-600 hover:text-slate-900 border-none bg-transparent'
                            }`}
                          >
                            Built-in Vector Icon
                          </button>
                          <button
                            type="button"
                            onClick={() => setTempLogoType('image')}
                            className={`flex-1 py-1 text-[10px] font-bold rounded-md ${
                              tempLogoType === 'image' ? 'bg-indigo-600 text-white border-none' : 'text-slate-600 hover:text-slate-900 border-none bg-transparent'
                            }`}
                          >
                            Custom Image File
                          </button>
                        </div>
                      </div>

                      {tempLogoType === 'icon' ? (
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-700 mb-1">Select Corporate Identity Icon</label>
                          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                            {['Database', 'Shield', 'Sparkles', 'Globe', 'Activity', 'Award', 'Briefcase', 'TrendingUp'].map((iconName: any) => {
                              const IconComponent = iconName === 'Database' ? Database :
                                                    iconName === 'Shield' ? Shield :
                                                    iconName === 'Sparkles' ? Sparkles :
                                                    iconName === 'Globe' ? Globe :
                                                    iconName === 'Activity' ? Activity :
                                                    iconName === 'Award' ? Award :
                                                    iconName === 'Briefcase' ? Briefcase : TrendingUp;
                              return (
                                <button
                                  key={iconName}
                                  type="button"
                                  onClick={() => setTempLogoIcon(iconName)}
                                  className={`p-3 flex flex-col items-center justify-center gap-2 rounded-lg border transition-all cursor-pointer ${
                                    tempLogoIcon === iconName
                                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                  }`}
                                >
                                  <IconComponent size={20} />
                                  <span className="text-[9px] font-bold tracking-tight">{iconName}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">Option A: Upload Corporate Logo File</label>
                            <div className="flex items-center gap-4">
                              <label className="flex items-center justify-center gap-2 px-4 py-2 border border-dashed border-indigo-300 rounded-xl bg-indigo-50/50 text-indigo-700 hover:bg-indigo-50 transition-all cursor-pointer text-xs font-bold shadow-sm">
                                <span>📁 Upload Image File (PNG/JPG/SVG)</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleLogoUpload}
                                  className="hidden"
                                />
                              </label>
                              {tempLogoUrl.startsWith('data:image/') && (
                                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                                  ✓ Base64 Image Loaded
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="border-t border-slate-200/60 pt-3">
                            <label className="block text-xs font-bold text-slate-700 mb-1">Option B: Logo Image Web URL</label>
                            <input
                              type="url"
                              value={tempLogoUrl.startsWith('data:image/') ? '' : tempLogoUrl}
                              onChange={e => setTempLogoUrl(e.target.value)}
                              placeholder="https://example.com/logo.png"
                              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white font-mono"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Favicon customization */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/50 space-y-4">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">🌐 Tab Favicon Customization</h4>
                        <p className="text-[10px] text-slate-500 mb-2">Configure custom icon to display in the web browser's tab for full white-label experience</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Upload Favicon File</label>
                          <div className="flex items-center gap-4">
                            <label className="flex items-center justify-center gap-2 px-4 py-2 border border-dashed border-indigo-300 rounded-xl bg-indigo-50/50 text-indigo-700 hover:bg-indigo-50 transition-all cursor-pointer text-xs font-bold shadow-sm">
                              <span>🌐 Upload Tab Icon (PNG/ICO/SVG)</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleFaviconUpload}
                                className="hidden"
                              />
                            </label>
                            {tempFaviconUrl.startsWith('data:image/') && (
                              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                                ✓ Tab Icon Loaded
                              </span>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Favicon Web URL</label>
                          <input
                            type="url"
                            value={tempFaviconUrl.startsWith('data:image/') ? '' : tempFaviconUrl}
                            onChange={e => setTempFaviconUrl(e.target.value)}
                            placeholder="https://example.com/favicon.png"
                            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 pt-2 border-t border-slate-100">
                      <div className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                        <span>Preview Logo:</span>
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center p-1.5 overflow-hidden">
                          {tempLogoType === 'image' && tempLogoUrl.trim() ? (
                            <img src={tempLogoUrl.trim()} alt="Preview" className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
                          ) : (
                            (() => {
                              const IconComp = tempLogoIcon === 'Database' ? Database :
                                               tempLogoIcon === 'Shield' ? Shield :
                                               tempLogoIcon === 'Sparkles' ? Sparkles :
                                               tempLogoIcon === 'Globe' ? Globe :
                                               tempLogoIcon === 'Activity' ? Activity :
                                               tempLogoIcon === 'Award' ? Award :
                                               tempLogoIcon === 'Briefcase' ? Briefcase : TrendingUp;
                              return <IconComp size={16} />;
                            })()
                          )}
                        </div>
                        <span className="font-bold text-slate-700">{tempCrmName}</span>
                      </div>

                      <button
                        type="submit"
                        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-md transition-all active:scale-95 cursor-pointer border-none"
                      >
                        Save branding & logo settings
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* TAB: MY PROFILE INFO */}
            {adminTab === 'profile' && (
              <div className="space-y-6 animate-fade-in" id="admin_tab_profile">
                <div className="flex flex-col lg:flex-row items-start gap-6">
                  {/* Left Form Column */}
                  <div className="w-full lg:w-2/3 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
                    <div className="border-b border-slate-100 pb-4">
                      <h3 className="text-base font-bold text-slate-800">My Profile</h3>
                      <p className="text-xs text-slate-500">View and update your administrator credentials and platform identity</p>
                    </div>

                    <form onSubmit={handleSaveProfile} className="space-y-5" id="profile_update_form">
                      {/* Update Account Details Section */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">Update Account Details</h4>
                        
                        {/* Name Input */}
                        <div>
                          <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                              <User size={14} />
                            </span>
                            <input
                              type="text"
                              required
                              value={profileName}
                              onChange={e => setProfileName(e.target.value)}
                              placeholder="e.g. Master Admin"
                              className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white text-slate-800 font-medium"
                            />
                          </div>
                        </div>

                        {/* Email Input */}
                        <div>
                          <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                              <Mail size={14} />
                            </span>
                            <input
                              type="email"
                              required
                              value={profileEmail}
                              onChange={e => setProfileEmail(e.target.value)}
                              placeholder="e.g. admin@admin.com"
                              className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white text-slate-800 font-medium"
                            />
                          </div>
                        </div>

                        {/* Password Input */}
                        <div>
                          <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">New Password</label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                              <Lock size={14} />
                            </span>
                            <input
                              type="password"
                              value={profilePassword}
                              onChange={e => setProfilePassword(e.target.value)}
                              placeholder="•••••••••"
                              className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white text-slate-800 font-medium font-mono"
                            />
                          </div>
                          <span className="text-[10px] text-slate-400 mt-1 block">Leave blank to keep your current password.</span>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-slate-100 my-4"></div>

                      {/* Upload Logo section */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                          <span>🖼️ Upload Logo</span>
                        </h4>
                        
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-3">
                          <div className="flex bg-white p-1 rounded-lg border border-slate-200 max-w-xs">
                            <button
                              type="button"
                              onClick={() => setProfileLogoType('icon')}
                              className={`flex-1 py-1 text-[9px] font-bold rounded-md ${
                                profileLogoType === 'icon' ? 'bg-indigo-600 text-white border-none' : 'text-slate-600 hover:text-slate-900 border-none bg-transparent'
                              }`}
                            >
                              Built-in Vector Icon
                            </button>
                            <button
                              type="button"
                              onClick={() => setProfileLogoType('image')}
                              className={`flex-1 py-1 text-[9px] font-bold rounded-md ${
                                profileLogoType === 'image' ? 'bg-indigo-600 text-white border-none' : 'text-slate-600 hover:text-slate-900 border-none bg-transparent'
                              }`}
                            >
                              Custom Image File
                            </button>
                          </div>

                          {profileLogoType === 'icon' ? (
                            <div className="space-y-1.5">
                              <span className="text-[10px] font-bold text-slate-500 uppercase">Select Built-in Icon</span>
                              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                                {['Database', 'Shield', 'Sparkles', 'Globe', 'Activity', 'Award', 'Briefcase', 'TrendingUp'].map((iconName: any) => {
                                  const IconComponent = iconName === 'Database' ? Database :
                                                        iconName === 'Shield' ? Shield :
                                                        iconName === 'Sparkles' ? Sparkles :
                                                        iconName === 'Globe' ? Globe :
                                                        iconName === 'Activity' ? Activity :
                                                        iconName === 'Award' ? Award :
                                                        iconName === 'Briefcase' ? Briefcase : TrendingUp;
                                  return (
                                    <button
                                      key={iconName}
                                      type="button"
                                      onClick={() => setProfileLogoIcon(iconName)}
                                      className={`p-2 flex flex-col items-center justify-center gap-1 rounded-lg border transition-all cursor-pointer ${
                                        profileLogoIcon === iconName
                                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                      }`}
                                    >
                                      <IconComponent size={14} />
                                      <span className="text-[8px] font-bold tracking-tight">{iconName}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div>
                                <span className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Option A: Upload Corporate Logo File</span>
                                <div className="flex items-center gap-3">
                                  <label className="flex items-center justify-center gap-2 px-3 py-1.5 border border-dashed border-indigo-300 rounded-xl bg-indigo-50/50 text-indigo-700 hover:bg-indigo-50 transition-all cursor-pointer text-[11px] font-bold shadow-xs">
                                    <span>📁 Upload Image File (PNG/JPG/SVG)</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={handleProfileLogoUpload}
                                      className="hidden"
                                    />
                                  </label>
                                  {profileLogoUrl.startsWith('data:image/') && (
                                    <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                      ✓ Image Loaded
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="border-t border-slate-200/60 pt-2">
                                <span className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Option B: Logo Image Web URL</span>
                                <input
                                  type="url"
                                  value={profileLogoUrl.startsWith('data:image/') ? '' : profileLogoUrl}
                                  onChange={e => setProfileLogoUrl(e.target.value)}
                                  placeholder="https://example.com/logo.png"
                                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white font-mono text-slate-700"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Upload Favicon section */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                          <span>🌐 Upload Favicon</span>
                        </h4>

                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <span className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Option A: Upload Favicon File</span>
                              <div className="flex items-center gap-3">
                                <label className="flex items-center justify-center gap-2 px-3 py-1.5 border border-dashed border-indigo-300 rounded-xl bg-indigo-50/50 text-indigo-700 hover:bg-indigo-50 transition-all cursor-pointer text-[11px] font-bold shadow-xs">
                                  <span>📁 Upload Tab Icon (PNG/ICO/SVG)</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleProfileFaviconUpload}
                                    className="hidden"
                                  />
                                </label>
                                {profileFaviconUrl.startsWith('data:image/') && (
                                  <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                    ✓ Loaded
                                  </span>
                                )}
                              </div>
                            </div>

                            <div>
                              <span className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Option B: Favicon Web URL</span>
                              <input
                                type="url"
                                value={profileFaviconUrl.startsWith('data:image/') ? '' : profileFaviconUrl}
                                onChange={e => setProfileFaviconUrl(e.target.value)}
                                placeholder="https://example.com/favicon.png"
                                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white font-mono text-slate-700"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Form Actions / Save changes button */}
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                        <button
                          type="submit"
                          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer border-none"
                        >
                          <Save size={14} />
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Right Sidebar Column with Security Tip & Status Profile Info */}
                  <div className="w-full lg:w-1/3 space-y-6">
                    {/* Security Tip Card */}
                    <div className="bg-blue-600 text-white p-5 rounded-2xl border border-blue-500/30 shadow-md space-y-3 relative overflow-hidden">
                      {/* Decorative Background Pattern */}
                      <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-4 translate-x-4">
                        <Shield size={160} />
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-white/10 rounded-xl shrink-0 mt-0.5">
                          <Shield size={18} className="text-white" />
                        </div>
                        <div className="space-y-1.5 z-10">
                          <h4 className="text-sm font-black tracking-tight flex items-center gap-1.5">
                            Security Tip
                          </h4>
                          <p className="text-xs text-white/90 leading-relaxed font-medium">
                            Keep your profile information up to date to ensure you receive system notifications and can recover your account if needed. If you change your password, make sure it is at least 8 characters long.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Root Privileges Card */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                      <div className="text-center pb-4 border-b border-slate-100">
                        <div className="w-16 h-16 bg-indigo-600 text-white font-black text-xl rounded-full flex items-center justify-center mx-auto border border-indigo-500 shadow-md">
                          {profileName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'SA'}
                        </div>
                        <h3 className="text-sm font-black text-slate-800 mt-3">{profileName || 'Super Admin'}</h3>
                        <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mt-0.5">Super Administrative Supervisor</p>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mt-2">
                          👑 Root Privileges Active
                        </span>
                      </div>

                      <div className="space-y-2 text-[11px] font-semibold text-slate-600">
                        <div className="flex justify-between py-1 border-b border-slate-50">
                          <span className="text-slate-400">Username</span>
                          <span className="text-slate-800 font-bold font-mono">admin</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-50">
                          <span className="text-slate-400">Email Contact</span>
                          <span className="text-slate-800 font-bold">{profileEmail || 'admin@admin.com'}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-slate-400">DB Status</span>
                          <span className="text-emerald-600 font-black">Connected</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>

        {/* MODAL OVERLAY: ADD NEW LEAD DIRECTLY FROM SIDEBAR */}
        {adminAddLeadOpen && (
          <div 
            id="modal_admin_add_lead"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
          >
            <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200/80 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="bg-[#2b3541] text-white p-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Plus className="text-emerald-400" size={18} />
                  <div>
                    <h3 className="text-base font-black tracking-tight">Add New Customer Entry</h3>
                    <p className="text-[11px] text-slate-400">Insert new prospect details directly to master ledger</p>
                  </div>
                </div>
                <button 
                  onClick={() => setAdminAddLeadOpen(false)} 
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer bg-transparent border-none"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form Content */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const target = e.target as any;
                  const nameVal = target.lead_name.value.trim();
                  const phoneVal = target.lead_phone.value.trim();
                  const emailVal = target.lead_email.value.trim();
                  const sourceVal = target.lead_source.value;
                  const statusVal = target.lead_status.value;
                  const notesVal = target.lead_notes.value.trim();
                  const followVal = target.lead_followup.value || undefined;

                  if (!nameVal) return;

                  const newLead: Lead = {
                    id: `lead-${Date.now()}`,
                    name: nameVal,
                    phone: phoneVal || '--',
                    email: emailVal || '--',
                    source: sourceVal,
                    status: statusVal,
                    followUpDate: followVal,
                    notes: notesVal || 'Prospect entry created via supervisor desk.',
                    createdBy: currentUser?.name || 'Admin',
                    createdAt: new Date().toISOString(),
                    updatedBy: currentUser?.name || 'Admin',
                    updatedAt: new Date().toISOString()
                  };

                  const updatedLeads = [newLead, ...leads];
                  const newActivity: Activity = {
                    id: `act-${Date.now()}`,
                    leadId: newLead.id,
                    leadName: newLead.name,
                    staffName: currentUser?.name || 'Admin',
                    action: 'create',
                    details: `Created new lead via supervisor command desk (${newLead.source}).`,
                    date: TODAY_DATE,
                    timestamp: new Date().toISOString()
                  };
                  const updatedActs = [newActivity, ...activities];

                  updateData(updatedLeads, updatedActs);
                  setAdminAddLeadOpen(false);
                  showBanner(`Successfully registered prospect "${newLead.name}"`);
                }} 
                className="p-6 space-y-4 flex-1 overflow-y-auto"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Customer Full Name *</label>
                    <input
                      name="lead_name"
                      type="text"
                      required
                      placeholder="e.g. Tony Stark"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Acquisition Channel *</label>
                    <select
                      name="lead_source"
                      required
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                    >
                      <option value="Google Ads">Google Ads</option>
                      <option value="Facebook Ads">Facebook Ads</option>
                      <option value="Organic Search">Organic Search</option>
                      <option value="Referral">Referral</option>
                      <option value="Website Contact">Website Contact</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Phone Number</label>
                    <input
                      name="lead_phone"
                      type="tel"
                      placeholder="e.g. +1 555-1234"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Email Address</label>
                    <input
                      name="lead_email"
                      type="email"
                      placeholder="e.g. tony@stark.com"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Initial Lead Stage *</label>
                    <select
                      name="lead_status"
                      required
                      defaultValue="new"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                    >
                      <option value="new">New Prospect</option>
                      <option value="hot">Hot 🔥</option>
                      <option value="cold">Cold ❄️</option>
                      <option value="converted">Converted ✅</option>
                      <option value="dead">Dead 💀</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Callback Follow-Up Date</label>
                    <input
                      name="lead_followup"
                      type="date"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Interaction Notes & Logs</label>
                  <textarea
                    name="lead_notes"
                    rows={3}
                    placeholder="Provide description or first contact callback instructions..."
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white resize-none"
                  ></textarea>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setAdminAddLeadOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer bg-transparent border-none"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#2b3541] hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer border-none"
                  >
                    Add Prospect
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    );
  };

  if (activePortal === 'admin') {
    return (
      <>
        {renderAdminPortalWithSidebar()}
        {/* Render edit lead modal globally so that edits from dashboard/ledger both open it */}
        {editingLead && (
          <div 
            id="modal_edit_lead"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
          >
            <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200/80 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              
              {/* Header */}
              <div className="bg-slate-950 text-white p-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Pencil className="text-indigo-400" size={18} />
                  <div>
                    <h3 className="text-base font-black tracking-tight">Edit Lead Info & Call Log</h3>
                    <p className="text-[11px] text-slate-400">Sales Agent Lead Modification Desk</p>
                  </div>
                </div>
                <button 
                  id="close_edit_modal_btn"
                  onClick={() => setEditingLead(null)} 
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer bg-transparent border-none"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSaveEditLead} className="p-6 space-y-4 flex-1 overflow-y-auto" id="edit_lead_form">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Lead Full Name *</label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={e => setEditPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={editEmail}
                      onChange={e => setEditEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                    />
                  </div>

                  {/* Source */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Lead Source</label>
                    <select
                      value={editSource}
                      onChange={e => setEditSource(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                    >
                      {SOURCES.map(src => (
                        <option key={src} value={src}>{src}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Status and Follow-up */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Lead Status</label>
                    <select
                      value={editStatus}
                      onChange={e => setEditStatus(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                    >
                      <option value="new">New Lead</option>
                      <option value="hot">🔥 Hot Lead</option>
                      <option value="cold">❄️ Cold Lead</option>
                      <option value="converted">Converted Lead ✅</option>
                      <option value="dead">💀 Dead Lead</option>
                    </select>
                  </div>

                  <div className="animate-fade-in">
                    <label className="block text-xs font-bold text-slate-600 mb-1">📅 Set Callback Follow-up Date</label>
                    <input
                      type="date"
                      min={TODAY_DATE}
                      value={editFollowUpDate}
                      onChange={e => setEditFollowUpDate(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white font-semibold"
                    />
                  </div>
                </div>

                {/* Append Phone Call interaction notes */}
                <div className="pt-2 border-t border-slate-100">
                  <label className="block text-xs font-extrabold text-indigo-900 mb-1">📞 Log New Phone Call Interaction</label>
                  <textarea
                    rows={3}
                    value={editAppendJournal}
                    onChange={e => setEditAppendJournal(e.target.value)}
                    placeholder="e.g. Called client from phone. Interested in scaling solutions. Wants callback next week."
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white resize-none"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Any details written here will be automatically formatted and appended to the lead's history journal.
                  </p>
                </div>

                {/* Existing History Notes Read-only for Reference */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 max-h-32 overflow-y-auto">
                  <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Existing Interaction History</p>
                  <p className="text-xs text-slate-600 whitespace-pre-wrap leading-relaxed">{editingLead.notes}</p>
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingLead(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-black rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-md hover:-translate-y-0.5 transition-all cursor-pointer border-none"
                  >
                    Save Lead & Log Activity
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased" id="app_root">
      {/* Dynamic Alert Banner */}
      {bannerMsg && (
        <div 
          id="system_notification_banner"
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border animate-bounce ${
            bannerMsg.type === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : 'bg-indigo-50 border-indigo-200 text-indigo-800'
          }`}
        >
          {bannerMsg.type === 'success' ? (
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          ) : (
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
          )}
          <span className="font-medium text-sm">{bannerMsg.text}</span>
          <button onClick={() => setBannerMsg(null)} className="text-slate-400 hover:text-slate-600">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Top Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm" id="app_header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand/Title */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-100 flex items-center justify-center">
              {renderLogo(22)}
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">{settings.crmName}</h1>
              <p className="text-xs text-slate-500 font-medium">{settings.crmSlogan} • Active Portal</p>
            </div>
          </div>

          {/* Core Feature: Single Page Toggle Switch (No Page Refresh) */}
          {currentUser.role === 'admin' ? (
            <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200/60" id="portal_view_selector">
              <button
                id="btn_view_staff_portal"
                onClick={() => setActivePortal('staff')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
                  activePortal === 'staff'
                    ? 'bg-white text-indigo-700 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900 font-semibold'
                }`}
              >
                <Briefcase size={14} />
                Staff Dashboard
              </button>
              <button
                id="btn_view_admin_portal"
                onClick={() => setActivePortal('admin')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
                  activePortal === 'admin'
                    ? 'bg-white text-indigo-700 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900 font-semibold'
                }`}
              >
                <Users size={14} />
                Admin Command
              </button>
            </div>
          ) : (
            <div className="hidden md:block text-xs font-medium text-slate-500">
              Sales Staff CRM Workspace
            </div>
          )}

          {/* Simulation Helper Actions & User Status */}
          <div className="flex items-center gap-4" id="header_right_controls">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
              <Calendar size={12} />
              Today: {TODAY_DATE}
            </span>
            
            <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${currentUser.color || 'bg-indigo-100 text-indigo-700'}`}>
                {currentUser.avatar}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-black text-slate-800 leading-none">{currentUser.name}</p>
                <p className="text-[10px] text-slate-400 capitalize font-semibold leading-none mt-1">
                  {currentUser.role === 'admin' ? 'Super Admin' : 'Sales Agent'}
                </p>
              </div>
              <button
                id="btn_logout"
                onClick={handleLogout}
                className="ml-2 px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 hover:border-rose-200 transition-colors flex items-center gap-1 cursor-pointer"
                title="Log Out"
              >
                <X size={12} />
                Log Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6" id="main_content_area">
        
        {/* ========================================================== */}
        {/*                    STAFF DASHBOARD PORTAL                  */}
        {/* ========================================================== */}
        {/* ========================================================== */}
        {/*                    STAFF DASHBOARD PORTAL                  */}
        {/* ========================================================== */}
        {activePortal === 'staff' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" id="staff_portal_layout">
            
            {/* STAFF PORTAL LEFT SIDEBAR */}
            <div className="lg:col-span-3 space-y-4 lg:sticky lg:top-24 h-fit" id="staff_portal_sidebar">
              
              {/* Sidebar card container */}
              <div className="bg-[#1e293b] text-slate-100 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-5">
                
                {/* Brand Header */}
                <div className="flex items-center gap-2.5 border-b border-slate-700/50 pb-4">
                  <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-md flex items-center justify-center shrink-0">
                    {renderLogo(18)}
                  </div>
                  <div>
                    <h2 className="text-xs font-black text-white tracking-wider uppercase leading-tight">
                      {settings.crmName}
                    </h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                      Staff Workspace
                    </p>
                  </div>
                </div>

                {/* Staff Info (matching the user's reference image!) */}
                <div className="flex items-center gap-3 bg-slate-800/60 p-3 rounded-xl border border-slate-700/30" id="staff_identity_badge">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${currentStaff.color || 'bg-indigo-600 text-white'}`}>
                    {currentStaff.avatar || 'S'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-100 truncate">{currentStaff.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                      <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest">Online</span>
                    </div>
                  </div>
                </div>

                {/* Navigation Group items */}
                <div className="space-y-4 pt-1">
                  
                  {/* CRM & LEADS SECTOR */}
                  <div className="space-y-1.5">
                    <p className="text-[9px] uppercase font-black text-slate-500 tracking-widest">CRM & Leads</p>
                    <div className="space-y-1">
                      
                      {/* Dashboard Tab button */}
                      <button
                        type="button"
                        id="staff_btn_tab_dashboard"
                        onClick={() => setStaffTab('dashboard')}
                        className={`flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl transition-all duration-200 shrink-0 cursor-pointer w-full text-left border-none ${
                          staffTab === 'dashboard'
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/50'
                            : 'bg-transparent text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <SlidersHorizontal size={14} />
                        <span>Dashboard</span>
                      </button>

                      {/* Leads Registry Tab button */}
                      <button
                        type="button"
                        id="staff_btn_tab_leads"
                        onClick={() => setStaffTab('leads')}
                        className={`flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl transition-all duration-200 shrink-0 cursor-pointer w-full text-left border-none ${
                          staffTab === 'leads'
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/50'
                            : 'bg-transparent text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <Layers size={14} />
                        <span>All Leads Overview</span>
                      </button>

                      {/* Add Prospect Tab button */}
                      <button
                        type="button"
                        id="staff_btn_tab_add"
                        onClick={() => setStaffTab('add')}
                        className={`flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl transition-all duration-200 shrink-0 cursor-pointer w-full text-left border-none ${
                          staffTab === 'add'
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/50'
                            : 'bg-transparent text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <Plus size={14} />
                        <span>Add New Lead</span>
                      </button>

                    </div>
                  </div>

                  {/* ACCOUNT GROUP */}
                  <div className="space-y-1.5">
                    <p className="text-[9px] uppercase font-black text-slate-500 tracking-widest">My Account</p>
                    <div className="space-y-1">
                      
                      {/* My Profile Tab button */}
                      <button
                        type="button"
                        id="staff_btn_tab_profile"
                        onClick={() => setStaffTab('profile')}
                        className={`flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl transition-all duration-200 shrink-0 cursor-pointer w-full text-left border-none ${
                          staffTab === 'profile'
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/50'
                            : 'bg-transparent text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <User size={14} />
                        <span>My Profile</span>
                      </button>

                    </div>
                  </div>

                  {/* BOTTOM LOGOUT EXCLUSION */}
                  <div className="border-t border-slate-800 pt-3.5">
                    <button
                      type="button"
                      id="staff_btn_logout_action"
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-black rounded-xl text-white bg-rose-600 hover:bg-rose-700 transition-all duration-200 w-full text-center cursor-pointer shadow-md shadow-rose-950/30 border-none"
                    >
                      <LogOut size={13} />
                      <span>Logout</span>
                    </button>
                  </div>

                </div>

              </div>

              {/* Admin simulated helper switcher */}
              {currentUser.role === 'admin' && (
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <span className="text-[9px] uppercase font-black text-indigo-600 tracking-widest">Admin Supervisor</span>
                  <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                    Change simulated sales agent viewpoint instantly below:
                  </p>
                  <select
                    id="sim_staff_selector"
                    value={currentStaff.id}
                    onChange={(e) => {
                      const selected = staffList.find(s => s.id === e.target.value);
                      if (selected) {
                        setCurrentStaff(selected);
                        showBanner(`Perspective switched to ${selected.name}`, 'info');
                      }
                    }}
                    className="w-full p-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
                  >
                    {staffList.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              )}

            </div>

            {/* STAFF PORTAL RIGHT MAIN CONTENT AREA */}
            <div className="lg:col-span-9 space-y-6" id="staff_portal_main_workspace">
              
              {/* ==================== TAB 1: DASHBOARD ==================== */}
              {staffTab === 'dashboard' && (
                <div className="space-y-6 animate-fade-in" id="staff_dashboard_pane">
                  
                  {/* Welcomer banner block */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <h2 className="text-xl font-black text-slate-900 tracking-tight" id="staff_portal_heading">
                        {settings.crmName} Dashboard
                      </h2>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">
                        Real-time sales customer acquisition & outreach ledger
                      </p>
                    </div>
                    <div className="text-xs font-semibold text-slate-600">
                      Welcome back, <span className="font-extrabold text-slate-900 bg-slate-100 px-2 py-1 rounded-md">{currentStaff.name}</span>
                    </div>
                  </div>

                  {/* 5 KPI widgets grid (matches the user's screenshot style exactly) */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4" id="staff_kpi_cards_grid">
                    
                    {/* Card 1: Total Active (Blue) */}
                    <div className="bg-[#007bff] hover:bg-blue-700 text-white rounded-2xl shadow-sm border-none overflow-hidden transition-all duration-200 flex flex-col justify-between h-36">
                      <div className="p-4">
                        <p className="text-4xl font-extrabold tracking-tight">{leads.filter(l => l.status !== 'dead').length}</p>
                        <p className="text-xs font-black tracking-wider uppercase opacity-90 mt-1">Total Active</p>
                      </div>
                      <button
                        onClick={() => { setStaffTab('leads'); setStatusFilter('all'); }}
                        className="w-full text-center bg-black/15 hover:bg-black/25 py-2 text-[11px] font-bold text-white transition-all border-none cursor-pointer flex items-center justify-center gap-1"
                      >
                        <span>View All</span>
                        <ChevronRight size={12} />
                      </button>
                    </div>

                    {/* Card 2: New Leads (Teal) */}
                    <div className="bg-[#17a2b8] hover:bg-cyan-700 text-white rounded-2xl shadow-sm border-none overflow-hidden transition-all duration-200 flex flex-col justify-between h-36">
                      <div className="p-4">
                        <p className="text-4xl font-extrabold tracking-tight">{leads.filter(l => l.status === 'new').length}</p>
                        <p className="text-xs font-black tracking-wider uppercase opacity-90 mt-1">New Leads</p>
                      </div>
                      <button
                        onClick={() => { setStaffTab('leads'); setStatusFilter('new'); }}
                        className="w-full text-center bg-black/15 hover:bg-black/25 py-2 text-[11px] font-bold text-white transition-all border-none cursor-pointer flex items-center justify-center gap-1"
                      >
                        <span>View New</span>
                        <ChevronRight size={12} />
                      </button>
                    </div>

                    {/* Card 3: Hot Leads (Red) */}
                    <div className="bg-[#dc3545] hover:bg-red-700 text-white rounded-2xl shadow-sm border-none overflow-hidden transition-all duration-200 flex flex-col justify-between h-36">
                      <div className="p-4">
                        <p className="text-4xl font-extrabold tracking-tight">{leads.filter(l => l.status === 'hot').length}</p>
                        <p className="text-xs font-black tracking-wider uppercase opacity-90 mt-1">Hot Leads</p>
                      </div>
                      <button
                        onClick={() => { setStaffTab('leads'); setStatusFilter('hot'); }}
                        className="w-full text-center bg-black/15 hover:bg-black/25 py-2 text-[11px] font-bold text-white transition-all border-none cursor-pointer flex items-center justify-center gap-1"
                      >
                        <span>View Hot</span>
                        <ChevronRight size={12} />
                      </button>
                    </div>

                    {/* Card 4: Cold Leads (Slate) */}
                    <div className="bg-[#6c757d] hover:bg-slate-700 text-white rounded-2xl shadow-sm border-none overflow-hidden transition-all duration-200 flex flex-col justify-between h-36">
                      <div className="p-4">
                        <p className="text-4xl font-extrabold tracking-tight">{leads.filter(l => l.status === 'cold').length}</p>
                        <p className="text-xs font-black tracking-wider uppercase opacity-90 mt-1">Cold Leads</p>
                      </div>
                      <button
                        onClick={() => { setStaffTab('leads'); setStatusFilter('cold'); }}
                        className="w-full text-center bg-black/15 hover:bg-black/25 py-2 text-[11px] font-bold text-white transition-all border-none cursor-pointer flex items-center justify-center gap-1"
                      >
                        <span>View Cold</span>
                        <ChevronRight size={12} />
                      </button>
                    </div>

                    {/* Card 5: Converted (Green) */}
                    <div className="bg-[#28a745] hover:bg-green-700 text-white rounded-2xl shadow-sm border-none overflow-hidden transition-all duration-200 flex flex-col justify-between h-36">
                      <div className="p-4">
                        <p className="text-4xl font-extrabold tracking-tight">{leads.filter(l => l.status === 'converted').length}</p>
                        <p className="text-xs font-black tracking-wider uppercase opacity-90 mt-1">Converted</p>
                      </div>
                      <button
                        onClick={() => { setStaffTab('leads'); setStatusFilter('converted'); }}
                        className="w-full text-center bg-black/15 hover:bg-black/25 py-2 text-[11px] font-bold text-white transition-all border-none cursor-pointer flex items-center justify-center gap-1"
                      >
                        <span>View Converted</span>
                        <ChevronRight size={12} />
                      </button>
                    </div>

                  </div>

                  {/* Action Items & Recent Leads table view */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden" id="staff_recent_leads_panel">
                    
                    {/* Panel Header */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <Calendar className="text-amber-500" size={16} />
                        <h3 className="text-sm font-black text-slate-800">Action Items & Recent Leads</h3>
                      </div>
                      <button
                        onClick={() => { setStaffTab('leads'); setStatusFilter('all'); }}
                        className="px-4 py-1.5 bg-[#007bff] hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-xs transition-colors duration-200 flex items-center gap-1 cursor-pointer border-none"
                      >
                        <span>View All</span>
                        <ChevronRight size={12} />
                      </button>
                    </div>

                    {/* Table Body */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse" id="staff_dashboard_table">
                        <thead>
                          <tr className="bg-slate-100 border-b border-slate-200 text-slate-500 text-[11px] font-black uppercase tracking-wider">
                            <th className="py-3 px-4">Customer Name</th>
                            <th className="py-3 px-4">Phone</th>
                            <th className="py-3 px-4">Stage</th>
                            <th className="py-3 px-4">Schedule / Status</th>
                            <th className="py-3 px-4 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                          {leads.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="py-8 text-center text-slate-400 font-medium">
                                No leads registered in the CRM database yet.
                              </td>
                            </tr>
                          ) : (
                            leads.slice(0, 8).map((lead) => {
                              // Dynamic Schedule Status text generator
                              let scheduleStatus = '';
                              let isOverdue = false;
                              let isCallbackToday = false;

                              if (lead.status === 'converted') {
                                scheduleStatus = '✅ Converted successfully';
                              } else if (lead.status === 'dead') {
                                scheduleStatus = '💀 Lead contact discontinued';
                              } else if (lead.status === 'hot' && lead.followUpDate) {
                                if (lead.followUpDate === TODAY_DATE) {
                                  scheduleStatus = '🔴 Due Call Today!';
                                  isCallbackToday = true;
                                } else if (lead.followUpDate < TODAY_DATE) {
                                  scheduleStatus = `⚠️ Overdue (${lead.followUpDate})`;
                                  isOverdue = true;
                                } else {
                                  scheduleStatus = `📅 Callback scheduled on ${lead.followUpDate}`;
                                }
                              } else {
                                // Format nice created date
                                const addDate = new Date(lead.createdAt).toLocaleDateString(undefined, {day: '2-digit', month: 'short'});
                                scheduleStatus = `⭐ New Lead (Added ${addDate})`;
                              }

                              return (
                                <tr key={lead.id} className="hover:bg-slate-50/55 transition-colors" id={`staff_row_${lead.id}`}>
                                  {/* Name */}
                                  <td className="py-3.5 px-4 font-extrabold text-slate-800">{lead.name}</td>
                                  
                                  {/* Phone */}
                                  <td className="py-3.5 px-4 text-slate-600 font-semibold font-mono">{lead.phone || '--'}</td>
                                  
                                  {/* Stage */}
                                  <td className="py-3.5 px-4">
                                    <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                                      lead.status === 'hot' 
                                        ? 'bg-rose-50 border border-rose-200 text-rose-800' 
                                        : lead.status === 'converted'
                                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                                        : lead.status === 'cold'
                                        ? 'bg-slate-100 border border-slate-200 text-slate-800'
                                        : lead.status === 'dead'
                                        ? 'bg-slate-200 border border-slate-300 text-slate-500'
                                        : 'bg-indigo-50 border border-indigo-200 text-indigo-800'
                                    }`}>
                                      {lead.status === 'new' ? 'New' : lead.status === 'hot' ? 'Hot' : lead.status === 'cold' ? 'Cold' : lead.status === 'converted' ? 'Converted' : 'Dead'}
                                    </span>
                                  </td>
                                  
                                  {/* Schedule Status */}
                                  <td className="py-3.5 px-4">
                                    <span className={`font-bold ${
                                      isCallbackToday 
                                        ? 'text-rose-600 animate-pulse' 
                                        : isOverdue 
                                        ? 'text-rose-500 font-extrabold' 
                                        : lead.status === 'converted' 
                                        ? 'text-emerald-700' 
                                        : 'text-slate-500 font-semibold'
                                    }`}>
                                      {scheduleStatus}
                                    </span>
                                  </td>

                                  {/* Action */}
                                  <td className="py-3.5 px-4 text-right">
                                    <button
                                      onClick={() => startEditLead(lead)}
                                      className="px-3.5 py-1.5 bg-[#007bff] hover:bg-blue-700 text-white font-extrabold text-xs rounded-lg shadow-xs transition-transform duration-100 active:scale-95 cursor-pointer border-none"
                                    >
                                      View
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>

                  </div>

                </div>
              )}

              {/* ==================== TAB 2: LEADS REGISTRY ==================== */}
              {staffTab === 'leads' && (
                <div className="space-y-6 animate-fade-in" id="staff_leads_registry_pane">
                  
                  {/* Lead Directory Banner */}
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Leads Master Registry</h2>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">Filter, query, search, and update customer interaction histories</p>
                  </div>

                  {/* Filter & Search Bar */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                    
                    {/* Row 1: Search and Source */}
                    <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
                        <input
                          id="leads_list_search"
                          type="text"
                          placeholder="Search leads by name, phone, email, notes..."
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                        />
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 font-bold flex items-center gap-1">
                          <Filter size={12} /> Channel Source:
                        </span>
                        <select
                          id="leads_list_source_filter"
                          value={sourceFilter}
                          onChange={e => setSourceFilter(e.target.value)}
                          className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none font-bold"
                        >
                          <option value="all">All Sources</option>
                          {SOURCES.map(src => (
                            <option key={src} value={src}>{src}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Row 2: Category Tabs & Callback Toggles */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                      
                      {/* Status category buttons */}
                      <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/40" id="leads_list_tabs">
                        <button
                          onClick={() => setStatusFilter('all')}
                          className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all border-none cursor-pointer ${
                            statusFilter === 'all'
                              ? 'bg-white text-slate-900 shadow-xs'
                              : 'bg-transparent text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          📁 All ({leads.length})
                        </button>
                        <button
                          onClick={() => setStatusFilter('new')}
                          className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all border-none cursor-pointer ${
                            statusFilter === 'new'
                              ? 'bg-white text-cyan-800 shadow-xs'
                              : 'bg-transparent text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          ⭐ New ({leads.filter(l => l.status === 'new').length})
                        </button>
                        <button
                          onClick={() => setStatusFilter('hot')}
                          className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all border-none cursor-pointer ${
                            statusFilter === 'hot'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'bg-transparent text-slate-500 hover:text-rose-600'
                          }`}
                        >
                          🔥 Hot ({leads.filter(l => l.status === 'hot').length})
                        </button>
                        <button
                          onClick={() => setStatusFilter('cold')}
                          className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all border-none cursor-pointer ${
                            statusFilter === 'cold'
                              ? 'bg-slate-700 text-white shadow-xs'
                              : 'bg-transparent text-slate-500 hover:text-slate-700'
                          }`}
                        >
                          ❄️ Cold ({leads.filter(l => l.status === 'cold').length})
                        </button>
                        <button
                          onClick={() => setStatusFilter('converted')}
                          className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all border-none cursor-pointer ${
                            statusFilter === 'converted'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-transparent text-slate-500 hover:text-emerald-600'
                          }`}
                        >
                          ✅ Converted ({leads.filter(l => l.status === 'converted').length})
                        </button>
                        <button
                          onClick={() => setStatusFilter('dead')}
                          className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all border-none cursor-pointer ${
                            statusFilter === 'dead'
                              ? 'bg-slate-800 text-white shadow-xs'
                              : 'bg-transparent text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          💀 Dead ({leads.filter(l => l.status === 'dead').length})
                        </button>
                      </div>

                      {/* Callback required today checkbox */}
                      <label 
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                          onlyTodayFollowUp 
                            ? 'bg-amber-50 border-amber-300 text-amber-800' 
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={onlyTodayFollowUp}
                          onChange={e => setOnlyTodayFollowUp(e.target.checked)}
                          className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                        />
                        <span>📅 Due Today ({leads.filter(l => l.status === 'hot' && l.followUpDate === TODAY_DATE).length})</span>
                      </label>

                    </div>

                  </div>

                  {/* Leads Queue Card List container */}
                  <div className="space-y-3.5" id="staff_leads_grid_directory">
                    {sortedLeads.length === 0 ? (
                      <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                        <AlertCircle className="mx-auto text-slate-400 mb-2" size={28} />
                        <h4 className="text-sm font-bold text-slate-700">No leads match search guidelines</h4>
                        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Try clearing search phrases or category filters to see more profiles.</p>
                      </div>
                    ) : (
                      sortedLeads.map((lead) => {
                        const isTodayFollowUp = lead.status === 'hot' && lead.followUpDate === TODAY_DATE;
                        
                        return (
                          <div
                            key={lead.id}
                            id={`leads_ledger_card_${lead.id}`}
                            className={`relative p-5 rounded-2xl border transition-all duration-200 shadow-xs hover:shadow-md ${
                              isTodayFollowUp
                                ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-300/30'
                                : 'bg-white border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            {/* Follow up badge at the top */}
                            {isTodayFollowUp && (
                              <span className="absolute -top-2.5 left-5 bg-amber-500 text-amber-950 text-[9px] font-black px-2.5 py-0.5 rounded-full border border-amber-400 uppercase tracking-widest flex items-center gap-1 shadow-sm">
                                <Clock size={10} /> Callback Required Today
                              </span>
                            )}

                            {/* Core profile row */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h4 className="text-sm font-extrabold text-slate-900">{lead.name}</h4>
                                  
                                  {/* Badge status */}
                                  <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider ${
                                    lead.status === 'hot' 
                                      ? 'bg-rose-50 border border-rose-200 text-rose-800' 
                                      : lead.status === 'converted'
                                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                                      : lead.status === 'cold'
                                      ? 'bg-slate-100 border border-slate-200 text-slate-800'
                                      : lead.status === 'dead'
                                      ? 'bg-slate-250 border border-slate-350 text-slate-500'
                                      : 'bg-cyan-50 border border-cyan-200 text-cyan-800'
                                  }`}>
                                    {lead.status === 'new' ? 'New' : lead.status === 'hot' ? '🔥 HOT' : lead.status === 'cold' ? '❄️ COLD' : lead.status === 'converted' ? '✅ CONVERTED' : '💀 DEAD'}
                                  </span>

                                  {/* Source Badge */}
                                  <span className="text-[9px] bg-slate-100 text-slate-600 font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider border border-slate-200/50">
                                    {lead.source}
                                  </span>
                                </div>

                                {/* Contact coordinates */}
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-semibold">
                                  <span className="flex items-center gap-1">
                                    <Phone size={12} className="text-slate-400" /> {lead.phone || 'N/A'}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Mail size={12} className="text-slate-400" /> {lead.email || 'N/A'}
                                  </span>
                                </div>
                              </div>

                              {/* Trigger Edit Button */}
                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  id={`btn_trigger_edit_${lead.id}`}
                                  onClick={() => startEditLead(lead)}
                                  className="flex items-center gap-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-transform duration-150 active:scale-95 cursor-pointer border-none"
                                >
                                  <Pencil size={11} />
                                  <span>Edit details & Logs</span>
                                </button>
                              </div>
                            </div>

                            {/* Journal Details snippet */}
                            <div className="mt-3.5 bg-slate-50 border border-slate-100 rounded-xl p-3">
                              <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block mb-1">Outreach History Logs</span>
                              <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                                {lead.notes}
                              </p>
                            </div>

                            {/* Extra Info footer metadata */}
                            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100/60 pt-3 text-[10px] text-slate-400 font-bold">
                              <div>
                                <span>Registered by: <span className="text-slate-600">{lead.createdBy}</span></span>
                                <span className="mx-2">•</span>
                                <span>{new Date(lead.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {lead.followUpDate && (
                                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-black uppercase tracking-wider ${
                                    lead.followUpDate === TODAY_DATE ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-600'
                                  }`}>
                                    <Calendar size={10} /> Callback: {lead.followUpDate}
                                  </span>
                                )}
                                <span>Last modified by: <span className="text-slate-600">{lead.updatedBy}</span></span>
                              </div>
                            </div>

                          </div>
                        );
                      })
                    )}
                  </div>

                </div>
              )}

              {/* ==================== TAB 3: ADD NEW LEAD ==================== */}
              {staffTab === 'add' && (
                <div className="space-y-6 animate-fade-in" id="staff_add_lead_pane">
                  
                  {/* Heading */}
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Add New Prospect Lead</h2>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">Register a new client record with initial status classes and notes</p>
                  </div>

                  {/* Add Lead Form Card */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm max-w-2xl" id="staff_add_lead_card">
                    <form onSubmit={(e) => {
                      handleAddLead(e);
                      setStaffTab('leads'); // Redirect to Leads ledger on success
                    }} className="space-y-4">
                      
                      {/* Name input */}
                      <div>
                        <label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-1.5">
                          Prospect Full Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-2.5 text-slate-400" size={14} />
                          <input
                            type="text"
                            required
                            placeholder="e.g. Jean-Luc Picard"
                            value={newLead.name}
                            onChange={e => setNewLead({ ...newLead, name: e.target.value })}
                            className="w-full pl-10 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                          />
                        </div>
                      </div>

                      {/* Contact row coordinates */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-1.5">Phone Number</label>
                          <div className="relative">
                            <Phone className="absolute left-3.5 top-2.5 text-slate-400" size={14} />
                            <input
                              type="tel"
                              placeholder="e.g. +1 555-0199"
                              value={newLead.phone}
                              onChange={e => setNewLead({ ...newLead, phone: e.target.value })}
                              className="w-full pl-10 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-1.5">Email Address</label>
                          <div className="relative">
                            <Mail className="absolute left-3.5 top-2.5 text-slate-400" size={14} />
                            <input
                              type="email"
                              placeholder="e.g. captain@enterprise.com"
                              value={newLead.email}
                              onChange={e => setNewLead({ ...newLead, email: e.target.value })}
                              className="w-full pl-10 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Source and Status selectors */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-1.5">Lead Acquisition Channel</label>
                          <select
                            value={newLead.source}
                            onChange={e => setNewLead({ ...newLead, source: e.target.value })}
                            className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white font-semibold"
                          >
                            {SOURCES.map(src => (
                              <option key={src} value={src}>{src}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-1.5">Initial Lead Classification</label>
                          <select
                            value={newLead.status}
                            onChange={e => setNewLead({ ...newLead, status: e.target.value as any })}
                            className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white font-semibold"
                          >
                            <option value="new">New Prospect</option>
                            <option value="hot">🔥 Hot Lead</option>
                            <option value="cold">❄️ Cold Lead</option>
                            <option value="converted">✅ Converted</option>
                            <option value="dead">💀 Dead Lead</option>
                          </select>
                        </div>
                      </div>

                      {/* Callback date picker (visible for hot leads only) */}
                      {(newLead.status === 'hot') && (
                        <div className="p-4 bg-indigo-50 border border-indigo-150 rounded-xl animate-fade-in space-y-1.5">
                          <label className="block text-xs font-black text-indigo-950 uppercase tracking-wider">
                            📅 Set Call-back Follow-up Date
                          </label>
                          <input
                            type="date"
                            min={TODAY_DATE}
                            value={newLead.followUpDate}
                            onChange={e => setNewLead({ ...newLead, followUpDate: e.target.value })}
                            className="w-full px-3 py-2 text-xs border border-indigo-200 rounded-xl bg-white text-indigo-950 font-extrabold focus:outline-none"
                            required
                          />
                          <p className="text-[10px] text-indigo-700 font-semibold leading-relaxed">
                            Setting this follow-up date puts this customer at the topmost queue for action on that designated date.
                          </p>
                        </div>
                      )}

                      {/* Consultation Notes */}
                      <div>
                        <label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-1.5">
                          Initial Consultation / Interaction Notes
                        </label>
                        <textarea
                          rows={4}
                          placeholder="Provide descriptive details of this prospect call or initial contact parameters..."
                          value={newLead.notes}
                          onChange={e => setNewLead({ ...newLead, notes: e.target.value })}
                          className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white resize-none"
                        />
                      </div>

                      {/* Buttons footer */}
                      <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setStaffTab('dashboard')}
                          className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 bg-transparent border-none cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer border-none"
                        >
                          Add Prospect Lead
                        </button>
                      </div>

                    </form>
                  </div>

                </div>
              )}

              {/* ==================== TAB 4: MY PROFILE ==================== */}
              {staffTab === 'profile' && (
                <div className="space-y-6 animate-fade-in" id="staff_profile_pane">
                  
                  {/* Header info */}
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Agent Profile Settings</h2>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">Manage your public agent details, passcode, and view personal metrics</p>
                  </div>

                  {/* Profile Overview Card */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center gap-6" id="staff_profile_hero">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center font-black text-3xl shadow-sm ${currentStaff.color || 'bg-indigo-600 text-white'}`}>
                      {currentStaff.avatar || 'S'}
                    </div>
                    <div className="text-center md:text-left space-y-1">
                      <div className="flex flex-col md:flex-row md:items-center gap-2">
                        <h3 className="text-lg font-black text-slate-900">{currentStaff.name}</h3>
                        <span className="inline-block px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full self-center">
                          Authorized Agent
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-semibold">Username Identifier: <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">@{currentStaff.username}</span></p>
                      <p className="text-[11px] text-emerald-600 font-bold flex items-center justify-center md:justify-start gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                        <span>Online Session Securely Established</span>
                      </p>
                    </div>
                  </div>

                  {/* Stats KPIs row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="staff_performance_kpis">
                    
                    {/* Leads Registered count */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Leads Assigned</p>
                        <p className="text-2xl font-black text-slate-900 mt-1">
                          {leads.filter(l => l.createdBy === currentStaff.name || l.updatedBy === currentStaff.name).length}
                        </p>
                      </div>
                      <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                        <Layers size={18} />
                      </div>
                    </div>

                    {/* Leads updated */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">My Logged Calls</p>
                        <p className="text-2xl font-black text-slate-900 mt-1">
                          {activities.filter(a => a.staffName === currentStaff.name).length}
                        </p>
                      </div>
                      <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                        <Activity size={18} />
                      </div>
                    </div>

                    {/* Conversion Rate */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">My Converted Leads</p>
                        <p className="text-2xl font-black text-slate-900 mt-1">
                          {leads.filter(l => l.status === 'converted' && (l.createdBy === currentStaff.name || l.updatedBy === currentStaff.name)).length}
                        </p>
                      </div>
                      <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                        <Award size={18} />
                      </div>
                    </div>

                  </div>

                  {/* Profile Edit details Form */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                    
                    <div>
                      <h3 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                        <User className="text-indigo-600" size={16} />
                        Update Personal Account Details
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">Modify your display name or secure account passcode details</p>
                    </div>

                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.currentTarget;
                      const targetName = (form.elements.namedItem('staff_name') as HTMLInputElement).value;
                      const targetPass = (form.elements.namedItem('staff_pass') as HTMLInputElement).value;
                      
                      if (!targetName.trim()) {
                        alert('Display name is required.');
                        return;
                      }

                      // Update current staff object
                      const updatedStaffObj = {
                        ...currentStaff,
                        name: targetName.trim(),
                        avatar: targetName.trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'SA',
                      };
                      if (targetPass.trim()) {
                        updatedStaffObj.password = targetPass.trim();
                      }

                      // Update staff list
                      const updatedStaffList = staffList.map(s => s.id === currentStaff.id ? { ...s, ...updatedStaffObj } : s);
                      
                      // Also update currentUser if simulated or logged in as staff
                      if (currentUser?.id === currentStaff.id) {
                        setCurrentUser(updatedStaffObj);
                      }
                      
                      setCurrentStaff(updatedStaffObj);
                      setStaffList(updatedStaffList);
                      
                      localStorage.setItem('crm_current_user', JSON.stringify(updatedStaffObj));
                      localStorage.setItem('crm_staff', JSON.stringify(updatedStaffList));

                      // Persist to backend database server
                      fetch('/api/leads-data', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ leads, activities, staff: updatedStaffList, settings })
                      }).then(() => {
                        showBanner('Your sales agent profile has been saved successfully!');
                        if (targetPass.trim()) {
                          (form.elements.namedItem('staff_pass') as HTMLInputElement).value = '';
                        }
                      }).catch(err => {
                        console.error('Failed to sync profile change:', err);
                        alert('Profile saved locally but failed to synchronize with cloud database.');
                      });
                    }} className="space-y-4">
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1">Display Public Name *</label>
                          <input
                            name="staff_name"
                            type="text"
                            defaultValue={currentStaff.name}
                            required
                            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1">Account Username Identifier (Read-Only)</label>
                          <input
                            type="text"
                            value={currentStaff.username}
                            disabled
                            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-100 text-slate-500 cursor-not-allowed font-semibold"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1">Set Secure Passcode</label>
                          <input
                            name="staff_pass"
                            type="password"
                            placeholder="•••••••••"
                            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white font-mono"
                          />
                          <span className="text-[10px] text-slate-400 mt-1 block">Leave blank to keep your current login password.</span>
                        </div>
                        <div className="flex items-end pb-1">
                          <button
                            type="submit"
                            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer border-none"
                          >
                            Save Agent Profile Settings
                          </button>
                        </div>
                      </div>

                    </form>
                  </div>

                </div>
              )}

            </div>

          </div>
        )}

        {/* ========================================================== */}
        {/*                    ADMIN COMMAND PORTAL                    */}
        {/* ========================================================== */}
        {activePortal === 'admin' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in" id="admin_portal_view">
            
            {/* ADMIN PORTAL LEFT SIDEBAR */}
            <div className="lg:col-span-3 space-y-3 lg:sticky lg:top-24 h-fit" id="admin_portal_sidebar">
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3 hidden lg:block">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Admin Navigation</h3>
                  <p className="text-[10px] text-slate-500 mt-1 font-semibold">Switch database & brand viewpoint</p>
                </div>
                
                <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-none" id="admin_nav_tabs">
                  <button
                    type="button"
                    onClick={() => setAdminTab('overview')}
                    className={`flex items-center gap-2 px-3 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 shrink-0 cursor-pointer w-full text-left ${
                      adminTab === 'overview'
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                        : 'bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <SlidersHorizontal size={14} />
                    <span>📊 Overview & Charts</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdminTab('leads')}
                    className={`flex items-center gap-2 px-3 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 shrink-0 cursor-pointer w-full text-left ${
                      adminTab === 'leads'
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                        : 'bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Layers size={14} />
                    <span>📋 Leads Registry</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdminTab('staff')}
                    className={`flex items-center gap-2 px-3 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 shrink-0 cursor-pointer w-full text-left ${
                      adminTab === 'staff'
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                        : 'bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Users size={14} />
                    <span>👥 Manage Staff</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdminTab('settings')}
                    className={`flex items-center gap-2 px-3 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 shrink-0 cursor-pointer w-full text-left ${
                      adminTab === 'settings'
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                        : 'bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Settings size={14} />
                    <span>⚙️ CRM Settings</span>
                  </button>
                </nav>
              </div>

              {/* Decorative mini status card in the sidebar for desktop */}
              <div className="bg-slate-950 text-white p-4 rounded-2xl hidden lg:block relative overflow-hidden" id="admin_sidebar_status">
                <div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4">
                  <Shield size={120} />
                </div>
                <div className="relative z-10 space-y-1">
                  <p className="text-[9px] uppercase tracking-widest font-black text-indigo-400">Security Active</p>
                  <h4 className="text-xs font-bold text-slate-100">Enterprise Supervisor Console</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed pt-1">
                    Logged in as super-administrator. System logs, employee credentials, and branding settings can be customized instantly.
                  </p>
                </div>
              </div>
            </div>

            {/* ADMIN PORTAL MAIN AREA */}
            <div className="lg:col-span-9 space-y-6" id="admin_portal_main_area">
              
              {/* Tab: Overview & Analytics */}
              {adminTab === 'overview' && (
                <div className="space-y-6 animate-fade-in" id="admin_view_overview">
                  
                  {/* Top-level Analytics cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="admin_stats_grid">
              
              {/* Total Leads */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Leads Stored</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">{totalLeadCount}</p>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold mt-1.5">
                    <TrendingUp size={12} />
                    <span>Real-time DB Active</span>
                  </div>
                </div>
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Database size={20} />
                </div>
              </div>

              {/* Hot Leads */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Active Hot Leads</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">{hotCount}</p>
                  <div className="flex items-center gap-1 text-[10px] text-amber-600 font-bold mt-1.5">
                    <Clock size={12} />
                    <span>Requires follow-up</span>
                  </div>
                </div>
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Layers size={20} />
                </div>
              </div>

              {/* Cold Leads */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Cold Leads</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">{coldCount}</p>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium mt-1.5">
                    <span>Nurturing candidates</span>
                  </div>
                </div>
                <div className="p-3 bg-slate-100 text-slate-600 rounded-xl">
                  <User size={20} />
                </div>
              </div>

              {/* Dead Leads */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Dead Leads</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">{deadCount}</p>
                  <div className="flex items-center gap-1 text-[10px] text-rose-500 font-medium mt-1.5 flex-row">
                    <TrendingDown size={12} />
                    <span>Contact discontinued</span>
                  </div>
                </div>
                <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
                  <X size={20} />
                </div>
              </div>

            </div>

            {/* Middle Grid: Staff Metrics & Lead Sources Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Staff Performance Dashboard List */}
              <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4" id="staff_performance_panel">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Award className="text-indigo-600" size={16} />
                    Staff Performance Metrics
                  </h3>
                  <p className="text-xs text-slate-500">Live summary of leads created and total operations performed by each agent</p>
                </div>

                <div className="divide-y divide-slate-100" id="staff_performance_list">
                  {staffPerformance.map(staff => (
                    <div key={staff.id} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-xs shrink-0 ${staff.color}`}>
                          {staff.avatar}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate">{staff.name}</p>
                          <p className="text-[10px] text-slate-400 font-semibold">Authorized Sales Agent</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 shrink-0 text-right">
                        <div>
                          <p className="text-xs font-black text-slate-800">{staff.leadsCreated}</p>
                          <p className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Leads Added</p>
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-800">{staff.totalUpdates}</p>
                          <p className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Total Logs</p>
                        </div>
                        <div className="w-16">
                          <p className="text-xs font-black text-indigo-700">{staff.conversionRate}%</p>
                          <p className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Hot Ratio</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lead Sources Distribution */}
              <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4" id="lead_sources_distribution_panel">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <SlidersHorizontal className="text-indigo-600" size={16} />
                    Lead Acquisition Channels
                  </h3>
                  <p className="text-xs text-slate-500">Breakdown of prospectus channels pulling leads into the database</p>
                </div>

                <div className="space-y-3 pt-1" id="sources_bars_list">
                  {sourceDistribution.map(item => (
                    <div key={item.source} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                        <span>{item.source}</span>
                        <span className="text-slate-500">{item.count} leads ({item.percent}%)</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                          style={{ width: `${item.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom Grid: Visual SVG Activity Graph & Date-Wise Log Ledger */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Custom SVG Column Activity Chart (Interactive Daily Update summary per Staff) */}
              <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4" id="visual_chart_panel">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">📊 Daily Lead Updates Trend</h3>
                  <p className="text-xs text-slate-500">Total activities completed per day (Visualized dynamically)</p>
                </div>

                {/* SVG Visual graph container */}
                <div className="relative pt-4 flex flex-col items-center" id="svg_chart_container">
                  <svg viewBox="0 0 400 200" className="w-full h-48 max-w-md">
                    {/* Grid lines */}
                    <line x1="40" y1="20" x2="380" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="40" y1="60" x2="380" y2="60" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="40" y1="100" x2="380" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="40" y1="140" x2="380" y2="140" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="40" y1="170" x2="380" y2="170" stroke="#e2e8f0" strokeWidth="1.5" />

                    {/* Y Axis labels */}
                    <text x="30" y="24" className="text-[9px] fill-slate-400 font-bold" textAnchor="end">4 Ops</text>
                    <text x="30" y="64" className="text-[9px] fill-slate-400 font-bold" textAnchor="end">3 Ops</text>
                    <text x="30" y="104" className="text-[9px] fill-slate-400 font-bold" textAnchor="end">2 Ops</text>
                    <text x="30" y="144" className="text-[9px] fill-slate-400 font-bold" textAnchor="end">1 Op</text>
                    <text x="30" y="174" className="text-[9px] fill-slate-400 font-bold" textAnchor="end">0</text>

                    {/* Bars data for last 4 days: July 12, 13, 14, 15 */}
                    {/* Y positions mapped: 170 base. 1 op = -30 height. */}
                    
                    {/* July 12: Emily=2 (height=60) */}
                    <g className="cursor-pointer group">
                      <rect x="75" y="110" width="16" height="60" rx="3" fill="#f43f5e" />
                      <text x="83" y="102" className="text-[9px] font-bold fill-rose-600 opacity-0 group-hover:opacity-100 transition-opacity" textAnchor="middle">2</text>
                    </g>

                    {/* July 13: Michael=1 (height=30) */}
                    <g className="cursor-pointer group">
                      <rect x="155" y="140" width="16" height="30" rx="3" fill="#d97706" />
                      <text x="163" y="132" className="text-[9px] font-bold fill-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" textAnchor="middle">1</text>
                    </g>

                    {/* July 14: Sarah=1 (height=30), John=1 (height=30) grouped */}
                    <g className="cursor-pointer group">
                      <rect x="225" y="140" width="12" height="30" rx="2.5" fill="#10b981" />
                      <rect x="239" y="140" width="12" height="30" rx="2.5" fill="#4f46e5" />
                      <text x="238" y="132" className="text-[9px] font-bold fill-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" textAnchor="middle">2</text>
                    </g>

                    {/* July 15 (Today): John=1 (height=30) plus any new added live activity */}
                    {/* Let's compute actual operations dynamically from current activity state for today */}
                    {(() => {
                      const todayCount = activities.filter(a => a.date === TODAY_DATE).length;
                      const mappedHeight = Math.min(todayCount * 30, 150);
                      const mappedY = 170 - mappedHeight;
                      return (
                        <g className="cursor-pointer group">
                          <rect x="315" y={mappedY} width="18" height={mappedHeight} rx="3" fill="#4f46e5" />
                          <text x="324" y={mappedY - 6} className="text-[9px] font-bold fill-indigo-700 opacity-100 transition-opacity" textAnchor="middle">
                            {todayCount}
                          </text>
                        </g>
                      );
                    })()}

                    {/* X Axis Date labels */}
                    <text x="83" y="185" className="text-[9px] fill-slate-500 font-bold" textAnchor="middle">July 12</text>
                    <text x="163" y="185" className="text-[9px] fill-slate-500 font-bold" textAnchor="middle">July 13</text>
                    <text x="238" y="185" className="text-[9px] fill-slate-500 font-bold" textAnchor="middle">July 14</text>
                    <text x="324" y="185" className="text-[9px] fill-indigo-600 font-extrabold" textAnchor="middle">July 15 (Today)</text>
                  </svg>

                  {/* Legend indicator */}
                  <div className="flex flex-wrap items-center justify-center gap-3 mt-1.5 text-[10px] font-bold text-slate-500">
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-indigo-600 inline-block"></span> John Doe</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block"></span> Sarah Smith</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block"></span> Michael Chen</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-rose-500 inline-block"></span> Emily Davis</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Date-wise staff activities log */}
              <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4" id="ledger_activities_panel">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <FileSpreadsheet className="text-indigo-600 animate-pulse" size={16} />
                    Date-wise Operations Ledger
                  </h3>
                  <p className="text-xs text-slate-500">Auditable history logs aggregated date-wise for tracking performance</p>
                </div>

                <div className="space-y-4 max-h-72 overflow-y-auto pr-1" id="ledger_date_groups">
                  {uniqueDates.map(dateStr => {
                    const dateActions = activities.filter(a => a.date === dateStr);
                    const formattedDate = new Date(dateStr + 'T12:00:00').toLocaleDateString(undefined, { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    });

                    return (
                      <div key={dateStr} className="space-y-2" id={`date_ledger_group_${dateStr}`}>
                        <div className="bg-slate-100/80 px-2.5 py-1 rounded-lg text-[11px] font-extrabold text-slate-700 tracking-wide uppercase flex justify-between items-center">
                          <span>📅 {formattedDate}</span>
                          <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.2 rounded-md">
                            {dateActions.length} Operations
                          </span>
                        </div>
                        
                        <div className="space-y-1.5 pl-2">
                          {dateActions.map(act => (
                            <div key={act.id} className="text-xs flex items-start gap-2.5 py-1 border-b border-slate-50/50">
                              <ChevronRight size={10} className="text-indigo-500 mt-1 shrink-0" />
                              <div className="space-y-0.5">
                                <p className="text-slate-800">
                                  <span className="font-extrabold text-indigo-700">{act.staffName}</span>
                                  {' '}{act.action === 'create' ? 'created' : act.action === 'call' ? 'called' : 'modified'}{' '}
                                  <span className="font-extrabold text-slate-900">{act.leadName}</span>:
                                  {' '}<span className="text-slate-600 font-medium">{act.details}</span>
                                </p>
                                <p className="text-[9px] text-slate-400 font-semibold uppercase">
                                  ⏱️ {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        )}

          {/* Tab: Manage Staff Accounts */}
          {adminTab === 'staff' && (
            <div className="space-y-6 animate-fade-in" id="admin_tab_staff">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4" id="manage_staff_panel">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Users className="text-indigo-600" size={16} />
                    Staff Accounts Registry
                  </h3>
                  <p className="text-xs text-slate-500">Supervise active agent logins and register new staff members</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Create New Staff Account Form */}
                <div className="md:col-span-5 bg-slate-50/50 p-4 rounded-xl border border-slate-200/60 space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Register New Agent</h4>
                  <form onSubmit={handleCreateStaff} className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Jack Sparrow"
                        value={newStaffName}
                        onChange={e => setNewStaffName(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Login Username</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. jack"
                        value={newStaffUsername}
                        onChange={e => setNewStaffUsername(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Passcode / Password</label>
                      <input
                        type="password"
                        required
                        placeholder="e.g. 1234"
                        value={newStaffPassword}
                        onChange={e => setNewStaffPassword(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow transition-all active:scale-95"
                    >
                      Add Agent Account
                    </button>
                  </form>
                </div>

                {/* Current Active Logins List */}
                <div className="md:col-span-7 space-y-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Active Staff Accounts ({staffList.length})</h4>
                  <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-1">
                    {staffList.map((st) => (
                      <div key={st.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] ${st.color}`}>
                            {st.avatar}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{st.name}</p>
                            <p className="text-[10px] text-slate-400">Username: <span className="font-semibold text-slate-600">{st.username}</span></p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase">
                            Active Staff
                          </span>
                          <button
                            onClick={() => {
                              if (st.id === 'staff-1') {
                                alert("Cannot delete seed master agent John Doe.");
                                return;
                              }
                              if (window.confirm(`Are you sure you want to delete staff account "${st.name}"?`)) {
                                const updatedStaff = staffList.filter(s => s.id !== st.id);
                                setStaffList(updatedStaff);
                                // Update Database
                                fetch('/api/leads-data', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ leads, activities, staff: updatedStaff, settings })
                                })
                                .then(() => {
                                  showBanner(`Staff account "${st.name}" removed successfully.`);
                                });
                              }
                            }}
                            className="p-1 text-slate-300 hover:text-rose-600 transition-colors"
                            title="Delete Account"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

          {/* Tab: CRM Settings & Branding */}
          {adminTab === 'settings' && (
            <div className="space-y-6 animate-fade-in" id="admin_tab_settings">
              {/* CRM Settings & Branding Panel */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4" id="crm_settings_panel">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Settings className="text-indigo-600 animate-spin-slow" size={16} />
                <div>
                  <h3 className="text-sm font-bold text-slate-800">⚙️ CRM Settings & Logo Customization</h3>
                  <p className="text-xs text-slate-500">Configure corporate branding, upload logos & favicons, and customize workspace name</p>
                </div>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* General Branding Name */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-600">Workspace / CRM Name</label>
                    <input
                      type="text"
                      required
                      value={tempCrmName}
                      onChange={e => setTempCrmName(e.target.value)}
                      placeholder="e.g. Secure Leads CRM"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white font-medium"
                    />
                    <p className="text-[10px] text-slate-400">Replaces system title and page headers instantly.</p>
                  </div>

                  {/* Slogan */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-600">Workspace Slogan</label>
                    <input
                      type="text"
                      required
                      value={tempCrmSlogan}
                      onChange={e => setTempCrmSlogan(e.target.value)}
                      placeholder="e.g. Enterprise CRM Core"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white font-medium"
                    />
                    <p className="text-[10px] text-slate-400">Subtitle displayed on login card and navigation headers.</p>
                  </div>

                  {/* Logo Source Type Selection */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-600">Logo Presentation Type</label>
                    <select
                      value={tempLogoType}
                      onChange={e => setTempLogoType(e.target.value as 'icon' | 'image')}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white font-semibold"
                    >
                      <option value="icon">Predefined Vector Icons</option>
                      <option value="image">Uploaded Image / Web URL</option>
                    </select>
                    <p className="text-[10px] text-slate-400">Select vector glyphs or supply an external branding image.</p>
                  </div>
                </div>

                {/* LOGO TYPE SWITCH DETAILS */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/50">
                  {tempLogoType === 'icon' ? (
                    <div className="space-y-3">
                      <label className="block text-xs font-bold text-slate-700">Choose Workspace Vector Icon</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
                        {(['Database', 'Shield', 'Sparkles', 'Globe', 'Activity', 'Award', 'Briefcase', 'TrendingUp'] as const).map((iconName) => {
                          const IconComponent = iconName === 'Database' ? Database :
                                                iconName === 'Shield' ? Shield :
                                                iconName === 'Sparkles' ? Sparkles :
                                                iconName === 'Globe' ? Globe :
                                                iconName === 'Activity' ? Activity :
                                                iconName === 'Award' ? Award :
                                                iconName === 'Briefcase' ? Briefcase : TrendingUp;
                          return (
                            <button
                              key={iconName}
                              type="button"
                              onClick={() => setTempLogoIcon(iconName)}
                              className={`p-3 flex flex-col items-center justify-center gap-2 rounded-lg border transition-all cursor-pointer ${
                                tempLogoIcon === iconName
                                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100'
                                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <IconComponent size={20} />
                              <span className="text-[9px] font-bold tracking-tight">{iconName}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Option A: Upload Corporate Logo File</label>
                        <div className="flex items-center gap-4">
                          <label className="flex items-center justify-center gap-2 px-4 py-2 border border-dashed border-indigo-300 rounded-xl bg-indigo-50/50 text-indigo-700 hover:bg-indigo-50 transition-all cursor-pointer text-xs font-bold shadow-sm">
                            <span>📁 Upload Image File (PNG/JPG/SVG)</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleLogoUpload}
                              className="hidden"
                            />
                          </label>
                          {tempLogoUrl.startsWith('data:image/') && (
                            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                              ✓ Base64 Image Loaded
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="border-t border-slate-200/60 pt-3">
                        <label className="block text-xs font-bold text-slate-700 mb-1">Option B: Logo Image Web URL</label>
                        <input
                          type="url"
                          value={tempLogoUrl.startsWith('data:image/') ? '' : tempLogoUrl}
                          onChange={e => setTempLogoUrl(e.target.value)}
                          placeholder="e.g. https://example.com/logo.png (Or leave Base64 string active)"
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white font-mono"
                        />
                        <p className="text-[10px] text-slate-400 mt-1">
                          Paste a direct image hotlink, or use the uploader button above to load a local corporate logo.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* FAVICON CUSTOMIZATION SECTION */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/50 space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <span>🌐 Tab Favicon Customization</span>
                    </h4>
                    <p className="text-[10px] text-slate-500 mb-2">Configure custom icon to display in the web browser's tab for full white-label experience</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Upload Favicon File</label>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center justify-center gap-2 px-4 py-2 border border-dashed border-indigo-300 rounded-xl bg-indigo-50/50 text-indigo-700 hover:bg-indigo-50 transition-all cursor-pointer text-xs font-bold shadow-sm">
                          <span>🌐 Upload Tab Icon (PNG/ICO/SVG)</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFaviconUpload}
                            className="hidden"
                          />
                        </label>
                        {tempFaviconUrl.startsWith('data:image/') && (
                          <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                            ✓ Tab Icon Loaded
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Favicon Web URL</label>
                      <input
                        type="url"
                        value={tempFaviconUrl.startsWith('data:image/') ? '' : tempFaviconUrl}
                        onChange={e => setTempFaviconUrl(e.target.value)}
                        placeholder="e.g. https://example.com/favicon.png"
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white font-mono"
                      />
                    </div>
                  </div>

                  {/* Favicon Previews */}
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-semibold bg-white p-2.5 rounded-lg border border-slate-100">
                    <span>Live Browser Tab Mockup:</span>
                    <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded border border-slate-200 shadow-xs max-w-xs truncate">
                      <div className="w-4 h-4 shrink-0 flex items-center justify-center bg-white border rounded p-0.5">
                        {tempFaviconUrl ? (
                          <img src={tempFaviconUrl} alt="Tab" className="object-contain" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-700 truncate font-bold">{tempCrmName || 'Secure Leads CRM'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 pt-1 border-t border-slate-100">
                  <div className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                    <span>Preview Logo:</span>
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center p-1.5 overflow-hidden">
                      {tempLogoType === 'image' && tempLogoUrl.trim() ? (
                        <img src={tempLogoUrl.trim()} alt="Preview" className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
                      ) : (
                        (() => {
                          const IconComp = tempLogoIcon === 'Database' ? Database :
                                           tempLogoIcon === 'Shield' ? Shield :
                                           tempLogoIcon === 'Sparkles' ? Sparkles :
                                           tempLogoIcon === 'Globe' ? Globe :
                                           tempLogoIcon === 'Activity' ? Activity :
                                           tempLogoIcon === 'Award' ? Award :
                                           tempLogoIcon === 'Briefcase' ? Briefcase : TrendingUp;
                          return <IconComp size={16} />;
                        })()
                      )}
                    </div>
                    <span className="font-bold text-slate-700">{tempCrmName}</span>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-md transition-all active:scale-95 cursor-pointer animate-pulse"
                  >
                    Save branding & logo settings
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

          {/* Tab: Leads Registry Table */}
          {adminTab === 'leads' && (
            <div className="space-y-6 animate-fade-in" id="admin_tab_leads">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4" id="admin_master_table_panel">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">🗄️ Database Master Ledger</h3>
                  <p className="text-xs text-slate-500">Read-write supervisor console showing all system entries</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  {/* CSV Export/Import Actions */}
                  {currentUser?.role === 'admin' && (
                    <div className="flex items-center gap-2">
                      <button
                        id="btn_export_csv"
                        onClick={exportToCSV}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-lg border border-emerald-200 transition-all shadow-sm active:scale-95 cursor-pointer"
                        title="Download the full database ledger as CSV"
                      >
                        <FileSpreadsheet size={13} />
                        Export CSV
                      </button>
                      
                      <label
                        id="btn_import_csv_label"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all active:scale-95 cursor-pointer"
                        title="Upload and merge new leads from a CSV file"
                      >
                        <Plus size={13} />
                        Import CSV
                        <input
                          id="csv_file_input"
                          type="file"
                          accept=".csv"
                          onChange={handleCSVImport}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}

                  {/* Search in Admin */}
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 text-slate-400" size={12} />
                    <input
                      id="admin_master_search"
                      type="text"
                      placeholder="Search master list..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Leads Table */}
              <div className="overflow-x-auto" id="admin_master_table_container">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50/50">
                      <th className="py-2.5 px-3">Lead Details</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Acquisition Channel</th>
                      <th className="py-2.5 px-3">Callback Schedule</th>
                      <th className="py-2.5 px-3">Assigned/Created By</th>
                      <th className="py-2.5 px-3">Last Active</th>
                      <th className="py-2.5 px-3 text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100" id="admin_master_table_rows">
                    {leads
                      .filter(l => l.name.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map(lead => (
                        <tr key={lead.id} id={`admin_row_${lead.id}`} className="hover:bg-slate-50/50">
                          <td className="py-3 px-3">
                            <div className="font-bold text-slate-800">{lead.name}</div>
                            <div className="text-[10px] text-slate-500 flex flex-col sm:flex-row sm:gap-2">
                              <span>📞 {lead.phone}</span>
                              <span className="hidden sm:inline text-slate-300">|</span>
                              <span>✉️ {lead.email}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${
                              lead.status === 'hot' 
                                ? 'bg-indigo-100 text-indigo-800' 
                                : lead.status === 'cold' 
                                ? 'bg-slate-100 text-slate-700' 
                                : 'bg-rose-100 text-rose-800'
                            }`}>
                              {lead.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-medium text-slate-600">{lead.source}</td>
                          <td className="py-3 px-3 font-semibold text-amber-700">
                            {lead.followUpDate ? `📅 ${lead.followUpDate}` : '--'}
                          </td>
                          <td className="py-3 px-3 font-semibold text-slate-700">{lead.createdBy}</td>
                          <td className="py-3 px-3 text-slate-400 font-medium">
                            {new Date(lead.updatedAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              id={`admin_delete_btn_${lead.id}`}
                              onClick={() => {
                                if (window.confirm(`Delete lead "${lead.name}"?`)) {
                                  const filtered = leads.filter(l => l.id !== lead.id);
                                  const updatedActs = [{
                                    id: `act-${Date.now()}`,
                                    leadId: lead.id,
                                    leadName: lead.name,
                                    staffName: 'Admin',
                                    action: 'status_change',
                                    details: 'Deleted lead completely from master registry.',
                                    date: TODAY_DATE,
                                    timestamp: new Date().toISOString()
                                  } as Activity, ...activities];
                                  updateData(filtered, updatedActs);
                                  showBanner(`Permanently purged "${lead.name}"`);
                                }
                              }}
                              className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto" id="app_footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-semibold">
          <div className="flex items-center gap-1">
            <span>Copyright 2026 | </span>
            <a 
              href="https://browsera.in" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-indigo-600 hover:text-indigo-800 transition-colors font-extrabold hover:underline"
            >
              Browsera Infotech
            </a>
          </div>
          <div className="text-slate-400 font-medium">
            Secure Leads CRM • Core Portal Active
          </div>
        </div>
      </footer>

      {/* ========================================================== */}
      {/*                 MODAL OVERLAY: EDIT LEAD                   */}
      {/* ========================================================== */}
      {editingLead && (
        <div 
          id="modal_edit_lead"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
        >
          <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200/80 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="bg-slate-950 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pencil className="text-indigo-400" size={18} />
                <div>
                  <h3 className="text-base font-black tracking-tight">Edit Lead Info & Call Log</h3>
                  <p className="text-[11px] text-slate-400">Sales Agent Lead Modification Desk</p>
                </div>
              </div>
              <button 
                id="close_edit_modal_btn"
                onClick={() => setEditingLead(null)} 
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveEditLead} className="p-6 space-y-4 flex-1 overflow-y-auto" id="edit_lead_form">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Lead Full Name *</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={e => setEditPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={e => setEditEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                  />
                </div>

                {/* Source */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Lead Source</label>
                  <select
                    value={editSource}
                    onChange={e => setEditSource(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                  >
                    {SOURCES.map(src => (
                      <option key={src} value={src}>{src}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status and Follow-up */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Lead Status</label>
                  <select
                    value={editStatus}
                    onChange={e => setEditStatus(e.target.value as 'hot' | 'cold' | 'dead')}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                  >
                    <option value="hot">🔥 Hot Lead</option>
                    <option value="cold">❄️ Cold Lead</option>
                    <option value="dead">💀 Dead Lead</option>
                  </select>
                </div>

                {editStatus === 'hot' && (
                  <div className="animate-fade-in">
                    <label className="block text-xs font-bold text-indigo-950 mb-1">📅 Set Callback Follow-up Date</label>
                    <input
                      type="date"
                      min={TODAY_DATE}
                      value={editFollowUpDate}
                      onChange={e => setEditFollowUpDate(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-indigo-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-indigo-50 text-indigo-950 font-semibold"
                      required
                    />
                  </div>
                )}
              </div>

              {/* Append Phone Call interaction notes */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-extrabold text-indigo-900 mb-1">📞 Log New Phone Call Interaction</label>
                <textarea
                  rows={3}
                  value={editAppendJournal}
                  onChange={e => setEditAppendJournal(e.target.value)}
                  placeholder="e.g. Called client from phone. Interested in scaling solutions. Wants callback next week."
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Any details written here will be automatically formatted and appended to the lead's history journal.
                </p>
              </div>

              {/* Existing History Notes Read-only for Reference */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 max-h-32 overflow-y-auto">
                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Existing Interaction History</p>
                <p className="text-xs text-slate-600 whitespace-pre-wrap leading-relaxed">{editingLead.notes}</p>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingLead(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-black rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  Save Lead & Log Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
