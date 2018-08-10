var controller = require('../controllers/accountController');

module.exports = function(app){
    app.route('/login')
        .get(controller.getLogin)
        .post(controller.login);
    app.route('/create')
        .get(controller.checkExistsUsername)
        .post(controller.createAccount);
    app.route('/new')
        .get(controller.createMessage);
    app.route('/group')
        .get(controller.createGrMessage);
    app.route('/sign')
        .get(controller.getSign);
    app.route('/sendmsg')
        .post(controller.loginRequired, controller.saveMessage);
    app.route('/avatar/:id')
        .get(controller.getAvatar);
    app.route('/info/:id')
        .get(controller.getInfo);
    app.route('/:mode/:id')
        .get(controller.getMessage);
    app.route('/list/:mode/:id')
        .get(controller.loginRequired, controller.listMessage);
    app.route('/search/user/:id')
        .get(controller.loginRequired, controller.searchUser);
    app.route('/createMsg')
        .post(controller.loginRequired, controller.sendMsg);
}