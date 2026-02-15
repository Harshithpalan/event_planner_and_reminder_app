import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Filter, Clock, Trash2, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, differenceInSeconds, isPast, parseISO, compareAsc } from 'date-fns';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import EventCard from './components/EventCard';
import EventForm from './components/EventForm';

function App() {
  const [events, setEvents] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'events'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const eventsData = [];
      querySnapshot.forEach((doc) => {
        eventsData.push({ ...doc.data(), id: doc.id });
      });
      setEvents(eventsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addEvent = async (newEvent) => {
    try {
      await addDoc(collection(db, 'events'), newEvent);
    } catch (error) {
      console.error("Error adding event: ", error);
    }
  };

  const deleteEvent = async (id) => {
    try {
      await deleteDoc(doc(db, 'events', id));
    } catch (error) {
      console.error("Error deleting event: ", error);
    }
  };

  const filteredEvents = events.filter(event => {
    const eventDate = parseISO(event.date + 'T' + event.time);
    const expired = isPast(eventDate);

    if (filter === 'upcoming') return !expired;
    if (filter === 'past') return expired;
    return true;
  }).sort((a, b) => compareAsc(parseISO(a.date + 'T' + a.time), parseISO(b.date + 'T' + b.time)));

  return (
    <div className="app-container">
      <header>
        <div className="header-content">
          <div className="title-group">
            <h1 className="gradient-text">Event Planner</h1>
            <p className="section-subtitle">Manage your time with precision</p>
          </div>
          <div className="top-nav">
            <div className="filter-bar">
              {['all', 'upcoming', 'past'].map((type) => (
                <button
                  key={type}
                  className={`filter-btn ${filter === type ? 'active' : ''}`}
                  onClick={() => setFilter(type)}
                >
                  {filter === type && (
                    <motion.div
                      layoutId="active-glow"
                      className="active-glow"
                      initial={false}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      style={{ position: 'absolute', inset: 0 }}
                    />
                  )}
                  <span style={{ position: 'relative', zIndex: 2 }}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </span>
                </button>
              ))}
            </div>
            <button className="btn btn-primary" onClick={() => setIsFormOpen(true)}>
              <Plus size={20} />
              <span>Add Event</span>
            </button>
          </div>
        </div>
      </header>

      <main>
        <div className="dashboard-grid">
          <div className="section-header">
            <h2 className="section-title">
              {filter === 'all' && "Your Schedule"}
              {filter === 'upcoming' && "Upcoming Events"}
              {filter === 'past' && "Past Events"}
            </h2>
            <p className="section-subtitle">
              You have {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} organized
            </p>
          </div>

          <div className="event-list">
            <AnimatePresence mode="popLayout">
              {filteredEvents.length > 0 ? (
                filteredEvents.map(event => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onDelete={deleteEvent}
                  />
                ))
              ) : (
                <div style={{ gridColumn: '1/-1', width: '100%', display: 'flex', justifyContent: 'center' }}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="empty-state glass"
                  >
                    <div className="empty-icon-wrapper">
                      <Calendar size={80} style={{ opacity: 0.15, color: 'var(--accent-secondary)' }} />
                    </div>
                    <h3>No events planned</h3>
                    <p>Start your journey by adding a new event.</p>
                    <button
                      className="btn btn-primary"
                      onClick={() => setIsFormOpen(true)}
                    >
                      Create your first event
                    </button>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <EventForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onAdd={addEvent}
      />
    </div>
  );
}

export default App;
