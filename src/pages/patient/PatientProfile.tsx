import { useState } from 'react';
import { User, Phone, Heart, Bell, Shield, LogOut, ChevronRight, Camera } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function PatientProfile() {
    const { user, logout } = useAuth();

    const [profile] = useState({
        name: user?.name || 'Awaiting Setup',
        email: user?.email || 'email@example.com',
        phone: 'Not provided',
        dob: '--/--/----',
        gender: 'Not specified',
        bloodGroup: 'Not set',
        allergies: 'None recorded',
        emergencyContact: 'Not set',
    });

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Column: Profile Card */}
                <div className="lg:w-1/3">
                    <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm text-center">
                        <div className="relative inline-block mb-6">
                            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-4xl font-extrabold shadow-xl shadow-primary-500/25">
                                {profile.name.substring(0, 2).toUpperCase()}
                            </div>
                            <button className="absolute -bottom-2 -right-2 p-3 bg-white border border-gray-100 rounded-2xl text-primary-600 shadow-lg hover:bg-gray-50 transition-all">
                                <Camera className="w-5 h-5" />
                            </button>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-1">{profile.name}</h2>
                        <p className="text-gray-500 text-sm font-medium mb-6 uppercase tracking-wider">Patient ID: #IA-NEW-USER</p>

                        <div className="grid grid-cols-3 gap-2 py-6 border-y border-gray-50 mb-8">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Blood</p>
                                <p className="text-sm font-bold text-gray-900">{profile.bloodGroup}</p>
                            </div>
                            <div className="border-x border-gray-50">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Gender</p>
                                <p className="text-sm font-bold text-gray-900">{profile.gender}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Age</p>
                                <p className="text-sm font-bold text-gray-900">--</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-2xl text-gray-700 hover:bg-gray-100 transition-all group">
                                <div className="flex items-center gap-3">
                                    <Shield className="w-5 h-5 text-primary-500" />
                                    <span className="text-sm font-semibold">Privacy & Security</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={logout}
                                className="w-full flex items-center gap-3 p-4 text-red-600 font-semibold hover:bg-red-50 rounded-2xl transition-all"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="text-sm">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Detailed Info */}
                <div className="lg:w-2/3 space-y-6">
                    <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-50">
                            <User className="w-6 h-6 text-primary-600" />
                            <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-8">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Name</p>
                                <div className="bg-gray-50 p-4 rounded-xl text-gray-900 font-medium border border-gray-100">
                                    {profile.name}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</p>
                                <div className="bg-gray-50 p-4 rounded-xl text-gray-900 font-medium border border-gray-100">
                                    {profile.email}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone Number</p>
                                <div className="bg-gray-50 p-4 rounded-xl text-gray-900 font-medium border border-gray-100">
                                    {profile.phone}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date of Birth</p>
                                <div className="bg-gray-50 p-4 rounded-xl text-gray-900 font-medium border border-gray-100">
                                    {profile.dob}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-50">
                            <Heart className="w-6 h-6 text-red-500" />
                            <h3 className="text-xl font-bold text-gray-900">Health Profile</h3>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Allergies</p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1.5 bg-gray-50 text-gray-500 rounded-lg text-sm font-medium border border-gray-100">
                                        No allergies recorded
                                    </span>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Emergency Contact</p>
                                <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-4 border border-gray-100">
                                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-primary-600 shadow-sm">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">Emergency setup pending</p>
                                        <button className="text-xs font-semibold text-primary-600 hover:text-primary-700">Add contact information</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-50">
                            <Bell className="w-6 h-6 text-amber-500" />
                            <h3 className="text-xl font-bold text-gray-900">Notifications</h3>
                        </div>
                        <div className="space-y-4">
                            {[
                                { label: 'Email Notifications', desc: 'Receive report updates and reminders via email', enabled: true },
                                { label: 'Push Notifications', desc: 'Real-time alerts on your device', enabled: false }
                            ].map(opt => (
                                <div key={opt.label} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-all cursor-pointer">
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm">{opt.label}</p>
                                        <p className="text-xs text-gray-500">{opt.desc}</p>
                                    </div>
                                    <div className={`w-12 h-6 rounded-full relative transition-colors ${opt.enabled ? 'bg-primary-500' : 'bg-gray-200'}`}>
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${opt.enabled ? 'left-7' : 'left-1'}`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
