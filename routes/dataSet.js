/**
 * Created by MoonJR on 2016. 4. 30..
 */

var pool = require('../libs/DBManager').mysqlPool;
var flag = require('../libs/ErrorFlag');
exports.getDataSet = function (req, res) {
    pool.getConnection(function (err, connection) {
        if (err) {
            console.log(err);
            res.json(flag.FLAG_DB_CONNECTION_ERROR_JSON);
        } else {
            connection.query('SELECT drawer_color, drawer_text FROM BODY_END_DATA_SET', [], function (err, result) {
                if (err) {
                    console.log(err);
                    res.json(flag.FLAG_UNKNOWN_ERROR_JSON);
                } else {
                    var sendData = (JSON.parse(JSON.stringify(flag.FLAG_SUCCESS_JSON)));
                    console.log(sendData);
                    sendData.contents = result[0];
                    res.json(sendData);
                }
            });
        }
        connection.release();
    });

};

exports.setDataSet = function (req, res) {
    var drawerColor = req.query.drawer_color;
    var drawerText = req.query.drawer_text;

    if (typeof drawerColor == 'undefined' || typeof drawerText == 'undefined') {
        res.json(flag.FLAG_LACK_VARIABLE_JSON);
        return;
    }

    pool.getConnection(function (err, connection) {
        if (err) {
            console.log(err);
            res.json(flag.FLAG_DB_CONNECTION_ERROR_JSON);
        } else {
            connection.query('UPDATE BODY_END_DATA_SET SET DRAWER_COLOR=?, DRAWER_TEXT=?', [drawerColor, drawerText], function (err, result) {
                if (err) {
                    console.log(err);
                    res.json(flag.FLAG_UNKNOWN_ERROR_JSON);
                } else {
                    res.json(flag.FLAG_SUCCESS_JSON);
                }
            });
        }
        connection.release();
    });

};
