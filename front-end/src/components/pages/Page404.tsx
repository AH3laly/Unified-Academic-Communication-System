import Breadcrumb from "../partials/Breadcrumb";
import Header from "../partials/Header";
import SideNavigation from "../partials/SideNavigation";

function Page404(){
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
                <h2>404 Not Found</h2>
                <Breadcrumb title="4O4" />
                <div className="container">

                    <div className="row">
                        <div className="col-xl-12">
                            <section id="not-found" className="center margin-top-50 margin-bottom-25">
                                <h2>404 <i className="icon-line-awesome-question-circle"></i></h2>
                                <p>We're sorry, but the page you were looking for doesn't exist</p>
                            </section>
                        </div>
                    </div>
                </div>
            <div className="margin-top-70"></div>
            </div>
            </div>
        </div>
        </>
    );
}

export default Page404;