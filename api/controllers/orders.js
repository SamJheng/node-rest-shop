const Order = require('../models/order');
const Product = require('../models/product');
const mongoose = require('mongoose');
exports.order_get_all = (req, res, next)=>{
    Order.find()
    .select('_id prodouct quantity')
    .populate('product','name')
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            order: docs.map(doc=> {
                return {
                    _id: doc._id,
                    prodouct: doc.prodouct,
                    quantity: doc.quantity,
                    require: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + doc._id
                    }
                }
            }),
        });
    })
    .catch(error => {
        console.log(error);
        res.status(500).json(error);
    })
};

exports.orders_create_order = (req, res, next)=>{
    Product.findById(req.body.productId)
    .then(product =>{
        if(!product){
            return res.status(404).json({
                message:'Product not found'
            });
        }
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            prodouct: req.body.productId,
            quantity: req.body.quantity
        });
        return order.save()
        
    })
    .then(result => {
        res.status(201).json({
            message: 'Order stored',
            createdOrder:{
                _id: result._id,
                prodouct: result.prodouct,
                quantity: result.quantity,
            },
            require: {
                type: 'GET',
                url: 'http://localhost:3000/orders/' + result._id
            }
        });
    })
    .catch(error => {
        console.log(error);
        res.status(500).json(error);
    });
}

exports.orders_get_order = (req, res, next)=>{
    Order.findById(req.params.orderId)
    .populate('product')
    .exec()
    .then(order =>{
        if(!order){
            return res.status(404).json({
                message:'order not found'
            });
        }
        res.status(200).json({
            order: order,
            require: {
                type: 'GET',
                url: 'http://localhost:3000/orders/'
            }
        })
    })
    .catch(error => {
        res.status(500).json(error);
    });
}
exports.orders_delete_order = (req, res, next)=>{
    Order.remove({_id: req.params.orderId})
    .exec()
    .then(result =>{
        res.status(200).json({
            message: 'Order deleted',
            require: {
                type: 'POST',
                url: 'http://localhost:3000/orders/',
                body: {
                    productId: 'ID',
                    quantity: 'Number',
                }
            }
        })
    })
    .catch(error => {
        res.status(500).json(error);
    });
}