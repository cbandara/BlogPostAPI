'use strict';

exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://<dbuser>:<dbpassword>@ds037990.mlab.com:37990/blogposts'
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/blog-app-test'
exports.PORT = process.env.PORT || 8080;
