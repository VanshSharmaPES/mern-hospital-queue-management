'use client';

import { useState, useEffect } from 'react';
import { IPatient } from '@/types/patient';
import { addPatient, updatePatient, deletePatient, searchPatients } from './actions';

const DEPTS = ['ALL', 'RADIOLOGY', 'CARDIOLOGY', 'NEUROLOGY', 'OPD', 'ENT'];

export default function HospitalDashboard() {
    const [queue, setQueue] = useState<IPatient[]>([]);
    const [selectedDept, setSelectedDept] = useState('ALL');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingPatient, setEditingPatient] = useState<IPatient | null>(null);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<IPatient[]>([]);
    const [formData, setFormData] = useState<Partial<IPatient>>({ priority: 0, department: 'OPD' });

    // Sync theme with document root
    useEffect(() => {
        const root = window.document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
            root.style.colorScheme = 'dark';
        } else {
            root.classList.remove('dark');
            root.style.colorScheme = 'light';
        }
    }, [isDarkMode]);

    const fetchQueue = async () => {
        try {
            const res = await fetch(`/api/patients?dept=${selectedDept}`, { cache: 'no-store' });
            const data = await res.json();
            setQueue(data);
        } catch (err) {
            console.error("Queue fetch error:", err);
        }
    };

    useEffect(() => { fetchQueue(); }, [selectedDept]);

    const handleSearch = async (val: string) => {
        setSearchQuery(val);
        if (val.length > 1) {
            const results = await searchPatients(val);
            setSearchResults(results as IPatient[]);
        } else {
            setSearchResults([]);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = editingPatient 
            ? await updatePatient(editingPatient.patientId, formData)
            : await addPatient(formData as IPatient);
        
        if ('error' in res && res.error) {
            alert(res.error);
        } else {
            setIsFormOpen(false);
            setEditingPatient(null);
            setFormData({ priority: 0, department: 'OPD' });
            fetchQueue();
        }
    };

    const todayStr = new Date().toISOString().split('T')[0];

    return (
        <main className={`min-h-screen transition-all duration-300 font-sans ${isDarkMode ? 'bg-[#020617] text-white' : 'bg-[#f8fafc] text-slate-900'}`}>
            <div className="max-w-6xl mx-auto p-6 md:p-10">
                
                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <div className="space-y-1 text-center md:text-left">
                        <h1 className="text-4xl font-black tracking-tighter bg-linear-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
                            HOSPITAL QUEUE
                        </h1>
                        <p className={`text-[12px] font-bold tracking-widest uppercase ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            Collective Management System
                        </p>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <input 
                                type="text" 
                                placeholder="Search..."
                                className={`w-full border px-5 py-2.5 rounded-2xl outline-none focus:ring-2 ring-indigo-500 transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                                value={searchQuery} 
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>
                        
                        <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-3 rounded-2xl border transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                            {isDarkMode ? '🌙' : '☀️'}
                        </button>

                        <button onClick={() => { setEditingPatient(null); setIsFormOpen(true); }} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-500/20 transition-all">
                            + New
                        </button>
                    </div>
                </header>

                {/* Tab Navigation */}
                <nav className="flex gap-2 mb-10 overflow-x-auto pb-4 no-scrollbar">
                    {DEPTS.map(d => (
                        <button 
                            key={d} 
                            onClick={() => setSelectedDept(d)}
                            className={`px-6 py-2.5 rounded-xl text-[12px] font-black transition-all whitespace-nowrap ${selectedDept === d ? 'bg-indigo-600 text-white shadow-md' : isDarkMode ? 'bg-slate-900 text-slate-400 border-slate-800 border' : 'bg-white text-slate-500 border-slate-200 border'}`}
                        >
                            {d}
                        </button>
                    ))}
                </nav>

                {/* TABLE - VISIBILITY FIX APPLIED HERE */}
                <div className={`border rounded-[2.5rem] overflow-hidden shadow-2xl ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <table className="w-full text-left border-collapse">
                        <thead className={`${isDarkMode ? 'bg-slate-950/50 text-slate-400' : 'bg-slate-50 text-slate-500'} text-[12px] uppercase font-black tracking-widest`}>
                            <tr>
                                <th className="p-8">Timeline</th>
                                <th className="p-8">Patient Details</th>
                                <th className="p-8">Dept</th>
                                <th className="p-8">Priority</th>
                                <th className="p-8 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isDarkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>
                            {queue.map(p => (
                                <tr key={p.patientId} className={`transition-colors ${isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}`}>
                                    <td className="p-8">
                                        <div className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{p.appointmentTime}</div>
                                        <div className="text-[12px] text-slate-400">{p.appointmentDate}</div>
                                    </td>
                                    <td className="p-8">
                                        {/* Name Visibility Fix */}
                                        <div className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                            {p.name}
                                        </div>
                                        <div className="text-[12px] font-mono mt-1 flex gap-2">
                                            <span className="text-indigo-500 font-bold">#{p.tokenNumber}</span>
                                            <span className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>| {p.patientId}</span>
                                        </div>
                                    </td>
                                    <td className={`p-8 text-[12px] font-bold uppercase ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{p.department}</td>
                                    <td className="p-8">
                                        <span className={`px-3 py-1.5 rounded-full text-[12px] font-black uppercase ${p.priority === 2 ? 'bg-red-900/20 text-red-400 border border-red-900/50' : p.priority === 1 ? 'bg-amber-900/20 text-amber-400 border border-amber-900/50' : 'bg-emerald-900/20 text-emerald-400 border border-emerald-900/50'}`}>
                                            {p.priority === 2 ? 'Severe' : p.priority === 1 ? 'Moderate' : 'Normal'}
                                        </span>
                                    </td>
                                    <td className="p-8 text-right space-x-6">
                                        <button onClick={() => { setEditingPatient(p); setFormData(p); setIsFormOpen(true); }} className="text-[12px] font-black text-slate-400 hover:text-indigo-500">EDIT</button>
                                        <button onClick={() => deletePatient(p.patientId)} className="text-[12px] font-black text-slate-400 hover:text-red-500">REMOVE</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {queue.length === 0 && (
                        <div className="p-20 text-center text-slate-500 text-[12px] font-bold uppercase tracking-widest">
                            No appointments found in this queue
                        </div>
                    )}
                </div>

                {/* Registration Modal - VISIBILITY FIX APPLIED HERE */}
                <div className={`fixed inset-0 z-100 flex items-center justify-center p-6 transition-all duration-300 ${isFormOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsFormOpen(false)} />
                    <form 
                        onSubmit={handleSave} 
                        className={`relative p-10 rounded-[3rem] border w-full max-w-lg shadow-2xl transition-all duration-500 transform ${isFormOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'} ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}
                    >
                        <h2 className={`text-3xl font-black mb-10 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            {editingPatient ? 'Update Record' : 'New Appointment'}
                        </h2>
                        <div className="space-y-5">
                            <input 
                                className={`w-full p-5 rounded-2xl outline-none focus:ring-2 ring-indigo-500 border ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                placeholder="Patient Name" 
                                value={formData.name || ''} 
                                onChange={e => setFormData({...formData, name: e.target.value})} 
                                required 
                            />
                            <input 
                                className={`w-full p-5 rounded-2xl outline-none focus:ring-2 ring-indigo-500 border ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                placeholder="Contact Number" 
                                type="tel" 
                                pattern="[0-9]{10}" 
                                value={formData.contact || ''} 
                                onChange={e => setFormData({...formData, contact: e.target.value})} 
                                required 
                            />
                            <div className="grid grid-cols-2 gap-5">
                                <input type="date" min={todayStr} className={`p-5 rounded-2xl outline-none border ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} value={formData.appointmentDate || ''} onChange={e => setFormData({...formData, appointmentDate: e.target.value})} required />
                                <input type="time" className={`p-5 rounded-2xl outline-none border ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} value={formData.appointmentTime || ''} onChange={e => setFormData({...formData, appointmentTime: e.target.value})} required />
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                <select className={`p-5 rounded-2xl outline-none border ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} value={formData.priority} onChange={e => setFormData({...formData, priority: parseInt(e.target.value) as any})}>
                                    <option value={0}>Normal Severity</option>
                                    <option value={1}>Moderate Severity</option>
                                    <option value={2}>Severe Condition</option>
                                </select>
                                <select className={`p-5 rounded-2xl outline-none border ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} value={formData.department} onChange={e => setFormData({...formData, department: e.target.value as any})}>
                                    {DEPTS.filter(d => d !== 'ALL').map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-4 mt-12">
                            <button type="button" onClick={() => setIsFormOpen(false)} className={`flex-1 py-5 rounded-2xl font-black text-[12px] uppercase ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>Cancel</button>
                            <button type="submit" className="flex-1 bg-indigo-600 py-5 rounded-2xl font-black text-white hover:bg-indigo-500 shadow-xl shadow-indigo-500/20 text-[12px] uppercase">Confirm</button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}