require('dotenv').config();



const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Models
const User = require('./models/User');
const Lead = require('./models/Lead');
const Property = require('./models/Property');
const Team = require('./models/Team');
const Invite = require('./models/Invite');

// Routes
const authRoutes = require('./routes/auth');
const leadRoutes = require('./routes/leads');
const propertyRoutes = require('./routes/properties');
const teamRoutes = require('./routes/teams');
const inviteRoutes = require('./routes/invites');

dotenv.config();

const app = express();

// ✅ TEMP: Open CORS for all requests (for testing)
app.use(cors({
  origin: [
    'https://crm-idx-frontend.onrender.com',
    'https://crm-idx.onrender.com'
  ],
  credentials: true,
}));



app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/invites', inviteRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('CRM IDX Backend is running!');
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend API is live" });
});


// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
})
.catch((err) => console.error('MongoDB connection error:', err));
