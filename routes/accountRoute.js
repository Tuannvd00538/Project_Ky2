var controller = require('../controllers/accountController');

module.exports = function(app){
    app.route('/login')
        .get(controller.getLogin)
        .post(controller.login);
    app.route('/create')
        .get(controller.checkExistsUsername)
        .post(controller.createAccount);
    app.route('/sign')
        .get(controller.getSign);
}