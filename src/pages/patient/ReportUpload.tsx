import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Upload, Camera, FileText, X, Image as ImageIcon, Loader2, AlertCircle, CheckCircle2, Brain } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { analyzeMedicalReport } from '../../lib/aiAnalysis';

const reportTypes = ['Blood Test', 'X-Ray', 'MRI / CT Scan', 'Prescription', 'Lab Report', 'Other'];

export default function ReportUpload() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [files, setFiles] = useState<File[]>([]);
    const [reportType, setReportType] = useState('');
    const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
    const [hospitalName, setHospitalName] = useState('');
    const [notes, setNotes] = useState('');
    const [dragOver, setDragOver] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [analysisProgress, setAnalysisProgress] = useState('');

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const droppedFiles = Array.from(e.dataTransfer.files).slice(0, 5);
        setFiles((prev) => [...prev, ...droppedFiles].slice(0, 5));
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files).slice(0, 5);
            setFiles((prev) => [...prev, ...selectedFiles].slice(0, 5));
        }
    };

    const removeFile = (index: number) => setFiles((prev) => prev.filter((_, i) => i !== index));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || files.length === 0) return;

        setIsUploading(true);
        setError(null);

        try {
            setAnalysisProgress('Uploading files...');

            // 1. Upload each file to Supabase Storage
            const uploadPromises = files.map(async (file) => {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
                const filePath = `${user.id}/${fileName}`;

                const { error: uploadError, data } = await supabase.storage
                    .from('medical-reports')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;
                return data.path;
            });

            const uploadedPaths = await Promise.all(uploadPromises);

            // 2. Analyze the first file with AI
            setIsAnalyzing(true);
            setAnalysisProgress('Analyzing report with AI...');


            let aiSummary = 'AI analysis pending...';
            let reportStatus = 'pending';

            try {
                const analysis = await analyzeMedicalReport(files[0]);

                aiSummary = analysis.summary;
                reportStatus = analysis.severity;

                setAnalysisProgress('Analysis complete!');
            } catch (aiError: any) {
                console.warn('AI analysis failed, continuing without it:', aiError);
                aiSummary = 'AI analysis unavailable. Please review the uploaded report manually or consult with a doctor.';
            }

            // 3. Save metadata to the reports table
            setAnalysisProgress('Saving report...');

            const { error: dbError } = await supabase.from('reports').insert({
                patient_id: user.id,
                title: `${reportType} - ${hospitalName || 'Report'}`,
                category: reportType,
                report_date: reportDate,
                report_type: reportType,
                hospital_clinic: hospitalName,
                file_url: uploadedPaths[0],
                notes: aiSummary,
                status: reportStatus
            });

            if (dbError) throw dbError;

            setUploadSuccess(true);
            setTimeout(() => navigate('/patient/reports'), 2000);
        } catch (err: any) {
            console.error('Upload error:', err);
            setError(err.message || 'An error occurred during upload. Please ensure you have configured Supabase Storage.');
        } finally {
            setIsUploading(false);
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Upload Medical Report</h1>
                <p className="text-gray-500 mt-1">Upload your report and our AI will analyze it for you</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 font-medium">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                {isAnalyzing && analysisProgress && (
                    <div className="p-4 bg-primary-50 border border-primary-100 rounded-2xl flex items-start gap-3 text-primary-700 font-medium animate-pulse">
                        <Brain className="w-5 h-5 shrink-0 animate-spin" />
                        <div>
                            <p className="font-bold">AI Analysis in Progress</p>
                            <p className="text-sm opacity-90">{analysisProgress}</p>
                        </div>
                    </div>
                )}

                {uploadSuccess && (
                    <div className="p-4 bg-green-50 border border-green-100 rounded-2xl flex items-start gap-3 text-green-600 font-medium animate-in fade-in slide-in-from-top-2">
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                        <div>
                            <p>Report uploaded successfully!</p>
                            <p className="text-sm opacity-90 font-normal">Redirecting to your reports list...</p>
                        </div>
                    </div>
                )}

                {/* Upload Area */}
                <div
                    onDragOver={(e) => { e.preventDefault(); !isUploading && setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all ${dragOver ? 'border-primary-400 bg-primary-50' : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                        } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                >
                    <Upload className={`w-12 h-12 mx-auto mb-4 ${dragOver ? 'text-primary-500' : 'text-gray-400'}`} />
                    <p className="text-gray-700 font-medium mb-1">Drag and drop your files here</p>
                    <p className="text-sm text-gray-500 mb-4">or click to browse — Supports JPG, PNG, PDF (max 10MB each, up to 5 files)</p>
                    <div className="flex items-center justify-center gap-3">
                        <label className={`inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 cursor-pointer transition-colors ${isUploading ? 'cursor-not-allowed' : ''}`}>
                            <ImageIcon className="w-4 h-4" />
                            Browse Files
                            <input type="file" disabled={isUploading} accept="image/*,.pdf" multiple onChange={handleFileSelect} className="hidden" />
                        </label>
                        <label className={`inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 cursor-pointer transition-colors ${isUploading ? 'cursor-not-allowed' : ''}`}>
                            <Camera className="w-4 h-4" />
                            Take Photo
                            <input type="file" disabled={isUploading} accept="image/*" capture="environment" onChange={handleFileSelect} className="hidden" />
                        </label>
                    </div>
                </div>

                {/* File previews */}
                {files.length > 0 && (
                    <div className="space-y-3">
                        <p className="text-sm font-semibold text-gray-700">{files.length} file{files.length > 1 ? 's' : ''} selected</p>
                        {files.map((file, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
                                <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-primary-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                                <button type="button" disabled={isUploading} onClick={() => removeFile(index)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Metadata */}
                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Report Type *</label>
                        <select disabled={isUploading} value={reportType} onChange={(e) => setReportType(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-primary-500 focus:outline-none transition-colors disabled:bg-gray-50" required>
                            <option value="">Select type</option>
                            {reportTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Report Date *</label>
                        <input disabled={isUploading} type="date" value={reportDate} onChange={(e) => setReportDate(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-primary-500 focus:outline-none transition-colors disabled:bg-gray-50" required />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Hospital / Lab Name</label>
                    <input disabled={isUploading} type="text" value={hospitalName} onChange={(e) => setHospitalName(e.target.value)} placeholder="e.g., City General Hospital" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none transition-colors disabled:bg-gray-50" />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Notes</label>
                    <textarea disabled={isUploading} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any additional notes about this report..." rows={3} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none transition-colors resize-none disabled:bg-gray-50" />
                </div>

                {/* Submit */}
                <div className="flex items-center justify-end gap-3">
                    <Link to="/patient/dashboard" className="px-6 py-3 text-sm font-semibold text-gray-700 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">Cancel</Link>
                    <button
                        type="submit"
                        disabled={files.length === 0 || isUploading}
                        className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="w-5 h-5" />
                                Upload & Analyze
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
