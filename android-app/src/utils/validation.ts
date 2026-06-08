import { z } from 'zod';

export const phoneSchema = z
  .string()
  .min(10, 'Phone number must be 10 digits')
  .max(10, 'Phone number must be 10 digits')
  .regex(/^[6-9]\d{9}$/, 'Enter a valid Indian mobile number');

export const loginSchema = z.object({
  phone: phoneSchema,
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
});

export const otpSchema = z.object({
  otp: z
    .string()
    .length(4, 'OTP must be 4 digits')
    .regex(/^\d{4}$/, 'OTP must contain only numbers'),
});

export const registerSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Enter a valid email address'),
  phone: phoneSchema,
  gender: z.string().min(1, 'Please select gender'),
  pinCode: z
    .string()
    .length(6, 'PIN code must be 6 digits')
    .regex(/^\d{6}$/, 'Enter a valid PIN code'),
  state: z.string().min(1, 'Please select state'),
  district: z.string().min(1, 'Please select district'),
  city: z.string().min(1, 'Please select city'),
  termsAccepted: z
    .boolean()
    .refine(val => val === true, 'You must accept the terms and conditions'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type OtpFormData = z.infer<typeof otpSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
