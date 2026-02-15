import React, { useState } from 'react';
import { X, Calendar, Clock, Tag, Type, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const categories = [
    { value: 'personal', label: 'Personal', color: 'var(--category-personal)' },
    { value: 'study', label: 'Study', color: 'var(--category-study)' },
    { value: 'health', label: 'Health', color: 'var(--category-health)' },
    { value: 'birthday', label: 'Birthday', color: 'var(--category-birthday)' },
    { value: 'meeting', label: 'Meeting', color: 'var(--category-meeting)' },
    { value: 'travel', label: 'Travel', color: 'var(--category-travel)' },
    { value: 'other', label: 'Other', color: 'var(--category-other)' }
];

const CustomDropdown = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedCategory = categories.find(c => c.value === value);

    return (
        <div className="custom-select-container">
            <div
                className={`custom-select-trigger ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="option-dot" style={{ '--category-color': selectedCategory?.color }}></div>
                    <span>{selectedCategory?.label}</span>
                </div>
                <ChevronDown size={18} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s ease' }} />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="options-list"
                    >
                        {categories.map((cat) => (
                            <div
                                key={cat.value}
                                className={`option-item ${value === cat.value ? 'selected' : ''}`}
                                onClick={() => {
                                    onChange(cat.value);
                                    setIsOpen(false);
                                }}
                            >
                                <div className="option-dot" style={{ '--category-color': cat.color }}></div>
                                <span>{cat.label}</span>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};


const EventForm = ({ isOpen, onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        time: '',
        category: 'personal'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title || !formData.date || !formData.time) return;

        onAdd({
            ...formData,
            id: Date.now().toString()
        });
        setFormData({ title: '', date: '', time: '', category: 'personal' });
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="modal-overlay"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="modal-content glass"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="card-header">
                            <h2 className="gradient-text">Add New Event</h2>
                            <button className="delete-btn" onClick={onClose}><X size={20} /></button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
                            <div className="form-group">
                                <label className="detail-item"><Type size={14} /> Title</label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="Event Name"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label className="detail-item"><Calendar size={14} /> Date</label>
                                    <input
                                        type="date"
                                        className="input"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="detail-item"><Clock size={14} /> Time</label>
                                    <input
                                        type="time"
                                        className="input"
                                        value={formData.time}
                                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="detail-item"><Tag size={14} /> Category</label>
                                <CustomDropdown
                                    value={formData.category}
                                    onChange={(value) => setFormData({ ...formData, category: value })}
                                />
                            </div>

                            <div className="form-actions">
                                <button type="button" className="btn" onClick={onClose}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Create Event</button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default EventForm;
