import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Trash2, AlertCircle } from 'lucide-react';
import { format, differenceInSeconds, isPast, parseISO, isToday } from 'date-fns';
import { motion } from 'framer-motion';

const EventCard = ({ event, onDelete }) => {
    const [units, setUnits] = useState({ d: 0, h: 0, m: 0, s: 0 });
    const [isExpired, setIsExpired] = useState(false);
    const happeningToday = isToday(parseISO(event.date));

    useEffect(() => {
        const timer = setInterval(() => {
            const targetDate = parseISO(event.date + 'T' + event.time);
            const totalSeconds = differenceInSeconds(targetDate, new Date());

            if (totalSeconds <= 0) {
                setIsExpired(true);
                clearInterval(timer);
                return;
            }

            setUnits({
                d: Math.floor(totalSeconds / (3600 * 24)),
                h: Math.floor((totalSeconds % (3600 * 24)) / 3600),
                m: Math.floor((totalSeconds % 3600) / 60),
                s: totalSeconds % 60
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [event]);

    const categoryColors = {
        personal: 'var(--category-personal)',
        study: 'var(--category-study)',
        health: 'var(--category-health)',
        birthday: 'var(--category-birthday)',
        meeting: 'var(--category-meeting)',
        travel: 'var(--category-travel)',
        other: 'var(--category-other)'
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`event-card glass ${happeningToday ? 'today-highlight' : ''}`}
            style={{
                '--category-color': categoryColors[event.category] || 'var(--accent-primary)',
            }}
        >
            <div className="card-header">
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span className="category-tag">
                        {event.category}
                    </span>
                    {happeningToday && <span className="today-badge">Live Today</span>}
                </div>
                <button className="delete-btn" onClick={() => onDelete(event.id)}>
                    <Trash2 size={20} />
                </button>
            </div>

            <h3 className="event-title">{event.title}</h3>

            <div className="event-details">
                <div className="detail-item">
                    <Calendar size={16} className="text-secondary" />
                    <span>{format(parseISO(event.date), 'MMM do, yyyy')}</span>
                </div>
                <div className="detail-item">
                    <Clock size={16} className="text-secondary" />
                    <span>{event.time}</span>
                </div>
            </div>

            <div className="countdown-container">
                {isExpired ? (
                    <div className="expired-tag">Session Active</div>
                ) : (
                    <div className="countdown-wrapper">
                        <CountdownUnit value={units.d} label="Days" />
                        <CountdownUnit value={units.h} label="Hrs" />
                        <CountdownUnit value={units.m} label="Min" />
                        <CountdownUnit value={units.s} label="Sec" />
                    </div>
                )}
                {isExpired && <AlertCircle size={18} style={{ color: 'var(--accent-secondary)' }} />}
            </div>
        </motion.div>
    );
};

const CountdownUnit = ({ value, label }) => (
    <div className="countdown-unit">
        <span className="unit-value">{String(value).padStart(2, '0')}</span>
        <span className="unit-label">{label}</span>
    </div>
);

export default EventCard;
