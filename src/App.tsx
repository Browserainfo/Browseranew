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
  FileSpreadsheet
} from 'lucide-react';

// Interfaces
interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: string;
  status: 'hot' | 'cold' | 'dead';
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

// Fixed Predefined Staff Logins
const STAFF_MEMBERS = [
  { id: 'staff-1', name: 'John Doe', avatar: 'JD', color: 'bg-indigo-100 text-indigo-700' },
  { id: 'staff-2', name: 'Sarah Smith', avatar: 'SS', color: 'bg-emerald-100 text-emerald-700' },
  { id: 'staff-3', name: 'Michael Chen', avatar: 'MC', color: 'bg-amber-100 text-amber-700' },
  { id: 'staff-4', name: 'Emily Davis', avatar: 'ED', color: 'bg-rose-100 text-rose-700' },
];

const SOURCES = ['Google Ads', 'Facebook Ads', 'Website Contact', 'Referral', 'Cold Outreach', 'Other'];

// Current local date anchor for follow-ups
const TODAY_DATE = '2026-07-15';

// Pre-seed mock database for a beautiful initial experience
const INITIAL_LEADS: Lead[] = [
  {
    id: "lead-1",
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
    id: "lead-2",
    name: "Bob Miller",
    phone: "+1 (555) 028-3948",
    email: "bob.miller@gmail.com",
    source: "Facebook Ads",
    status: "hot",
    followUpDate: "2026-07-16", // Tomorrow
    notes: "Requested a live platform walkthrough for his operations team.",
    createdBy: "John Doe",
    createdAt: "2026-07-14T15:45:00.000Z",
    updatedBy: "John Doe",
    updatedAt: "2026-07-14T15:45:00.000Z"
  },
  {
    id: "lead-3",
    name: "Charlie Davis",
    phone: "+1 (555) 037-4112",
    email: "charlie.d@yahoo.com",
    source: "Organic Search",
    status: "cold",
    notes: "No active budget yet. Keep in newsletter loop for nurtures.",
    createdBy: "Michael Chen",
    createdAt: "2026-07-13T09:15:00.000Z",
    updatedBy: "Michael Chen",
    updatedAt: "2026-07-13T09:15:00.000Z"
  },
  {
    id: "lead-4",
    name: "Diana Prince",
    phone: "+1 (555) 046-5221",
    email: "diana.prince@gmail.com",
    source: "Referral",
    status: "dead",
    notes: "Incorrect phone number, email address bounced back.",
    createdBy: "Emily Davis",
    createdAt: "2026-07-12T11:00:00.000Z",
    updatedBy: "Emily Davis",
    updatedAt: "2026-07-12T11:00:00.000Z"
  },
  {
    id: "lead-5",
    name: "Evan Wright",
    phone: "+1 (555) 055-6334",
    email: "evan.wright@outlook.com",
    source: "Website Contact",
    status: "hot",
    followUpDate: "2026-07-15", // Today
    notes: "High intent. Left a message stating interest in onboarding early next week.",
    createdBy: "John Doe",
    createdAt: "2026-07-15T08:20:00.000Z",
    updatedBy: "John Doe",
    updatedAt: "2026-07-15T08:20:00.000Z"
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
  
  // Navigation State
  const [activePortal, setActivePortal] = useState<'admin' | 'staff'>('staff');
  
  // Logged-in Staff State
  const [currentStaff, setCurrentStaff] = useState(STAFF_MEMBERS[0]);
  
  // Filtering & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'hot' | 'cold' | 'dead'>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [onlyTodayFollowUp, setOnlyTodayFollowUp] = useState(false);
  
  // New Lead Form State
  const [newLead, setNewLead] = useState({
    name: '',
    phone: '',
    email: '',
    source: 'Google Ads',
    status: 'hot' as 'hot' | 'cold' | 'dead',
    notes: '',
    followUpDate: ''
  });
  
  // Call Simulator Modal State
  const [activeCallLead, setActiveCallLead] = useState<Lead | null>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [callTimer, setCallTimer] = useState(0);
  const [callOutcome, setCallOutcome] = useState<'interested' | 'reschedule' | 'cold' | 'dead' | null>(null);
  const [callNotes, setCallNotes] = useState('');
  const [callFollowUpDate, setCallFollowUpDate] = useState('');
  
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
        } else {
          // If server database is empty, seed it
          setLeads(INITIAL_LEADS);
          setActivities(INITIAL_ACTIVITIES);
          fetch('/api/leads-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ leads: INITIAL_LEADS, activities: INITIAL_ACTIVITIES })
          }).catch(err => console.error("Error seeding backend DB:", err));
        }
      })
      .catch(err => {
        console.error("Failed to connect to backend API database. Using local state fallback.", err);
        // Fallback to local storage if API is offline
        const storedLeads = localStorage.getItem('crm_leads');
        const storedActivities = localStorage.getItem('crm_activities');
        if (storedLeads && storedActivities) {
          setLeads(JSON.parse(storedLeads));
          setActivities(JSON.parse(storedActivities));
        } else {
          setLeads(INITIAL_LEADS);
          setActivities(INITIAL_ACTIVITIES);
        }
      });
  }, []);

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
      body: JSON.stringify({ leads: newLeads, activities: newActivities })
    }).catch(err => {
      console.error("Failed to save data to backend database server:", err);
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
      followUpDate: newLead.status === 'hot' && newLead.followUpDate ? newLead.followUpDate : undefined,
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
      status: 'hot',
      notes: '',
      followUpDate: ''
    });
    
    showBanner(`Successfully added lead: "${createdLead.name}"`);
  };

  // Call simulator effects
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCalling) {
      interval = setInterval(() => {
        setCallTimer(prev => prev + 1);
      }, 1000);
    } else {
      setCallTimer(0);
    }
    return () => clearInterval(interval);
  }, [isCalling]);

  // Launch Call Simulator
  const startCall = (lead: Lead) => {
    setActiveCallLead(lead);
    setIsCalling(true);
    setCallOutcome(null);
    setCallNotes('');
    setCallFollowUpDate('');
  };

  // Handle saving Call Outcome
  const submitCallLog = () => {
    if (!activeCallLead) return;
    
    const timestamp = new Date().toISOString();
    let finalStatus: 'hot' | 'cold' | 'dead' = activeCallLead.status;
    let finalFollowUp: string | undefined = activeCallLead.followUpDate;
    let activityDetail = '';

    if (callOutcome === 'interested') {
      finalStatus = 'hot';
      activityDetail = 'Logged call: Client is highly interested. Lead remains HOT.';
    } else if (callOutcome === 'reschedule') {
      finalStatus = 'hot';
      finalFollowUp = callFollowUpDate || TODAY_DATE;
      activityDetail = `Logged call: Client busy. Scheduled callback for ${finalFollowUp}.`;
    } else if (callOutcome === 'cold') {
      finalStatus = 'cold';
      finalFollowUp = undefined;
      activityDetail = 'Logged call: Low interest. Downgraded status to COLD.';
    } else if (callOutcome === 'dead') {
      finalStatus = 'dead';
      finalFollowUp = undefined;
      activityDetail = 'Logged call: Do not contact. Status updated to DEAD.';
    } else {
      activityDetail = 'Logged phone interaction details.';
    }

    const appendNote = `\n[Call Log - ${TODAY_DATE} by ${currentStaff.name}]: ${callNotes || 'No specific notes recorded.'}${callOutcome === 'reschedule' ? ` (Scheduled callback for ${callFollowUpDate})` : ''}`;

    // Update Lead
    const updatedLeads = leads.map(l => {
      if (l.id === activeCallLead.id) {
        return {
          ...l,
          status: finalStatus,
          followUpDate: finalFollowUp,
          notes: l.notes + appendNote,
          updatedBy: currentStaff.name,
          updatedAt: timestamp
        };
      }
      return l;
    });

    // Create Activity Record
    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      leadId: activeCallLead.id,
      leadName: activeCallLead.name,
      staffName: currentStaff.name,
      action: 'call',
      details: `${activityDetail} Notes: "${callNotes || 'None'}"`,
      date: TODAY_DATE,
      timestamp
    };

    updateData(updatedLeads, [newActivity, ...activities]);
    setActiveCallLead(null);
    setIsCalling(false);
    showBanner(`Logged interaction with "${activeCallLead.name}"`);
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
  const staffPerformance = STAFF_MEMBERS.map(staff => {
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
            <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-100">
              <Database size={22} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">LeadPortal</h1>
              <p className="text-xs text-slate-500 font-medium">Enterprise CRM Core • Simulation Active</p>
            </div>
          </div>

          {/* Core Feature: Single Page Toggle Switch (No Page Refresh) */}
          <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200/60" id="portal_view_selector">
            <button
              id="btn_view_staff_portal"
              onClick={() => setActivePortal('staff')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
                activePortal === 'staff'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
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
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users size={14} />
              Admin Command
            </button>
          </div>

          {/* Simulation Helper Actions */}
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
              <Calendar size={12} />
              Today: {TODAY_DATE}
            </span>
            <button 
              id="btn_reset_demo_data"
              onClick={resetDemoData}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
            >
              Reset Data
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6" id="main_content_area">
        
        {/* ========================================================== */}
        {/*                    STAFF DASHBOARD PORTAL                  */}
        {/* ========================================================== */}
        {activePortal === 'staff' && (
          <div className="space-y-6" id="staff_portal_view">
            {/* Staff Identity switcher */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-3" id="staff_identity_section">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Staff Terminal Authorization</h2>
                  <p className="text-xs text-slate-500">Choose your staff login below to record and update leads under your identifier</p>
                </div>
                <div className="text-xs font-medium text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-lg">
                  Currently Logged in: <span className="font-bold underline">{currentStaff.name}</span>
                </div>
              </div>

              {/* Login Buttons Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1" id="staff_login_grid">
                {STAFF_MEMBERS.map((staff) => {
                  const isSelected = currentStaff.id === staff.id;
                  return (
                    <button
                      key={staff.id}
                      id={`staff_login_btn_${staff.id}`}
                      onClick={() => {
                        setCurrentStaff(staff);
                        showBanner(`Logged in as ${staff.name}`, 'info');
                      }}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 hover:-translate-y-0.5 ${
                        isSelected 
                          ? 'bg-slate-900 border-slate-900 text-white shadow-md' 
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100/70'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${staff.color}`}>
                        {staff.avatar}
                      </div>
                      <div className="overflow-hidden">
                        <p className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                          {staff.name}
                        </p>
                        <p className={`text-[10px] truncate ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                          Sales Agent
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Interactive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Input Form (Leads Addition) */}
              <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4" id="lead_entry_sidebar">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                    <Plus size={16} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">Add New Prospect Lead</h3>
                </div>

                <form onSubmit={handleAddLead} className="space-y-3.5" id="form_add_lead">
                  {/* Name Input */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1" htmlFor="lead_name">
                      Lead Full Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 text-slate-400" size={14} />
                      <input
                        id="lead_name"
                        type="text"
                        placeholder="e.g. Marcus Aurelius"
                        value={newLead.name}
                        onChange={e => setNewLead({ ...newLead, name: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone Input */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1" htmlFor="lead_phone">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 text-slate-400" size={14} />
                      <input
                        id="lead_phone"
                        type="tel"
                        placeholder="e.g. +1 (555) 000-0000"
                        value={newLead.phone}
                        onChange={e => setNewLead({ ...newLead, phone: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1" htmlFor="lead_email">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 text-slate-400" size={14} />
                      <input
                        id="lead_email"
                        type="email"
                        placeholder="e.g. marcus@rome.org"
                        value={newLead.email}
                        onChange={e => setNewLead({ ...newLead, email: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Grid row for Source and Initial Status */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1" htmlFor="lead_source">
                        Lead Source
                      </label>
                      <select
                        id="lead_source"
                        value={newLead.source}
                        onChange={e => setNewLead({ ...newLead, source: e.target.value })}
                        className="w-full px-2.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                      >
                        {SOURCES.map(src => (
                          <option key={src} value={src}>{src}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1" htmlFor="lead_status">
                        Initial Class
                      </label>
                      <select
                        id="lead_status"
                        value={newLead.status}
                        onChange={e => setNewLead({ ...newLead, status: e.target.value as 'hot' | 'cold' | 'dead' })}
                        className="w-full px-2.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                      >
                        <option value="hot">🔥 Hot Lead</option>
                        <option value="cold">❄️ Cold Lead</option>
                        <option value="dead">💀 Dead Lead</option>
                      </select>
                    </div>
                  </div>

                  {/* Follow Up Date Picker (Only visible for Hot Leads) */}
                  {newLead.status === 'hot' && (
                    <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/60 animate-fade-in" id="hot_lead_date_picker">
                      <label className="block text-xs font-bold text-indigo-900 mb-1" htmlFor="lead_follow_up">
                        📅 Set Follow-up Call Date
                      </label>
                      <input
                        id="lead_follow_up"
                        type="date"
                        value={newLead.followUpDate}
                        onChange={e => setNewLead({ ...newLead, followUpDate: e.target.value })}
                        min={TODAY_DATE}
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white text-indigo-950 font-semibold"
                      />
                      <p className="text-[10px] text-indigo-700 mt-1 font-medium">
                        On this selected date, this lead will be prioritized at the absolute top of the queue.
                      </p>
                    </div>
                  )}

                  {/* Notes / Details */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1" htmlFor="lead_notes">
                      Initial Consultation Notes
                    </label>
                    <textarea
                      id="lead_notes"
                      rows={3}
                      placeholder="e.g. Looking for scaling solutions. Call preference details..."
                      value={newLead.notes}
                      onChange={e => setNewLead({ ...newLead, notes: e.target.value })}
                      className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    id="submit_add_lead_btn"
                    type="submit"
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors duration-200 cursor-pointer"
                  >
                    Add Lead to Database
                  </button>
                </form>
              </div>

              {/* Right Column: Lead Browser & Filters (One-Page Reactive Interface) */}
              <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-5" id="lead_browser_section">
                
                {/* Search and Source filters Row */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  {/* Search */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
                    <input
                      id="lead_search_input"
                      type="text"
                      placeholder="Search leads by name, phone, email, notes..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Source Dropdown Filter */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-bold flex items-center gap-1">
                      <Filter size={12} /> Source:
                    </span>
                    <select
                      id="lead_source_filter"
                      value={sourceFilter}
                      onChange={e => setSourceFilter(e.target.value)}
                      className="px-2 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none"
                    >
                      <option value="all">All Sources</option>
                      {SOURCES.map(src => (
                        <option key={src} value={src}>{src}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Categories Tabs & Toggle Filter bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Category Status Selector Tabs */}
                  <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/40" id="lead_status_tabs">
                    <button
                      id="tab_status_all"
                      onClick={() => setStatusFilter('all')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        statusFilter === 'all'
                          ? 'bg-white text-slate-900 shadow-sm font-bold'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      📁 All ({leads.length})
                    </button>
                    <button
                      id="tab_status_hot"
                      onClick={() => setStatusFilter('hot')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        statusFilter === 'hot'
                          ? 'bg-indigo-600 text-white shadow-sm font-bold'
                          : 'text-slate-500 hover:text-indigo-600'
                      }`}
                    >
                      🔥 Hot ({leads.filter(l => l.status === 'hot').length})
                    </button>
                    <button
                      id="tab_status_cold"
                      onClick={() => setStatusFilter('cold')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        statusFilter === 'cold'
                          ? 'bg-slate-700 text-white shadow-sm font-bold'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      ❄️ Cold ({leads.filter(l => l.status === 'cold').length})
                    </button>
                    <button
                      id="tab_status_dead"
                      onClick={() => setStatusFilter('dead')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        statusFilter === 'dead'
                          ? 'bg-rose-600 text-white shadow-sm font-bold'
                          : 'text-slate-500 hover:text-rose-600'
                      }`}
                    >
                      💀 Dead ({leads.filter(l => l.status === 'dead').length})
                    </button>
                  </div>

                  {/* Follow Up Date Checkbox */}
                  <label 
                    id="checkbox_label_today_followup"
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                      onlyTodayFollowUp 
                        ? 'bg-amber-50 border-amber-300 text-amber-800' 
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      id="checkbox_today_followup"
                      type="checkbox"
                      checked={onlyTodayFollowUp}
                      onChange={e => setOnlyTodayFollowUp(e.target.checked)}
                      className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span>📅 Due for Callback Today ({leads.filter(l => l.status === 'hot' && l.followUpDate === TODAY_DATE).length})</span>
                  </label>
                </div>

                {/* Leads Queue Card List */}
                <div className="space-y-3" id="leads_card_list">
                  {sortedLeads.length === 0 ? (
                    <div className="py-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      <AlertCircle className="mx-auto text-slate-400 mb-2" size={24} />
                      <p className="text-sm font-semibold text-slate-700">No leads found</p>
                      <p className="text-xs text-slate-400 mt-1">Try resetting the search or filters to see all entries.</p>
                    </div>
                  ) : (
                    sortedLeads.map((lead) => {
                      const isTodayFollowUp = lead.status === 'hot' && lead.followUpDate === TODAY_DATE;
                      
                      return (
                        <div
                          key={lead.id}
                          id={`lead_card_${lead.id}`}
                          className={`relative p-4 rounded-xl border transition-all duration-200 shadow-sm hover:shadow ${
                            isTodayFollowUp
                              ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-300/30'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {/* Pin Banner for the Follow-Up Date (Show at First Rule) */}
                          {isTodayFollowUp && (
                            <span 
                              id={`priority_badge_${lead.id}`}
                              className="absolute -top-2.5 left-4 bg-amber-500 text-amber-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-amber-400 uppercase tracking-widest flex items-center gap-1 shadow-sm"
                            >
                              <Clock size={10} /> Call Required Today
                            </span>
                          )}

                          {/* Top Card Row */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-slate-900">{lead.name}</h4>
                                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                                  lead.status === 'hot' 
                                    ? 'bg-indigo-100 text-indigo-800' 
                                    : lead.status === 'cold' 
                                    ? 'bg-slate-100 text-slate-800' 
                                    : 'bg-rose-100 text-rose-800'
                                }`}>
                                  {lead.status === 'hot' ? '🔥 HOT' : lead.status === 'cold' ? '❄️ COLD' : '💀 DEAD'}
                                </span>
                                <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-md">
                                  🌐 {lead.source}
                                </span>
                              </div>
                              
                              {/* Contact row */}
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-medium">
                                <span className="flex items-center gap-1">
                                  <Phone size={12} /> {lead.phone}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Mail size={12} /> {lead.email}
                                </span>
                              </div>
                            </div>

                            {/* Call Action Button */}
                            <div className="flex items-center gap-2 shrink-0">
                              {lead.status === 'hot' ? (
                                <button
                                  id={`btn_call_lead_${lead.id}`}
                                  onClick={() => startCall(lead)}
                                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
                                >
                                  <PhoneCall size={12} /> Call Client
                                </button>
                              ) : (
                                <span className="text-[10px] text-slate-400 italic">No Call actions</span>
                              )}
                            </div>
                          </div>

                          {/* Notes Preview Block */}
                          <div className="mt-3 bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                            <p className="text-[11px] text-slate-600 font-semibold uppercase tracking-wider mb-0.5">Interaction Journal</p>
                            <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                              {lead.notes}
                            </p>
                          </div>

                          {/* Footer Info Row */}
                          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100/60 pt-2.5 text-[10px] text-slate-400 font-medium">
                            <div className="flex items-center gap-1">
                              <span>Added by: <span className="text-slate-600 font-bold">{lead.createdBy}</span></span>
                              <span className="text-slate-300">•</span>
                              <span>{new Date(lead.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {lead.followUpDate && (
                                <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${
                                  lead.followUpDate === TODAY_DATE ? 'bg-amber-100 text-amber-900 font-bold' : 'bg-slate-100 text-slate-600'
                                }`}>
                                  <Calendar size={10} /> Callback date: {lead.followUpDate}
                                </span>
                              )}
                              <span>Modified by: <span className="text-slate-600 font-bold">{lead.updatedBy}</span></span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/*                    ADMIN COMMAND PORTAL                    */}
        {/* ========================================================== */}
        {activePortal === 'admin' && (
          <div className="space-y-6 animate-fade-in" id="admin_portal_view">
            
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

            {/* Master Admin Leads Table */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4" id="admin_master_table_panel">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">🗄️ Database Master Ledger</h3>
                  <p className="text-xs text-slate-500">Read-write supervisor console showing all system entries</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  {/* CSV Export/Import Actions */}
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

      </main>

      {/* ========================================================== */}
      {/*               MODAL OVERLAY: CALL SIMULATOR                */}
      {/* ========================================================== */}
      {activeCallLead && (
        <div 
          id="modal_call_simulator"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
        >
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200/80 shadow-2xl overflow-hidden flex flex-col">
            
            {/* Header: Simulation Dialing Banner */}
            <div className="bg-slate-900 text-white p-5 flex flex-col items-center justify-center text-center relative">
              <button 
                id="close_call_modal_btn"
                onClick={() => {
                  setActiveCallLead(null);
                  setIsCalling(false);
                }} 
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>

              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 mb-3 animate-pulse">
                <PhoneCall size={28} className="animate-bounce" />
              </div>

              <h3 className="text-base font-black tracking-tight">{activeCallLead.name}</h3>
              <p className="text-xs text-slate-400 font-semibold">{activeCallLead.phone}</p>
              
              <div className="mt-2.5 px-3 py-1 bg-slate-800 rounded-full flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block"></span>
                <span>{isCalling ? 'Active Call - Connected' : 'Call Log Completed'}</span>
                {isCalling && <span className="text-slate-400 font-normal">({formatTime(callTimer)})</span>}
              </div>
            </div>

            {/* Form Section */}
            <div className="p-5 space-y-4 flex-1 overflow-y-auto">
              {/* Call Outcome Choices */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-600">Select Call Outcome <span className="text-rose-500">*</span></label>
                <div className="grid grid-cols-2 gap-2" id="call_outcome_grid">
                  <button
                    id="outcome_interested"
                    type="button"
                    onClick={() => setCallOutcome('interested')}
                    className={`p-2.5 border text-xs font-bold rounded-xl text-center transition-all ${
                      callOutcome === 'interested'
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500/30'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    🔥 Client Interested (Keep Hot)
                  </button>
                  <button
                    id="outcome_reschedule"
                    type="button"
                    onClick={() => setCallOutcome('reschedule')}
                    className={`p-2.5 border text-xs font-bold rounded-xl text-center transition-all ${
                      callOutcome === 'reschedule'
                        ? 'bg-amber-50 border-amber-500 text-amber-700 ring-1 ring-amber-500/30'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    📅 Schedule Callback (Set Date)
                  </button>
                  <button
                    id="outcome_cold"
                    type="button"
                    onClick={() => setCallOutcome('cold')}
                    className={`p-2.5 border text-xs font-bold rounded-xl text-center transition-all ${
                      callOutcome === 'cold'
                        ? 'bg-slate-100 border-slate-400 text-slate-800 ring-1 ring-slate-400/30'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    ❄️ Low Interest (Mark Cold)
                  </button>
                  <button
                    id="outcome_dead"
                    type="button"
                    onClick={() => setCallOutcome('dead')}
                    className={`p-2.5 border text-xs font-bold rounded-xl text-center transition-all ${
                      callOutcome === 'dead'
                        ? 'bg-rose-50 border-rose-500 text-rose-700 ring-1 ring-rose-500/30'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    💀 Do Not Contact (Mark Dead)
                  </button>
                </div>
              </div>

              {/* Dynamic Reschedule calendar field */}
              {callOutcome === 'reschedule' && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 animate-fade-in" id="reschedule_calendar_container">
                  <label className="block text-xs font-bold text-amber-900 mb-1" htmlFor="reschedule_date">
                    📅 Select Callback Follow-up Date
                  </label>
                  <input
                    id="reschedule_date"
                    type="date"
                    min={TODAY_DATE}
                    value={callFollowUpDate}
                    onChange={e => setCallFollowUpDate(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-amber-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                    required
                  />
                  <p className="text-[10px] text-amber-700 mt-1 font-semibold">
                    The lead will remain HOT and will automatically show at the very top of the list when {callFollowUpDate || TODAY_DATE} arrives.
                  </p>
                </div>
              )}

              {/* Call conversation notes */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1" htmlFor="call_journal_notes">
                  Active Call Conversation Summary
                </label>
                <textarea
                  id="call_journal_notes"
                  rows={3}
                  value={callNotes}
                  onChange={e => setCallNotes(e.target.value)}
                  placeholder="e.g. Discussed subscription tiers. Client was in a rush but wants details sent to email..."
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Footer buttons */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3.5">
              <button
                id="btn_cancel_call"
                onClick={() => {
                  setActiveCallLead(null);
                  setIsCalling(false);
                }}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-xl"
              >
                Cancel call
              </button>
              <button
                id="btn_submit_call_outcome"
                onClick={submitCallLog}
                disabled={!callOutcome}
                className={`px-4 py-2 text-xs font-black rounded-xl text-white shadow-md transition-all ${
                  callOutcome 
                    ? 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5 cursor-pointer' 
                    : 'bg-slate-300 cursor-not-allowed'
                }`}
              >
                Log Call Outcomes
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
