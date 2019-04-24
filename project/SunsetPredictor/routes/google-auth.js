/** import { google } from 'googleapis';

const googleConfig = {
    clientId: '1078333857284-9icej2t3a4bria2l1cfqpa74baqpgonj.apps.googleusercontent.com',
    clientSecret: 'xFJete1hukDi_eb4uu_4dNkX',
    redirect: 'localhost:3000/' // this must match your google api settings
};


const defaultScope = [
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/userinfo.email',
];


//Get a url which will open the google sign-in page and request access to the scope provided (such as calendar events).

function createConnection() {
    return new google.auth.OAuth2(
        googleConfig.clientId,
        googleConfig.clientSecret,
        googleConfig.redirect
    );
}

function getConnectionUrl(auth) {
    return auth.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: defaultScope
    });
}

function getGooglePlusApi(auth) {
    return google.plus({ version: 'v1', auth });
}


//MAIN



//Create a Google URL and send to the client to log in the user.

function urlGoogle() {
    const auth = createConnection();
    const url = getConnectionUrl(auth);
    return url;
}


//Take the "code" parameter which Google gives us once when the user logs in, then get the user's email and id.

async function getGoogleAccountFromCode(code) {
    const data = await auth.getToken(code);
    const tokens = data.tokens;
    const auth = createConnection();
    auth.setCredentials(tokens);
    const plus = getGooglePlusApi(auth);
    const me = await plus.people.get({userId: 'me'});
    const userGoogleId = me.data.id;
    const userGoogleEmail = me.data.emails && me.data.emails.length && me.data.emails[0].value;
    return {
        id: userGoogleId,
        email: userGoogleEmail,
        tokens: tokens,
    };
}

module.exports = {
    googleConfig: googleConfig,
    defaultScope: defaultScope,
    createConnection: createConnection(),
    getConnectionUrl: getConnectionUrl(),
    getGooglePlusApi: getGooglePlusApi(),
    getGoogleAccountFromCode: getGoogleAccountFromCode
}

/**

