const { getDB } = require('../config/db');

exports.createEvent = async (req, res) => {
    const { type, ...payload } = req.body;
    const allowedTypes = ['LOGIN', 'LOGOUT', 'PURCHASE', 'PROFILE_UPDATE'];
    const errors = [];

    if (!type || !allowedTypes.includes(type)) {
        errors.push(`Invalid or missing event type. Allowed: ${allowedTypes.join(', ')}`);
    }

    if (type === 'LOGIN') {
        if (!payload.device || typeof payload.device !== 'string') errors.push('Missing or invalid device');
        if (!payload.ip || typeof payload.ip !== 'string') errors.push('Missing or invalid ip');
    } else if (type === 'LOGOUT') {
        if (!payload.reason || typeof payload.reason !== 'string') errors.push('Missing or invalid reason');
    } else if (type === 'PURCHASE') {
        if (!payload.amount || isNaN(parseFloat(payload.amount)) || parseFloat(payload.amount) <= 0) {
            errors.push('Missing or invalid amount (must be positive number)');
        }
        if (!payload.productId || typeof payload.productId !== 'string') {
            errors.push('Missing or invalid productId');
        }
    } else if (type === 'PROFILE_UPDATE') {
        if (!payload.changedFields || !Array.isArray(payload.changedFields) || payload.changedFields.length === 0) {
            errors.push('Missing or invalid changedFields (must be non-empty array)');
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    try {
        const db = getDB();
        const event = {
            type,
            payload,
            created_at: new Date()
        };
        const result = await db.collection('events').insertOne(event);
        res.status(201).json({ ...event, _id: result.insertedId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getEvents = async (req, res) => {
    const { type, from, to } = req.query;
    const query = {};

    if (type) {
        const types = type.split(',').map(t => t.trim()).filter(t => t);
        if (types.length > 0) {
            query.type = { $in: types };
        }
    }

    if (from || to) {
        query.created_at = {};
        if (from) query.created_at.$gte = new Date(from);
        if (to) query.created_at.$lte = new Date(to);
    }

    try {
        const db = getDB();
        const events = await db.collection('events')
            .find(query)
            .sort({ created_at: -1 })
            .toArray();

        const formattedEvents = events.map(event => ({
            id: event._id.toString(),
            type: event.type,
            payload: event.payload,
            created_at: event.created_at
        }));

        res.json(formattedEvents);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getSummary = async (req, res) => {
    try {
        const db = getDB();
        const events = await db.collection('events').find().toArray();

        let loginCount = 0;
        let logoutCount = 0;
        let purchaseTotalAmount = 0;
        const dayCounts = {};

        events.forEach(event => {
            if (event.type === 'LOGIN') loginCount++;
            if (event.type === 'LOGOUT') logoutCount++;
            if (event.type === 'PURCHASE') {
                purchaseTotalAmount += parseFloat(event.payload.amount || 0);
            }

            const day = new Date(event.created_at).toISOString().split('T')[0];
            dayCounts[day] = (dayCounts[day] || 0) + 1;
        });

        let mostActiveDay = null;
        let maxCount = 0;
        for (const [day, count] of Object.entries(dayCounts)) {
            if (count > maxCount) {
                maxCount = count;
                mostActiveDay = day;
            }
        }

        res.json({
            totalEvents: events.length,
            loginCount,
            logoutCount,
            purchaseTotalAmount: purchaseTotalAmount.toFixed(2),
            mostActiveDay
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};