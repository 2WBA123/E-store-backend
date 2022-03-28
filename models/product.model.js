const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema(
	{
		name: String,
		imageUrl: String,
		price: Number,
		detail: String,
		quantity: Number,
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('products', ProductSchema);
