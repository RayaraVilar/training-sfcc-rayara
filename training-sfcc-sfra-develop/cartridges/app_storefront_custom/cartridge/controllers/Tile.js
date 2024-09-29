'use strict';

var server = require('server');
server.extend(module.superModule);

var productHelpers = require('*/cartridge/scripts/helpers/productHelpers');

server.append('Show', function (req, res, next) {
    var product = res.getViewData().product;

    if (product && product.price && product.price.sales && product.price.list) {
        var priceOriginal = product.price.list.value;
        var pricePromo = product.price.sales.value;

        var discountPercentage = productHelpers.getDiscountMessage(priceOriginal, pricePromo);

        // Adiciona o desconto percentual ao pdict
        res.setViewData({
            discountPercentage: discountPercentage
        });
    }

    next();
});

module.exports = server.exports();