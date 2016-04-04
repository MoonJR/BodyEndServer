var express = require('express');
var router = express.Router();
var youtube = require('./youtube');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/insertVideo', youtube.insertVideo);
router.get('/getVideo', youtube.getVideo)
router.get('/deleteVideo', youtube.deleteVideo);

module.exports = router;
