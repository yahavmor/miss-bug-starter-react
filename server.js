import express from 'express' 
import { bugService } from './bug.service.remote.js'
import { utilService } from './public/services/util.service.js'



const app = express() 
app.use(express.static('public'));
app.get('/', (req, res) => res.send('Hello there')) 
app.listen(3030, () => console.log('Server ready at port 3030'))


app.get('/api/bug', (req, res) => {
      bugService.query()
      .then(bugs => {res.send(bugs);});
});



app.get('/api/bug/:id/remove', (req, res) => {
      bugService.remove(req.params.id)
      .then(bugs => {res.send(bugs);});
});

app.get('/api/bug/save', (req, res) => {
  const { id, title, severity } = req.query;
  if (id) {
    bugService.getById(id)
      .then(bug => {
        bug.title = title || 'default title';
        bug.severity = severity || 'default severity';
        return bugService.save(bug);
      })
      .then(bugs => res.send(bugs))
  } else {
    let newBug = {
      id: utilService.makeId(),
      title: title || 'default title',
      severity: severity || 'default severity'
    };
    bugService.save(newBug)
      .then(bugs => res.send(bugs))
  }
});



app.get('/api/bug /:id', (req, res) => {
      const {id} = req.params
      bugService.getById(id)
      .then(bug => {res.send(bug);});
});
