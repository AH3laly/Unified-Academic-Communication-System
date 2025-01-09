function Breadcrumb(props: any){
    return (
        <div className="dashboard-headline">
            <nav id="breadcrumbs" className="dark">
                <ul>
                    <li><a href="/">Home</a></li>
                    <li>{props.title}</li>
                </ul>
            </nav>
        </div>
    )
}

export default Breadcrumb