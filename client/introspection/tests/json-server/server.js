import jsonServer from 'json-server';
import path from 'path';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { execSync } from 'child_process';
import { createProxyMiddleware } from 'http-proxy-middleware';

const server = jsonServer.create();
const middlewares = jsonServer.defaults();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(__dirname, 'db.json');

let router = jsonServer.router(file);

let adapter = new JSONFile(file);
let db = new Low(adapter);


server.use(cors());
server.use(middlewares);
server.use(jsonServer.bodyParser);

const publicRoutes = new Set([
  '/login', 
  '/compilers',
]);

server.use('/api', async (req, res, next) => {
  router.db.read();
  return next();
});

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

server.put('/api/files/:id', async (req, res) => {
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

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }

  await db.write();
  return res.sendStatus(269);
});

server.get('/api/files/:id', async (req, res) => {
  await db.read(); 
  const id = Number(req.params.id);

  let file;
  try {
    [ file ] = db.data.files.filter(obj => obj.id === id);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }

  return res.json(file);
});

server.delete('/api/files/:id', async (req, res) => {
  await db.read(); 
  const id = Number(req.params.id);

  try {
    const newfiles = db.data.files.filter(obj => obj.id !== id);

    db.data.files = newfiles;
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }

  await db.write();
  return res.status(200).json({ status: 'removed item' });
});

server.delete('/api/directories/:id', async (req, res) => {
  await db.read(); 
  const id = Number(req.params.id);

  try {
    const newdirectories = db.data.directories.filter(obj => obj.id !== id);
    const newfiles = db.data.files.filter(obj => obj.directoryId !== id);

    db.data.directories = newdirectories;
    db.data.files = newfiles;
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }

  await db.write();
  return res.status(200).json({ status: 'removed item' });
});

server.post('/api/compile', async (req, res) => {
  // TODO fake compilation handling
  const file = req.body;
  const compilerOptions = '-S -O0 -fno-asynchronous-unwind-tables -fverbose-asm -masm=intel';

  let output = '';
  let error = null;
  try {
    output = execSync(`echo ${JSON.stringify(file.content)} | clang ${compilerOptions} -x c - -o -`).toString();
  } catch (err) {
    error = err.toString();
  }

  return res.json({
    error: error,
    content: output,
  });
});

server.use('/api', router);

const port = 3000;
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});