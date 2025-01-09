import { useCookies } from "react-cookie";
import Breadcrumb from "../partials/Breadcrumb";
import Header from "../partials/Header";
import SideNavigation from "../partials/SideNavigation";
import Page404 from "./Page404";
import { useEffect, useState } from "react";

function SearchPagination({pagination, onSelectPage}: any){

    const [currentPage, setCurrentPage] = useState(pagination.currentPage);

    return (
        <div className="pagination-container margin-top-20 margin-bottom-20">
            <nav className="pagination">
                <ul>
                    {pagination.pages.map( (page: string, index: any) => (<li style={{cursor: 'pointer', margin: '0px 5px'}} key={index}><a onClick={(e) => {setCurrentPage(page); onSelectPage(page)}} className={page == currentPage ? 'ripple-effect current-page' : 'ripple-effect'}>{page}</a></li>))}
                </ul>
            </nav>
        </div>
    )
}

function SearchTextBox({searchString, setSearchString, onSearch}: any){

    return (
        <div className="keywords-container" style={{width: '500px'}}>
            
            <div className="keyword-input-container">
                <input type="text" className="keyword-input" placeholder="Search ..." value={searchString} onChange={e => setSearchString(e.target.value)}/>
                <button className="keyword-input-button ripple-effect" onClick={onSearch} ><i className="icon-material-outline-search"></i></button>
            </div>
            <div className="keywords-list"></div>
            <div className="clearfix"></div>
        </div>
    )
}

function SearchItem({item, createMessage}: any){

    const [message, setMessage] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [statusError, setStatusError] = useState('');

    return (
    <li>
        <div className="freelancer-overview manage-candidates">
            <div className="freelancer-overview-inner">

                <div className="freelancer-avatar">
                    <div className="verified-badge"></div>
                    <a href={"/posts/" + item.accountId}><img src="/src/assets/images/user-avatar-big-01.jpg" alt="" /></a>
                </div>

                <div className="freelancer-name">
                    <h4 style={{cursor:'unset'}}>
                        {!item.parentId && <strong title="Institution Account" style={{marginRight:'10px', color: 'green', fontSize:'20px'}}><i className="icon-line-awesome-institution"></i></strong>}
                        <a href={"/posts/" + item.accountId}>{item.name}</a>
                    </h4>
                    <div className="margin-top-10 margin-bottom-10">{item.title}</div>
                    <span className="freelancer-detail-item"><i className="icon-feather-mail"></i> {item.email}</span>
                    <span className="freelancer-detail-item"><i className="icon-feather-phone"></i> {item.phone}</span>
                    <a href={"/posts/" + item.accountId}>
                        <span style={{color:'#9d2a2a', fontWeight:'bold'}} className="freelancer-detail-item"><i className="icon-material-outline-star-border"></i>View Posts</span>
                    </a>
                    
                    <div className="buttons-to-right always-visible margin-top-10 margin-bottom-5">
                        <input type="text" placeholder="Enter your message" style={{width:'400px', display:'inline-block'}} onChange={e => setMessage(e.target.value)}/>
                        <button className="popup-with-zoom-anim button ripple-effect" style={{margin: '5px 5px', height: '48px'}}
                        onClick={() => {
                            createMessage(item.accountId, message, setStatusMessage, setStatusError);
                        }}
                        ><i className="icon-feather-mail"></i> Send Message</button> <span style={{color: statusError == '1' ? 'red' : 'green'}}>{statusMessage}</span>
                    </div>
                </div>
            </div>
        </div>
    </li>
    )
}

function fetchItems({setItems, setPagination, params} :any){
    fetch(`http://localhost:3000/search?page=${params.page}&searchString=${params.searchString}`, {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        setItems(data.content.items);
        setPagination({pages: data.content.pages, currentPage: data.content.currentPage});
    });
}

function createRemoteMessage({targetUserId, message, setStatusMessage, setStatusError}: any){
    fetch('http://localhost:3000/account/createMessage', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({targetUserId: targetUserId, message: message})
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        setStatusMessage(data.message);
        setStatusError(data.error);
    });
}

function Search(){

    const [cookie, setCookie] = useCookies(['session']);
    const session = cookie.session;

    if(!session){
        return (<Page404 />);
    }

    const [items, setItems] = useState([]);
    const [pagination, setPagination] = useState({pages:[], currentPage: 1});
    const [currentPage, setCurrentPage] = useState(1);
    const [searchString, setSearchString] = useState('');

    const loadItems = (page: any) => {
        fetchItems({
            params: {page: page, searchString: searchString},
            setItems: setItems,
            setPagination: setPagination
        })
    };

    const createMessage = (targetUserId: any, message: any, setStatusMessage: any, setStatusError: any) => {
        createRemoteMessage( {targetUserId, message, setStatusMessage, setStatusError})
    }

    useEffect(() => {
        // Execure when component Loads
        loadItems(1);
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
                    <Breadcrumb title="Accounts" />
                    <div className="row">
                        <div className="col-xl-12">
                            <div className="dashboard-box margin-top-0">
                            <div className="headline">
                                    <h3><i className="icon-material-outline-supervisor-account"></i> Accounts </h3>
                                </div>
                                <div className="headline" style={{width: '700px'}}>
                                    <SearchTextBox searchString={searchString} setSearchString={setSearchString} onSearch={() => loadItems(currentPage)} />
                                </div>
                                
                                <div className="content">
                                    <ul className="dashboard-box-list">
                                        {items.map((item, index) => <SearchItem key={index} item={item} createMessage={createMessage} />)}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="clearfix"></div>
                        {pagination.pages.length > 1 && <SearchPagination pagination={pagination} onSelectPage={loadItems}/>}
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Search;