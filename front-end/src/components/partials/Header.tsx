import { useCookies } from "react-cookie";
import Logo from "./Logo";
import Navigation from "./Navigation";

function Notifictions(){
    return (
        <div className="header-notifications">
            <div className="header-notifications-trigger">
                <a href="/home" style={{color: '#2a41e8', fontWeight: 'bold'}}><i className="icon-feather-bell"></i></a>
            </div>
        </div>
    )
}

function Header(){

    // JSX = JavaScript XML
    return (
        <header id="header-container" className="fullwidth dashboard-header not-sticky">
            <div id="header">
                <div className="container">
                    <div className="left-side">
                    <Logo/>
                    <Navigation />
                    <div className="clearfix"></div>
                    </div>
                        <div className="right-side">
                            <div className="header-widget hide-on-mobile">
                                <Notifictions />
                            </div>
                        
                            <div className="header-widget">
                                
                                <div className="header-notifications user-menu">
                                    <div className="header-notifications-trigger">
                                        <a href="/profile"><div className="user-avatar status-online"><img src="/src/assets/images/user-avatar-small-01.jpg" alt="" /></div></a>
                                    </div>
                                </div>
                            </div>

                        </div>
                </div>
            </div>
        </header>
    );
}

export default Header