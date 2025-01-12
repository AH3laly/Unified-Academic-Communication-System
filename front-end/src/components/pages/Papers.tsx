import { useCookies } from "react-cookie";
import Breadcrumb from "../partials/Breadcrumb";
import Header from "../partials/Header";
import SideNavigation from "../partials/SideNavigation";
import Page404 from "./Page404";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function fetchItems({setItems, setAccount, params} :any){
    fetch(`http://localhost:3000/search/accountPapers?accountId=${params.accountId}`, {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        setItems(data.content.articles || []);
        setAccount(data.content.account || {});
    });
}


function PaperItem({item}: any){
    return (
        <li>
            <div className="boxed-list-item">
                
                <div className="item-content">
                    <h4>
                        <a href={item.link} target="_blank">{item.title}</a>
                    </h4>
                    <div className="item-details margin-top-10">
                        <div className="detail-item">
                            <b>{item.title}</b>
                            <span style={{display: 'inline-block', width: '50px'}}></span>
                             <b>publication: </b>{item.publication}
                            <span style={{display: 'inline-block', width: '50px'}}></span>
                            <b>Year:</b>  {item.year}
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

function Papers(){
    
    const [cookie, setCookie] = useCookies(['session']);
    const session = cookie.session;
    const { accountId } = useParams();
    
    if(!session){
        return (<Page404 />);
    }

    const [items, setItems] = useState([]);
    const [account, setAccount] = useState({});

    const loadItems = () => {
        fetchItems({
            params: {accountId: accountId || ''},
            setItems: setItems,
            setAccount: setAccount
        })
    };

    useEffect(() => {
        // Execure when component Loads
        loadItems();
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
                    <Breadcrumb title="Articles" />
                    <div className="row">

                        <div className="col-xl-12 margin-top-30">
                            <div className="dashboard-box margin-top-0">
                                
                                <div className="headline">
                                    <h3><i className="icon-material-outline-business"></i> Articles</h3>
                                </div>
                
                                <div className="content">
                                    {items.length === 0  && <div style={{textAlign: "center", padding: '20px', fontWeight: 'bold'}}>No Papaers</div>}
                                    
                                    <ul className="dashboard-box-list">

                                        <li>
                                            <div className="freelancer-overview manage-candidates">
                                                <div className="freelancer-overview-inner">

                                                    <div className="freelancer-avatar">
                                                        <div className="verified-badge"></div>
                                                        <a href={"/search/accountPapers/" + account.accountId}><img src="/src/assets/images/user-avatar-big-01.jpg" alt="" /></a>
                                                    </div>

                                                    <div className="freelancer-name">
                                                        <h4 style={{cursor:'unset'}}>
                                                            {!account.parentId && <strong title="Institution Account" style={{marginRight:'10px', color: 'green', fontSize:'20px'}}><i className="icon-line-awesome-institution"></i></strong>}
                                                            <a href={"/search/accountPapers/" + account.accountId}>{account.name} - {account.title}</a>
                                                        </h4>
                                                        <span className="freelancer-detail-item"><i className="icon-feather-mail"></i> {account.email}</span>
                                                        <span className="freelancer-detail-item"><i className="icon-feather-phone"></i> {account.phone}</span>
                                                        <a href={"/posts/" + account.accountId}>
                                                            <span style={{color:'#9d2a2a', fontWeight:'bold'}} className="freelancer-detail-item"><i className="icon-material-outline-star-border"></i>View Posts</span>
                                                        </a>
                                                    
                                                    </div>
                                                </div>
                                            </div>
                                        </li>

                                        {items.map((item, index) => <PaperItem key={index} item={item} />)}
                                    </ul>
                                </div>
                            </div>
                            <div className="clearfix"></div>
                        </div>
			        </div>
                </div>
            </div>
        </div></>
    )
}

export default Papers;