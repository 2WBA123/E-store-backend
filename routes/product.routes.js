const cliBoxes = require('cli-boxes');
const express = require('express');
const router = express.Router();

// MULTER Start
const multer = require('multer');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './uploads/');
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + file.originalname);
	},
});

const upload = multer({ storage: storage });

// Multer Ends

const product = require('../controllers/product.controller');

router.post('/', upload.single('imageUrl'), product.create);
router.post('/makePayment', product.makePayment);
router.get('/', product.findAll);
router.get('/:id', product.findOne);
router.delete('/:id', product.delete);
router.put('/:id', upload.single('imageUrl'), product.update);

module.exports = router;
