import axios from 'axios';
import { generateAccessToken } from './auth';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL!;

export interface Country {
  id: string;
  name: string;
  calling_code: string;
  phone_length: string;
}

export async function fetchCountries(): Promise<Record<string, Country> | null> {
  try {
    const token = await generateAccessToken();

    if (!token) throw new Error('Token generation failed');

    const response = await axios.get(`${API_BASE_URL}/challenges/countries`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; // object with country codes as keys
  } catch (error) {
    console.error('Failed to fetch countries:', error);
    return null;
  }
}
