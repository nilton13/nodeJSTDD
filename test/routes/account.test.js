const request = require('supertest');
const app = require('../../src/app');
const jwt = require('jwt-simple');

const MAIN_ROOT = '/v1/accounts';
let user;

beforeAll( async() =>{
    const res = await app.services.user.save({ name: 'User Account', email: `${Date.now()}@mail.com`, password: '123456' });
    user = { ...res[0] };
    user.token = jwt.encode(user,'asjdhajsldmasldmasndandjasldk');
});

test('Deve inserir uma conta com sucesso', () =>{
    return request(app).post(MAIN_ROOT)
        .send({ name: 'Acc #1', user_id: user.id })
        .set('authorization',`bearer ${user.token}`) 
        .then((result) =>{
            expect(result.status).toBe(201)
            expect(result.body.name).toBe('Acc #1')
        });
});

test('Não deve insertir uma conta sem nome', () =>{
    return request(app).post(MAIN_ROOT)
    .send({ user_id: user.id })
    .set('authorization',`bearer ${user.token}`) 
    .then((result) =>{
        expect(result.status).toBe(400)
        expect(result.body.error).toBe('Nome é um atributo obrigatório')
    });
});

test.skip('Não deve inserir uma conta de nome duplicado', () => {});

test('Deve listar todas as contas', () =>{
    return app.db('accounts')
            .insert({ name: 'Acc list', user_id: user.id })
            .then(() => request(app).get(MAIN_ROOT)
            .set('authorization',`bearer ${user.token}`) )
                .then((res) =>{
                    expect(res.status).toBe(200);
                    expect(res.body.length).toBeGreaterThan(0);
                });
}); 

test.skip('Deve listar apenas as contas do usuário', () => {});


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

test.skip('Não deve inserir uma conta de outro usuário', () => {});


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

test.skip('Não deve alterar uma conta de outro usuário', () => {});

test('Deve remover uma conta', () =>{
    return app.db('accounts')
    .insert({ name: 'Acc By Id', user_id: user.id }, ['id'])
    .then(acc => request(app).delete(`${MAIN_ROOT}/${acc[0].id}`)
    .set('authorization',`bearer ${user.token}`) )
        .then((res) =>{
            expect(res.status).toBe(204);
        })
});

