/**
 * Created by MoonJR on 2016. 4. 1..
 */

var pool = require('../libs/DBManager').mysqlPool;
var flag = require('../libs/ErrorFlag');
var https = require('https');
var youtubeRequestUrl = 'https://www.googleapis.com/youtube/v3/videos';

exports.insertVideo = function (req, res) {

    var id = req.query.id;
    var requestUrl = youtubeRequestUrl + '?part=id%2Csnippet%2CcontentDetails%2Cstatistics&id=' + id + '&key=AIzaSyDFJfd0OTAkc35K4kqb5et4E0N7YN1C_og';

    https.get(requestUrl, function (result) {
        var body = '';
        result.on('data', function (chunk) {
            body += chunk;
        });
        result.on('end', function () {
            try {
                var response = JSON.parse(body);

                if (response.items.length == 0) {
                    res.json(flag.FLAG_NOT_EXIST_VIDEO_JSON);
                    return;
                }

                var item = response.items[0];

                var durationTmp = item.contentDetails.duration.replace('PT', '');
                var hour = 0;
                var min = 0;
                var sec = 0;

                if (durationTmp.indexOf("H") > 0) {
                    hour = durationTmp.substr(0, durationTmp.indexOf('H'));
                    durationTmp = durationTmp.substr(durationTmp.indexOf('H') + 1, durationTmp.length);
                }
                if (durationTmp.indexOf("M") > 0) {
                    min = durationTmp.substr(0, durationTmp.indexOf('M'));
                    durationTmp = durationTmp.substr(durationTmp.indexOf('M') + 1, durationTmp.length);
                }
                if (durationTmp.indexOf("S") > 0) {
                    sec = durationTmp.substr(0, durationTmp.indexOf('S'));
                }

                hour = Number(hour) * 60 * 60;
                min = Number(min) * 60;
                sec = Number(sec);

                var duration = hour + min + sec;
                var title = item.snippet.title;
                var thumbs = item.snippet.thumbnails.medium.url;
                var viewCount = item.statistics.viewCount;
                var category = Number(req.query.category);

                if (isNaN(category)) {
                    res.json(flag.FLAG_NOT_EXIST_CATEGORY_JSON);
                    return;
                }

                pool.getConnection(function (err, connection) {
                    if (err) {
                        console.log(err);
                        res.json(flag.FLAG_DB_CONNECTION_ERROR_JSON);
                    } else {
                        connection.query('INSERT INTO YOUTUBE_LIST VALUES(?,?,?,?,?,?)', [id, title, duration, thumbs, viewCount, category], function (err, result) {
                            if (err) {
                                console.log(err);
                                if (err.errno == 1452) {
                                    res.json(flag.FLAG_NOT_EXIST_CATEGORY_JSON);
                                } else {
                                    res.json(flag.FLAG_ALREADY_REG_VIDEO_JSON);
                                }
                            } else {
                                res.json(flag.FLAG_SUCCESS_JSON);
                            }
                        });
                    }
                    connection.release();

                });
            } catch (e) {
                console.log(e);
                res.json(flag.FLAG_UNKNOWN_ERROR_JSON);
            }


        });
    });


};

exports.getVideo = function (req, res) {
    pool.getConnection(function (err, connection) {
        if (err) {
            console.log(err);
            res.json(flag.FLAG_DB_CONNECTION_ERROR_JSON);
        } else {
            connection.query('SELECT YOUTUBE_LIST.video_id, YOUTUBE_LIST.video_title, YOUTUBE_LIST.video_duration, YOUTUBE_LIST.video_thumbs, YOUTUBE_LIST.video_view_count, YOUTUBE_CATEGORY.video_category_title, YOUTUBE_CATEGORY.video_category_id FROM YOUTUBE_LIST JOIN YOUTUBE_CATEGORY ON YOUTUBE_LIST.VIDEO_CATEGORY_ID = YOUTUBE_CATEGORY.VIDEO_CATEGORY_ID ORDER BY YOUTUBE_LIST.VIDEO_CATEGORY_ID', [], function (err, result) {
                if (err) {
                    res.json(flag.FLAG_ALREADY_REG_VIDEO_JSON);
                } else {
                    var sendData = (JSON.parse(JSON.stringify(flag.FLAG_SUCCESS_JSON)));
                    console.log(sendData);
                    sendData.contents = result;
                    res.json(sendData);
                }
            });
        }
        connection.release();
    });

};

