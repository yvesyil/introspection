import jsonServer from 'json-server';
import path from 'path';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

const server = jsonServer.create();
const middlewares = jsonServer.defaults();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(__dirname, 'db.json');

const adapter = new JSONFile(file);
const db = new Low(adapter);


server.use(middlewares);

server.get('/echo', (req, res) => {
  res.jsonp(req.query);
});

server.use(jsonServer.bodyParser);

server.post('/api/login', async (req, res) => {
  await db.read();

  try {
    const { username, password } = req.body;

    if (!(username && password)) {
      return res.status(400).json({error: 'All input is required'});
    }

    const { users } = db.data;
    const usr = users.filter(obj => obj.name === username && obj.password === password);
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

server.listen(3000, () => {
  console.log('JSON Server is running');
});