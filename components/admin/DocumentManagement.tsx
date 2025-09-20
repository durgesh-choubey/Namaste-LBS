import React, { useState, useEffect, useCallback } from 'react';
import SpinnerIcon from '../icons/SpinnerIcon';
import TrashIcon from '../icons/TrashIcon';
import XIcon from '../icons/XIcon';
import PaperclipIcon from '../icons/PaperclipIcon';
import ConfirmationModal from '../ConfirmationModal';
import DocumentTextIcon from '../icons/DocumentTextIcon';

interface Document {
    id: string;
    filename: string;
    filetype: string;
    uploaded_at: string;
}

interface DocumentManagementProps {
    showToast: (message: string, type: 'success' | 'error') => void;
}

const DocumentManagement: React.FC<DocumentManagementProps> = ({ showToast }) => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fileToUpload, setFileToUpload] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [docToDelete, setDocToDelete] = useState<Document | null>(null);

    const fetchDocuments = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:3001/api/documents');
            if (!response.ok) throw new Error('Failed to fetch documents.');
            const data = await response.json();
            setDocuments(data);
        } catch (error: any) {
            showToast(error.message, 'error');
        } finally {
            setIsLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                showToast('File size should not exceed 10MB.', 'error');
                return;
            }
            setFileToUpload(file);
        }
    };

    const removeFile = () => {
        setFileToUpload(null);
        const fileInput = document.getElementById('doc-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fileToUpload) {
            showToast('Please select a file to upload.', 'error');
            return;
        }

        setIsUploading(true);

        const reader = new FileReader();
        reader.readAsDataURL(fileToUpload);
        reader.onload = async () => {
            const base64Data = (reader.result as string).split(',')[1];
            try {
                const payload = {
                    filename: fileToUpload.name,
                    filetype: fileToUpload.type,
                    data: base64Data,
                };
                const response = await fetch('http://localhost:3001/api/documents', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to upload document.');
                }
                showToast('Document uploaded successfully!', 'success');
                removeFile();
                fetchDocuments();
            } catch (error: any) {
                showToast(error.message, 'error');
            } finally {
                setIsUploading(false);
            }
        };
        reader.onerror = (error) => {
             showToast('Error reading file.', 'error');
             setIsUploading(false);
        };
    };

    const handleDelete = async () => {
        if (!docToDelete) return;
        try {
            const response = await fetch(`http://localhost:3001/api/documents/${docToDelete.id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete document.');
            showToast('Document deleted.', 'success');
            setDocToDelete(null);
            fetchDocuments();
        } catch (error: any) {
            showToast(error.message, 'error');
        }
    };
    
     const handleDownload = (doc: Document) => {
        window.open(`http://localhost:3001/api/documents/${doc.id}`, '_blank');
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-slate-800">Document Management</h1>

            {/* Upload Form */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Upload New Document</h2>
                <form onSubmit={handleUpload} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Select File</label>
                        {fileToUpload ? (
                            <div className="mt-2 p-2 border border-slate-200 rounded-lg flex items-center gap-3 bg-slate-50">
                                <PaperclipIcon className="w-5 h-5 text-slate-500 flex-shrink-0" />
                                <p className="text-sm font-medium text-slate-700 break-all flex-1">{fileToUpload.name}</p>
                                <button type="button" onClick={removeFile} className="p-1 text-slate-400 hover:text-red-500"><XIcon className="w-4 h-4" /></button>
                            </div>
                        ) : (
                             <label htmlFor="doc-upload" className="mt-1 relative flex items-center justify-center w-full h-12 border-2 border-slate-300 border-dashed rounded-md cursor-pointer hover:bg-slate-50">
                                <div className="text-sm text-slate-600">
                                    <span className="font-medium text-hostel-blue-600">Click to select a file</span> (Max 10MB)
                                </div>
                                <input id="doc-upload" name="doc-upload" type="file" className="sr-only" onChange={handleFileChange} />
                            </label>
                        )}
                    </div>
                    <div className="pt-2 flex justify-end">
                        <button type="submit" disabled={isUploading || !fileToUpload}
                            className="w-40 flex justify-center bg-hostel-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-hostel-blue-700 disabled:bg-hostel-blue-300">
                            {isUploading ? <SpinnerIcon className="w-5 h-5" /> : 'Upload'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Document List */}
            <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-x-auto">
                 <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Filename</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">File Type</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Uploaded At</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {isLoading ? (
                            <tr><td colSpan={4} className="text-center p-8 text-slate-500">Loading documents...</td></tr>
                        ) : documents.map((doc) => (
                            <tr key={doc.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 cursor-pointer hover:underline" onClick={() => handleDownload(doc)}>{doc.filename}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{doc.filetype}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(doc.uploaded_at).toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => setDocToDelete(doc)} className="text-red-600 hover:text-red-900 p-1" title="Delete Document">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 { !isLoading && documents.length === 0 && (
                    <div className="text-center p-8 text-slate-500">
                        No documents have been uploaded yet.
                    </div>
                )}
            </div>

            <ConfirmationModal 
                isOpen={!!docToDelete}
                onClose={() => setDocToDelete(null)}
                onConfirm={handleDelete}
                title="Delete Document?"
                message={`Are you sure you want to permanently delete "${docToDelete?.filename}"?`}
                isLoading={false}
            />
        </div>
    );
};

export default DocumentManagement;
