import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express(); //Criando uma variável app chamando a função express

app.use(cors());
app.use(express.json()); //introduzindo pacote json, para que o express consiga realizar a leitura do mesmo
app.use(routes);


//localhost:3333
app.listen(3333); //O método listen irá 'ouvir' um endereço/requisições HTTP. Escolhi usar a porta 3333, do que a padrão(80)

/* O pacote cors permite que aplicações em endereços diferentes, acessem a API, ou seja, o front-end conseguirá
acessar a API, mesmo estando em outro endereço. EX.: Front-End -> localhost:3000 -- Back-End -> localhost:3333 */