import React from 'react';

const Summary = ({ data }) => {
    if (!data) {
        return (
            <div className="card">
                <div className="loading">⏳ Loading summary...</div>
            </div>
        );
    }

    return (
        <div className="card">
            <h2>📈 Activity Summary</h2>
            <div className="grid">
                <div className="summary-item">
                    <div className="summary-value">{data.totalEvents}</div>
                    <div>📌 Total Events</div>
                </div>
                <div className="summary-item">
                    <div className="summary-value">{data.loginCount}</div>
                    <div>🔐 Logins</div>
                </div>
                <div className="summary-item">
                    <div className="summary-value">{data.logoutCount}</div>
                    <div>🚪 Logouts</div>
                </div>
                <div className="summary-item">
                    <div className="summary-value">${data.purchaseTotalAmount}</div>
                    <div>🛒 Total Purchases</div>
                </div>
                <div className="summary-item">
                    <div className="summary-value" style={{ fontSize: '1.2rem' }}>
                        {data.mostActiveDay || 'N/A'}
                    </div>
                    <div>🔥 Most Active Day</div>
                </div>
            </div>
        </div>
    );
};

export default Summary;