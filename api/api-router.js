const express = require('express');
const postRouter = require("../posts/postRouter");

const router = express.Router();


router.use('/posts', postRouter);

module.exports = router;