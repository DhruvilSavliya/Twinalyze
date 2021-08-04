const Exception = require('../lib/exceptions');
const Twit = require('twit');
require('dotenv').config();

const AWS = require('aws-sdk');
const Utils = require('../lib/Utils');

//Constants
const ID = 'ASIAUFWLHNZ7U2IULR5R';
const SECRET = 'e2nLIckdQEqX2wSY2d0+9Ei77C2+B6C3uyyd3nxx';

// The name of the bucket that you have created
const BUCKET_NAME = 'csci5409';

const T = new Twit({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN_KEY,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
});


class TweetController {
    static async startAnalysis(req, res) {
        try {
            const {uid, searchKeyword} = req.body;
            await T.get('search/tweets', { q: 'covid-19', count: 20 }, function(err, data, response) {
                twitterApiResult = data
            })
            console.log(twitterApiResult)
            
            const analysisId = await Utils.generateId(5);
            const uploadFile = async(content, index) => {
                const buf = Buffer.from(JSON.stringify(content));
                const data = {
                    Bucket: BUCKET_NAME,
                    Key: uid+'_'+analysisId+'_'+index+'.json',
                    Body: buf,
                    ContentEncoding: 'base64',
                    ContentType: 'application/json'
                };
                const s3 = new AWS.S3({
                    accessKeyId: ID,
                    secretAccessKey: SECRET
                });

                s3.upload(data, function(s3Err, data) {
                    if (s3Err) throw s3Err
                    console.log(`File uploaded successfully at ${data.Location}`)
                });
            }

            let asyncCall = [];

            twitterApiResult.forEach(tweet => {
                console.log(tweet)
               asyncCall.push(uploadFile(tweet,1));
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

}

module.exports = TweetController;