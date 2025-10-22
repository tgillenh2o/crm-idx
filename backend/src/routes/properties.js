const express = require('express');
const Property = require('../models/property');
const auth = require('../middleware/auth');
const { syncPropertiesToDb } = require('../services/idxService');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const q = {};
    if (req.query.city) q['address.city'] = req.query.city;
    if (req.query.minPrice) q.price = { $gte: Number(req.query.minPrice) };
    if (req.query.status) q.status = req.query.status;
    const props = await Property.find(q).limit(200).lean();
    res.json(props);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const p = await Property.create({ ...req.body, source: 'manual' });
    res.json(p);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

router.post('/sync', auth, async (req, res) => {
  try {
    if (!['admin','teamAdmin'].includes(req.user.role)) return res.status(403).json({ message: 'Only admin/teamAdmin can trigger sync' });
    const result = await syncPropertiesToDb();
    res.json({ ok: true, result });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Sync failed' }); }
});

module.exports = router;
