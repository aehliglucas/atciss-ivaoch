const axios = require('axios');

async function getAccessToken(authCode) {
    const tokenUrl = 'https://api.ivao.aero/v2/oauth/token';
    const response = await axios.post(tokenUrl, {
        grant_type: 'authorization_code',
        code: authCode,
        redirect_uri: 'http://localhost:3000/callback',
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET
    });

    return response.data.access_token;
}

async function getCurrentATCPosition(accessToken) {
    try {
        const session = await axios.get('https://api.ivao.aero/v2/users/me/sessions/now', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return session.data.callsign
    } catch (error) {
        if (error.status == 404) {
            return ""
        }
    }
}

async function logout() {
    const endpointURL = "https://sso.ivao.aero/logout";
    await axios.get(endpointURL);
}

module.exports = {
    getAccessToken,
    getCurrentATCPosition,
    logout
};
