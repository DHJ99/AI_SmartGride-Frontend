import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number, decimals: number = 2): string {
  if (isNaN(num)) return '0'
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number,
  immediate?: boolean
): T {
  let timeout: NodeJS.Timeout | null = null
  
  return ((...args: Parameters<T>) => {
    const later = () => {
      timeout = null
      if (!immediate) func(...args)
    }
    
    const callNow = immediate && !timeout
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    
    if (callNow) func(...args)
  }) as T
}

export function getRandomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'online':
    case 'active':
    case 'success':
    case 'good':
      return 'text-green-600 dark:text-green-400'
    case 'offline':
    case 'inactive':
    case 'error':
    case 'critical':
      return 'text-red-600 dark:text-red-400'
    case 'warning':
    case 'maintenance':
      return 'text-yellow-600 dark:text-yellow-400'
    case 'pending':
    case 'processing':
      return 'text-blue-600 dark:text-blue-400'
    default:
      return 'text-gray-600 dark:text-gray-400'
  }
}

export function getStatusBgColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'online':
    case 'active':
    case 'success':
    case 'good':
      return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200'
    case 'offline':
    case 'inactive':
    case 'error':
    case 'critical':
      return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
    case 'warning':
    case 'maintenance':
      return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200'
    case 'pending':
    case 'processing':
      return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200'
    default:
      return 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-200'
  }
}