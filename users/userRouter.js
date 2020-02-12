const express = require('express');
const Users = require('./userDb')

const router = express.Router();

router.post('/', (req, res) => {
  const newUser = req.body;
  if (newUser.name){
    Users.insert(newUser)
      .then(user=>res.status(200).json(user))
      .catch(fail=>res.status(500).json({message: 'server error'}))
  } else {
    res.status(400).json({message: 'needs a name'})
  }
});

router.post('/:id/posts', (req, res) => {
  // do your magic!
});

router.get('/', (req, res) => {
  Users.get()
    .then(users => res.status(200).json(users))
    .catch(err=>res.status(500).json({message: "error"}));
});

router.get('/:id', (req, res) => {
  const {id} = req.params;
  Users.getById(id)
    .then(user => {
      user ? res.status(200).json({user}) : res.status(404).json({message: 'no post with that id'})
    .catch(err => res.status(500).json({message: 'server error'}))
    })
});

router.get('/:id/posts', (req, res) => {
  // do your magic!
});

router.delete('/:id', (req, res) => {
  const {id} = req.params;
  Users.remove(id)
    .then(rem => rem ? res.status(200).json({rem}) : res.status(404).json({message: 'no post with that id'}))
    .catch(err=>res.status(500).json({message:'server error'}))
});

router.put('/:id', (req, res) => {
  const {id} = req.params;
  const newUser = req.body;


  Users.update(id, newUser)
    .then(user => {
      console.log('the post', user);
      if (user){
        if(newUser.name){
          res.status(200).json(user)
          //never getting here, don't know why
        } else {
          res.status(400).json({message: 'needs name'})
        }
      } else {
        res.status(404).json({message: 'no user at that id'})
      }
    })
    .catch(err => res.status(500).json({message: 'server error'}))
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
}

function validateUser(req, res, next) {
  // do your magic!
}

function validatePost(req, res, next) {
  console.log('from the validation function', req.body)
  const theBody = req.body;
  const keys = Object.keys(theBody);
  if (keys.length > 0){
    req.body.text ? next() : res.status(400).json({message: 'missing required text field'})
  } else {
    res.status(400).json({message: 'missing post data'})
  }
}

module.exports = router;
