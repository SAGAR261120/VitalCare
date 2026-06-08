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
  },
  { timestamps: true },
);

appointmentSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
