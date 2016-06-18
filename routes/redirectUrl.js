/**
 * Created by yeonjukko on 2016. 6. 6..
 */
var https = require('https');
var requestUrl = 'market://details?id=net.yeonjukko.bodyend';
var pool = require('../libs/DBManager').mysqlPool;

exports.redirectUrl = function (req, res) {
    res.redirect(requestUrl);

    pool.getConnection(function (err, connection) {
        if (err) {
            console.log(err);
        } else {
            var cafeName = req.query.cafeName;
            connection.query('INSERT INTO BODY_END_ANALYSIS VALUES(?,?,?)'
                , [myDate(), cafeName,myTime()], function (err, result) {
                    if (err) {
                        console.log(err);
                    }
                });
        }
        connection.release();
    });
};

function myDate() {
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var date = d.getDate();

    if (month < 10) {
        month = '0' + month;
    }
    if (date < 10) {
        date = '0' + date;
    }

    return Number(year + month + date);
}
function myTime(){
    return Number(new Date().getHours());
}



