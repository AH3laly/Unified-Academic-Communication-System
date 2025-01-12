
const { ObjectId } = require('mongodb');
const https = require("https");
const axios = require('axios');

const helpers = require('../helpers/globalFunctions');

const search_index = (req, res, db) => {
    
    // Require Authentication
    if(!helpers.is_logged_in(req)){
        res.status(401).json(helpers.generate_response_message(0, 'Unauthorized', {}));
        return;
    }

    const currentPage = req.query.page || 1;
    const searchString = req.query.searchString || '';

    const itemsPerPage = 5;
    const skip = (currentPage - 1) * itemsPerPage;
    const limit =  itemsPerPage;

    let accounts = [];

    function getItemsCount (response) {

        response.pages = [];
        return db.collection('account').countDocuments({$or: [
            {name: { $regex: '.*' + searchString + '.*', $options: "si" }},
            {email: { $regex: '.*' + searchString + '.*', $options: "si" }},
            {title: { $regex: '.*' + searchString + '.*', $options: "si" }},
            {phone: { $regex: '.*' + searchString + '.*', $options: "si" }},
        ]}).then((itemsCount) => {
            response.itemsCount = itemsCount;
            let numberOfPages = Math.ceil(response.itemsCount / itemsPerPage);

            for(let i = 1; i<= numberOfPages; i++){
                response.pages.push(i);
            }
            res.status(200).send(helpers.generate_response_message(0, 1, response));
        });
    }

    db.collection('account')
    .find({$or: [
        {name: { $regex: '.*' + searchString + '.*', $options: "si" }},
        {email: { $regex: '.*' + searchString + '.*', $options: "si" }},
        {title: { $regex: '.*' + searchString + '.*', $options: "si" }},
        {phone: { $regex: '.*' + searchString + '.*', $options: "si" }},
    ]})
    .sort({_id: -1})
    .skip(skip)
    .limit(limit)
    .forEach( account => {
        delete account.password;
        if(account.scholarApiKey && account.scholarAuthorId){
            account.hasScholarAccount = true;
        } else {
            account.hasScholarAccount = false;
        }
        delete account.scholarApiKey;
        delete account.scholarAuthorId;
        accounts.push(account);
    })
    .then(() => {

        getItemsCount({
            items: accounts,
            currentPage: currentPage
        });
        
    })
    .catch(() => {
        res.status(500).json({ error: 'Could not fetch the document' })
    });
};


const search_show_account_papers = (req, res, db) => {
    
    // Require Authentication
    if(!helpers.is_logged_in(req)){
        //res.status(401).json(helpers.generate_response_message(0, 'Unauthorized', {}));
        //return;
    }

    const accountId = req.query.accountId || '';

    if(!accountId){
        res.json(helpers.generate_response_message(1, 'Invalid Account ID', 'Account ID is required'));
        return;
    }


    const fetchScholarPapers = async (account, res) => {
        const url = `https://serpapi.com/search.json?engine=google_scholar_author&author_id=${account.scholarAuthorId}&api_key=${account.scholarApiKey}`;
      
        try {

            delete account.scholarApiKey;
            delete account.scholarAuthorId;
            delete account.password;

            const response = await axios.get(url);
            const results = response.data;
            res.send(helpers.generate_response_message(0, 'Account Papers', {
                account:  account,
                articles:  results['articles'],
                pagination: results['serpapi_pagination']
            }));
        } catch (error) {
            res.status(401).json(helpers.generate_response_message(0, 'No Papers', 'Unable to fetch Papers'));
        }
      };

    db.collection('account')
    .findOne({accountId: new ObjectId(accountId)})
    .then((result) => {

        if(!result.scholarApiKey || !result.scholarAuthorId){
            res.status(401).json(helpers.generate_response_message(0, 'No Papers', 'No papers for this account'));
        } else {
            // Fetch papers from Google Scholar
            
            fetchScholarPapers(result, res);
            
            /*
            const options = {
                host: 'serpapi.com',
                port: 443,
                path: `/search.json?engine=google_scholar_author&author_id=${result.scholarAuthorId}&api_key=${result.scholarApiKey}`,
                method: 'GET'
            };

            https.request(options, function(response) {
                response.setEncoding('utf8');
                response.on('data', function (chunk) {
                    res.send(helpers.generate_response_message(0, 'Account Papers', chunk));
                });
              }).end();*/
        }
    }).catch((error) => {
        res.status(401).json(helpers.generate_response_message(0, 'No Papers', 'Unable to fetch Papers'));
    });
};

module.exports = {
    search_index,
    search_show_account_papers
}
