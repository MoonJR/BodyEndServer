/**
 * Created by yeonjukko on 2016. 6. 6..
 */
var https = require('https');
var requestUrl = 'market://details?id=net.yeonjukko.bodyend';

exports.redirectUrl = function(req, res){
    res.redirect(requestUrl);

};



