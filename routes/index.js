var express = require('express');
var router = express.Router();
var youtube = require('./youtube');
var dataSet = require('./dataSet');
var redirectUrl = require('./redirectUrl');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/insertVideo', youtube.insertVideo);
router.get('/getVideo', youtube.getVideo);
router.get('/deleteVideo', youtube.deleteVideo);

router.get('/modifyCategory', youtube.modifyCategory);
router.get('/insertCategory', youtube.insertCategory);
router.get('/getCategory', youtube.getCategory);
router.get('/deleteCategory', youtube.deleteCategory);
router.get('/getVideoInfo', youtube.getVideoInfo);

router.get('/getDataSet', dataSet.getDataSet);
router.get('/setDataSet', dataSet.setDataSet);

router.get('/redirectUrl', redirectUrl.redirectUrl);

module.exports = router;
