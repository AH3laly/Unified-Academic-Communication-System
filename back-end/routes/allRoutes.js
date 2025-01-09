const express = require('express');
const accountController = require('../controllers/accountController');
const searchController = require('../controllers/searchController');
const demoController = require('../controllers/demoController');
const postController = require('../controllers/postController');


function allRoutes(db){

    const router = express.Router();

    // Account controller
    router.get('/account/ping', accountController.account_ping);
    router.get('/account/login', (req, res) => { accountController.account_login (req, res, db); });
    router.get('/account/logout', accountController.account_logout);
    router.post('/account/update', (req, res) => { accountController.account_update (req, res, db); });
    router.post('/account/create', (req, res) => { accountController.account_create (req, res, db); });
    router.get('/account/messages', (req, res) => { accountController.account_messages (req, res, db); });
    router.post('/account/createMessage', (req, res) => { accountController.account_create_message (req, res, db); });
    router.get('/account/messageContacts', (req, res) => { accountController.account_message_contacts (req, res, db); });

    router.get('/account/notifications', (req, res) => { accountController.account_notifications (req, res, db); });
    router.get('/account/posts', (req, res) => { accountController.account_posts (req, res, db); });

    // Demo controller
    router.get('/demo/create', (req, res) => { demoController.account_create_demo_data (req, res, db); });

    // Search Controller
    router.get('/search', (req, res) => { searchController.search_index (req, res, db); });

    // Post Controller
    router.get('/post', (req, res) => { postController.post_index (req, res, db); });
    router.post('/post/create', (req, res) => { postController.post_create (req, res, db); });

    return router;
}


module.exports = allRoutes;
