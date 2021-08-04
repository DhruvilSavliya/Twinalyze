const router = require('express').Router();
const TweetRoutes = require('../controllers/tweet.controller');

router.post('/startAnalysis', TweetRoutes.startAnalysis);
router.get('/getAnalysisByUser/:uid', TweetRoutes.getAnalysisByUser);
router.get('/getTweetReportByAnalysisId/:analysisId', TweetRoutes.getTweetReportByAnalysisId);

module.exports = router;