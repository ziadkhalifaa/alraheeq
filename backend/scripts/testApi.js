
import axios from 'axios';

async function testApi() {
  try {
    const res = await axios.get('http://localhost:5000/api/inquiries/admin');
    console.log('Response type:', typeof res.data);
    console.log('Is array:', Array.isArray(res.data));
    console.log('Data:', res.data);
  } catch (err) {
    console.error('API Error:', err.message);
  }
}

testApi();
