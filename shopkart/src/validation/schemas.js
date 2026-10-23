import { z } from 'zod'

/* ---------------------------------- API ---------------------------------- */

export const apiRatingSchema = z.object({
  rate: z.number().min(0).max(5),
  count: z.number().int().min(0),
})

export const apiProductSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
  price: z.number().positive(),
  description: z.string(),
  category: z.string().min(1),
  image: z.string().min(1),
  rating: apiRatingSchema,
})

export const apiProductListSchema = z.array(apiProductSchema)

const apiUserNameSchema = z.object({
  firstname: z.string().min(1),
  lastname: z.string().min(1),
})

export const apiUserSchema = z.object({
  id: z.number().int().positive(),
  email: z.email(),
  username: z.string().min(1),
  password: z.string().min(1),
  name: apiUserNameSchema,
})

export const apiUserListSchema = z.array(apiUserSchema)

export const apiTokenSchema = z.object({
  token: z.string().min(1),
})

/* --------------------------------- Forms --------------------------------- */

export const loginSchema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
})

export const signupSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters'),
    email: z.email('Enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
    acceptTerms: z.literal(true, {
      error: 'You must accept the terms and conditions',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })

export const forgotPasswordSchema = z.object({
  email: z.email('Enter a valid email address'),
})

export const couponSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, 'Enter a coupon code')
    .max(24, 'Coupon code is too long'),
})

export const checkoutSchema = z.object({
  fullName: z.string().trim().min(2, 'Enter your full name'),
  email: z.email('Enter a valid email address'),
  address: z.string().trim().min(5, 'Enter a valid street address'),
  city: z.string().trim().min(2, 'Enter a valid city'),
  postalCode: z
    .string()
    .trim()
    .min(3, 'Enter a valid postal code')
    .max(12, 'Enter a valid postal code'),
  country: z.string().trim().min(2, 'Select or enter a country'),
})
