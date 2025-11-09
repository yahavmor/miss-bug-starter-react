import express from 'express';
import { bugService } from './services/bug.service.js';
import { utilService } from './public/services/util.service.js';

const app = express();
app.use(express.static('public'));
app.use(express.json()); 

app.get('/', (req, res) => res.send('Hello there'));

app.get('/api/bug', (req, res) => {
  bugService.query(req.query)
    .then(bugs => res.send(bugs))
    .catch(err => res.status(500).send('Failed to load bugs'));
});

app.get('/api/bug/:id', (req, res) => {
  const { id } = req.params;
  bugService.getById(id)
    .then(bug => {
      if (!bug) return res.status(404).send('Bug not found');
      res.send(bug);
    })
    .catch(err => res.status(500).send('Failed to get bug'));
});

app.delete('/api/bug/:id', (req, res) => {
  const { id } = req.params;
  bugService.remove(id)
    .then(() => res.send({ message: 'Bug removed' }))
    .catch(err => res.status(404).send('Bug not found'));
});

app.post('/api/bug', (req, res) => {
  const bug = req.body;
  bug._id = utilService.makeId();
  bugService.save(bug)
    .then(savedBug => res.send(savedBug))
    .catch(err => res.status(500).send('Failed to create bug'));
});

app.put('/api/bug/:id', (req, res) => {
  const { id } = req.params;
  const updatedBug = { ...req.body, _id: id };
  bugService.save(updatedBug)
    .then(savedBug => res.send(savedBug))
    .catch(err => res.status(404).send('Bug not found for update'));
});

app.listen(3030, () => console.log('Server ready at port 3030'));
