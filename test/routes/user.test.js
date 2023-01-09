const request = require('supertest');

const app = require('../../src/app');
const jwt = require('jwt-simple');

const mail = `${Date.now()}@email.com`;

//Criando usuário antes de qualquer test
let user;

beforeAll( async() =>{
    const res = await app.services.user.save({ name: 'User Account', email: `${Date.now()}@mail.com`, password: '123456' });
    user = { ...res[0] };
    user.token = jwt.encode(user,'asjdhajsldmasldmasndandjasldk');
});

test('Deve listar todos o usuários', () =>{
    return request(app).get('/users')
        .set('authorization',`bearer ${user.token}`) // Adicionando token a requisição
        .then((res) =>{
            expect(res.status).toBe(200);
            expect(res.body.length).toBeGreaterThan(0)
            //expect(res.body[0]).toHaveProperty('name','Jhon Doe');
        })
});

test('Deve inserir usuário com sucesso', () =>{
    return request(app).post('/users')
        .send({ name:'Walter Mitty', email: mail,password:'123456' })
        .set('authorization',`bearer ${user.token}`)
        .then((res) =>{
            expect(res.status).toBe(201);
            expect(res.body.name).toBe('Walter Mitty');
            expect(res.body).not.toHaveProperty('password');
        })  
});

test('Deve armazenar uma senha criptograda', async () =>{
    const res = await request(app).post('/users')
        .send({ name:'Walter Mitty', email: `${Date.now()}@email.com`,password:'123456' })
        .set('authorization',`bearer ${user.token}`)
    expect(res.status).toBe(201);

    const { id } = res.body;
    const userDb = await app.services.user.findOne({ id });
    expect(userDb.password).not.toBeUndefined();
    expect(userDb.password).not.toBe('123456');
})

//Testes de validação de usuário
test('Não deve inserir usuário sem nome', () => {
    return request(app).post('/users')
        .send({ email: 'nilton@teste.com', password: '123456' })
        .set('authorization',`bearer ${user.token}`)
        .then((res) =>{
            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Nome é um atributo obrigatório');
        })
});

test('Não deve inserir usuário sem email', async () =>{
    const result = await request(app).post('/users')
        .send({ name:'Walter Mitty', password:'123456' })
        .set('authorization',`bearer ${user.token}`)
        expect(result.status).toBe(400);
        expect(result.body.error).toBe('Email é um atributo obrigatório')
});

test('Não deve inserir usuário sem senha', (done) => {
    request(app).post('/users')
        .send({ name:'Walter Mitty', email: 'nilton@teste.com'})
        .set('authorization',`bearer ${user.token}`)
        .then((res) =>{
            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Senha é um atributo obrigatório');
            done();
        })

});

test('Não deve inserir usuário com Email existente',() =>{
    return request(app).post('/users')
        .send({ name:'Walter Mitty', email: mail,password:'123456' })
        .set('authorization',`bearer ${user.token}`)
        .then((res) =>{
            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Já existe um usuário com esse email');
        })  
});