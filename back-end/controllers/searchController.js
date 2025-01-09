
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

module.exports = {
    search_index
}
