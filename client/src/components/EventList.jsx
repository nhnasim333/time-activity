import React from 'react';

const EventList = ({ events, filters, onFilterChange, loading }) => {
    const getEventIcon = (type) => {
        const icons = {
            'LOGIN': '🔐',
            'LOGOUT': '🚪',
            'PURCHASE': '🛒',
            'PROFILE_UPDATE': '👤'
        };
        return icons[type] || '📌';
    };

    return (
        <div className="card">
            <h2>📊 Event Log</h2>

            <div className="filters">
                <div className="form-group">
                    <label>Filter by Type</label>
                    <input
                        placeholder="e.g., LOGIN, PURCHASE"
                        value={filters.type}
                        onChange={(e) => onFilterChange('type', e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>From Date</label>
                    <input
                        type="datetime-local"
                        value={filters.from}
                        onChange={(e) => onFilterChange('from', e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>To Date</label>
                    <input
                        type="datetime-local"
                        value={filters.to}
                        onChange={(e) => onFilterChange('to', e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="loading">⏳ Loading events...</div>
            ) : (
                <ul className="event-list">
                    {events.map(event => (
                        <li key={event.id} className="event-item">
                            <div style={{ flex: 1 }}>
                                <span className="event-type">
                                    {getEventIcon(event.type)} {event.type}
                                </span>
                                <div className="event-details">
                                    🕒 {new Date(event.created_at).toLocaleString('en-US', {
                                        dateStyle: 'medium',
                                        timeStyle: 'short'
                                    })}
                                </div>
                            </div>
                            <div style={{ maxWidth: '50%', overflow: 'hidden' }}>
                                <pre>
                                    {JSON.stringify(event.payload, null, 2)}
                                </pre>
                            </div>
                        </li>
                    ))}
                    {events.length === 0 && (
                        <div className="no-events">
                            📭 No events found. Create your first event above!
                        </div>
                    )}
                </ul>
            )}
        </div>
    );
};

export default EventList;