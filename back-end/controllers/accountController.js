
const helpers = require('../helpers/globalFunctions');
const { ObjectId } = require('mongodb');

const push_notification = (accountId, message, db) => {

    db.collection('notification').insertOne({
        notificationId: new ObjectId(),
        accountId: accountId == '*' ? '*' : new ObjectId(accountId),
        content: message,
        isNew: 1,
        creationDate: new Date()
    })
}

/** PING */
const account_ping = (req, res) => {
    res.status(200).send(
        helpers.generate_response_message(0, 'Account Login Status', {loggedIn: req.session.user ? 1 : 0, userInfo: req.session.user})
    )
};

/** NOTIFICATIONS */
const account_notifications = (req, res, db) => {

    // Require Authentication
    if(!helpers.is_logged_in(req)){
        res.status(401).json(helpers.generate_response_message(1, 'Unauthorized', {}));
        return;
    }

    const userInfo = helpers.get_user_info(req);

    let notifications = [];
    
    db.collection('notification')
    .find({
        $or: [
            {accountId: new ObjectId(userInfo.accountId)},
            {accountId: '*'}
        ]
    })
    .sort({_id: -1})
    .forEach( notification => {
        notifications.push(notification);
    })
    .then(() => {

        // Make All Notifications NOT New
        db.collection('notification')
        .updateMany({
            $or: [
                {accountId: new ObjectId(userInfo.accountId)},
                {accountId: '*', creationDate: {$gt: helpers.get_time_after(24)}}
            ]
        },
        {
            $set: { isNew: 0 }
        }
        ).then(() => {
            res.status(200).send(helpers.generate_response_message(0, 'Notifications', {
                items: notifications,
                itemsCount: notifications.length
            }));
        });
    })
    .catch(() => {
        res.status(500).json({ error: 'Action Failed.' })
    });
};

/** POSTS */
const account_posts = (req, res, db) => {

    // Require Authentication
    if(!helpers.is_logged_in(req)){
        res.status(401).json(helpers.generate_response_message(1, 'Unauthorized', {}));
        return;
    }

    const page = req.query.p || 0;
    const itemsPerPage = 10;

    let posts = [];

    db.collection('post')
    .find()
    .sort({creationDate: 1})
    .skip(page * itemsPerPage)
    .limit(itemsPerPage)
    .forEach( post => {
        posts.push(post);
    })
    .then(() => {
        res.status(200).json(posts);
    })
    .catch(() => {
        res.status(500).json({ error: 'Action Failed.' })
    });
};

/** Message Contacts */
const account_message_contacts = (req, res, db) => {

    // Require Authentication
    if(!helpers.is_logged_in(req)){
        res.status(401).json(helpers.generate_response_message(1, 'Unauthorized', {}));
        return;
    }

    const accountId = helpers.get_loggedin_account(req).accountId;

    let contacts = [];
    let contactIds = [];
    
    db.collection('message')
    .aggregate([
        {
            $match: {
                $or: [{fromAccountId: new ObjectId(accountId)}, {toAccountId: new ObjectId(accountId)}]
            },
        },
        {
            $lookup:
            {
                from: 'account',
                localField: 'fromAccountId',
                foreignField: 'accountId',
                as: 'fromAccount'
            }
        },
        {
            $lookup:
            {
                from: 'account',
                localField: 'toAccountId',
                foreignField: 'accountId',
                as: 'toAccount'
            },
        },
        { "$project": { 
                fromAccount: {accountId: 1, name: 1, title: 1},
                toAccount: {accountId: 1, name: 1, title: 1}
            }
        }
    ])
    .sort({creationDate: 1})
    .forEach( message => {

        const fromAccount = message.fromAccount[0];
        const toAccount = message.toAccount[0];

        const fromAccountId = new ObjectId(fromAccount.accountId).toHexString();
        const toAccountId = new ObjectId(toAccount.accountId).toHexString();

        if(fromAccountId != accountId && !contactIds.includes(fromAccountId)){
            contacts.push(fromAccount);
            contactIds.push(fromAccountId);
        } else if(toAccountId != accountId && !contactIds.includes(toAccountId)){
            contacts.push(toAccount);
            contactIds.push(toAccountId);
        }
    })
    .then((result) => {
        res.status(201).json(helpers.generate_response_message(0, 'Message Contacts', contacts)); // 201 means successfully added the resource
    })
    .catch(err => {
        res.status(500).json({ error: 'Action Failed.' });
    });

    
};

