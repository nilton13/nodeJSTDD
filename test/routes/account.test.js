const request = require('supertest');
const app = require('../../src/app');
const jwt = require('jwt-simple');

const MAIN_ROOT = '/v1/accounts';
let user;
let user2;

//Irá criar usuário antes de Todos os Testes
// beforeAll( async() =>{
//     const res = await app.services.user.save({ name: 'User Account', email: `${Date.now()}@mail.com`, password: '123456' });
//     user = { ...res[0] };
//     user.token = jwt.encode(user,'asjdhajsldmasldmasndandjasldk');
//     const res2 = await app.services.user.save({ name: 'User Account2', email: `${Date.now()}@mail.com`, password: '123456' });
//     user2 = { ...res2[0] };
// });

//Irá criar um usuário para cada teste
beforeEach( async() =>{
    const res = await app.services.user.save({ name: 'User Account', email: `${Date.now()}@mail.com`, password: '123456' });
    user = { ...res[0] };
    user.token = jwt.encode(user,'asjdhajsldmasldmasndandjasldk');
    const res2 = await app.services.user.save({ name: 'User Account2', email: `${Date.now()}@mail.com`, password: '123456' });
    user2 = { ...res2[0] };
});

test('Deve inserir uma conta com sucesso', () =>{
    return request(app).post(MAIN_ROOT)
        .send({ name: 'Acc #1' })
        .set('authorization',`bearer ${user.token}`) 
        .then((result) =>{
            expect(result.status).toBe(201)
            expect(result.body.name).toBe('Acc #1')
        });
});

test('Não deve insertir uma conta sem nome', () =>{
    return request(app).post(MAIN_ROOT)
    .send({ })
    .set('authorization',`bearer ${user.token}`) 
    .then((result) =>{
        expect(result.status).toBe(400)
        expect(result.body.error).toBe('Nome é um atributo obrigatório')
    });
});

test('Não deve retornar uma conta de outro usuário', () => {
    return app.db('accounts')
    .insert({ name: 'Acc User #2', user_id: user2.id }, ['id'])
    .then(acc => request(app).get(`${MAIN_ROOT}/${acc[0].id}`)
    .set('authorization',`bearer ${user.token}`))
    .then((res) =>{
        expect(res.status).toBe(403);
        expect(res.body.error).toBe('Este recurso não pertence ao usuário');
    })
});

test('Deve listar apenas as contas do usuário', () => {
    return app.db('accounts').insert([
        { name: 'Acc User #1',user_id: user.id },
        { name: 'Acc User #2',user_id: user2.id },
    ]).then(() => request(app).get(MAIN_ROOT)
        .set('authorization',`bearer ${user.token}`) )
                .then((res) =>{
                    expect(res.status).toBe(200);
                    expect(res.body.length).toBe(1);
                    expect(res.body[0].name).toBe('Acc User #1')
                });
});


test('Deve retornar uma conta por Id', () =>{
    return app.db('accounts')
        .insert({ name: 'Acc By Id', user_id: user.id }, ['id'])
        .then(acc => request(app).get(`${MAIN_ROOT}/${acc[0].id}`)
        .set('authorization',`bearer ${user.token}`) )
            .then((res) =>{
                expect(res.status).toBe(200);
                expect(res.body.name).toBe('Acc By Id');
                expect(res.body.user_id).toBe(user.id);
            })
});

test('Não deve inserir uma conta de nome duplicado , para o mesmo usuário', () => {
    return app.db('accounts').insert({ name: 'Acc duplicada', user_id: user.id })
        .then(() => request(app).post(MAIN_ROOT)
        .set('authorization',`bearer ${user.token}`) 
        .send({ name: 'Acc duplicada' }))
        .then((res) => {
            expect(res.status).toBe(400)
            expect(res.body.error).toBe('Já existe um conta com esse nome')
        })
});


test('Deve alterar uma conta', () =>{
    return app.db('accounts')
        .insert({ name: 'Acc To Update', user_id: user.id }, ['id'])
        .then( acc => request(app).put(`${MAIN_ROOT}/${acc[0].id}`)
        .set('authorization',`bearer ${user.token}`) 
            .send({ name: 'Acc Updated' }))
            .then((res) => {
                expect(res.status).toBe(200);
                expect(res.body.name).toBe('Acc Updated');
            });
});

test('Não deve alterar uma conta de outro usuário', () => {
    return app.db('accounts')
    .insert({ name: 'Acc User #2', user_id: user2.id }, ['id'])
    .then(acc => request(app).put(`${MAIN_ROOT}/${acc[0].id}`)
    .send({ name: 'Acc Updated' })
    .set('authorization',`bearer ${user.token}`))
    .then((res) =>{
        expect(res.status).toBe(403);
        expect(res.body.error).toBe('Este recurso não pertence ao usuário');
    })
});

test('Deve remover uma conta', () =>{
    return app.db('accounts')
    .insert({ name: 'Acc By Id', user_id: user.id }, ['id'])
    .then(acc => request(app).delete(`${MAIN_ROOT}/${acc[0].id}`)
    .set('authorization',`bearer ${user.token}`) )
        .then((res) =>{
            expect(res.status).toBe(204);
        })
});

test('Não deve remover uma conta de outro usuário', () => {
    return app.db('accounts')
    .insert({ name: 'Acc User #2', user_id: user2.id }, ['id'])
    .then(acc => request(app).delete(`${MAIN_ROOT}/${acc[0].id}`)
    .set('authorization',`bearer ${user.token}`))
    .then((res) =>{
        expect(res.status).toBe(403);
        expect(res.body.error).toBe('Este recurso não pertence ao usuário');
    })
});
