import { useCookies } from "react-cookie";
import Breadcrumb from "../../partials/Breadcrumb";
import Header from "../../partials/Header";
import SideNavigation from "../../partials/SideNavigation";
import Page404 from "../Page404";
import { useEffect, useState } from "react";


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

function fetchUserInfo(callback :any){
    fetch('http://localhost:3000/account/ping', {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        callback(data);
    });
}

function updateRemoteUserInfo(userInfo: any, setStatusMessage: any, setStatusError: any, callback: any){
    console.log(userInfo);
    fetch('http://localhost:3000/account/update', {
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
        callback(data);
    });
}

function Profile(){
    
    const [cookie, setCookie] = useCookies(['session']);
    const session = cookie.session;

    if(!session){
        return (<Page404 />);
    }

    const [statusMessage, setStatusMessage] = useState('');
    const [statusError, setStatusError] = useState('');
    const [accountId, setAccountId] = useState('');
    const [name, setName] = useState('');
    const [title, setTitle] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [scholarApiKey, setScholarApiKey] = useState('');
    const [scholarAuthorId, setScholarAuthorId] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    

    function updateUserInfo(){
        updateRemoteUserInfo(
            {
                name: name, 
                title: title, 
                email: email, 
                phone: phone, 
                scholarApiKey: scholarApiKey,
                scholarAuthorId: scholarAuthorId,
                newPassword: newPassword, 
                currentPassword: currentPassword, 
                confirmPassword: confirmPassword
            },
            setStatusMessage,
            setStatusError,
            (data: any) => {
                if(data.error === 0){
                    window.location.href = '/logout'
                }
            }
        )
    }

    const load = () => {
        fetchUserInfo( (data: any) => {
            setAccountId(data.content.userInfo.accountId);
            setName(data.content.userInfo.name);
            setTitle(data.content.userInfo.title);
            setEmail(data.content.userInfo.email);
            setPhone(data.content.userInfo.phone);
            setScholarApiKey(data.content.userInfo.scholarApiKey);
            setScholarAuthorId(data.content.userInfo.scholarAuthorId);
        });
    };

    useEffect(() => {
        // Execure when component Loads
        load();
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
                    <h3>Hello {session.name} !</h3>
                    <span>We are glad to see you again!</span>
                    <Breadcrumb title="Update Profile" />
                    <div className="row">

                        <div className="col-xl-12">
                            <div className="dashboard-box margin-top-0">

                                <div className="headline">
                                    <h3><i className="icon-material-outline-account-circle"></i> Update Profile</h3>
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

                                                <div className="col-xl-12">
                                                    <div className="submit-field">
                                                        <h5>Account Type:</h5>
                                                        <span>{session.parentName ? <>Sub Account of <b> {session.parentName} </b></> : <><strong title="Institution Account" style={{marginRight:'10px', color: 'green', fontSize:'20px'}}><i className="icon-line-awesome-institution"></i></strong><b>Institution Account</b></>}</span>
                                                    </div>
                                                </div>

                                                <div className="col-xl-6">
                                                    <div className="submit-field">
                                                        <h5>Name</h5>
                                                        <input type="text" className="with-border" value={name}
                                                            onChange={(e) => {setName(e.target.value)}}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-xl-6">
                                                    <div className="submit-field">
                                                        <h5>Title</h5>
                                                        <input type="text" className="with-border" value={title}
                                                            onChange={(e) => {setTitle(e.target.value)}}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-xl-6">
                                                    <div className="submit-field">
                                                        <h5>Email</h5>
                                                        <input type="text" className="with-border"  value={email}
                                                            onChange={(e) => {setEmail(e.target.value)}}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-xl-6">
                                                    <div className="submit-field">
                                                        <h5>Phone</h5>
                                                        <input type="text" className="with-border" value={phone}
                                                            onChange={(e) => {setPhone(e.target.value)}}
                                                        />
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="row">
                                            <div className="col-xl-4">
                                                    <div className="submit-field">
                                                        <h5>Google Scholar API-Key</h5>
                                                        <input type="text" className="with-border" value={scholarApiKey}
                                                            onChange={(e) => {setScholarApiKey(e.target.value)}}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-xl-4">
                                                    <div className="submit-field">
                                                        <h5>Google Scholar Author ID</h5>
                                                        <input type="text" className="with-border" value={scholarAuthorId}
                                                            onChange={(e) => {setScholarAuthorId(e.target.value)}}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-xl-4">
                                                    <div className="submit-field">
                                                        <h5>Current Password</h5>
                                                        <input type="password" className="with-border" value={currentPassword}
                                                            onChange={(e) => {setCurrentPassword(e.target.value)}}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-xl-4">
                                                    <div className="submit-field">
                                                        <h5>New Password</h5>
                                                        <input type="password" className="with-border" value={newPassword}
                                                            onChange={(e) => {setNewPassword(e.target.value)}}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-xl-4">
                                                    <div className="submit-field">
                                                        <h5>Repeat New Password</h5>
                                                        <input type="password" className="with-border" value={confirmPassword} 
                                                            onChange={(e) => {setConfirmPassword(e.target.value)}}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-xl-12 padding-bottom-30">
                                                    <button className="button ripple-effect big margin-top-30" onClick={() => {
                                                        updateUserInfo();
                                                    }}>Update Profile</button>
                                                    
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

export default Profile;