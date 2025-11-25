import React, { useState } from 'react';

const EventForm = ({ onEventCreated }) => {
    const [type, setType] = useState('LOGIN');
    const [formData, setFormData] = useState({});
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setLoading(true);

        const payload = { type, ...formData };

        if (type === 'PROFILE_UPDATE' && typeof formData.changedFields === 'string') {
            payload.changedFields = formData.changedFields.split(',').map(s => s.trim()).filter(s => s);
        }

        if (type === 'PURCHASE' && formData.amount) {
            payload.amount = parseFloat(formData.amount);
        }

        try {
            const response = await fetch('http://localhost:5000/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.errors ? data.errors.join(', ') : 'Failed to create event');
            }

            onEventCreated();
            setFormData({});
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleTypeChange = (e) => {
        setType(e.target.value);
        setFormData({});
        setError(null);
    };

    return (
        <div className="card">
            <h2>📝 Log New Event</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Event Type</label>
                    <select value={type} onChange={handleTypeChange}>
                        <option value="LOGIN">🔐 Login</option>
                        <option value="LOGOUT">🚪 Logout</option>
                        <option value="PURCHASE">🛒 Purchase</option>
                        <option value="PROFILE_UPDATE">👤 Profile Update</option>
                    </select>
                </div>

                {type === 'LOGIN' && (
                    <>
                        <div className="form-group">
                            <label>Device</label>
                            <input
                                name="device"
                                value={formData.device || ''}
                                onChange={handleChange}
                                placeholder="e.g., Chrome/Windows"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>IP Address</label>
                            <input
                                name="ip"
                                value={formData.ip || ''}
                                onChange={handleChange}
                                placeholder="e.g., 192.168.1.1"
                                required
                            />
                        </div>
                    </>
                )}

                {type === 'LOGOUT' && (
                    <div className="form-group">
                        <label>Reason</label>
                        <input
                            name="reason"
                            value={formData.reason || ''}
                            onChange={handleChange}
                            placeholder="e.g., User logout, Session timeout"
                            required
                        />
                    </div>
                )}

                {type === 'PURCHASE' && (
                    <>
                        <div className="form-group">
                            <label>Product ID</label>
                            <input
                                name="productId"
                                value={formData.productId || ''}
                                onChange={handleChange}
                                placeholder="e.g., PROD-12345"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Amount ($)</label>
                            <input
                                name="amount"
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={formData.amount || ''}
                                onChange={handleChange}
                                placeholder="e.g., 99.99"
                                required
                            />
                        </div>
                    </>
                )}

                {type === 'PROFILE_UPDATE' && (
                    <div className="form-group">
                        <label>Changed Fields (comma separated)</label>
                        <input
                            name="changedFields"
                            value={formData.changedFields || ''}
                            onChange={handleChange}
                            placeholder="e.g., email, username, avatar"
                            required
                        />
                    </div>
                )}

                {error && <div className="error-msg">❌ {error}</div>}
                {success && <div className="success-msg">✅ Event created successfully!</div>}

                <button type="submit" disabled={loading} style={{ marginTop: '1rem' }}>
                    {loading ? '⏳ Creating...' : '✨ Submit Event'}
                </button>
            </form>
        </div>
    );
};

export default EventForm;