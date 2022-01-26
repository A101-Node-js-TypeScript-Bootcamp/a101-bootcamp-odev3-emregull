const express = require('express');
let router = express.Router();

const userEndpoint = require('./user/user')
const productsEndpoint = require('./products/products')

router.use('/user', userEndpoint)
router.use('/products', productsEndpoint)
/*router.use('/posts',)
router.use('/tags')*/

module.exports = router;