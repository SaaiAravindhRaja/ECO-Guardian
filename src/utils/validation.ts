// Validation utilities for forms and user input

export class ValidationService {
  static validateEmail(email: string): { isValid: boolean; error?: string } {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
      return { isValid: false, error: 'Email is required' };
    }
    
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Please enter a valid email address' };
    }
    
    return { isValid: true };
  }

  static validatePassword(password: string): { isValid: boolean; error?: string } {
    if (!password) {
      return { isValid: false, error: 'Password is required' };
    }
    
    if (password.length < 6) {
      return { isValid: false, error: 'Password must be at least 6 characters long' };
    }
    
    return { isValid: true };
  }

  static validateDisplayName(name: string): { isValid: boolean; error?: string } {
    if (!name) {
      return { isValid: false, error: 'Display name is required' };
    }
    
    if (name.length < 2) {
      return { isValid: false, error: 'Display name must be at least 2 characters long' };
    }
    
    if (name.length > 30) {
      return { isValid: false, error: 'Display name must be less than 30 characters' };
    }
    
    // Check for inappropriate characters
    const validNameRegex = /^[a-zA-Z0-9\s\-_]+$/;
    if (!validNameRegex.test(name)) {
      return { isValid: false, error: 'Display name contains invalid characters' };
    }
    
    return { isValid: true };
  }

  static validatePasswordMatch(password: string, confirmPassword: string): { isValid: boolean; error?: string } {
    if (password !== confirmPassword) {
      return { isValid: false, error: 'Passwords do not match' };
    }
    
    return { isValid: true };
  }

  static validateLocation(latitude: number, longitude: number): { isValid: boolean; error?: string } {
    if (latitude < -90 || latitude > 90) {
      return { isValid: false, error: 'Invalid latitude' };
    }
    
    if (longitude < -180 || longitude > 180) {
      return { isValid: false, error: 'Invalid longitude' };
    }
    
    return { isValid: true };
  }

  static sanitizeInput(input: string): string {
    // Remove potentially harmful characters
    return input.replace(/[<>\"']/g, '').trim();
  }

  static validateCreatureName(name: string): { isValid: boolean; error?: string } {
    if (!name) {
      return { isValid: false, error: 'Creature name is required' };
    }
    
    if (name.length > 50) {
      return { isValid: false, error: 'Creature name is too long' };
    }
    
    return { isValid: true };
  }

  static validateChallengeInput(input: string): { isValid: boolean; error?: string } {
    if (!input) {
      return { isValid: false, error: 'Input is required' };
    }
    
    if (input.length > 500) {
      return { isValid: false, error: 'Input is too long' };
    }
    
    return { isValid: true };
  }
}