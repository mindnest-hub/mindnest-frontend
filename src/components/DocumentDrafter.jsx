import React, { useState } from 'react';
import { documentTemplates, getAllDocuments } from '../data/legalTemplates';
import { generatePDF } from '../utils/pdfGenerator';
import { promptAndSendEmail } from '../utils/emailService';

const DocumentDrafter = ({ country, onClose }) => {
    const [step, setStep] = useState('select'); // select, form, preview, history, samples
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [formData, setFormData] = useState({});
    const [generatedDocument, setGeneratedDocument] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all'); // all, general, real-estate, business
    const [searchQuery, setSearchQuery] = useState('');

    const documents = getAllDocuments().filter(doc =>
        doc.countries.includes(country) &&
        (categoryFilter === 'all' || doc.category === categoryFilter) &&
        (searchQuery === '' || doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || doc.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Load saved draft if exists
    React.useEffect(() => {
        if (selectedDoc) {
            const savedDraft = localStorage.getItem(`draft_${selectedDoc}`);
            if (savedDraft) {
                try {
                    const draft = JSON.parse(savedDraft);
                    setFormData(draft);
                } catch (e) {
                    console.error('Failed to load draft:', e);
                }
            }
        }
    }, [selectedDoc]);

    // Save draft automatically
    const saveDraft = (data) => {
        if (selectedDoc) {
            localStorage.setItem(`draft_${selectedDoc}`, JSON.stringify(data));
        }
    };

    // Get document history
    const getDocumentHistory = () => {
        const history = localStorage.getItem('documentHistory');
        return history ? JSON.parse(history) : [];
    };

    // Save to history
    const saveToHistory = (docType, docName, content) => {
        const history = getDocumentHistory();
        const newEntry = {
            id: Date.now(),
            type: docType,
            name: docName,
            content: content,
            date: new Date().toISOString(),
            country: country
        };
        history.unshift(newEntry);
        // Keep only last 10 documents
        if (history.length > 10) history.pop();
        localStorage.setItem('documentHistory', JSON.stringify(history));
    };

    const handleDocumentSelect = (docId) => {
        setSelectedDoc(docId);
        setStep('form');
        // Initialize form data with default values
        const template = documentTemplates[docId];
        const initialData = {};
        template.fields.forEach(field => {
            if (field.type === 'date' && field.id === 'date') {
                initialData[field.id] = new Date().toISOString().split('T')[0];
            } else if (field.default) {
                initialData[field.id] = field.default;
            } else {
                initialData[field.id] = '';
            }
        });
        setFormData(initialData);
    };

    const handleInputChange = (fieldId, value) => {
        const newData = { ...formData, [fieldId]: value };
        setFormData(newData);
        // Auto-save draft
        saveDraft(newData);
    };

    const handleGenerateDocument = () => {
        const template = documentTemplates[selectedDoc];
        const document = template.generateTemplate(formData, country);
        setGeneratedDocument(document);
        // Save to history
        saveToHistory(selectedDoc, template.name, document);
        // Clear draft after successful generation
        localStorage.removeItem(`draft_${selectedDoc}`);
        setStep('preview');
    };

    const handleDownloadPDF = () => {
        const template = documentTemplates[selectedDoc];
        const filename = `${template.name.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.pdf`;
        generatePDF(generatedDocument, filename, false); // false = free tier (with watermark)
    };

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(generatedDocument);
        alert('Document copied to clipboard!');
    };

    const handleReset = () => {
        setStep('select');
        setSelectedDoc(null);
        setFormData({});
        setGeneratedDocument('');
    };

    const handleEmailDocument = () => {
        const template = documentTemplates[selectedDoc];
        const success = promptAndSendEmail(generatedDocument, template.name);
        if (success) {
            // Save to history when emailed
            saveToHistory(selectedDoc, template.name, generatedDocument);
        }
    };

    if (step === 'select') {
        return (
            <div style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0 }}>Select Document</h3>
                    <button
                        onClick={() => setStep('history')}
                        style={{
                            padding: '0.4rem 0.8rem',
                            borderRadius: '5px',
                            border: '1px solid #666',
                            background: 'none',
                            color: '#aaa',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                        }}
                    >
                        📜 History
                    </button>
                </div>

                {/* Search Bar */}
                <input
                    type="text"
                    placeholder="🔍 Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '0.7rem',
                        borderRadius: '8px',
                        border: '1px solid #555',
                        background: '#222',
                        color: '#fff',
                        fontSize: '0.9rem',
                        marginBottom: '1rem'
                    }}
                />

                {/* Category Filter Tabs */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', overflowX: 'auto' }}>
                    {['all', 'general', 'real-estate', 'business'].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategoryFilter(cat)}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '20px',
                                border: 'none',
                                background: categoryFilter === cat ? 'var(--color-primary)' : '#333',
                                color: '#fff',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {cat === 'all' ? 'All' : cat === 'real-estate' ? 'Real Estate' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                    ))}
                </div>

                <p style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    {documents.length} document{documents.length !== 1 ? 's' : ''} available for {country}
                </p>

                <div style={{ display: 'grid', gap: '0.5rem', maxHeight: '350px', overflowY: 'auto' }}>
                    {documents.map(doc => (
                        <button
                            key={doc.id}
                            onClick={() => handleDocumentSelect(doc.id)}
                            style={{
                                padding: '1rem',
                                borderRadius: '10px',
                                border: '1px solid var(--color-primary)',
                                background: 'rgba(156, 39, 176, 0.1)',
                                color: '#fff',
                                cursor: 'pointer',
                                textAlign: 'left'
                            }}
                        >
                            <div style={{ fontWeight: 'bold', marginBottom: '0.3rem' }}>
                                {doc.name}
                                {doc.tier === 'premium' && (
                                    <span style={{
                                        marginLeft: '0.5rem',
                                        fontSize: '0.7rem',
                                        padding: '0.2rem 0.4rem',
                                        background: '#FFD700',
                                        color: '#000',
                                        borderRadius: '5px'
                                    }}>
                                        PREMIUM
                                    </span>
                                )}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#aaa' }}>
                                {doc.description}
                            </div>
                        </button>
                    ))}
                </div>
                <button
                    onClick={onClose}
                    style={{
                        marginTop: '1rem',
                        padding: '0.5rem 1rem',
                        borderRadius: '5px',
                        border: '1px solid #666',
                        background: 'none',
                        color: '#fff',
                        cursor: 'pointer',
                        width: '100%'
                    }}
                >
                    Cancel
                </button>
            </div>
        );
    }

    if (step === 'form') {
        const template = documentTemplates[selectedDoc];
        return (
            <div style={{ padding: '1rem', maxHeight: '500px', overflowY: 'auto' }}>
                <h3 style={{ marginTop: 0 }}>{template.name}</h3>
                <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    Fill in the details below
                </p>
                <p style={{ color: 'var(--color-accent)', fontSize: '0.75rem', marginBottom: '1rem' }}>
                    💾 Draft auto-saves as you type
                </p>
                <form onSubmit={(e) => { e.preventDefault(); handleGenerateDocument(); }}>
                    {template.fields.map(field => (
                        <div key={field.id} style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem' }}>
                                {field.label} {field.required && <span style={{ color: '#ff4444' }}>*</span>}
                            </label>
                            {field.type === 'textarea' ? (
                                <textarea
                                    value={formData[field.id] || ''}
                                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                                    required={field.required}
                                    placeholder={field.placeholder}
                                    rows={4}
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        borderRadius: '5px',
                                        border: '1px solid #555',
                                        background: '#222',
                                        color: '#fff',
                                        fontSize: '0.9rem'
                                    }}
                                />
                            ) : field.type === 'select' ? (
                                <select
                                    value={formData[field.id] || ''}
                                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                                    required={field.required}
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        borderRadius: '5px',
                                        border: '1px solid #555',
                                        background: '#222',
                                        color: '#fff',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    <option value="">Select...</option>
                                    {field.options.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type={field.type}
                                    value={formData[field.id] || ''}
                                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                                    required={field.required}
                                    placeholder={field.placeholder}
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        borderRadius: '5px',
                                        border: '1px solid #555',
                                        background: '#222',
                                        color: '#fff',
                                        fontSize: '0.9rem'
                                    }}
                                />
                            )}
                        </div>
                    ))}
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
                        <button
                            type="button"
                            onClick={() => setStep('select')}
                            style={{
                                flex: 1,
                                padding: '0.7rem',
                                borderRadius: '5px',
                                border: '1px solid #666',
                                background: 'none',
                                color: '#fff',
                                cursor: 'pointer'
                            }}
                        >
                            Back
                        </button>
                        <button
                            type="submit"
                            style={{
                                flex: 1,
                                padding: '0.7rem',
                                borderRadius: '5px',
                                border: 'none',
                                background: 'var(--color-primary)',
                                color: '#fff',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            Generate Document
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    if (step === 'preview') {
        return (
            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <h3 style={{ marginTop: 0 }}>Document Preview</h3>
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    background: '#fff',
                    color: '#000',
                    padding: '1rem',
                    borderRadius: '5px',
                    marginBottom: '1rem',
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    whiteSpace: 'pre-wrap'
                }}>
                    {generatedDocument}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                    <button
                        onClick={handleCopyToClipboard}
                        style={{
                            padding: '0.7rem',
                            borderRadius: '5px',
                            border: '1px solid var(--color-accent)',
                            background: 'rgba(0, 200, 81, 0.1)',
                            color: 'var(--color-accent)',
                            cursor: 'pointer',
                            fontSize: '0.85rem'
                        }}
                    >
                        📋 Copy
                    </button>
                    <button
                        onClick={handleEmailDocument}
                        style={{
                            padding: '0.7rem',
                            borderRadius: '5px',
                            border: '1px solid #4A90E2',
                            background: 'rgba(74, 144, 226, 0.1)',
                            color: '#4A90E2',
                            cursor: 'pointer',
                            fontSize: '0.85rem'
                        }}
                    >
                        📧 Email
                    </button>
                    <button
                        onClick={handleDownloadPDF}
                        style={{
                            padding: '0.7rem',
                            borderRadius: '5px',
                            border: 'none',
                            background: 'var(--color-primary)',
                            color: '#fff',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '0.85rem'
                        }}
                    >
                        📥 PDF
                    </button>
                </div>
                <button
                    onClick={handleReset}
                    style={{
                        marginTop: '0.5rem',
                        padding: '0.5rem',
                        borderRadius: '5px',
                        border: '1px solid #666',
                        background: 'none',
                        color: '#fff',
                        cursor: 'pointer'
                    }}
                >
                    Create Another Document
                </button>
            </div>
        );
    }

    if (step === 'history') {
        const history = getDocumentHistory();
        return (
            <div style={{ padding: '1rem' }}>
                <h3 style={{ marginTop: 0 }}>Document History</h3>
                <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '1rem' }}>
                    Last {history.length} generated documents
                </p>
                {history.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                        <p>No documents generated yet</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '0.5rem', maxHeight: '400px', overflowY: 'auto' }}>
                        {history.map(doc => (
                            <div
                                key={doc.id}
                                style={{
                                    padding: '1rem',
                                    borderRadius: '10px',
                                    border: '1px solid #444',
                                    background: '#222'
                                }}
                            >
                                <div style={{ fontWeight: 'bold', marginBottom: '0.3rem', color: '#fff' }}>
                                    {doc.name}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '0.5rem' }}>
                                    {new Date(doc.date).toLocaleString()} • {doc.country}
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(doc.content);
                                            alert('Document copied to clipboard!');
                                        }}
                                        style={{
                                            flex: 1,
                                            padding: '0.5rem',
                                            borderRadius: '5px',
                                            border: '1px solid var(--color-accent)',
                                            background: 'rgba(0, 200, 81, 0.1)',
                                            color: 'var(--color-accent)',
                                            cursor: 'pointer',
                                            fontSize: '0.8rem'
                                        }}
                                    >
                                        📋 Copy
                                    </button>
                                    <button
                                        onClick={() => {
                                            const filename = `${doc.name.replace(/[^a-z0-9]/gi, '_')}_${doc.id}.pdf`;
                                            generatePDF(doc.content, filename, false);
                                        }}
                                        style={{
                                            flex: 1,
                                            padding: '0.5rem',
                                            borderRadius: '5px',
                                            border: 'none',
                                            background: 'var(--color-primary)',
                                            color: '#fff',
                                            cursor: 'pointer',
                                            fontSize: '0.8rem'
                                        }}
                                    >
                                        📥 PDF
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <button
                    onClick={() => setStep('select')}
                    style={{
                        marginTop: '1rem',
                        padding: '0.5rem 1rem',
                        borderRadius: '5px',
                        border: '1px solid #666',
                        background: 'none',
                        color: '#fff',
                        cursor: 'pointer',
                        width: '100%'
                    }}
                >
                    Back to Documents
                </button>
            </div>
        );
    }
};

export default DocumentDrafter;
