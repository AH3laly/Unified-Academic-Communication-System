const crypto = require('crypto')

function get_time_after(plusHours){
    const timeToAdd = plusHours * 60 * 60 * 1000;
    let time = new Date();
    time.setTime(time.getTime() + timeToAdd);
    return time;
}

function generate_response_message(error, message, content){
    return {
        error: error,
        message: message,
        content: content
    }
}

function is_logged_in(req){
    if(req.session.user && req.session.user.token != ''){
        return true;
    } else {
        return false;
    }
}

function get_user_info(req){
    return req.session.user;
}

function logout_user(req){
    delete req.session.user;
}


function generate_token(email, password){
    return crypto.createHash('md5').update(email + ':' + password).digest("hex");
}

function get_loggedin_account(req){
    if(req.session.user && req.session.user.token != ''){
        return req.session.user;
    } else {
        return false;
    }
}

module.exports = {
    generate_response_message,
    is_logged_in,
    get_loggedin_account,
    get_user_info,
    generate_token,
    logout_user,
    get_time_after
}