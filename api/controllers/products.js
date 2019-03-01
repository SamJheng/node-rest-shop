const Product = require('../models/product');
const mongoose = require('mongoose');
exports.products_get_all = (req, res, next) => {
    Product.find()
        .select('name price _id productImage')
        .exec()
        .then(docs => {
            const reponse = {
                count: docs.length,
                product: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    }
                })
            };

            if (docs.length >= 0) {
                res.status(200).json({
                    reponse
                });
            } else {
                res.status(404).json({
                    message: "no entries found"
                });
            }

        })
        .catch(error => {
            res.status(500).json({
                error
            });
        })
};
exports.products_create_product = (req, res, next) => {
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product.save()
        .then(result => {
            // console.log(result);
            res.status(201).json({
                message: 'Post req products',
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    productImage: result.productImage,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + result._id
                    }
                }
            });

        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error
            });
        });

};
exports.products_get_product = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('name price _id productImage')
        .exec()
        .then(doc => {
            console.log('From database', doc);
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products'
                    }
                });
            } else {
                res.status(404).json({
                    message: "no valid entry found for product Id"
                });
            }

        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error
            });
        });
};

exports.products_update_product =(req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update( {_id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + id
                }
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error
            });
        });
}
exports.products_delete_product = (req, res, next) => {
    const id = req.params.productId;
    Product.remove({
        _id: id
    })
        .exec()
        .then(doc => {
            console.log('From database', doc);
            if (doc) {
                res.status(200).json({
                    message: 'Product deleted',
                    request: {
                        type: 'POST',
                        url: 'http://localhost:3000/products/' + id,
                        body:{
                            name: 'String',
                            price: 'Number'
                        }
                    }
                });
            } else {
                res.status(403).json({
                    message: "no valid entry found for product Id"
                });
            }

        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error
            });
        });
}