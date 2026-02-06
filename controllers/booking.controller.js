import Booking from "../models/booking.js";
import Car from "../models/car.js";

export const checkAvailability = async (carId, pickupDate, returnDate) => {
  const bookings = await Booking.find({ car: carId, $or: [{ pickupDate: { $lte: returnDate }, returnDate: { $gte: pickupDate } }] });
  return bookings.length === 0;
};

export const checkAvailabilityOfCars = async (req, res) => {
  try {
    const { location, pickupDate, returnDate } = req.body;
    const cars = await Car.find({ location, isAvailable: true });
    const availableCars = await Promise.all(cars.map(async car => {
      const available = await checkAvailability(car._id, pickupDate, returnDate);
      return { ...car._doc, isAvailable: available };
    }));
    res.json({ success: true, availableCars: availableCars.filter(c => c.isAvailable) });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const createBooking = async (req, res) => {
  try {
    const userId = req.user._id;
    const { car: carId, pickupDate, returnDate } = req.body;
    const available = await checkAvailability(carId, pickupDate, returnDate);
    if (!available) return res.json({ success: false, message: "Car not available" });
    const carData = await Car.findById(carId);
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    const noOfDays = Math.ceil((end - start) / (1000*60*60*24));
    const price = carData.pricePerDay * noOfDays;
    await Booking.create({ car: carId, owner: carData.owner, user: userId, pickupDate: start, returnDate: end, price });
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate("car owner");
    res.json({ success: true, bookings });
  } catch { res.json({ success: false }); }
};

export const getOwnerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ owner: req.user._id }).populate("car user");
    res.json({ success: true, bookings });
  } catch { res.json({ success: false }); }
};

export const changeBookingStatus = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const { bookingId, status } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking || booking.owner.toString() !== ownerId.toString()) return res.json({ success: false });
    booking.status = status;
    await booking.save();
    res.json({ success: true });
  } catch { res.json({ success: false }); }
};
