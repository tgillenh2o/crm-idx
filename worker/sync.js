require('dotenv').config();
const mongoose = require('mongoose');
const { syncPropertiesToDb } = require('../backend/src/services/idxService');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/crmidx';
const INTERVAL_MINUTES = Number(process.env.SYNC_INTERVAL_MINUTES || 10);

async function start() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Worker: connected to Mongo');

  // initial sync
  try {
    console.log('Worker: initial sync start');
    const r = await syncPropertiesToDb();
    console.log('Worker: initial sync result', r);
  } catch (err) {
    console.error('Worker: initial sync error', err);
  }

  setInterval(async () => {
    try {
      console.log('Worker: scheduled sync start');
      const r = await syncPropertiesToDb();
      console.log('Worker: scheduled sync result', r);
    } catch (err) {
      console.error('Worker: scheduled sync error', err);
    }
  }, INTERVAL_MINUTES * 60 * 1000);
}

start().catch(err => { console.error(err); process.exit(1); });
