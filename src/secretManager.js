var AWS = require('aws-sdk'),
  region = 'us-east-1',
  secretName = 'TestSecret',
  decodedBinarySecret

const secretManagerClient = new AWS.SecretsManager({
  region: region,
})

secretManagerClient.getSecretValue({ SecretId: secretName }, (err, data) => {
  if (err) {
    console.error(err)
  } else {
    if ('SecretString' in data) {
      secretString = data.SecretString
      secretObj = JSON.parse(secretString)

      console.log(secretObj)
      console.log('Email: ' + secretObj.email)
      console.log('Password: ' + secretObj.password)
    } else {
      let buff = new Buffer(data.SecretBinary, 'base64')
      decodedBinarySecret = buff.toString('ascii')
      console.log('Decoded Binary Secret: ' + decodedBinarySecret)
    }
  }
})
