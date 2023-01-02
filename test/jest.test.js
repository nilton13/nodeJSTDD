test('Devo conhecer as principais assertivas do Jest', () =>{
    // Aqui vai a função de fato
    let number = null;
    expect(number).toBeNull();
});

test('Devo saber trabalhar com objetos', () =>{
    const obj = { name: 'Jhon', email: 'jhon@email.com' }
    // Verficando se o obj possui o atributo name
    expect(obj).toHaveProperty('name');
    expect(obj).toHaveProperty('name', 'Jhon'); // Verificando além da propriedade o seu valor
    expect(obj.name).toBe('Jhon');
});