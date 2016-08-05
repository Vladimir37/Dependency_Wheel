'use strict';

class Render {
    page(page) {
        return function (req, res, next) {
            res.render(page + '.ejs');
        }
    }
}

module.exports = Render;