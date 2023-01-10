module.exports = function RecursoIndevidoError(message = 'Esse recurso não pertence ao usuário'){
    this.name = 'RecursoIndevidoError';
    this.message = message;
}