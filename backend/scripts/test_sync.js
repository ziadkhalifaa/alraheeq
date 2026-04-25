import axios from 'axios';

async function testSync() {
  try {
    const res = await axios.put('http://localhost:5000/api/pages/home/content', {
      content_key: 'home.categories.c4Img',
      value: { src: 'http://localhost:5000/uploads/general/instapay.webp' },
      language: 'en'
    });
    console.log('Success:', res.data);
  } catch (err) {
    console.error('Error:', err.response?.data || err.message);
  }
}

testSync();