exports.deleteVideo = function (req, res) {

    var id = req.query.id;

    pool.getConnection(function (err, connection) {
        if (err) {
            console.log(err);
            res.json(flag.FLAG_DB_CONNECTION_ERROR_JSON);
        } else {
            connection.query('DELETE FROM YOUTUBE_LIST WHERE VIDEO_ID = ?', [id], function (err, result) {
                if (err) {
                    res.json(flag.FLAG_ALREADY_REG_VIDEO_JSON);
                } else {
                    if (result.affectedRows > 0) {
                        res.json(flag.FLAG_SUCCESS_JSON);
                    } else {
                        res.json(flag.FLAG_NOT_EXIST_VIDEO_JSON);
                    }
                }
            });
        }
        connection.release();
    });

};

exports.insertCategory = function (req, res) {

    var id = Number(req.query.category_id);
    var title = req.query.category_title;

    if (isNaN(id)) {
        res.json(flag.FLAG_NOT_AVAILABLE_CATEGORY_JSON);
        return;
    }

    pool.getConnection(function (err, connection) {
        if (err) {
            console.log(err);
            res.json(flag.FLAG_DB_CONNECTION_ERROR_JSON);
        } else {
            connection.query('INSERT INTO YOUTUBE_CATEGORY VALUES(?,?)', [id, title], function (err, result) {
                if (err) {
                    res.json(flag.FLAG_ALREADY_REG_CATEGORY_JSON);
                } else {
                    res.json(flag.FLAG_SUCCESS_JSON);
                }
            });
        }
        connection.release();
    });

};

exports.getCategory = function (req, res) {
    pool.getConnection(function (err, connection) {
        if (err) {
            console.log(err);
            res.json(flag.FLAG_DB_CONNECTION_ERROR_JSON);
        } else {
            connection.query('SELECT video_category_title, video_category_id FROM YOUTUBE_CATEGORY ORDER BY VIDEO_CATEGORY_ID', [], function (err, result) {
                if (err) {
                    res.json(flag.FLAG_UNKNOWN_ERROR_JSON);
                } else {
                    var sendData = (JSON.parse(JSON.stringify(flag.FLAG_SUCCESS_JSON)));
                    console.log(sendData);
                    sendData.contents = result;
                    res.json(sendData);
                }
            });
        }
        connection.release();
    });

};

exports.modifyCategory = function (req, res) {

    var id = Number(req.query.category_id);
    var title = req.query.category_title;

    if (isNaN(id)) {
        res.json(flag.FLAG_NOT_EXIST_CATEGORY_JSON);
        return;
    }

    pool.getConnection(function (err, connection) {
        if (err) {
            console.log(err);
            res.json(flag.FLAG_DB_CONNECTION_ERROR_JSON);
        } else {
            connection.query('UPDATE YOUTUBE_CATEGORY SET VIDEO_CATEGORY_TITLE = ? WHERE VIDEO_CATEGORY_ID = ?', [title, id], function (err, result) {
                if (err) {
                    res.json(flag.FLAG_NOT_EXIST_CATEGORY_JSON);
                } else {
                    if (result.affectedRows > 0) {
                        res.json(flag.FLAG_SUCCESS_JSON);
                    } else {
                        res.json(flag.FLAG_NOT_EXIST_CATEGORY_JSON);
                    }
                }
            });
        }
        connection.release();
    });

};

exports.deleteCategory = function (req, res) {

    var id = req.query.category_id;

    pool.getConnection(function (err, connection) {
        if (err) {
            console.log(err);
            res.json(flag.FLAG_DB_CONNECTION_ERROR_JSON);
        } else {
            connection.query('DELETE FROM YOUTUBE_CATEGORY WHERE VIDEO_CATEGORY_ID = ?', [id], function (err, result) {
                if (err) {
                    res.json(flag.FLAG_ALREADY_EXIST_OTHER_TABLE_JSON);
                } else {
                    if (result.affectedRows > 0) {
                        res.json(flag.FLAG_SUCCESS_JSON);
                    } else {
                        res.json(flag.FLAG_NOT_EXIST_CATEGORY_JSON);
                    }
                }
            });
        }
        connection.release();
    });

};