const express = require("express"),
  bodyParser = require("body-parser"),
  jwt = require("jsonwebtoken"),
  cors = require("cors"),
  fs = require("fs"),
  path = require("path");
CryptoJS = require("crypto-js");

require("dotenv").config();

app = express();
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// fetch Connected Apps values from env variable
const clientId = process.env.clientId,
  secretId = process.env.secretId,
  secretValue = process.env.secretValue,
  caScopes = process.env.scope,
  caUserId = process.env.userId;

app.use(bodyParser.json());
const authRoutes = express.Router();
app.use("/api", authRoutes);

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("Example app listening on port " + port);
});

app.get("/", function (req, res) {
  res.send("App is running on http://localhost:3000/index.html");
});

app.get("/gimmeJWT", (req, res) => {
  var userid = caUserId;
  var iss = clientId;
  var kid = secretId;
  var secret = secretValue;
  var scp = caScopes;
  res.json({
    token: createToken(userid, kid, secret, iss, scp),
  });
});

function createToken(userid, kid, secret, iss, scp) {
  var header = {
    alg: "HS256",
    typ: "JWT",
    iss: iss,
    kid: kid,
  };
  var stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header));
  var encodedHeader = base64url(stringifiedHeader);
  var claimSet = {
    sub: userid,
    aud: "tableau",
    nbf: Math.round(new Date().getTime() / 1000) - 100,
    jti: new Date().getTime().toString(),
    iss: iss,
    scp: scp.split(", "),
    exp: Math.round(new Date().getTime() / 1000) + 100,
  };
  var stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(claimSet));
  var encodedData = base64url(stringifiedData);
  var token = encodedHeader + "." + encodedData;
  var signature = CryptoJS.HmacSHA256(token, secret);
  signature = base64url(signature);
  var signedToken = token + "." + signature;
  return signedToken;
}

function base64url(source) {
  encodedSource = CryptoJS.enc.Base64.stringify(source);
  encodedSource = encodedSource.replace(/=+$/, "");
  encodedSource = encodedSource.replace(/\+/g, "-");
  encodedSource = encodedSource.replace(/\//g, "_");
  return encodedSource;
}

app.use(express.static(path.join(__dirname, "/public")));
