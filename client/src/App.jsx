import React, { useState, useEffect } from 'react';
import EventForm from './components/EventForm';
import EventList from './components/EventList';
import Summary from './components/Summary';
import './App.css';

function App() {
  const [events, setEvents] = useState([]);
  const [summary, setSummary] = useState(null);
  const [filters, setFilters] = useState({ type: '', from: '', to: '' });
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    const params = new URLSearchParams();
    if (filters.type) params.append('type', filters.type);
    if (filters.from) params.append('from', new Date(filters.from).toISOString());
    if (filters.to) params.append('to', new Date(filters.to).toISOString());

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/events?${params.toString()}`);
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error('Failed to fetch events', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await fetch('http://localhost:5000/events/summary');
      const data = await res.json();
      setSummary(data);
    } catch (err) {
      console.error('Failed to fetch summary', err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  useEffect(() => {
    fetchSummary();
  }, []);

  const handleEventCreated = () => {
    fetchEvents();
    fetchSummary();
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Activity Timeline Dashboard</h1>
        <p className="subtitle">Track and monitor all system events in real-time</p>
      </header>

      <div className="container">
        <Summary data={summary} />
        <EventForm onEventCreated={handleEventCreated} />
        <EventList
          events={events}
          filters={filters}
          onFilterChange={handleFilterChange}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default App;