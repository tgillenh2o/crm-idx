require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const teamRoutes = require('./routes/teams');
const inviteRoutes = require('./routes/invites');
const propertyRoutes = require('./routes/properties');
const leadRoutes = require('./routes/leads');

const app = express();
app.use(cors());
app.use(express.json());

// Connect DB with retry mechanism
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/crmidx';

const connectWithRetry = async (retries = 5, delay = 5000) => {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('✅ Mongo connected');
  } catch (err) {
    console.error(`❌ Mongo connection error: ${err.message}`);
    if (retries > 0) {
      console.log(`Retrying in ${delay / 1000} seconds... (${retries} retries left)`);
      setTimeout(() => connectWithRetry(retries - 1, delay), delay);
    } else {
      console.error('Failed to connect to MongoDB. Exiting.');
      process.exit(1);
    }
  }
};

connectWithRetry();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/invites', inviteRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/leads', leadRoutes);

app.get('/', (req, res) => res.send({ ok: true, service: 'crm-idx-backend' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
