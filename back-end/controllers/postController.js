
const { ObjectId } = require('mongodb');
const helpers = require('../helpers/globalFunctions');

const push_notification = (accountId, message, db) => {

    db.collection('notification').insertOne({
        notificationId: new ObjectId(),
        accountId: accountId == '*' ? '*' : new ObjectId(accountId),
        content: message,
        isNew: 1,
        creationDate: new Date()
    })
}

const post_index = (req, res, db) => {
    
    // Require Authentication
    if(!helpers.is_logged_in(req)){
        res.status(401).json(helpers.generate_response_message(1, 'Unauthorized', {}));
        return;
    }

    const currentPage = req.query.page || 1;
    const searchString = req.query.searchString || '';
    const accountId = req.query.accountId || '';

    const itemsPerPage = 5;
    const skip = (currentPage - 1) * itemsPerPage;
    const limit = skip + itemsPerPage;

    const match = {
        $match: {
            content: { $regex: '.*' + searchString + '.*', $options: "si" },
        }
    };

    accountId ? match.$match.accountId = new ObjectId(accountId) : null;

    let items = [];

    const getItemsCount = (responseToSend) => {

        responseToSend.pages = [];

        return db.collection('post')
            .countDocuments(match.$match)
            .then((itemsCount) => {
            
                responseToSend.itemsCount = itemsCount;
                // Calculate Pages
                let numberOfPages = Math.ceil(responseToSend.itemsCount / itemsPerPage);
                responseToSend.pages = [];
                for(let i = 1; i<= numberOfPages; i++){
                    responseToSend.pages.push(i);
                }
                res.status(200).send(helpers.generate_response_message(0, 1, responseToSend));
        });
    }

    db.collection('post')
    .aggregate([
        match,
        {
            $sort: {_id: -1}
        },
        {
            $lookup:
            {
                from: 'account',
                localField: 'accountId',
                foreignField: 'accountId',
                as: 'accountInfo'
            }
        },
        {
            $project: {
                postId: 1, content: 1, creationDate: 1,
                accountInfo: {accountId: 1, parentId: 1, name: 1, title: 1, email: 1, phone: 1},
            }
        },
        {
            $limit: limit
        },
        {
            $skip: skip
        }
    ])
    .forEach( item => {
        if(item.accountInfo.length > 0){
            items.push(item);
        }
    })
    .then((result) => {

        getItemsCount({
            items: items,
            currentPage: currentPage
        });
    })
    .catch(() => {
        res.status(500).json({ error: 'Could not fetch the document' })
    });
};

const post_create = (req, res, db) => {

    // Require Authentication
    if(!helpers.is_logged_in(req)){
        res.status(401).json(helpers.generate_response_message(1, 'Unauthorized', {}));
        return;
    }

    const userInfo = helpers.get_user_info(req);

    // Check required Params
    if(!req.body.content){
        res.status(200).send(helpers.generate_response_message(1, 'Post content is required.', {}));
        return;
    }
    
    const createObject = {
        postId: new ObjectId(),
        accountId: new ObjectId(userInfo.accountId), // This Post belongs to current User
        type: 'text',
        content: req.body.content,
        creationDate: new Date()
    };

    console.log(createObject)
    // Do the Insertion
    db.collection('post')
    .insertOne(createObject)
    .then((result) => {

        push_notification('*', userInfo.name + ' Created new Post.', db); // Notify All users

        res.status(201).json(helpers.generate_response_message(0, 'Post Created.', createObject)); // 201 means successfully added the resource
    })
    .catch(err => {
        res.status(500).send(helpers.generate_response_message(1, 'Action Failed!', err));
    });
};

module.exports = {
    post_index,
    post_create
}
