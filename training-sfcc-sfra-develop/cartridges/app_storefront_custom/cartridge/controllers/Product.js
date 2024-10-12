'use strict';

var server = require('server');
var ProductMgr = require('dw/catalog/ProductMgr');
var ProductSearchModel = require('dw/catalog/ProductSearchModel');
var URLUtils = require('dw/web/URLUtils');

server.extend(module.superModule);

server.append('Show', function (req, res, next) {
    var viewData = res.getViewData();
    var productId = viewData.product ? viewData.product.id : null;
    if (!productId) {
        res.render('error/notFound');
        return next();
    }
    var product = ProductMgr.getProduct(productId);
    if (!product) {
        res.render('error/notFound');
        return next();
    }

    var suggestedProducts = [];


    if (product.isCategorized()) {
        var apiProductSearch = new ProductSearchModel();
        apiProductSearch.setCategoryID(product.getPrimaryCategory().ID);
        apiProductSearch.search();

        var productsIterator = apiProductSearch.getProductSearchHits();
        var uniqueProducts = [];

        while (productsIterator.hasNext()) {
            var searchProduct = productsIterator.next().getProduct();

            if (searchProduct && searchProduct.ID !== product.ID) {
                uniqueProducts.push({
                    name: searchProduct.name,
                    ID: searchProduct.ID,
                    url: URLUtils.url(
                        'Product-Show',
                        'pid',
                        searchProduct.ID
                    ).toString(),
                    imageUrl: searchProduct.getImage('medium') // Example method
                });
            }
        }
        // Add unique products to suggestedProducts
        suggestedProducts = uniqueProducts.slice(0, 4);
        // If less than 4, repeat products to fill up to 4
        while (suggestedProducts.length < 4) {
            suggestedProducts.push(uniqueProducts[suggestedProducts.length % uniqueProducts.length]);
        }
    }
    viewData.suggestedProducts = suggestedProducts;
    res.setViewData(viewData);
    next();
});
module.exports = server.exports();