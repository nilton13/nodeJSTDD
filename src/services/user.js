module.exports = (app) =>{
    const findAll = () =>{
        return app.db('users').select();
    };

    const save = async (user) =>{
        if(!user.name) return { error: 'Nome é um atributo obrigatório' }
        if(!user.email) return { error: 'Email é um atributo obrigatório' }
        if(!user.password) return { error: 'Senha é um atributo obrigatório' }

        const userDb = await app.db('users').where({email: user.email}).select();
        
        if(userDb && userDb.length > 0) return { error: 'Já existe um usuário com esse email' }

        return app.db('users').insert(user,'*');
    }

    return { findAll, save }
} 