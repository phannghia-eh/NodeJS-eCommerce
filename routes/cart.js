var express = require('express');
var router = express.Router();

var cartController = require('../controllers/cartController');

router.get('/',cartController.index);

router.post('/add/:id', cartController.add_item);

router.post('/delete/:id',cartController.delete_item_all);

router.post('/update/:id/:qty', cartController.update_quantity);

router.get('/checkout', cartController.check_out);

router.post('/save',cartController.save);

module.exports = router;