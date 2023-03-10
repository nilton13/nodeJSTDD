module.exports = (app) => {
    const find = (userId, filter = {}) =>{
        return app.db('transactions')
            .join('accounts', 'accounts.id', 'acc_id')
            .where(filter)
            .andWhere('accounts.user_id', '=', userId)
            .select();
    };

    const findOne = (filter) => {
        return app.db('transactions')
                .where(filter)
                .first();
    };

    const save = (transaction) => {

        if((transaction.type === 'I' && transaction.ammount < 0) ||
        (transaction.type === 'O' && transaction.ammount > 0)){
            transaction.ammount *= -1;  
        }

        return app.db('transactions')
            .insert(transaction,"*");
    };

    const update = (id, transaction) => {
        return app.db('transactions')
            .where({ id })
            .update(transaction,'*');
    }

    const remove = (id) => {
        return app.db('transactions')
            .where({ id })
            .del();
    }

    return { find, save,findOne,update, remove }
}