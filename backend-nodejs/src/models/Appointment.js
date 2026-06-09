const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    healthPackage: { type: mongoose.Schema.Types.ObjectId, ref: 'HealthPackage' },
    specialist: { type: mongoose.Schema.Types.ObjectId, ref: 'Specialist' },
    doctorName: { type: String },
    specialty: { type: String },
    hospital: { type: String },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    status: {
      type: String,
      enum: ['upcoming', 'completed', 'cancelled', 'pending'],
      default: 'pending',
    },
    notes: { type: String },
    patientDetails: {
      fullName: { type: String },
      age: { type: Number },
      gender: { type: String },
      relationship: { type: String },
      address: { type: String },
      city: { type: String },
      landmark: { type: String },
      pincode: { type: String },
      state: { type: String },
      district: { type: String },
    },
  },
  { timestamps: true },
);

appointmentSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
