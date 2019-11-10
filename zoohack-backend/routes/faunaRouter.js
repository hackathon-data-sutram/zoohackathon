var express = require('express');
var router = express.Router();
var faunaController = require('../controllers/faunaController');

router.post('/getkeywords', faunaController.getKeywords);
router.post('/findbykeywords', faunaController.findByKeywords);

module.exports = router;