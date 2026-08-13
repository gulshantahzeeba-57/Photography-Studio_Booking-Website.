const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

let bookings = [];

// 1. New Booking
app.post('/bookings', (req, res) => {
  try {
    const newBooking = {
      _id: Date.now().toString(),
      name: req.body.name || 'N/A',
      email: req.body.email || 'N/A',
      phone: req.body.phone || 'N/A',
      date: req.body.date || 'N/A',
      time: req.body.time || 'N/A',
      category: req.body.category || 'N/A',
      package: req.body.package || 'N/A',
      studio: req.body.studio || 'N/A',
      status: req.body.status || 'Pending'
    };
    
    bookings.push(newBooking);
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ error: "Failed to create booking" });
  }
});

// 2. Get All Bookings
app.get('/bookings', (req, res) => {
  res.status(200).json(bookings);
});

// 3. Get Single Booking
app.get('/bookings/:id', (req, res) => {
  const booking = bookings.find(b => b._id === req.params.id);
  if (!booking) return res.status(404).json({ error: "Booking not found" });
  res.status(200).json(booking);
});

// 4. Update Status
app.patch('/bookings/:id', (req, res) => {
  const booking = bookings.find(b => b._id === req.params.id);
  if (booking) {
    booking.status = req.body.status;
    res.status(200).json(booking);
  } else {
    res.status(404).json({ error: "Booking not found" });
  }
});

// 5. Delete Booking
app.delete('/bookings/:id', (req, res) => {
  bookings = bookings.filter(b => b._id !== req.params.id);
  res.status(200).json({ message: "Booking deleted successfully" });
});

module.exports = app;
