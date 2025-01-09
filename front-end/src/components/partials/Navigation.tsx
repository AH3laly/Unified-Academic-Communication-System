
import { Fragment } from "react/jsx-runtime";

function Navigation(props: any){

    const links = [
        {title: 'Home', href: '/home', iconClass: ''},
        {title: 'Accounts', href: '/search', iconClass: ''},
        {title: 'Posts', href: '/posts', iconClass: ''},
        {title: 'Messages', href: '/messages', iconClass: ''},
        {title: 'Profile', href: '/profile', iconClass: ''}
    ];

    return (
        <Fragment>
            <nav id="navigation">
            <ul id="responsive">
                { links.map( (link, key) => (<li key={key} ><a  className={location.pathname.replace('/','') === link.href.replace('/','') ? 'current' : ''} href={link.href}>{link.title}</a></li>)) }
            </ul>
        </nav>
        <div className="clearfix"></div>
        </Fragment>
    );
}

export default Navigation;

