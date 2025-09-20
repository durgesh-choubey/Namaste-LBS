import React, { useState, useEffect, useCallback } from 'react';
import DownloadIcon from './icons/DownloadIcon';
import SpinnerIcon from './icons/SpinnerIcon';
import DocumentTextIcon from './icons/DocumentTextIcon';

interface Document {
    id: string;
    filename: string;
    filetype: string;
    uploaded_at: string;
}

const StudentDocuments: React.FC = () => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchDocuments = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:3001/api/documents');
            if (!response.ok) throw new Error('Failed to fetch documents.');
            const data = await response.json();
            setDocuments(data);
        } catch (error) {
            console.error(error);
            // Optionally show a toast message here if a showToast function was passed
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);
    
    const handleDownload = (doc: Document) => {
        window.open(`http://localhost:3001/api/documents/${doc.id}`, '_blank');
    };

    return (
        <div className="p-4 space-y-4 max-w-screen-md mx-auto">
            <h1 className="text-2xl font-bold text-slate-800">Shared Documents</h1>
            <p className="text-slate-500">Important documents shared by the hostel administration.</p>

            <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
                <ul className="divide-y divide-slate-200">
                    {isLoading ? (
                        <li className="p-8 text-center"><SpinnerIcon className="w-8 h-8 mx-auto" /></li>
                    ) : documents.length > 0 ? (
                        documents.map(doc => (
                            <li key={doc.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                                <div className="flex items-center gap-4">
                                    <div className="bg-hostel-blue-100 p-2.5 rounded-full">
                                        <DocumentTextIcon className="w-5 h-5 text-hostel-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-800">{doc.filename}</p>
                                        <p className="text-xs text-slate-400">Uploaded on {new Date(doc.uploaded_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDownload(doc)}
                                    className="flex items-center gap-2 text-sm bg-slate-100 text-slate-700 font-bold py-2 px-3 rounded-lg hover:bg-slate-200"
                                    aria-label={`Download ${doc.filename}`}
                                >
                                    <DownloadIcon className="w-4 h-4" />
                                    <span>Download</span>
                                </button>
                            </li>
                        ))
                    ) : (
                        <li className="p-8 text-center text-slate-500">No documents have been shared yet.</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default StudentDocuments;
