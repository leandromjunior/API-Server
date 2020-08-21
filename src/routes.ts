import express from 'express';
import ClassesController from './controllers/ClassesController';
import ConnectionsController from './controllers/ConnectionsController';


const routes = express.Router();
const classesControllers = new ClassesController(); // Trazendo conteúdo do arquivo ClassesController
const connectionsController = new ConnectionsController();


//localhost:3333/classes
routes.get('/classes', classesControllers.index);
routes.post('/classes', classesControllers.create); //Chamando método create do arquivo ClassesController

routes.get('/connections', connectionsController.index);
routes.post('/connections', connectionsController.create);

export default routes;