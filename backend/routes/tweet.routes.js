const router = require('express').Router();
const TweetRoutes = require('../controllers/tweet.controller');

router.post('/startAnalysis', TweetRoutes.startAnalysis);

module.exports = router;