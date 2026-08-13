const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Database Connection (MongoDB Atlas URI paste karein)
const MONGO_URI = process.env.MONGO_URI || "YOUR_MONGODB_ATLAS_CONNECTION_STRING";

mongoose.connect(MONGO_URI)
  .then(() => console.log("Database Connected Successfully"))
  .catch(err => console.error("Database Connection Error:", err));

// Booking Model Schema
const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  date: String,
  service: String,
  status: { type: String, default: 'Pending' }
});

const Booking = mongoose.model('Booking', bookingSchema);

// --- ROUTES ---

// 1. User Form Submit karega (New Booking)
app.post('/bookings', async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    await newBooking.save();
    res.status(201).json({ message: "Booking Request Sent!", booking: newBooking });
  } catch (error) {
    res.status(500).json({ error: "Failed to create booking" });
  }
});

// 2. Admin Panel Bookings Fetch karega
app.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// 3. Admin Accept ya Reject karega (Status Update)
app.put('/bookings/:id', async (req, res) => {
  try {
    const { status } = req.body; // 'Accepted' ya 'Rejected'
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(500).json({ error: "Failed to update status" });
  }
});

// Export app for Vercel Serverless Function
module.exports = app;

// Local Development
if (process.env.NODE_ENV !== 'production') {
  app.listen(3000, () => console.log('Server running on port 3000'));
}
