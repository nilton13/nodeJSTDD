const request = require('supertest');

const app = require('../src/app');

test('Deve responder na raiz',() =>{
    return request(app).get('/') // Dessa forma o teste passa sem nem mesmo o aplicação estar rodando.
        .then(res =>{
            expect(res.status).toBe(200);
        });
});