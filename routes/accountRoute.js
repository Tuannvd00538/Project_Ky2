var controller = require('../controllers/accountController');

module.exports = function(app){
    app.route('/login')
        .get(controller.login);
}