/** CREATE MESSAGE */
const account_create_message = (req, res, db) => {

     // Require Authentication
     if(!helpers.is_logged_in(req)){
        res.status(401).json(helpers.generate_response_message(1, 'Unauthorized', {}));
        return;
    }

    const userInfo = helpers.get_user_info(req);

    // Check required Params
    if(!req.body.message || !req.body.targetUserId){
        res.status(200).send(helpers.generate_response_message(1, 'message and targetUserId are required.', {}));
        return;
    }
    
    const createObject = {
        name: req.body.name,
        messageId: new ObjectId(),
        fromAccountId: new ObjectId(userInfo.accountId),
        toAccountId: new ObjectId(req.body.targetUserId),
        content: req.body.message,
        creationDate: new Date()
    };

    // Do the Insertion
    db.collection('message')
    .insertOne(createObject)
    .then((result) => {
        
        push_notification(req.body.targetUserId, 'You have a new Message From ' + userInfo.name, db); // Notify the user

        res.status(201).send(helpers.generate_response_message(0, 'Message Sent.', createObject)); // 201 means successfully added the resource
    })
    .catch(err => {
        res.status(500).send(helpers.generate_response_message(1, 'Action Failed!', err));
    });
}

/** MESSAGES */
const account_messages = (req, res, db) => {

    // Require Authentication
    if(!helpers.is_logged_in(req)){
        res.status(401).json(helpers.generate_response_message(1, 'Unauthorized', {}));
        return;
    }

    // Check required Params
    if(!req.query.accountId){
        res.status(200).send(helpers.generate_response_message(1, 'Missing accountId parameter'));
        return;
    }

    const accountId = helpers.get_loggedin_account(req).accountId;
    const targetAccountId = req.query.accountId;

    const page = req.query.p || 0;
    const itemsPerPage = 10;

    let messages = [];
    db.collection('message')
    .aggregate([
        {
            $match: {
                $or: [
                    {fromAccountId: new ObjectId(accountId), toAccountId: new ObjectId(targetAccountId)},
                    {fromAccountId: new ObjectId(targetAccountId), toAccountId: new ObjectId(accountId)}
                ]
            },
        },
        {
            $lookup:
            {
                from: 'account',
                localField: 'fromAccountId',
                foreignField: 'accountId',
                as: 'fromAccount'
            }
        },
        {
            $lookup:
            {
                from: 'account',
                localField: 'toAccountId',
                foreignField: 'accountId',
                as: 'toAccount'
            },
        },
        { "$project": { 
            content: 1, 
            creationDate: 1, 
            fromAccount: {accountId: 1, name: 1, title: 1, email: 1, phone: 1},
            toAccount: {accountId: 1, name: 1, title: 1, email: 1, phone: 1}
            }
        }
    ])
    .sort({_id: 1})
    .forEach( message => {
        messages.push(message);
    })
    .then(() => {
        res.status(200).send(helpers.generate_response_message(0, 'Messages', messages));
    })
    .catch(() => {
        res.status(500).json({ error: 'Action Failed.' })
    });
};

/** LOGIN */
const account_login = (req, res, db) => {

    // Check if already logged in
    if(helpers.is_logged_in(req)){
        res.status(200).send(helpers.generate_response_message(1, 'Already Logged In', ''));
        return;
    }

    // Check required Params
    if(!req.query.username || !req.query.password){
        res.status(200).send(helpers.generate_response_message(1, 'Missing username and password parameters', req.query));
        return;
    }

    db.collection('account')
    .findOne({
        email: req.query.username, password: req.query.password
    }, {projection: {accountId: 1, parentId: 1, email: 1, phone: 1, name: 1, title: 1, active: 1, password: 1}})
    .then((result) => {
        result.parentName = '';
        req.session.user = result;
        req.session.user.token = helpers.generate_token(result.email, result.password);
        delete req.session.user.password;

        if(!result.parentId){
            req.session.user.parentName = '';
            res.status(201).json(helpers.generate_response_message(0, 'Logged in', result)); // 201 means successfully added the resource
        } else {
            db.collection('account')
            .findOne({ accountId: new ObjectId(result.parentId) }, {projection: {name: 1}})
            .then((result2) => {
                result.parentName = result2.name;
                req.session.user.parentName = result2.name;
                res.status(201).json(helpers.generate_response_message(0, 'Logged in', result)); // 201 means successfully added the resource
            });
        }
        
    })
    .catch(err => {
        res.status(500).json({ error: 'Action Failed.' });
    });
};

/** LOGOUT */
const account_logout = (req, res) => {
    // Check if already logged in
    if(!helpers.is_logged_in(req)){
        res.status(200).json(helpers.generate_response_message(1, 'Already Logged Out', {}));
        return;
    }
    delete req.session.user;
    res.send(helpers.generate_response_message(0, 'Logged Out', ''));
};


