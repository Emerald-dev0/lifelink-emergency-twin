export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isStrongPassword(password: string): { valid: boolean; reasons: string[] } {
  const reasons: string[] = [];
  if (password.length < 8) reasons.push('At least 8 characters');
  if (!/[A-Z]/.test(password)) reasons.push('One uppercase letter');
  if (!/[a-z]/.test(password)) reasons.push('One lowercase letter');
  if (!/[0-9]/.test(password)) reasons.push('One number');
  return { valid: reasons.length === 0, reasons };
}

export function isValidPhone(phone: string): boolean {
  return /^\+?[\d\s\-()]{7,20}$/.test(phone);
}

export function isValidBloodType(type: string): type is 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' {
  return ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].includes(type);
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone;
}

export function sanitizeString(input: string): string {
  return input.replace(/[<>&"']/g, (char) => {
    const map: Record<string, string> = { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#x27;' };
    return map[char] || char;
  });
}