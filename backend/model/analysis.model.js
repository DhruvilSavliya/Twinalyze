const db = require('../lib/db-connection');
class AnalysisModel{
    static async startAnalysis(analysisId, uid) {
        return new Promise(async(resolve, reject) => {
            try {
                const params = {
                    TableName: "analysis",
                    Item: {
                        analysisId,
                        uid,
                        status: "PENDING"
                    }
                };
                db.put(params, function(err, data) {
                    if (err) {
                        console.log('Error in analysis model: startAnalysis: ', err)
                        reject();
                    } else {
                        console.log("Added Analysis:", JSON.stringify(data));
                        resolve();
                    }
                });

            } catch (error) {
                console.error('Error in analysis model: startAnalysis: ', error);
                reject();
            }
        });
    }

    static async getRecentAnalysisByUserId(uid) {
        return new Promise(async(resolve, reject) => {
            try {
                const params = {
                    TableName: "analysis",
                    FilterExpression: "#uid = :uid_val",
                    ExpressionAttributeNames: {
                        "#uid": "uid",
                    },
                    ExpressionAttributeValues: { ":uid_val": parseInt(uid) }
                };
                db.scan(params, function(err, data) {
                    if (err) {
                        console.error('Error in analysis model: getRecentAnalysisByUserId', err);
                        reject();
                    } else {
                        resolve(data["Items"]);
                    }
                });

            } catch (error) {
                console.error('Error in analysis model: getRecentAnalysisByUserId: ', error);
                reject();
            }
        });
    }
}
module.exports = AnalysisModel;