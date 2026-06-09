const { body } = require('express-validator');

module.exports = {
  bookAppointment: [
    body('date').notEmpty().withMessage('Appointment date is required'),
    body('time').trim().notEmpty().withMessage('Appointment time is required'),
    body('healthPackage').optional().isMongoId(),
    body('specialist').optional().isMongoId(),
    body('doctorName').optional().isString(),
    body('specialty').optional().isString(),
    body('hospital').optional().isString(),
    body('notes').optional().isString(),
    body('patientDetails.fullName').optional().trim().notEmpty(),
    body('patientDetails.age').optional().isInt({ min: 1, max: 120 }),
    body('patientDetails.gender').optional().isString(),
    body('patientDetails.relationship').optional().isString(),
    body('patientDetails.address').optional().isString(),
    body('patientDetails.city').optional().isString(),
    body('patientDetails.landmark').optional().isString(),
    body('patientDetails.pincode').optional().isString(),
    body('patientDetails.state').optional().isString(),
    body('patientDetails.district').optional().isString(),
  ],
};
