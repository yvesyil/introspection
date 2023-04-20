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
server.use(jsonServer.bodyParser);

const publicRoutes = new Set([
  '/login', 
  '/compilers'
]);

// auth middleware
server.use('/api', (req, res, next) => {
  if (publicRoutes.has(req.path)) {
    return next();
  }

  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, 'secret');
    req.userData = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
})

server.post('/api/login', async (req, res) => {
  await db.read();

  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      return res.status(400).json({error: 'All input is required'});
    }

    const { users } = db.data;
    const usrs = users.filter(obj => obj.email === email && obj.password === password);
    if (usrs.length < 1) {
      return res.status(400).json({error: 'Username or password wrong'});
    }
    const [ usr ] = usrs;
    
    const token = jwt.sign({
      id: usr.id, 
      email: usr.email
    }, 'secret');

    return res.json({message: 'Successful login', id: usr.id, email: usr.email, token});
  } catch (err) {
    console.error(err);
  }
});

server.post('/api/files/:id', async (req, res) => {
  await db.read();
  const id = Number(req.params.id);

  try {
    // TODO fixxx
    const newfile = req.body;

    const newfiles = db.data.files.map(obj => {
      if (obj.id === id) {
        return newfile;
      } else {
        return obj;
      }
    });

    db.data.files = newfiles;

  } catch (err) {
    console.error(err);
    return res.status(500).json({ err });
  }

  await db.write();
  return res.sendStatus(269);
});

server.get('/api/files/:id', async (req, res) => {
  await db.read(); 
  const id = Number(req.params.id);

  let file;
  try {
    file = db.data.files.filter(obj => obj.id === id);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err });
  }

  return res.json(file);
});

server.post('/api/compile', async (req, res) => {
  // TODO fake compilation handling
});

server.use('/api', router);
server.listen(3000, () => {
  console.log('JSON Server is running');
});