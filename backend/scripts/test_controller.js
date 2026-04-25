import { updatePageContent } from '../controllers/pageContentController.js';

const mockReq = {
  params: { slug: 'home' },
  body: {
    content_key: 'test_key',
    value: { test: 'value' },
    language: 'en'
  }
};

const mockRes = {
  status: function(code) { this.statusCode = code; return this; },
  json: function(data) { this.data = data; console.log('Response:', data); }
};

updatePageContent(mockReq, mockRes).then(() => {
  console.log('Finished test');
});
