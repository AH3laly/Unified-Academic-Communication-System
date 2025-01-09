import Breadcrumb from "../partials/Breadcrumb";
import Header from "../partials/Header";
import SideNavigation from "../partials/SideNavigation";

import AccountService from "../../services/AccountService";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Page404 from "./Page404";

function fetchUserInfo({setUserInfo} :any){
    fetch('http://localhost:3000/account/ping', {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        setUserInfo(data.content.userInfo);
    });
}

function fetchNotifications({setNotifications} :any){
    fetch('http://localhost:3000/account/notifications', {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        setNotifications(data.content.items);
    });
}

function NotificationItem({item}: any){
    const notificationDate = item.creationDate.split('.')[0].split('T');
    return (
        <>
        <li style={{backgroundColor: item.isNew ? '#ffffe9' : 'unset'}}>
            
            <span className="col-xl-12">
                <div>
                    <span className="notification-icon" style={{color: '#2a41e8', backgroundColor: 'unset'}}><i className="icon-material-baseline-notifications-none"></i></span>
                    <span style={{padding: '10px'}}>{item.content}</span>
                </div>
                <div style={{fontSize: 'small', fontWeight: 'bold', marginLeft: '50px'}}>{notificationDate[0]} at {notificationDate[1]}</div>
            </span>
        </li>
        </>
    )
}

function Home(){

    const [cookie, setCookie] = useCookies(['session']);
    const session = cookie.session;

    let loaded = 0;

    if(!session){
        return (<Page404 />);
    }

    const [notifications, setNotifications] = useState([]);
    const [userInfo, setUserInfo] = useState({name:''});

    const load = () => {

        // Fetch Notifications
        fetchNotifications({
            setNotifications: setNotifications
        });

        fetchUserInfo({
            setUserInfo: setUserInfo
        });
    };

    useEffect(() => {
        // Execure when component Loads
        if(!loaded){
            loaded = 1;
            load();
        }
    }, []);

    return (
        <>
        <Header />
        <div className="clearfix"></div>
            <div className="dashboard-container">
            <div className="dashboard-sidebar">
                <div className="dashboard-sidebar-inner" data-simplebar>
                    <SideNavigation />
                </div>
            </div>
            <div className="dashboard-content-container" data-simplebar>
                <div className="dashboard-content-inner" >
                <h3>Welcome Back {userInfo.name}!</h3>
                <span>We are glad to see you again!</span>
                <Breadcrumb title="" />
                    <div className="row">
                        
                        <div className="col-xl-6">
                            <div className="dashboard-box">
                                <div className="headline">
                                    <h3><i className="icon-material-baseline-notifications-none"></i> Notifications</h3>
                                </div>
                                <div className="content">
                                    <ul className="dashboard-box-list" style={{maxHeight: '600px', overflow: 'auto'}}>
                                        {notifications.map((item, index) => <NotificationItem key={index} item={item} />)}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-6">
                            <div className="dashboard-box" style={{textAlign: 'center', padding: '200px 0px', height: '650px'}}>
                                <img src="/src/assets/images/upm.png" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="dashboard-footer-spacer"></div>
                    <div className="small-footer margin-top-15">
                        <div className="small-footer-copyrights">
                            © 2018 <strong>UACS</strong>. All Rights Reserved.
                        </div>
                        <ul className="footer-social-links">
                            <li>
                                <a href="#" title="Facebook" data-tippy-placement="top">
                                    <i className="icon-brand-facebook-f"></i>
                                </a>
                            </li>
                            <li>
                                <a href="#" title="Twitter" data-tippy-placement="top">
                                    <i className="icon-brand-twitter"></i>
                                </a>
                            </li>
                            <li>
                                <a href="#" title="Google Plus" data-tippy-placement="top">
                                    <i className="icon-brand-google-plus-g"></i>
                                </a>
                            </li>
                            <li>
                                <a href="#" title="LinkedIn" data-tippy-placement="top">
                                    <i className="icon-brand-linkedin-in"></i>
                                </a>
                            </li>
                        </ul>
                        <div className="clearfix"></div>
                    </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home;