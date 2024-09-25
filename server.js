const express = require('express');
const session = require('express-session');
const path = require('path')
require('dotenv').config()
const app = express();
const sso = require('./sso');

// Session-Setup
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

function checkAuth(req, res, next) {
    if (req.session.position) {
        next();
    } else {
        res.redirect('/login');
    }
}

app.get('/getLoginUrl', (req, res) => {
    const clientId = process.env.CLIENT_ID;
    const redirectUri = 'http://localhost:3000/callback';
    const scope = 'tracker';

    const loginUrl = `https://sso.ivao.aero/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;

    res.json({ loginUrl });
});

app.get('/callback', async (req, res) => {
    const authCode = req.query.code;
    try {
        const accessToken = await sso.getAccessToken(authCode);
        const position = await sso.getCurrentATCPosition(accessToken);

        if (position == "") {
            res.redirect('/loginError');
            return
        }

        req.session.position = position;

        res.redirect('/');
    } catch (error) {
        res.status(500).send('An error occurred: ' + error.message);
    }
});

app.get('/api/currentPosition', async (req, res) => {
    if (req.session.position) {
        res.json({ position: req.session.position })
    } else {
        res.status(401).send('User is not logged in')
    }
});

app.get('/', checkAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/logout', (req, res) => {
    sso.logout()
    req.session.destroy()
    res.redirect("/login")
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/loginError', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login_error.html'));
});

app.get('/coordContent', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'content', 'coord.html'))
})

app.use(express.static('public'));




function launch() {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = {
    launch
};