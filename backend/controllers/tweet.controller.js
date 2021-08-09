const Exception = require("../lib/exceptions");
const AWS = require("aws-sdk");
const Twit = require("twit");
const AnalysisModel = require("../model/analysis.model");
const Utils = require("../lib/Utils");
require("dotenv").config();

var secretManagerClient = new AWS.SecretsManager({
    region: "us-east-1"
});

const secretName = "twitterdb";

secretManagerClient.getSecretValue({SecretId: secretName}, function(err, data) {
    if (err) {
        if (err.code === 'DecryptionFailureException')
            // Secrets Manager can't decrypt the protected secret text using the provided KMS key.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
        else if (err.code === 'InternalServiceErrorException')
            // An error occurred on the server side.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
        else if (err.code === 'InvalidParameterException')
            // You provided an invalid value for a parameter.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
        else if (err.code === 'InvalidRequestException')
            // You provided a parameter value that is not valid for the current state of the resource.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
        else if (err.code === 'ResourceNotFoundException')
            // We can't find the resource that you asked for.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
    }
    else {
        // Decrypts secret using the associated KMS CMK.
        // Depending on whether the secret is a string or binary, one of these fields will be populated.
        if ('SecretString' in data) {
            secret = data.SecretString;
            process.env['CONSUMER_KEY'] = secret.consumer_key;
            process.env['CONSUMER_SECRET'] = secret.consumer_secret;
            process.env['ACCESS_TOKEN_KEY'] = secret.access_token;
            process.env['ACCESS_TOKEN_SECRET'] = secret.access_token_secret;
        } else {
            let buff = new Buffer(data.SecretBinary, 'base64');
            decodedBinarySecret = buff.toString('ascii');
            console.log(decodedBinarySecret);
        }
    }

    // Your code goes here.
});

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
