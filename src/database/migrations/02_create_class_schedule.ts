import Knex from 'knex';

export async function up(knex: Knex) { //Fazer alterações
    return knex.schema.createTable('class_schedule', table => {
        table.increments('id').primary();
        table.integer('week_day').notNullable(); // dia da semana, enumerado de 0(domingo) a 6(sábado)
        table.integer('from').notNullable(); //Horário em que o professor começa a dar suas aulas
        table.integer('to').notNullable();// Horário em que o professor termina de dar suas aulas do dia

        table.integer('class_id')
        .notNullable()
        .references('id')
        .inTable('classes') //Relacionando com a tabela de aulas
        .onUpdate('CASCADE')
    });
}

export async function down(knex: Knex) { //Desfazer alterações
    return knex.schema.dropTable('class_schedule');
}