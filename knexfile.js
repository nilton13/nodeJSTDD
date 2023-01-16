module.exports = {
    test:{
        client: 'pg',
        //version: '8.0.3',
        connection:{
            host: 'localhost',
            user: 'postgres',
            password: 'docker',
            database: 'nodejstdd'
        },
        migrations:{ directory: 'src/migrations' },
        seeds: { directory: 'src/seeds' }
    }
}