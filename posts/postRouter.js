const express = require('express');
const Posts = require('./postDb')

const router = express.Router();

router.get('/', (req, res) => {
  Posts.get()
    .then(posts => res.status(200).json(posts))
    .catch(err=>res.status(500).json({message: "error"}));
});

router.get('/:id', validatePostById, (req, res) => {
  const {id} = req.params;
  Posts.getById(id)
    .then(post => {res.status(200).json({post})})
    .catch(err => res.status(500).json({message: 'server error'}))
});

router.delete('/:id', (req, res) => {
  const {id} = req.params;
  Posts.remove(id)
    .then(rem => rem ? res.status(200).json({rem}) : res.status(404).json({message: 'no post with that id'}))
    .catch(err=>res.status(500).json({message:'server error'}))
});

router.put('/:id', validatePostById, validatePost, (req, res) => {
  const {id} = req.params;
  const newPost = req.body;

  Posts.update(id, newPost)
    .then(post => { res.status(200).json(post)})
    .catch(err => res.status(500).json({message: 'server error'}))
});


// router.post('/', (req,res)=>{
//   const newPost = req.body;
//   Posts.insert(newPost)
//     .then(post=>{
//       post ? 
//     })
// })

// custom middleware

function validatePostById(req, res, next) {
  const {id} = req.params;
  Posts.getById(id)
    .then(post =>{
      req.post = post;
      post ? next() : res.status(404).json({message:'no user with that ID'})
    })
    .catch(error=>{
      console.log(error);
      res.status(500).json({message: 'could not validate post id'})
    })
}

function validatePost(req, res, next) {
  const newPost = req.body;
  const keys = Object.keys(newPost);
  if (keys.length === 0){
    return res.status(400).json({message: 'needs a body'})
  } else if (!newPost.text){
    return res.status(400).json({message:'needs some text'})
  }
  next();
}

module.exports = router;
