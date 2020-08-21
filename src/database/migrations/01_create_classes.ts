import Knex from 'knex';

export async function up(knex: Knex) { //Fazer alterações
    return knex.schema.createTable('classes', table => {
        table.increments('id').primary();
        table.string('subject').notNullable(); // matéria
        table.decimal('cost').notNullable(); //custo da hora/aula

        table.integer('user_id') //Referenciando o campo id
        .notNullable()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE') // Caso alguma informação seja atualizada, será feito em cascata
        .onDelete('CASCADE') // Caso o professor seja deletado da plataforma, suas aulas também serão
    });
}

export async function down(knex: Knex) { //Desfazer alterações
    return knex.schema.dropTable('classes');
}