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

router.get('/modifyCategory', youtube.modifyCategory);
router.get('/insertCategory', youtube.insertCategory);
router.get('/deleteCategory', youtube.deleteCategory);


module.exports = router;
