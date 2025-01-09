import { useCookies } from "react-cookie";
import Breadcrumb from "../../partials/Breadcrumb";
import Header from "../../partials/Header";
import SideNavigation from "../../partials/SideNavigation";
import Page404 from "../Page404";
import { useEffect, useState } from "react";

function loadRemoteMessages({accountId, setMessages} :any){
    fetch(`http://localhost:3000/account/messages?accountId=${accountId}`, {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        setMessages(data.content);
    });
}

function loadRemoteMessageContacts({setMessageContacts} :any){
    fetch('http://localhost:3000/account/messageContacts', {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        setMessageContacts(data.content);
    });
}

function createRemoteMessage(messageInfo: any, setStatusMessage: any, setStatusError: any, loadMessages: any){
    fetch('http://localhost:3000/account/createMessage', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(messageInfo)
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        setStatusMessage(data.message);
        setStatusError(data.error);
        loadMessages(messageInfo.targetUserId);
    });
}

function MessageContactItem({contact, loadMessages, setTargetUserId, setTargetUserName, setStatusMessage, targetUserId} : any){
    return (
        <li className={targetUserId == contact.accountId ? 'active-message' : ''} onClick={() => { setStatusMessage(''); setTargetUserId(contact.accountId); setTargetUserName(contact.name); loadMessages(contact.accountId); }}>
            <a>
                <div className="message-avatar"><i className="status-icon status-online"></i><img src="/src/assets/images/user-avatar-small-03.jpg" alt="" /></div>

                <div className="message-by" style={{cursor: 'pointer'}}>
                    <div className="message-by-headline">
                        <h5>{contact.name}</h5>
                    </div>
                    <p>{contact.title}</p>
                </div>
            </a>
        </li>
    )
}
function MessageContactList({messageContacts, loadMessages, setTargetUserId, setTargetUserName, setStatusMessage, setContactSearchString, loadMessageContacts, contactSearchString, targetUserId} : any){
    return (
        <div className="messages-inbox">
            <div className="messages-headline">
                <div className="input-with-icon">
                    <input id="autocomplete-input" type="text" placeholder="Search" value={contactSearchString} onChange={(e) => setContactSearchString(e.target.value)} />
                    <i className="icon-material-outline-search" style={{cursor: "pointer"}} onClick={loadMessageContacts}></i>
                </div>
            </div>

            <ul style={{overflow: 'auto', maxHeight: '650px'}}>
                {messageContacts.map(
                    (contact: any, index: any) => (contact.name.toLowerCase().indexOf(contactSearchString.toLowerCase()) != -1 || contact.title.toLowerCase().indexOf(contactSearchString.toLowerCase()) != -1) && <MessageContactItem key={index} contact={contact} loadMessages={loadMessages} setTargetUserId={setTargetUserId} setTargetUserName={setTargetUserName} setStatusMessage={setStatusMessage} targetUserId={targetUserId}/>
                )}
            </ul>
        </div>
    );
}

function MessageItem({message, currentAccountId}: any){

    let additionalClasses = '';
    if(currentAccountId === message.fromAccount[0].accountId){
        additionalClasses = 'message-bubble me';
        // My Message
    } else if(currentAccountId === message.toAccount[0].accountId){
        additionalClasses = 'message-bubble';
    }

    const messageDate = message.creationDate.split('.')[0].split('T');

    return (
        <div className={additionalClasses}>
            <div className="message-bubble-inner">
                <div className="message-avatar"><img src="/src/assets/images/user-avatar-small-01.jpg" alt="" /></div>
                <div className="message-text"><p>{message.content}</p><span style={{fontSize:'small'}}>{messageDate[0]} at {messageDate[1]}</span></div>
            </div>
            <div className="clearfix"></div>
        </div>
    )
    
}

function StatusMessageBox({statusMessage, statusError}: any){
    const severity = statusError == 1 ? 'error' : 'success';
    return (
        <div className="col-xl-12">
            <div className={'notification margin-bottom-0 margin-top-30 ' + severity}>
                <p><span>{statusMessage}</span></p>
                </div>
        </div>
    );
}


function Messages(){

    const [cookie, setCookie] = useCookies(['session']);
    const session = cookie.session;
    const [statusMessage, setStatusMessage] = useState('');
    const [statusError, setStatusError] = useState('');
    const [message, setMessage] = useState('');
    const [contactSearchString, setContactSearchString] = useState('');
    const [targetUserId, setTargetUserId] = useState('');
    const [targetUserName, setTargetUserName] = useState('');

    if(!session){
        return (<Page404 />);
    }

    const [messageContacts, setMessageContacts] = useState([]);
    const [messages, setMessages] = useState([]);
    const loadMessageContacts = (page: any) => {
        loadRemoteMessageContacts({
            setMessageContacts: setMessageContacts
        })
    };

    const loadMessages = (accountId: any) => {
        loadRemoteMessages({
            accountId,
            setMessages: setMessages
        })
    };
    
    const createMessage = () => {
        createRemoteMessage( {message: message, targetUserId: targetUserId}, setStatusMessage, setStatusError, loadMessages)
    }

    useEffect(() => {
        // Execure when component Loads
        loadMessageContacts(1);
    }, []);
    
    return (
        <>
        <Header /><div className="clearfix"></div><div className="dashboard-container">
            <div className="dashboard-sidebar">
                <div className="dashboard-sidebar-inner" data-simplebar>
                    <SideNavigation />
                </div>
            </div>
            <div className="dashboard-content-container" data-simplebar>
                <div className="dashboard-content-inner">
                    <h3>Hello {session.name} !</h3>
                    <span>We are glad to see you again!</span>
                    <Breadcrumb title="Messages" />
                    <div className="messages-container margin-top-0">
                        <div className="messages-container-inner">
                            <MessageContactList messageContacts={messageContacts} loadMessages={loadMessages} setTargetUserId={setTargetUserId} setTargetUserName={setTargetUserName} setStatusMessage={setStatusMessage} loadMessageContacts={loadMessageContacts} setContactSearchString={setContactSearchString} contactSearchString={contactSearchString} targetUserId={targetUserId}/>
                            <div className="message-content">
                                <div className="messages-headline">
                                    <h4>{targetUserName}</h4>
                                </div>
                                <div className="message-content-inner" style={{overflow: 'auto', maxHeight: '450px'}}>
                                    {messages.map((message: any, index: any) => <MessageItem currentAccountId={session.accountId} message={message} />)}
                                </div>
                                {targetUserId && <>
                                    <div>{statusMessage !=='' && <StatusMessageBox statusMessage={statusMessage} statusError={statusError} />}</div>
                                    <div className="message-reply">
                                        <textarea style={{height: '200px', border: 'solid #808080 1px', padding: '5px'}} placeholder="Your Message" data-autoresize value={message}
                                            onChange={(e) => {setMessage(e.target.value)}}></textarea>
                                        <button className="button ripple-effect" onClick={() => {createMessage();}}>Send</button>
                                    </div>
                                </>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Messages;