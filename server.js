import express from 'express';
import { bugService } from './services/bug.service.js';
import { utilService } from './public/services/util.service.js';
import cookieParser from 'cookie-parser'
import { userService } from './services/user.service.js';
import { authService } from './services/auth.service.js';


const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser()) 


app.get('/api/bug', (req, res) => {
  bugService.query(req.query)
    .then(bugs => res.send(bugs))
    .catch(err => res.status(500).send('Failed to load bugs'));
});


app.get('/api/bug/:id', (req, res) => {
    const { id } = req.params;
    let visitedBugs = req.cookies.visitedBugs ? req.cookies.visitedBugs : [];
    if (!visitedBugs.includes(id)) visitedBugs.push(id);
    if (visitedBugs.length > 3) return res.status(429).send('Please wait for 7 seconds')

      res.cookie('visitedBugs', visitedBugs, { maxAge: 7000 });
      console.log('User visited at the following bugs:', visitedBugs);

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
  bug.id = utilService.makeId();
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
app.post('/api/auth/signup', (req, res) => {
  const {username , password , fullname}=  req.body
  userService.add({username , password , fullname})
    .then(user => {
      const loginToken = authService.getLoginToken(user)
      res.cookie('loginToken', loginToken)
      res.send(user)
    })
    .catch(err => res.status(400).send('Cannot signup'));
});
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  authService.checkLogin({ username, password })
    .then(user => {
      const loginToken = authService.getLoginToken(user)
      res.cookie('loginToken', loginToken)
      res.send(user)              
    })
    .catch(err => {
      res.status(401).send('Invalid Credentials')
    })
})

app.post('/api/auth/logout',(req,res)=>{
  res.clearCookie('loginToken')
  res.send('logged-out')
})
app.get('/api/user/:id', (req, res) => {
  const { id } = req.params
  userService.getById(id)
    .then(user => {
      if (!user) return res.status(404).send('User not found')
      res.send(user)
    })
    .catch(err => res.status(500).send('Failed to get user'))
})


app.listen(3030, () => console.log('Server ready at port 3030'));
