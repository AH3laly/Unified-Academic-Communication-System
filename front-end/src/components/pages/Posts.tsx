import { useCookies } from "react-cookie";
import Breadcrumb from "../partials/Breadcrumb";
import Header from "../partials/Header";
import SideNavigation from "../partials/SideNavigation";
import Page404 from "./Page404";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

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

function fetchItems({setItems, setPagination, setTargetAccount, params} :any){
    fetch(`http://localhost:3000/post?page=${params.page}&searchString=${params.searchString}&accountId=${params.accountId}`, {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        setItems(data.content.items);
        setTargetAccount(data.content.account || {});
        setPagination({pages: data.content.pages, currentPage: data.content.currentPage});
    });
}

function AccountInfo({account}: any){
    return (
        <li>
            <div className="freelancer-overview manage-candidates">
                <div className="freelancer-overview-inner">

                    <div className="freelancer-avatar">
                        <div className="verified-badge"></div>
                        <a href={"/posts/" + account.accountId}><img src="/src/assets/images/user-avatar-big-01.jpg" alt="" /></a>
                    </div>

                    <div className="freelancer-name">
                        <h4 style={{cursor:'unset'}}>
                            {!account.parentId && <strong title="Institution Account" style={{marginRight:'10px', color: 'green', fontSize:'20px'}}><i className="icon-line-awesome-institution"></i></strong>}
                            <a href={"/posts/" + account.accountId}>{account.name} - {account.title}</a>
                        </h4>
                        <span className="freelancer-detail-item"><i className="icon-feather-mail"></i> {account.email}</span>
                        <span className="freelancer-detail-item"><i className="icon-feather-phone"></i> {account.phone}</span>
                    </div>
                </div>
            </div>
        </li>
    )
}
function SearchTextBox({searchString, setSearchString, onSearch, targetAccountId}: any){
    return (
        <div className="keywords-container" style={{width: '500px'}}>
            <div className="keyword-input-container">
                <input type="text" className="keyword-input" placeholder="Search ..." value={searchString} onChange={e => setSearchString(e.target.value)}/>
                <button className="keyword-input-button ripple-effect" onClick={onSearch} ><i className='icon-material-outline-search'></i></button><span></span>
            </div>
            {targetAccountId && <div className='margin-left-10  margin-top-10'><strong>Results are Filtered</strong> <a style={{color: 'red'}} href="/posts">Click Here to show posts for all users</a></div>}
            <div className="keywords-list"></div>
            <div className="clearfix"></div>
        </div>
    )
}

function Pagination({pagination, onSelectPage, currentPage} : any){
    return (
        <div className="pagination-container margin-top-20 margin-bottom-20">
            <nav className="pagination">
                <ul>
                    {pagination.pages.map( (page: string, index: any) => (<li style={{cursor: 'pointer'}} key={index}><a onClick={(e) => {onSelectPage(page)}} className={page===currentPage ? 'ripple-effect current-page' : 'ripple-effect'}>{page}</a></li>))}
                </ul>
            </nav>
        </div>
    )
}

function PostItem({item}: any){
    const accountInfo = item.accountInfo[0];
    const postDate = item.creationDate.split('.')[0].split('T');
    return (
        <li>
            <div className="boxed-list-item">
                
                <div className="item-content">
                    <h4>
                    {!accountInfo.parentId && <strong title="Institution Account" style={{marginRight:'10px', color: 'green', fontSize:'20px'}}><i className="icon-line-awesome-institution"></i></strong>}  
                        <a href={"/posts/" + accountInfo.accountId}>{accountInfo.name} - {accountInfo.title}</a>
                    </h4>
                    <div className="item-details margin-top-10">
                        <div className="detail-item">
                            <i className="icon-material-outline-date-range"></i> <b>{postDate[0]} at {postDate[1]}</b>
                            <span style={{display: 'inline-block', width: '50px'}}></span>
                            <i className="icon-feather-phone"></i> {accountInfo.phone}
                            <span style={{display: 'inline-block', width: '50px'}}></span>
                            <i className="icon-material-outline-email"></i> {accountInfo.email} &nbsp;
                        </div>
                    </div>
                    <div className="item-description">
                        <p>{item.content}</p>
                    </div>
                </div>
            </div>
        </li>
    )
}

