const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

// In-Memory Storage (Bina kisi database ke)
let bookings = [];

// --- ROUTES ---

// 1. User Form Submit karega
app.post('/bookings', (req, res) => {
  try {
    const newBooking = {
      _id: Date.now().toString(), // Simple unique ID
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      date: req.body.date,
      time: req.body.time,
      category: req.body.category,
      package: req.body.package,
      studio: req.body.studio,
      status: req.body.status || 'Pending'
    };
    
    bookings.push(newBooking);
    res.status(201).json({ message: "Booking Request Sent!", booking: newBooking });
  } catch (error) {
    res.status(500).json({ error: "Failed to create booking" });
  }
});

// 2. Admin Dashboard Bookings Fetch karega
app.get('/bookings', (req, res) => {
  res.status(200).json(bookings);
});

// 3. Single Booking View karne ke liye
app.get('/bookings/:id', (req, res) => {
  const booking = bookings.find(b => b._id === req.params.id);
  if (!booking) return res.status(404).json({ error: "Booking not found" });
  res.status(200).json(booking);
});

// 4. Status Update (Approve)
app.patch('/bookings/:id', (req, res) => {
  const booking = bookings.find(b => b._id === req.params.id);
  if (booking) {
    booking.status = req.body.status;
    res.status(200).json(booking);
  } else {
    res.status(404).json({ error: "Booking not found" });
  }
});

// 5. Booking Delete (Reject)
app.delete('/bookings/:id', (req, res) => {
  bookings = bookings.filter(b => b._id !== req.params.id);
  res.status(200).json({ message: "Booking deleted successfully" });
});

module.exports = app;

if (process.env.NODE_ENV !== 'production') {
  app.listen(3000, () => console.log('Server running on port 3000'));
}
