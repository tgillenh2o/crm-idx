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

// Connect DB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/crmidx';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Mongo connected'))
  .catch(err => {
    console.error('Mongo connection error', err);
    process.exit(1);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/invites', inviteRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/leads', leadRoutes);

app.get('/', (req, res) => res.send({ ok: true, service: 'crm-idx-backend' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