function createRemotePost(postInfo: any, setStatusMessage: any, setStatusError: any, callback: any){
    fetch('http://localhost:3000/post/create', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(postInfo)
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        setStatusMessage(data.message);
        setStatusError(data.error);
        callback();
    });
}

function Posts(){
    
    const [cookie, setCookie] = useCookies(['session']);
    const session = cookie.session;
    const { targetAccountId } = useParams();
    
    if(!session){
        return (<Page404 />);
    }

    const [items, setItems] = useState([]);
    const [pagination, setPagination] = useState({pages:[], currentPage: 1});
    const [targetAccount, setTargetAccount] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [searchString, setSearchString] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [statusError, setStatusError] = useState(0);
    const [content, setContent] = useState('');

    const createPost = (callback: any) => {
        createRemotePost(
            {
                content: content
            },
            setStatusMessage,
            setStatusError,
            callback
        )
    }

    const loadItems = (page: any) => {
        setCurrentPage(page);
        fetchItems({
            params: {page: page, searchString: searchString, accountId: targetAccountId || ''},
            setItems: setItems,
            setPagination: setPagination,
            setTargetAccount: setTargetAccount
        })
    };

    useEffect(() => {
        // Execure when component Loads
        loadItems(1);
    }, []);
    
    return (
        <><Header /><div className="clearfix"></div><div className="dashboard-container">
            <div className="dashboard-sidebar">
                <div className="dashboard-sidebar-inner" data-simplebar>
                    <SideNavigation />
                </div>
            </div>
            <div className="dashboard-content-container" data-simplebar>
                <div className="dashboard-content-inner">
                    <h3>Hello {session.name} !</h3>
                    <span>We are glad to see you again!</span>
                    <Breadcrumb title="Posts" />
                    <div className="row">
                    
                        <div className="col-xl-12">
                            <div className="submit-field">
                                <h5>Create New Post</h5>
                                <textarea cols="30" rows="5" className="with-border" 
                                value={content}
                                onChange={(e) => {setContent(e.target.value)}}></textarea>
                            </div>
                        </div>

                        <div className="col-xl-8">
                            <button className="button ripple-effect big margin-top-0 margin-bottom-30" 
                                onClick={() => createPost(() => { loadItems(1); })
                            }>Add Post</button>
                        </div>

                        {statusMessage !=='' && <StatusMessageBox statusMessage={statusMessage} statusError={statusError} />}

                        <div className="col-xl-12 margin-top-30">
                            <div className="dashboard-box margin-top-0">
                                
                                <div className="headline">
                                    <h3><i className="icon-material-outline-business"></i> Posts</h3>
                                </div>

                                <div className="headline">
                                    <SearchTextBox searchString={searchString} setSearchString={setSearchString} targetAccountId={targetAccountId} onSearch={() => loadItems(1)} />
                                </div>

                                <div className="content">
                                    <ul className="dashboard-box-list">
                                        {targetAccountId && <AccountInfo account={targetAccount} />}
                                        {items.map((item, index) => <PostItem key={index} item={item} />)}
                                    </ul>
                                    {items.length === 0  && <div style={{textAlign: "center", padding: '20px', fontWeight: 'bold'}}>No Posts</div>}
                                </div>
                            </div>
                            
                            <div className="clearfix"></div>
                            
                            {pagination.pages.length > 1 && <Pagination pagination={pagination} onSelectPage={loadItems} currentPage={currentPage}/>}
                            
                            <div className="clearfix"></div>
                        </div>
			        </div>
                </div>
            </div>
        </div></>
    )
}

export default Posts;