'use strict';

exports.port = process.env.PORT || 3000;
exports.mongodb = {
  //uri: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'localhost/drywall'
  uri: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || process.env.PARAM1 || 'mongodb://venderUser:Mellmen123!@ds059938.mongolab.com:59938/venderprod'
};
exports.companyName = 'Clarity Consulting, Inc.';
exports.projectName = 'Vender';
exports.systemEmail = 'vender1450@gmail.com';
exports.cryptoKey = 'k3yb0ardc4t';
exports.requireAccountVerification = false;
exports.smtp = {
  from: {
    name: process.env.SMTP_FROM_NAME || exports.projectName +' Website',
    address: process.env.SMTP_FROM_ADDRESS || 'vender1450@gmail.com'
  },
  credentials: {
    user: process.env.SMTP_USERNAME || 'vender1450@gmail.com',
    password: process.env.SMTP_PASSWORD || 'Vender@1450',
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    ssl: true
  }
};
exports.oauth = {
  twitter: {
    key: process.env.TWITTER_OAUTH_KEY || '',
    secret: process.env.TWITTER_OAUTH_SECRET || ''
  },
  facebook: {
    key: process.env.FACEBOOK_OAUTH_KEY || '',
    secret: process.env.FACEBOOK_OAUTH_SECRET || ''
  },
  github: {
    key: process.env.GITHUB_OAUTH_KEY || '',
    secret: process.env.GITHUB_OAUTH_SECRET || ''
  }
};
