const request = require('supertest');

const app = require('../../src/app');

const mail = `${Date.now()}@email.com`;

test('Deve listar todos o usuários', () =>{
    return request(app).get('/users')
        .then((res) =>{
            expect(res.status).toBe(200);
            expect(res.body.length).toBeGreaterThan(0)
            //expect(res.body[0]).toHaveProperty('name','Jhon Doe');
        })
});

test('Deve inserir usuário com sucesso', () =>{
    return request(app).post('/users')
        .send({ name:'Walter Mitty', email: mail,password:'123456' })
        .then((res) =>{
            expect(res.status).toBe(201);
            expect(res.body.name).toBe('Walter Mitty');
        })  
});

//Testes de validação de usuário
test('Não deve inserir usuário sem nome', () => {
    return request(app).post('/users')
        .send({ email: 'nilton@teste.com', password: '123456' })
        .then((res) =>{
            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Nome é um atributo obrigatório');
        })
});

test('Não deve inserir usuário sem email', async () =>{
    const result = await request(app).post('/users')
        .send({ name:'Walter Mitty', password:'123456' });
    
        expect(result.status).toBe(400);
        expect(result.body.error).toBe('Email é um atributo obrigatório')
});

test('Não deve inserir usuário sem senha', (done) => {
    request(app).post('/users')
        .send({ name:'Walter Mitty', email: 'nilton@teste.com'})
        .then((res) =>{
            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Senha é um atributo obrigatório');
            done();
        })

});

test('Não deve inserir usuário com Email existente',() =>{
    return request(app).post('/users')
        .send({ name:'Walter Mitty', email: mail,password:'123456' })
        .then((res) =>{
            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Já existe um usuário com esse email');
        })  
});