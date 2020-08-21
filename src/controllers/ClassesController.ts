import { Request, Response } from 'express';
import db from '../database/connection';
import convertHoursToMinutes from '../utils/convertHoursToMinutes';


interface ScheduleItem {
    week_day: number;
    from: string;
    to: string;
}

export default class ClassesController {
    async index(request: Request, response: Response) { //Listagem das aulas
        const filters = request.query;

        //criando variáveis para definir os formatos
        const week_day = filters.week_day as string;
        const subject = filters.subject as string;
        const time = filters.time as string; //Utilizando o 'as string' informo que o filters.time é uma string

        if(!filters.week_day || !filters.subject || !filters.time) { //Se o usuário não informou dia da semana, matéria ou horário que ele quer marcar a aula, retorna erro
            return response.status(400).json({
                error: 'Missing filters to search classes'
            });
        }

        const timeInMinutes = convertHoursToMinutes(time) 
        
        //Listando as aulas
        const classes = await db('classes')
            .whereExists(function() { //Verificar a disponibilidade de horários
                this.select('class_schedule.*')
                  .from('class_schedule')
                  .whereRaw('`class_schedule`.`class_id` = `classes`.`id`') //whereRaw, mais recomendado nesse caso pela documentação do Knex
                  .whereRaw('`class_schedule`.`week_day` = ??', [Number(week_day)]) //Buscar o dia da semana que é igual ao que está sendo filtrado
                  .whereRaw('`class_schedule`.`from` <= ??', [timeInMinutes]) //Para marcar uma aula, o profesor deve estar dentro do horário dele
                  .whereRaw('`class_schedule`.`to` > ??', [timeInMinutes]) //Não posso marcar aula no mesmo horário de término da aula, ou seja, se um professor para de atender 11h, não posso marcar uma aula neste horário, por isso não há o sinal '='

            })

            .where('classes.subject', '=', subject)
            .join('users', 'classes.user_id', '=', 'users.id') //inner join
            .select(['classes.*', 'users.*']); //selecionar todos os dados de classes e de users

        return response.json(classes);
    }

    async create(request: Request, response: Response) {
        const { //Fragmentando a variável
            name,
            avatar,
            whatsapp,
            bio,
            subject,
            cost,
            schedule
        } = request.body;
    
        const trx = await db.transaction(); // Faz todas as operações do db ao mesmo tempo
    
        try { //tratamento de erro
            const insertedUsersIds = await trx('users').insert({
                name,
                avatar,
                whatsapp,
                bio,
            });
        
            const user_id = insertedUsersIds[0]; //Pega o user_id na posição 0, tenho apenas um 'array' em insertedUserIds. Desta forma, faço o relacionamento
        
            const insertedClassesIds = await trx('classes').insert({
                subject,
                cost,
                user_id, //Foreign Key
            });
        
            const class_id = insertedClassesIds[0]; //retorna o id da aula inserido acima
        
            //percorrendo o array do schedule através do .map
            const classSchedule = schedule.map((scheduleItem: ScheduleItem) => { //Criei uma interface e passei por parâmetro para identificar o formato dos objetos
                return {
                    class_id, //Foreign key
                    week_day: scheduleItem.week_day,
                    from: convertHoursToMinutes(scheduleItem.from),
                    to: convertHoursToMinutes(scheduleItem.to)
                };
            })
        
            await trx('class_schedule').insert(classSchedule); //Não precisei passar o insert como array, pois acima já deixei no formato que o banco espera
        
            await trx.commit(); // Aqui é onde commita todas as operações ao mesmo tempo no BD
        
            return response.status(201).send(); //retorna status de 'criado com sucesso'
        } catch(err) { //caso dê algum erro
            console.log(err);
            
            await trx.rollback(); //Desfaz qualquer alteração que tenha acontecido no banco nesse contexto(codigo acima)
    
            return response.status(400).json({ //Aqui estou retornando uma bad request(400) e uma mensagem de erro em formato json
                error: 'Unexpected error while creating new class'
            })
        }
    }
}

/* Este conteúdo estava sendo desenvolvido dentro do arquivo routes.ts em routes.post,
 porém criei um controller e trouxe o conteúdo */

 /* No padrão MVC, geralmente o index retorna uma lista */

 //Corpo (Request Body): Dados para criação ou atualização de um registro
//Route Params (request.params): Identificar qual recurso quero atuaizar ou deletar. ex: app.delete('/users/:id), na url, na posição do id, passo o numero(id)
//Query Params (request.query): Paginação, filtros, ordenação. ex: app.get('/users') 