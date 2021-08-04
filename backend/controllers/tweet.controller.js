const Exception = require('../lib/exceptions');
const AWS = require('aws-sdk');
const AnalysisModel = require('../model/analysis.model');
const Utils = require('../lib/Utils');

// The name of the bucket that you have created
const BUCKET_NAME = 'csci5409';

class TweetController {
    static async startAnalysis(req, res) {
        try {
            const {uid, searchKeyword} = req.body;

            const twitterApiResult = [
                {
                    a: "a"
                },
                {
                    b: "b"
                },
                {
                    c: "c"
                }
            ];

            const analysisId = await Utils.generateId(5);
            const uploadFile = async(content, index) => {
                return new Promise(async(resolve) => {
                    const buf = Buffer.from(JSON.stringify(content));
                    const data = {
                        Bucket: BUCKET_NAME,
                        Key: uid + '_' + analysisId + '_' + index + '.json',
                        Body: buf,
                        ContentEncoding: 'base64',
                        ContentType: 'application/json'
                    };
                    const s3 = new AWS.S3();
                    s3.upload(data, function (s3Err, data) {
                        if (s3Err) throw s3Err
                        console.log(`File uploaded successfully at ${data.Location}`);
                        resolve();
                    });
                });
            }

            let asyncCall = [];

            await AnalysisModel.startAnalysis(analysisId, uid);

            twitterApiResult.forEach((tweet,i) => {
                asyncCall.push(uploadFile(tweet,i+1));
            });

            await Promise.all(asyncCall);
            return res.sendResponse({
                success: true,
                message: 'Analysis Started.'
            });

        } catch (error) {
            console.error('Error in startAnalysis', error);
            return res.sendError(new Exception('GeneralError'));
        }
    }

    static async getAnalysisByUser(req, res) {
        try {
            const {uid} = req.params;

            const analysisData = await AnalysisModel.getRecentAnalysisByUserId(uid);

            return res.sendResponse({
                success: true,
                message: 'Analysis Started.',
                data: analysisData
            });

        } catch (error) {
            console.error('Error in getAnalysisByUser', error);
            return res.sendError(new Exception('GeneralError'));
        }
    }
}

module.exports = TweetController;