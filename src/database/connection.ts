import knex from 'knex';
import path from 'path';

const db = knex({
    client: 'sqlite3',
    connection: {
        filename: path.resolve(__dirname, 'database.sqlite') 
    },
    
    useNullAsDefault: true, //utiliza nulo quando não consegue definir um campo padrão no BD
});

export default db;

/*__dirname retorna qual diretório está o arquivo em que o __dirname está sendo executado, ou seja,
 diretório database */