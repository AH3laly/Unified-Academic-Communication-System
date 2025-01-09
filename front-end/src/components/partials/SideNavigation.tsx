
import { useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";

function LinkBasedElement({link}: any){
    return <a href={link.href}><i className={link.iconClass}></i> {link.title} </a>
}

function EventBasedElement({link}: any){
    return <a href="#" onClick={link.onClick}><i className={link.iconClass}></i> {link.title} </a>
}

function SideNavigation(){

    const location = useLocation();
    const [cookie, setCookie] = useCookies(['session']);
    const session = cookie.session;

    function handleLogout(){
        // Logout Remote Server
        fetch('http://localhost:3000/account/logout',{
            method: 'GET',
            credentials: 'include' // Ensure cookies are included
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            // Remove Local Cookie
            setCookie('session', '', {path: '/'});
            window.location.href = '/login';
        });
    }

    const links = [
        {title: 'Home', href: '/home', iconClass: 'icon-material-outline-dashboard', viewMode: 'login', isVisible: () => {
            return session;
        }},
        {title: 'Accounts', href: '/search', iconClass: 'icon-material-outline-rate-review', viewMode: 'login', isVisible: () => {
            return session;
        }},
        {title: 'Posts', href: '/posts', iconClass: 'icon-material-outline-star-border', viewMode: 'login', isVisible: () => {
            return session;
        }},
        {title: 'Messages', href: '/messages', iconClass: 'icon-material-outline-question-answer', viewMode: 'login', isVisible: () => {
            return session;
        }},
        {title: 'Profile', href: '/profile', iconClass: 'icon-material-outline-settings', viewMode: 'login', isVisible: () => {
            return session;
        }},
        {title: 'CreateAccount', href: '/createAccount', iconClass: 'icon-material-outline-settings', viewMode: 'login', isVisible: () => {
            return session && !session.parentId;
        }},
        {title: 'Login', href: '/login', iconClass: 'icon-material-outline-settings', viewMode: 'logout', isVisible: () => {
            return !session;
        }},
        {title: 'Logout', href: '/logout', iconClass: 'icon-material-outline-power-settings-new', viewMode: 'login', isVisible: () => {
            return session;
        }}
    ];

    return (
        <div className="dashboard-nav-container">
        <a href="#" className="dashboard-responsive-nav-trigger">
            <span className="hamburger hamburger--collapse" >
                <span className="hamburger-box">
                    <span className="hamburger-inner"></span>
                </span>
            </span>
            <span className="trigger-title">Dashboard Navigation</span>
        </a>
        <div className="dashboard-nav">
            <div className="dashboard-nav-inner">
                <ul>
                    {links.map( (link, index) => 
                        (link.isVisible() ? <li key={index} className={location.pathname.replace('/','') === link.href.replace('/','') ? 'active' : ''}>
                            {link.href !== '' ? <LinkBasedElement link={link}/> : <EventBasedElement link={link}/>}
                        </li>: null)
                    )}
                </ul>
            </div>
        </div>
    </div>
    );
}

export default SideNavigation;

