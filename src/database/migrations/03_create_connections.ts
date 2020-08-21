import Knex from 'knex';

export async function up(knex: Knex) { //Fazer alterações
    return knex.schema.createTable('connections', table => {
        table.increments('id').primary();
        

        table.integer('user_id')
        .notNullable()
        .references('id')
        .inTable('users') //Relacionando com a tabela de aulas
        .onUpdate('CASCADE')

        table.timestamp('created_at') //Registra quando a conexão foi feita/criada
        .defaultTo(knex.raw('CURRENT_TIMESTAMP')) //Pega o horário atual que o registro está sendo criado e salva no campo 'created_at
        .notNullable()
    });
}

export async function down(knex: Knex) { //Desfazer alterações
    return knex.schema.dropTable('connections');
}


/* Connections: Armazena a seguinte informação: se o usuário tentou entrar em contato com o professor (ao
    clicar no botão Whatsapp) */