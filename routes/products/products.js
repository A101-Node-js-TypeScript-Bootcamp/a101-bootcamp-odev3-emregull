const express = require('express');
let router = express.Router();
let productController = require('../../controllers/Products')

//In this way we can send the neccessary infos and create new item in product table
router.post('/', productController.add);
//In this way we can scan the table items
router.get('/fetch', productController.fetchAll);
//In this way we can send id via parameter and get the result from database about this item
router.get('/id/:id', productController.fetch);
//We can scan the discounted products
router.get('/discount', productController.check);
//We can delete the items with sending id via params, but in here you may get error because item discount status must be false
router.get('/delete/:id', productController.delete);
//We can update an item with id
router.post('/update/', productController.update);

module.exports = router;