import jsonServer from 'json-server';
import path from 'path';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

const server = jsonServer.create();
const middlewares = jsonServer.defaults();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(__dirname, 'db.json');

const router = jsonServer.router(file);

const adapter = new JSONFile(file);
const db = new Low(adapter);


server.use(cors());
server.use(middlewares);

server.get('/echo', (req, res) => {
  res.jsonp(req.query);
});

server.use(jsonServer.bodyParser);
server.post('/api/login', async (req, res) => {
  await db.read();

  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      return res.status(400).json({error: 'All input is required'});
    }

    const { users } = db.data;
    const usr = users.filter(obj => obj.email === email && obj.password === password);
    if (usr.length < 1) {
      return res.status(400).json({error: 'Username or password wrong'});
    }
    
    const token = jwt.sign({
      id: usr.id, 
      email: usr.email
    }, 'secret');

    return res.json({message: 'Successful login', token});
  } catch (err) {
    console.error(err);
  }
});

server.use('/api/compile', async (req, res) => {
  // TODO fake compilation handling
});

server.use('/api', router);
server.listen(3000, () => {
  console.log('JSON Server is running');
});