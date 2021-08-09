const Exception = require("../lib/exceptions");
const AWS = require("aws-sdk");
const Twit = require("twit");
const AnalysisModel = require("../model/analysis.model");
const Utils = require("../lib/Utils");
require("dotenv").config();

// The name of the bucket that you have created
const BUCKET_NAME = "tweet-box-new";

const T = new Twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

class TweetController {
  static async startAnalysis(req, res) {
    try {
      const { uid, searchKeyword } = req.body;

      let twitterApiResult = [];

      const fetchTweets = async (query) => {
        return new Promise((resolve) => {
          T.get(
            "search/tweets",
            { q: query, count: 20 },
            function (err, data, resp) {
              twitterApiResult = data.statuses;
              resolve();
            }
          );
        });
      };

      await fetchTweets(searchKeyword);

      const analysisId = await Utils.generateId(5);
      const uploadFile = async (content, index) => {
        return new Promise(async (resolve) => {
          const buf = Buffer.from(JSON.stringify(content));
          const data = {
            Bucket: BUCKET_NAME,
            Key: uid + "_" + analysisId + "_" + index + ".json",
            Body: buf,
            ContentEncoding: "base64",
            ContentType: "application/json",
          };
          const s3 = new AWS.S3();
          s3.upload(data, function (s3Err, data) {
            if (s3Err) throw s3Err;
            console.log(`File uploaded successfully at ${data.Location}`);
            resolve();
          });
        });
      };

      let asyncCall = [];

      await AnalysisModel.startAnalysis(analysisId, uid, searchKeyword);

      twitterApiResult.forEach((tweet, i) => {
        asyncCall.push(uploadFile(tweet, i + 1));
      });

      await Promise.all(asyncCall);
      return res.sendResponse({
        success: true,
        message: "Analysis Started.",
      });
    } catch (error) {
      console.error("Error in startAnalysis", error);
      return res.sendError(new Exception("GeneralError"));
    }
  }

  static async getAnalysisByUser(req, res) {
    try {
      const { uid } = req.params;

      const analysisData = await AnalysisModel.getRecentAnalysisByUserId(uid);

      return res.sendResponse({
        success: true,
        message: "Analysis retrived.",
        data: analysisData,
      });
    } catch (error) {
      console.error("Error in getAnalysisByUser", error);
      return res.sendError(new Exception("GeneralError"));
    }
  }

  static async getTweetReportByAnalysisId(req, res) {
    try {
      const { analysisId } = req.params;

      const analysisData = await AnalysisModel.getTweetReportByAnalysisId(
        analysisId
      );

      return res.sendResponse({
        success: true,
        message: "Tweet report retrived.",
        data: analysisData,
      });
    } catch (error) {
      console.error("Error in getAnalysisByUser", error);
      return res.sendError(new Exception("GeneralError"));
    }
  }
}

module.exports = TweetController;
