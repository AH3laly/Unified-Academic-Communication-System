import { useCookies } from "react-cookie";
import Breadcrumb from "../../partials/Breadcrumb";
import Header from "../../partials/Header";
import SideNavigation from "../../partials/SideNavigation";
import Page404 from "../Page404";
import { useEffect, useState } from "react";

function createRemoteAccount(userInfo: any, setStatusMessage: any, setStatusError: any){
    console.log(userInfo);
    fetch('http://localhost:3000/account/create', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(userInfo)
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        setStatusMessage(data.message);
        setStatusError(data.error);
    });
}

function StatusMessageBox({statusMessage, statusError}: any){
    
    const severity = statusError == 1 ? 'error' : 'success';

    return (
        <div className="col-xl-12">
            <div className={"notification margin-bottom-30 " + severity}>
                <p><span>{statusMessage}</span></p>
                </div>
        </div>
    );
}

function CreateAccount(){
    
    const [cookie, setCookie] = useCookies(['session']);
    const session = cookie.session;

    if(!session){
        return (<Page404 />);
    }

    //const [userInfo, setUserInfo] = useState({name:''});
    const [statusMessage, setStatusMessage] = useState('');
    const [statusError, setStatusError] = useState('');

    const [accountId, setAccountId] = useState('');
    const [name, setName] = useState('');
    const [title, setTitle] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    

    function createAccount(){

        createRemoteAccount(
            {
                name: name, 
                title: title, 
                email: email, 
                phone: phone, 
                newPassword: newPassword, 
                currentPassword: currentPassword,
                confirmPassword: confirmPassword
            },
            setStatusMessage,
            setStatusError
        )
    }

    useEffect(() => {
        // Execure when component Loads
        
    }, []);
    
    return (
        
        <>
        <Header />
        <div className="clearfix"></div><div className="dashboard-container">
            <div className="dashboard-sidebar">
                <div className="dashboard-sidebar-inner" data-simplebar>
                    <SideNavigation />
                </div>
            </div>
            <div className="dashboard-content-container" data-simplebar>
                <div className="dashboard-content-inner">
                    <h3>Howdy, Tom!</h3>
                    <span>We are glad to see you again!</span>
                    <Breadcrumb title="Create Account" />
                    <div className="row">

                        <div className="col-xl-12">
                            <div className="dashboard-box margin-top-0">

                                <div className="headline">
                                    <h3><i className="icon-material-outline-account-circle"></i> Create Account</h3>
                                </div>

                                <div className="content with-padding padding-bottom-0">

                                    <div className="row">

                                        <div className="col-auto">
                                            <div className="avatar-wrapper" data-tippy-placement="bottom" title="Change Avatar">
                                                <img className="profile-pic" src="images/user-avatar-placeholder.png" alt="" />
                                            </div>
                                        </div>

                                        <div className="col">
                                            <div className="row">

                                                {statusMessage !=='' && <StatusMessageBox statusMessage={statusMessage} statusError={statusError} />}

                                                <div className="col-xl-6">
                                                    <div className="submit-field">
                                                        <h5>Name</h5>
                                                        <input type="text" className="with-border" value={name}
                                                            onChange={(e) => {setName(e.target.value)}}/>
                                                    </div>
                                                </div>

                                                <div className="col-xl-6">
                                                    <div className="submit-field">
                                                        <h5>Title</h5>
                                                        <input type="text" className="with-border" value={title}
                                                            onChange={(e) => {setTitle(e.target.value)}}/>
                                                    </div>
                                                </div>

                                                <div className="col-xl-6">
                                                    <div className="submit-field">
                                                        <h5>Email</h5>
                                                        <input type="text" className="with-border" value={email}
                                                            onChange={(e) => {setEmail(e.target.value)}}/>
                                                    </div>
                                                </div>

                                                <div className="col-xl-6">
                                                    <div className="submit-field">
                                                        <h5>Phone</h5>
                                                        <input type="text" className="with-border" value={phone}
                                                            onChange={(e) => {setPhone(e.target.value)}}/>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="row">
                                                <div className="col-xl-4">
                                                    <div className="submit-field">
                                                        <h5>Current Admin Password</h5>
                                                        <input type="password" className="with-border" value={currentPassword}
                                                            onChange={(e) => {setCurrentPassword(e.target.value)}}/>
                                                    </div>
                                                </div>

                                                <div className="col-xl-4">
                                                    <div className="submit-field">
                                                        <h5>Account Password</h5>
                                                        <input type="password" className="with-border" value={newPassword}
                                                            onChange={(e) => {setNewPassword(e.target.value)}}/>
                                                    </div>
                                                </div>

                                                <div className="col-xl-4">
                                                    <div className="submit-field">
                                                        <h5>Repeat Account Password</h5>
                                                        <input type="password" className="with-border" value={confirmPassword}
                                                            onChange={(e) => {setConfirmPassword(e.target.value)}}/>
                                                    </div>
                                                </div>
                                                <div className="col-xl-12 padding-bottom-30">
                                                    <button className="button ripple-effect big margin-top-30" onClick={() => {
                                                        createAccount();
                                                    }}>Create Account</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        </>
    )
}

export default CreateAccount;