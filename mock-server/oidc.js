// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

var jsrsasign = require('jsrsasign');
var rsaKey = jsrsasign.KEYUTIL.generateKeypair('RSA', 1024);
var e = jsrsasign.hextob64u(rsaKey.pubKeyObj.e.toString(16));
var n = jsrsasign.hextob64u(rsaKey.pubKeyObj.n.toString(16));
const expirationWindow = 3600; // seconds

var path = '/ids';
var metadataPath = path + '/.well-known/openid-configuration';
// var signingKeysPath = path + '/.well-known/jwks';
var signingKeysPath = path + '/.well-known/openid-configuration/jwks';
var authorizationPath = path + '/connect/authorize';
var userInfoPath = path + '/connect/userinfo';
var endSessionPath = path + '/connect/endsession';
var checkSessionPath = path + '/connect/checksession';
var tokenEndpointPath = path + '/connect/token';

var metadata = {
    issuer: path,
    jwks_uri: signingKeysPath,
    authorization_endpoint: authorizationPath,
    userinfo_endpoint: userInfoPath,
    end_session_endpoint: endSessionPath,
    check_session_iframe: checkSessionPath,
    token_endpoint: tokenEndpointPath
};

function prependBaseUrlToMetadata(baseUrl) {
    for (var name in metadata) {
        metadata[name] = baseUrl + metadata[name];
    }
}

var keys = {
    keys: [
        {
            kty: 'RSA',
            use: 'sig',
            kid: '1',
            e: e,
            n: n,
        },
    ],
};

var claims = {
    sub: '00000000-0000-0000-0000-000000000000',
    email: 'connectweb-cypress@livetula.com',
    upn: 'connectweb-cypress@livetula.com',
    given_name: 'Jane',
    family_name: 'Doe',
    name: 'Jane Doe',
    email_verified: true,
    role: 'admin',
};

function genAccessToken() {
    return parseInt(Math.random().toString().replace('0.', '')).toString(16);
}

function hashAccessToken(access_token) {
    var hash = jsrsasign.crypto.Util.hashString(access_token, 'sha256');
    var left = hash.substr(0, hash.length / 2);
    var left_b64u = jsrsasign.hextob64u(left);
    return left_b64u;
}

function genIdToken(aud, nonce, access_token) {
    var now = parseInt(Date.now() / 1000);
    var payload = {
        aud: aud,
        iss: metadata.issuer,
        nonce: nonce,
        sid: '37889234079034890',
        nbf: now,
        iat: now,
        exp: now + expirationWindow,
        idp: 'some_idp',
        amr: ['password'],
    };

    if (access_token) {
        payload.at_hash = hashAccessToken(access_token);
        payload.sub = claims.sub;
        payload.upn = claims.upn;
        payload.name = claims.name;
        payload.email = claims.email;
        payload.given_name = claims.given_name;
        payload.family_name = claims.family_name;
    } else {
        for (var key in claims) {
            payload[key] = claims[key];
        }
    }

    return jsrsasign.jws.JWS.sign(null, { alg: 'RS256', kid: '1' }, payload, rsaKey.prvKeyObj);
}

function isOidc(response_type) {
    var result = response_type.split(/\s+/g).filter(function (item) {
        return item === 'id_token';
    });
    return !!result[0];
}

function isOAuth(response_type) {
    var result = response_type.split(/\s+/g).filter(function (item) {
        return item === 'token';
    });
    return !!result[0];
}

function isCode(response_type) {
    var result = response_type.split(/\s+/g).filter(function (item) {
        return item === 'code';
    });
    return !!result[0];
}

function addFragment(url, name, value) {
    if (url.indexOf('#') < 0) {
        url += '#';
    }

    if (url[url.length - 1] !== '#') {
        url += '&';
    }

    url += encodeURIComponent(name);
    url += '=';
    url += encodeURIComponent(value);

    return url;
}

function addParams(url, name, value) {
    if (url.indexOf('?') < 0) {
        url += '?';
    }

    if (url[url.length - 1] !== '?') {
        url += '&';
    }

    url += encodeURIComponent(name);
    url += '=';
    url += encodeURIComponent(value);

    return url;
}

module.exports = function (baseUrl, app) {
    prependBaseUrlToMetadata(baseUrl);

    app.get(metadataPath, function (req, res) {
        //res.send("<h1>not json...</h1>"); return;
        res.json(metadata);
    });

    app.get(signingKeysPath, function (req, res) {
        res.json(keys);
    });

    app.get(authorizationPath, function (req, res) {
        //res.send("<h1>waiting...</h1>"); return;

        var response_type = req.query.response_type;

        var url = req.query.redirect_uri;

        var state = req.query.state;

        //url = addFragment(url, "error", "bad_stuff"); res.redirect(url); return;

        if(isCode(response_type)) {
            url = addParams(url, 'code', 'C7CBFF7459271A4D9CCC36797558A3E54B858F20388C5E38278665A6A9DD449B');
            url = addParams(url, 'session_state', '123');
            url = addParams(url, 'scope', req.query.scope);
            
            if (state) {
                url = addParams(url, 'state', state);
            }

        } else {
            if (isOAuth(response_type)) {
                var access_token = genAccessToken();
                url = addFragment(url, 'access_token', access_token);
                url = addFragment(url, 'token_type', 'Bearer');
                url = addFragment(url, 'expires_in', `${expirationWindow}`);
                url = addFragment(url, 'scope', req.query.scope);
            }

            if (isOidc(response_type)) {
                url = addFragment(url, 'id_token', genIdToken(req.query.client_id, req.query.nonce, access_token));
                url = addFragment(url, 'session_state', '123');
            }

            if (state) {
                url = addFragment(url, 'state', state);
            }
        }




        res.redirect(url);
    });

    app.get(userInfoPath, function (req, res) {
        res.json(claims);
    });

    app.get(endSessionPath, function (req, res) {
        var url = req.query.post_logout_redirect_uri;
        if (url) {
            var state = req.query.state;
            if (state) {
                url += '?state=' + state;
            }
            res.redirect(url);
        } else {
            res.send('logged out');
        }
    });

    app.get(checkSessionPath, function (req, res) {
        res.json(claims);
    });

    app.post(tokenEndpointPath, function(req, res){
        console.log('BODY', req.body);
        res.status(200).json({
            access_token: genAccessToken(),
            token_type: 'Bearer',
            expires_in: expirationWindow,
            id_token: genIdToken(req.body.client_id, 'r3U9tGDbcWzJ-MxA4qz5OvlQH88VKMGn_xMSR5TD6Ow'),
            scope: req.body.scope,
        });
    });
};
