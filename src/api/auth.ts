import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL!;
const API_KEY = process.env.REACT_APP_API_KEY!;
const CORPORATE_ID = process.env.REACT_APP_CORPORATE_ID!;

export async function generateAccessToken(): Promise<string | null> {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/access_token?corporate_id=${CORPORATE_ID}`,
      null,
      {
        headers: {
          'Api-Key': API_KEY,
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error('Failed to generate token:', error);
    return null;
  }
}
