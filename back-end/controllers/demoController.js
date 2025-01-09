
const helpers = require('../helpers/globalFunctions');
const { ObjectId, ISODate } = require('mongodb');
const crypto = require('crypto')

const account_create_demo_data = (req, res, db) => {

    const demoAccounts = [
        {
            accountId: new ObjectId(),
            name: 'UPM',
            title: 'Admin',
            email: '@upm.edu.my',
            phone: '123456789',
            password: 'password',
            active: true
        },
        {
            accountId: new ObjectId(),
            name: 'UTM',
            title: 'Admin',
            email: '@utm.edu.my',
            phone: '123456789',
            password: 'password',
            active: true
        },
        {
            accountId: new ObjectId(),
            name: 'MMU',
            title: 'Admin',
            email: '@mmu.edu.my',
            phone: '123456789',
            password: 'password',
            active: true
        }
        ,
        {
            accountId: new ObjectId(),
            name: 'UniSZA',
            title: 'Admin',
            email: '@unisza.edu.my',
            phone: '123456789',
            password: 'password',
            active: true
        }
        
    ];

    const createMessages = function(account){

        function getTimePlus(plusHours){
            const timeToAdd = plusHours * 60 * 60 * 1000;
            let time = new Date();
            time.setTime(time.getTime() + timeToAdd);
            return time;
        }

        db.collection('message')
        .insertMany([
            {
                messageId: new ObjectId(),
                fromAccountId: new ObjectId(account.accountId),
                toAccountId: new ObjectId(account.parentId),
                content: 'Message 1 Lorem ipsum dolor sit amet.',
                creationDate: getTimePlus(1)
            },
            {
                messageId: new ObjectId(),
                fromAccountId: new ObjectId(account.parentId),
                toAccountId: new ObjectId(account.accountId),
                content: 'Reply 1 Lorem ipsum dolor sit amet.',
                creationDate: getTimePlus(2)
            },
            {
                messageId: new ObjectId(),
                fromAccountId: new ObjectId(account.accountId),
                toAccountId: new ObjectId(account.parentId),
                content: 'Message 2 Lorem ipsum dolor sit amet.',
                creationDate: getTimePlus(3)
            },
            {
                messageId: new ObjectId(),
                fromAccountId: new ObjectId(account.parentId),
                toAccountId: new ObjectId(account.accountId),
                content: 'Reply 2 Lorem ipsum dolor sit amet.',
                creationDate: getTimePlus(4)
            },
            {
                messageId: new ObjectId(),
                fromAccountId: new ObjectId(account.accountId),
                toAccountId: new ObjectId(account.parentId),
                content: 'Message 3 Lorem ipsum dolor sit amet.',
                creationDate: getTimePlus(5)
            },
            {
                messageId: new ObjectId(),
                fromAccountId: new ObjectId(account.parentId),
                toAccountId: new ObjectId(account.accountId),
                content: 'Reply 3 Lorem ipsum dolor sit amet.',
                creationDate: getTimePlus(6)
            },
            {
                messageId: new ObjectId(),
                fromAccountId: new ObjectId(account.accountId),
                toAccountId: new ObjectId(account.parentId),
                content: 'Message 4 Lorem ipsum dolor sit amet.',
                creationDate: getTimePlus(7)
            },
            {
                messageId: new ObjectId(),
                fromAccountId: new ObjectId(account.parentId),
                toAccountId: new ObjectId(account.accountId),
                content: 'Reply 4 Lorem ipsum dolor sit amet.',
                creationDate: getTimePlus(8)
            },
            {
                messageId: new ObjectId(),
                fromAccountId: new ObjectId(account.accountId),
                toAccountId: new ObjectId(account.parentId),
                content: 'Message 5 Lorem ipsum dolor sit amet.',
                creationDate: getTimePlus(9)
            },
            {
                messageId: new ObjectId(),
                fromAccountId: new ObjectId(account.parentId),
                toAccountId: new ObjectId(account.accountId),
                content: 'Reply 5 Lorem ipsum dolor sit amet.',
                creationDate: getTimePlus(10)
            }
        ]);
    }
    const createPosts = function(accountId){
        // Posts
        db.collection('post')
        .insertMany([
            {
                postId: new ObjectId(),
                accountId: new ObjectId(accountId),
                type: 'text',
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vestibulum felis a maximus tempor. Duis ac sapien non est dictum venenatis eget eleifend tellus.',
                creationDate: new Date(),
            },
            {
                postId: new ObjectId(),
                accountId: new ObjectId(accountId),
                type: 'text',
                content: 'Fusce efficitur, ante cursus blandit aliquam, arcu purus tincidunt nulla, vitae sagittis erat odio id est. Nulla congue egestas diam, sit amet sodales sem convallis ut. Sed dolor elit, congue quis molestie non, vulputate ut mi. Suspendisse a convallis magna, et consectetur lacus.',
                creationDate: new Date(),
            },
            {
                postId: new ObjectId(),
                accountId: new ObjectId(accountId),
                type: 'text',
                content: 'Etiam luctus elementum libero bibendum tincidunt. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
                creationDate: new Date(),
            },
            {
                postId: new ObjectId(),
                accountId: new ObjectId(accountId),
                type: 'text',
                content:  'Mauris auctor porta lacus, a condimentum arcu suscipit elementum. Integer arcu mi, vestibulum nec purus id, congue eleifend lorem. Quisque interdum est a elementum ornare. Vestibulum sit amet nisl consectetur quam luctus porttitor.',
                creationDate: new Date(),
            },
        ]);
    }

    const createnotifications = function(accountId){

        // Notifications
        db.collection('notification')
        .insertMany([
            {
                notificationId: new ObjectId(),
                accountId: new ObjectId(accountId),
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque consectetur neque quis commodo vehicula. Donec vulputate, arcu eu efficitur placerat.',
                creationDate: new Date(),
                isNew: 1
            },
            {
                notificationId: new ObjectId(),
                accountId: new ObjectId(accountId),
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque non blandit nibh. Praesent pharetra sapien id nulla imperdiet, a dapibus.',
                creationDate: new Date(),
                isNew: 1
            },
            {
                notificationId: new ObjectId(),
                accountId: new ObjectId(accountId),
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut sit amet mollis turpis. Nullam porta, mi vitae condimentum facilisis, tellus.',
                creationDate: new Date(),
                isNew: 1
            },
            {
                notificationId: new ObjectId(),
                accountId: new ObjectId(accountId),
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean posuere vitae leo at finibus. Nunc vulputate placerat vestibulum. Morbi ullamcorper.',
                creationDate: new Date(),
                isNew: 1
            },
            {
                notificationId: new ObjectId(),
                accountId: new ObjectId(accountId),
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mattis sapien erat, sed placerat ipsum laoreet eget. Lorem ipsum dolor.',
                creationDate: new Date(),
                isNew: 1
            }
        ])
    }

    return;
    db.collection('account').find({})
    .forEach( account => {
        createnotifications(account.accountId);
        createPosts(account.accountId);
        if(account.accountId && account.parentId){
            createMessages(account);
        }
    });
    res.send('Done');
    return;

    // Create Demo Accounts
    demoAccounts.forEach((account, index) => {

        // Parent Accounts
        const domain = account.email;
        const title = account.name;

        const parentAccount = account;
        parentAccount.parentId = '';
        parentAccount.email = 'admin' + domain;

        db.collection('account')
        .insertOne(parentAccount)
        .then((result) => {
            // Create SubAccounts
            for(let i = 0; i <= 5; i++){
                db.collection('account').insertOne({
                    accountId: new ObjectId(),
                    parentId:  new ObjectId(account.accountId),
                    name: "Account " + i + " ",
                    title: "Researcher at " + title,
                    email: 'user' + i + domain,
                    phone: '123456789' + i,
                    password: 'password',
                    active: true
                })
                .then((result2) => {
                    console.log('result: ', result2);
                });
            }
        })
    });
};

module.exports = {
    account_create_demo_data,
}
