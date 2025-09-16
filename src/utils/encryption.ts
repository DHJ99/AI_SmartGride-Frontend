export const encryptSensitiveData = async (data: unknown): Promise<string | null> => {
  try {
    const jsonString = JSON.stringify(data)
    const encoded = btoa(jsonString)
    return encoded
  } catch (error) {
    console.error('Encryption failed:', error)
    return null
  }
}

export const decryptSensitiveData = async (encryptedData: string): Promise<unknown | null> => {
  try {
    const decoded = atob(encryptedData)
    return JSON.parse(decoded) as unknown
  } catch (error) {
    console.error('Decryption failed:', error)
    return null
  }
}

export const generateSecureToken = (): string => {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

export const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash), b => b.toString(16).padStart(2, '0')).join('')
}

export const generateSessionId = (): string => {
  return `sess_${generateSecureToken()}`
}

export const maskSensitiveData = (data: string, visibleChars = 4): string => {
  if (!data || data.length <= visibleChars) return data
  const masked = '*'.repeat(data.length - visibleChars)
  return masked + data.slice(-visibleChars)
}


