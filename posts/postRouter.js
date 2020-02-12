const express = require('express');
const Posts = require('./postDb')

const router = express.Router();

router.get('/', (req, res) => {
  Posts.get()
    .then(posts => res.status(200).json(posts))
    .catch(err=>res.status(500).json({message: "error"}));
});

router.get('/:id', (req, res) => {
  const {id} = req.params;
  Posts.getById(id)
    .then(post => {
      post ? res.status(200).json({post}) : res.status(404).json({message: 'no post with that id'})
    .catch(err => res.status(500).json({message: 'server error'}))
    })
});

router.delete('/:id', (req, res) => {
  const {id} = req.params;
  Posts.remove(id)
    .then(rem => rem ? res.status(200).json({rem}) : res.status(404).json({message: 'no post with that id'}))
    .catch(err=>res.status(500).json({message:'server error'}))
});

router.put('/:id', validatePost, (req, res) => {
  
  const {id} = req.params;
  console.log('id', Number(id))
  const newPost = req.body;
  console.log('req.body', req.body.text);


  Posts.update(id, newPost)
    .then(post => {
      console.log('the post', post);
      if (post){
        if(newPost.text){
          res.status(200).json(post)
          //never getting here, don't know why
        } else {
          res.status(400).json({message: 'need text'})
        }
      } else {
        res.status(404).json({message: 'post at that id does not exist'})
      }
    })
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
