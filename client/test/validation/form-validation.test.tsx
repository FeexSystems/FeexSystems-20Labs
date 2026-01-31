import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// Import validation schemas (these would be defined in your actual components)
// For this test, I'll define them here as they would appear in the components

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
});

describe('Form Validation Schemas', () => {
  describe('Login Schema', () => {
    it('should validate correct login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should reject invalid email format', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Please enter a valid email address');
        expect(result.error.issues[0].path).toEqual(['email']);
      }
    });

    it('should reject empty email', () => {
      const invalidData = {
        email: '',
        password: 'password123',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Please enter a valid email address');
      }
    });

    it('should reject empty password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password is required');
        expect(result.error.issues[0].path).toEqual(['password']);
      }
    });

    it('should reject missing fields', () => {
      const invalidData = {};

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toHaveLength(2);
        expect(result.error.issues.some(issue => issue.path.includes('email'))).toBe(true);
        expect(result.error.issues.some(issue => issue.path.includes('password'))).toBe(true);
      }
    });
  });

  describe('Registration Schema', () => {
    it('should validate correct registration data', () => {
      const validData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      };

      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should reject empty first name', () => {
      const invalidData = {
        firstName: '',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('First name is required');
        expect(result.error.issues[0].path).toEqual(['firstName']);
      }
    });

    it('should reject empty last name', () => {
      const invalidData = {
        firstName: 'John',
        lastName: '',
        email: 'john@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Last name is required');
        expect(result.error.issues[0].path).toEqual(['lastName']);
      }
    });

    it('should reject invalid email format', () => {
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Please enter a valid email address');
        expect(result.error.issues[0].path).toEqual(['email']);
      }
    });

    it('should reject password shorter than 8 characters', () => {
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Pass1!',
        confirmPassword: 'Pass1!',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password must be at least 8 characters');
        expect(result.error.issues[0].path).toEqual(['password']);
      }
    });

    it('should reject password without uppercase letter', () => {
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123!',
        confirmPassword: 'password123!',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password must contain at least one uppercase letter, one lowercase letter, and one number');
        expect(result.error.issues[0].path).toEqual(['password']);
      }
    });

    it('should reject password without lowercase letter', () => {
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'PASSWORD123!',
        confirmPassword: 'PASSWORD123!',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password must contain at least one uppercase letter, one lowercase letter, and one number');
        expect(result.error.issues[0].path).toEqual(['password']);
      }
    });

    it('should reject password without number', () => {
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password!',
        confirmPassword: 'Password!',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password must contain at least one uppercase letter, one lowercase letter, and one number');
        expect(result.error.issues[0].path).toEqual(['password']);
      }
    });

    it('should reject mismatched passwords', () => {
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123!',
        confirmPassword: 'DifferentPassword123!',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Passwords don't match");
        expect(result.error.issues[0].path).toEqual(['confirmPassword']);
      }
    });

    it('should handle multiple validation errors', () => {
      const invalidData = {
        firstName: '',
        lastName: '',
        email: 'invalid-email',
        password: 'weak',
        confirmPassword: 'different',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(1);
        
        const errorMessages = result.error.issues.map(issue => issue.message);
        expect(errorMessages).toContain('First name is required');
        expect(errorMessages).toContain('Last name is required');
        expect(errorMessages).toContain('Please enter a valid email address');
        expect(errorMessages).toContain('Password must be at least 8 characters');
      }
    });
  });

  describe('Forgot Password Schema', () => {
    it('should validate correct email', () => {
      const validData = {
        email: 'test@example.com',
      };

      const result = forgotPasswordSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should reject invalid email format', () => {
      const invalidData = {
        email: 'invalid-email',
      };

      const result = forgotPasswordSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Please enter a valid email address');
        expect(result.error.issues[0].path).toEqual(['email']);
      }
    });

    it('should reject empty email', () => {
      const invalidData = {
        email: '',
      };

      const result = forgotPasswordSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Please enter a valid email address');
      }
    });
  });

  describe('Reset Password Schema', () => {
    it('should validate correct password reset data', () => {
      const validData = {
        password: 'NewPassword123!',
        confirmPassword: 'NewPassword123!',
      };

      const result = resetPasswordSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should reject password shorter than 8 characters', () => {
      const invalidData = {
        password: 'Pass1!',
        confirmPassword: 'Pass1!',
      };

      const result = resetPasswordSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password must be at least 8 characters');
        expect(result.error.issues[0].path).toEqual(['password']);
      }
    });

    it('should reject password without complexity requirements', () => {
      const invalidData = {
        password: 'simplepassword',
        confirmPassword: 'simplepassword',
      };

      const result = resetPasswordSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password must contain at least one uppercase letter, one lowercase letter, and one number');
        expect(result.error.issues[0].path).toEqual(['password']);
      }
    });

    it('should reject mismatched passwords', () => {
      const invalidData = {
        password: 'Password123!',
        confirmPassword: 'DifferentPassword123!',
      };

      const result = resetPasswordSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Passwords don't match");
        expect(result.error.issues[0].path).toEqual(['confirmPassword']);
      }
    });
  });

  describe('Profile Schema', () => {
    it('should validate correct profile data', () => {
      const validData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      };

      const result = profileSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should reject empty first name', () => {
      const invalidData = {
        firstName: '',
        lastName: 'Doe',
        email: 'john@example.com',
      };

      const result = profileSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('First name is required');
        expect(result.error.issues[0].path).toEqual(['firstName']);
      }
    });

    it('should reject empty last name', () => {
      const invalidData = {
        firstName: 'John',
        lastName: '',
        email: 'john@example.com',
      };

      const result = profileSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Last name is required');
        expect(result.error.issues[0].path).toEqual(['lastName']);
      }
    });

    it('should reject invalid email format', () => {
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
      };

      const result = profileSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Please enter a valid email address');
        expect(result.error.issues[0].path).toEqual(['email']);
      }
    });

    it('should handle multiple validation errors', () => {
      const invalidData = {
        firstName: '',
        lastName: '',
        email: 'invalid-email',
      };

      const result = profileSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBe(3);
        
        const errorMessages = result.error.issues.map(issue => issue.message);
        expect(errorMessages).toContain('First name is required');
        expect(errorMessages).toContain('Last name is required');
        expect(errorMessages).toContain('Please enter a valid email address');
      }
    });
  });

  describe('Edge Cases and Special Characters', () => {
    it('should handle special characters in names', () => {
      const validData = {
        firstName: "O'Connor",
        lastName: 'Smith-Jones',
        email: 'test@example.com',
      };

      const result = profileSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should handle international email domains', () => {
      const validData = {
        email: 'test@example.co.uk',
        password: 'password123',
      };

      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should handle plus signs in email addresses', () => {
      const validData = {
        email: 'test+tag@example.com',
        password: 'password123',
      };

      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should handle long email addresses', () => {
      const validData = {
        email: 'very.long.email.address.with.many.dots@very-long-domain-name.example.com',
        password: 'password123',
      };

      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject email addresses that are too simple', () => {
      const invalidData = {
        email: 'a@b',
        password: 'password123',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should handle unicode characters in names', () => {
      const validData = {
        firstName: 'José',
        lastName: 'García',
        email: 'jose@example.com',
      };

      const result = profileSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should handle very long passwords', () => {
      const longPassword = 'A'.repeat(100) + 'a1';
      const validData = {
        password: longPassword,
        confirmPassword: longPassword,
      };

      const result = resetPasswordSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should handle passwords with special characters', () => {
      const validData = {
        password: 'Password123!@#$%^&*()',
        confirmPassword: 'Password123!@#$%^&*()',
      };

      const result = resetPasswordSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('Type Safety', () => {
    it('should infer correct types from schemas', () => {
      type LoginData = z.infer<typeof loginSchema>;
      type RegisterData = z.infer<typeof registerSchema>;
      type ProfileData = z.infer<typeof profileSchema>;

      const loginData: LoginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const registerData: RegisterData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      };

      const profileData: ProfileData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      };

      expect(loginSchema.parse(loginData)).toEqual(loginData);
      expect(registerSchema.parse(registerData)).toEqual(registerData);
      expect(profileSchema.parse(profileData)).toEqual(profileData);
    });
  });
});