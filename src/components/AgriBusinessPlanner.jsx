import React, { useState } from 'react';
import { agriBusinessTemplates, getAgriDocuments } from '../data/agriBusinessTemplates';
import { generatePDF } from '../utils/pdfGenerator';
import { promptAndSendEmail } from '../utils/emailService';

const AgriBusinessPlanner = ({ onClose }) => {
    const [step, setStep] = useState('select'); // select, form, preview
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [formData, setFormData] = useState({});
    const [generatedDocument, setGeneratedDocument] = useState('');

    const documents = getAgriDocuments();

    const handleDocumentSelect = (docId) => {
        setSelectedDoc(docId);
        setStep('form');
        const template = agriBusinessTemplates[docId];
        const initialData = {};
        template.fields.forEach(field => {
            if (field.type === 'date' && field.id === 'date') {
                initialData[field.id] = new Date().toISOString().split('T')[0];
            } else {
                initialData[field.id] = '';
            }
        });
        setFormData(initialData);
    };

    const handleInputChange = (fieldId, value) => {
        setFormData(prev => ({ ...prev, [fieldId]: value }));
    };

    const handleGenerate = () => {
        const template = agriBusinessTemplates[selectedDoc];
        const docContent = template.generateTemplate(formData);
        setGeneratedDocument(docContent);
        setStep('preview');
    };

    const handleDownload = () => {
        const template = agriBusinessTemplates[selectedDoc];
        const filename = `${template.name.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
        generatePDF(generatedDocument, filename, true); // True for "premium" (no watermark) for now
    };

    return (
        <div className="card" style={{ padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h3 style={{ margin: 0, color: 'var(--color-primary)' }}>Agri-Business Hub 💼</h3>
                <button onClick={onClose} style={{ color: 'var(--color-text-muted)', fontSize: '1.5rem' }}>×</button>
            </div>

            {step === 'select' && (
                <div style={{ overflowY: 'auto' }}>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>Select a template to generate your business draft:</p>
                    <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
                        {documents.map(doc => (
                            <button
                                key={doc.id}
                                onClick={() => handleDocumentSelect(doc.id)}
                                style={{
                                    padding: '1.25rem',
                                    borderRadius: '12px',
                                    border: '1px solid var(--color-border)',
                                    background: 'rgba(255,255,255,0.02)',
                                    color: '#fff',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    transition: 'var(--transition)'
                                }}
                                className="hover-card"
                            >
                                <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>{doc.name}</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>{doc.description}</div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {step === 'form' && (
                <form onSubmit={(e) => { e.preventDefault(); handleGenerate(); }} style={{ overflowY: 'auto', flex: 1, paddingRight: '0.5rem' }}>
                    <h4 style={{ marginTop: 0, color: '#fff', marginBottom: '1.5rem' }}>{agriBusinessTemplates[selectedDoc].name}</h4>
                    {agriBusinessTemplates[selectedDoc].fields.map(field => (
                        <div key={field.id} style={{ marginBottom: '1.25rem' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--color-text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>{field.label}</label>
                            {field.type === 'textarea' ? (
                                <textarea
                                    value={formData[field.id] || ''}
                                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                                    required={field.required}
                                    placeholder={field.placeholder}
                                    style={{ width: '100%', padding: '1rem', borderRadius: '10px', border: '1px solid var(--color-border)', background: '#222', color: '#fff', minHeight: '100px', fontFamily: 'inherit' }}
                                />
                            ) : field.type === 'select' ? (
                                <select
                                    value={formData[field.id] || ''}
                                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                                    required={field.required}
                                    style={{ width: '100%', padding: '1rem', borderRadius: '10px', border: '1px solid var(--color-border)', background: '#222', color: '#fff', fontFamily: 'inherit' }}
                                >
                                    <option value="">Select...</option>
                                    {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            ) : (
                                <input
                                    type={field.type}
                                    value={formData[field.id] || ''}
                                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                                    required={field.required}
                                    placeholder={field.placeholder}
                                    style={{ width: '100%', padding: '1rem', borderRadius: '10px', border: '1px solid var(--color-border)', background: '#222', color: '#fff', fontFamily: 'inherit' }}
                                />
                            )}
                        </div>
                    ))}
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                        <button type="button" onClick={() => setStep('select')} className="btn btn-outline" style={{ flex: '1 1 120px' }}>Back</button>
                        <button type="submit" className="btn btn-primary" style={{ flex: '2 1 180px' }}>Generate Draft 📝</button>
                    </div>
                </form>
            )}

            {step === 'preview' && (
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div style={{ flex: 1, background: '#fff', color: '#000', padding: '1.5rem', borderRadius: '8px', overflowY: 'auto', whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.9rem', marginBottom: '1.5rem', border: '1px solid var(--color-primary)' }}>
                        {generatedDocument}
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <button onClick={() => setStep('form')} className="btn btn-outline" style={{ flex: '1 1 120px' }}>Edit Draft</button>
                        <button onClick={handleDownload} className="btn btn-primary" style={{ flex: '2 1 180px' }}>Download PDF 📥</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AgriBusinessPlanner;
