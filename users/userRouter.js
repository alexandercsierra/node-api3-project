const express = require('express');
const Users = require('./userDb')
const Posts = require('../posts/postDb')

const router = express.Router();

router.post('/', validateUser, (req, res) => {
  const newUser = req.body;

    Users.insert(newUser)
      .then(user=>res.status(201).json(user))
      .catch(fail=>res.status(500).json({message: 'server error'}))

});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {

  const newPost = req.body;
  newPost.user_id = req.params.id;
    console.log('new post', newPost)
    Posts.insert(newPost)
      .then(post => {res.status(201).json(post)})
      .catch(err=>{
        console.log('error', err)
        res.status(500).json({message:'server error'})
      })

});

router.get('/', (req, res) => {
  Users.get()
    .then(users => res.status(200).json(users))
    .catch(err=>res.status(500).json({message: "error"}));
});

router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user)
});

router.get('/:id/posts', validateUserId, (req, res) => {
  const {id} = req.params;
  Users.getUserPosts(id)
    .then(posts => res.status(200).json(posts))
    .catch(err=>res.status(500).json({message:'server error'}))
});

router.delete('/:id', validateUserId, (req, res) => {
  const {id} = req.params;
  Users.remove(id)
    .then(rem => res.status(200).json({rem}))
    .catch(err=>res.status(500).json({message:'server error'}))
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  const {id} = req.params;
  const newUser = req.body;

  Users.update(id, newUser)
    .then(user => res.status(200).json(user))
    .catch(err => res.status(500).json({message: 'server error'}))
});

//custom middleware

//does the user exist?
function validateUserId(req, res, next) {
  const {id} = req.params;
  Users.getById(id)
    .then(user => {
      req.user = user;
      console.log(req.user);
      user ? next() : res.status(404).json({message: 'no user with that id'})
    })
    .catch(error => res.status(500).json({message: 'validation error'}))
}


//is the user object valid, with a name?
function validateUser(req, res, next) {
  const body = req.body;
  const keys = Object.keys(body);
  if (keys.length === 0){
    return res.status(400).json({message:'missing user data'})
  }
  if(!body.name){
    return res.status(400).json({message:'missing required name field'})
  }
  next();
}


//is the post object valid, with a text?
function validatePost(req, res, next) {
  const body = req.body
  const keys = Object.keys(body);
  if (keys.length === 0){
    return res.status(400).json({message:'missing post data'})
  }
  else if (!body.text){
    console.log(body);
    return res.status(400).json({message:'needs text'})
  }
  next();
}

module.exports = router;
