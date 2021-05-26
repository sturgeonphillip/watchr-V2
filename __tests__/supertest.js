const request = require('supertest');
const server = 'http://localhost:8080';

describe('Login Feature', () => {
  describe('/login', () => {
    describe('POST', () => {
      it('responds with 200 status', () => {
          return request(server)
            .post('/login')
            .send(JSON.stringify({username: 'PPPS', password: 'ppps'}))
            .expect(200)
            .expect('Content-Type', "text/plain; charset=utf-8")
    });
  });
});
});
