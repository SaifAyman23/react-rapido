/**
 * Email validation
 * @param email - Email address to validate
 * @returns true if email is valid, false otherwise
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Password strength validation
 * @param password - Password to validate
 * @returns Object with isValid flag and strength level
 */
export const validatePassword = (
  password: string
): {
  isValid: boolean
  strength: 'weak' | 'fair' | 'good' | 'strong'
} => {
  const length = password.length
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  let strength: 'weak' | 'fair' | 'good' | 'strong' = 'weak'
  let isValid = false

  if (length < 6) {
    strength = 'weak'
  } else if (length >= 6 && length < 8) {
    strength = 'fair'
    isValid = hasUpperCase && hasLowerCase
  } else if (length >= 8 && length < 12) {
    const score = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length
    if (score >= 3) {
      strength = 'good'
      isValid = true
    } else {
      strength = 'fair'
      isValid = hasUpperCase && hasLowerCase
    }
  } else {
    const score = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length
    if (score >= 3) {
      strength = 'strong'
      isValid = true
    } else {
      strength = 'good'
      isValid = hasUpperCase && hasLowerCase
    }
  }

  return { isValid, strength }
}

/**
 * Validate name (no numbers or special characters)
 * @param name - Name to validate
 * @returns true if name is valid
 */
export const validateName = (name: string): boolean => {
  return name.length >= 2 && /^[a-zA-Z\s]+$/.test(name)
}