/** CREATE */
const account_create = (req, res, db) => {

    // Require Authentication
    if(!helpers.is_logged_in(req)){
        res.status(401).json(helpers.generate_response_message(1, 'Unauthorized', {}));
        return;
    }

    const userInfo = helpers.get_user_info(req);

    if(userInfo.parentId !== ''){
        res.status(200).send(helpers.generate_response_message(1, 'This feature is only available for Institution account.', {}));
        return;
    }

    // Check required Params
    if(!req.body.name || !req.body.title || !req.body.email || !req.body.phone || !req.body.currentPassword
        || !req.body.newPassword
    ){
        res.status(200).send(helpers.generate_response_message(1, 'Fields: name, title, phone, email, currentPassword, newPassword are required.', req.body));
        return;
    }
    
    const providedAccessToken = helpers.generate_token(userInfo.email, req.body.currentPassword);
    if(userInfo.token !== providedAccessToken){
        res.status(200).send(helpers.generate_response_message(1, 'Invalid Current Password', {}));
        return;
    }
    
    const createObject = {
        accountId: new ObjectId(),
        name: req.body.name,
        parentId: new ObjectId(userInfo.accountId), // This user belongs to current Institution account
        title: req.body.title,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.newPassword,
        isActive: true
    };

    // Check if the email already exists for different user
    db.collection('account').findOne({email: req.body.email}).then(
    (result) => {

        if(!result){

            // Do the Insertion
            db.collection('account')
            .insertOne(createObject)
            .then((result) => {
                delete createObject.password;
                res.status(201).json(helpers.generate_response_message(0, 'Account Created.', createObject)); // 201 means successfully added the resource
            })
            .catch(err => {
                res.status(500).send(helpers.generate_response_message(1, 'Action Failed!', err));
            });

        } else {
            res.status(200).json(helpers.generate_response_message(1, 'Email Already In Use', createObject));
        }

    }).catch(err => {
        res.status(500).send(helpers.generate_response_message(1, 'Action Failed!', err));
    });

};

/** UPDATE */
const account_update = (req, res, db) => {

    // Require Authentication
    if(!helpers.is_logged_in(req)){
        res.status(401).json(helpers.generate_response_message(1, 'Unauthorized', {}));
        return;
    }

    // Check required Params
    if(!req.body.name || !req.body.title || !req.body.email || !req.body.phone || !req.body.currentPassword){
        res.status(200).send(helpers.generate_response_message(1, 'Fields: name, title, phone, email, currentPassword are required.', req.body));
        return;
    }

    const userInfo = helpers.get_user_info(req);

    const providedAccessToken = helpers.generate_token(userInfo.email, req.body.currentPassword);
    if(userInfo.token !== providedAccessToken){
        res.status(200).send(helpers.generate_response_message(1, 'Invalid Current Password', {}));
        return;
    }
    
    const updateObject = {
        name: req.body.name,
        title: req.body.title,
        email: req.body.email,
        phone: req.body.phone,
    };

    if(req.body.newPassword){
        updateObject.password = req.body.newPassword;
    } else {
        delete updateObject.password;
    }

    // Check if the email already exists for different user
    db.collection('account').findOne({accountId: {$not: {$eq: new ObjectId(userInfo.accountId)}}, email: req.body.email}).then(
    (result) => {

        if(!result){

            // Do the Update
            db.collection('account')
            .updateOne({
                accountId: new ObjectId(userInfo.accountId), 
                email: userInfo.email
            }, {$set: updateObject})
            .then((result) => {
                
                if(
                    (updateObject.password && helpers.generate_token(updateObject.email, updateObject.password) != userInfo.token) ||
                    (updateObject.email !== userInfo.email)
                ){
                    // Username or Password has changed, We must logout
                    helpers.logout_user(req);
                }

                delete updateObject.password;
                res.status(201).json(helpers.generate_response_message(0, 'Profile Updated', updateObject)); // 201 means successfully added the resource
            })
            .catch(err => {
                res.status(500).send(helpers.generate_response_message(1, 'Action Failed!', err));
            });

        } else {
            res.status(200).json(helpers.generate_response_message(1, 'Email Already In Use', updateObject));
        }

    }).catch(err => {
        res.status(500).send(helpers.generate_response_message(1, 'Action Failed!', err));
    });

};

module.exports = {
    account_ping,
    account_login,
    account_logout,
    account_update,
    account_messages,
    account_create_message,
    account_message_contacts,
    account_notifications,
    account_posts,
    account_create
}
