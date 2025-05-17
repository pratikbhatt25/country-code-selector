import axios from 'axios';
import { generateAccessToken } from './auth';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL!;

export async function postTwoFactorAuth(phone_number: string, country_id: string) {
  const token = await generateAccessToken();
  if (!token) throw new Error('No access token');

  const response = await axios.post(
    `${API_BASE_URL}/challenges/two_factor_auth`,
    null,
    {
      headers: { Authorization: `Bearer ${token}` },
      params: { phone_number, country_id },
    }
  );

  return response.data;
}
