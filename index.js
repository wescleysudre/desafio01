const express = require('express');

const server = express();

server.use(express.json());

const projects = [
  {
    id: "1",
    title: "Novo Projeto",
    tasks: []
  }
];

function checkQtdReq(req, res, next) {

  console.count("Qtd de requisições");

  return next();
}

server.use(checkQtdReq);

//Middleware Local
function checkProjectExist(req, res, next) {
  const { id } = req.params;
  const project = projects.find(a => a.id == id);

  if (!project) {
    return res.status(400).json({ error: 'Project not found' });
  }

  return next();
}

/**
 * Request body: id, title
 * Cadastra um novo projeto
 */
server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(project);
});

server.post('/projects/:id/tasks', checkProjectExist, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const index = projects.findIndex(a => a.id == id);

  const task = { title };

  projects[index].tasks.push(task);

  return res.json(projects[index]);

});

server.put('/projects/:id', checkProjectExist, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const index = projects.findIndex(a => a.id == id);

  projects[index].title = title;

  return res.json(projects);
});

server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.delete('/projects/:id', checkProjectExist, (req, res) => {
  const { id } = req.params;

  const index = projects.findIndex(a => a.id == id);

  projects.splice(index, 1);

  return res.send();
});

server.listen(3000);