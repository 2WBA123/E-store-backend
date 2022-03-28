const express = require('express');
const router = express();

const porductRoutes = require('./product.routes');

// Product Routes
router.use('/product', porductRoutes);

module.exports = router;
