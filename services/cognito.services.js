const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
global.fetch = require('node-fetch');

// ======> Data for authorize on AWS 
const poolData = {
    UserPoolId: process.env.AWS_USER_POOL_ID,
    ClientId: process.env.AWS_CLIENT_ID
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);


exports.authenticateUser = async (mail, password) => {
    return new Promise((resolve, reject) => {
        const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: mail,
            Password: password
        });
        const userData = {
            Username: mail,
            Pool: userPool
        };
        const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                //console.log('access token + ' + result.getAccessToken().getJwtToken());
                //console.log('id token + ' + result.getIdToken().getJwtToken());
                //console.log('refresh token + ' + result.getRefreshToken().getToken());
                resolve(result);
            },
            onFailure: function (err) {
                //console.log(err)
                reject(err)
            },

        });
    })
}


exports.signup = async (mail, password) => {
    return new Promise((resolve, reject) => {

        let attributeList = [];

        let dataEmail = {
            Name: 'email',
            Value: mail
        }

        const attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
        attributeList.push(attributeEmail);

        userPool.signUp(mail, password, attributeList, null, (err, result) => {
            if (err) {
                reject(err);

            } else {
                cognitoUser = result.user;
                resolve(result);
            }
        })
    })
}


exports.deleteUser = (username, password) => {
    return new Promise((reject, resolve) => {
        const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: username,
            Password: password,
        });

        const userData = {
            Username: username,
            Pool: userPool
        };
        const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                cognitoUser.deleteUser((err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result)
                    }
                });
            },
            onFailure: function (err) {
                reject(err)
            },
        });
    })
}
