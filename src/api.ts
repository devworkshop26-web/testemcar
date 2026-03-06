import { AppData, BookingData, defaultAppData } from './localData';

export const API_BASE = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV
  ? '/api'
  : 'https://lucrabe-backend.onrender.com/api');

export const buildApiUrl = (endpoint: string): string => {
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE}${normalizedEndpoint}`;
};

interface LoginResponse {
  success: boolean;
  require2FA: boolean;
}

interface VerifyResponse {
  success: boolean;
  token: string;
}

const jsonHeaders = (token?: string): HeadersInit => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `HTTP ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function fetchContent(): Promise<AppData> {
  try {
    const response = await fetch(buildApiUrl('/content'));
    return await parseResponse<AppData>(response);
  } catch (error) {
    console.error('Failed to load backend content, using defaults.', error);
    return defaultAppData;
  }
}

export async function submitBooking(booking: Omit<BookingData, 'id' | 'createdAt'>): Promise<void> {
  const response = await fetch(buildApiUrl('/book'), {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify(booking),
  });
  await parseResponse<{ success: boolean }>(response);
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(buildApiUrl('/login'), {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({ email, password }),
  });
  return parseResponse<LoginResponse>(response);
}

export async function verifyCode(email: string, code: string): Promise<VerifyResponse> {
  const response = await fetch(buildApiUrl('/verify'), {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({ email, code }),
  });
  return parseResponse<VerifyResponse>(response);
}

export async function saveContentRemote(content: AppData, token: string): Promise<void> {
  const response = await fetch(buildApiUrl('/content'), {
    method: 'POST',
    headers: jsonHeaders(token),
    body: JSON.stringify(content),
  });
  await parseResponse<{ success: boolean }>(response);
}

export async function fetchBookings(token: string): Promise<BookingData[]> {
  const response = await fetch(buildApiUrl('/bookings'), {
    headers: jsonHeaders(token),
  });
  return parseResponse<BookingData[]>(response);
}

export async function changePassword(
  token: string,
  payload: { email: string; currentPassword: string; newPassword: string }
): Promise<void> {
  const response = await fetch(buildApiUrl('/change-password'), {
    method: 'POST',
    headers: jsonHeaders(token),
    body: JSON.stringify(payload),
  });
  await parseResponse<{ success: boolean }>(response);
}
