const router = require('express').Router();
// const userRoutes = require('./user.routes');
const tweetRoutes = require('./tweet.routes');

//user routes
// router.use('/api', userRoutes);
router.use('/tweet', tweetRoutes);

module.exports = router;
