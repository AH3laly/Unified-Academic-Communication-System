import { useState } from "react";
import { useCookies } from "react-cookie";

function Login(){

    const [cookie, setCookie] = useCookies(['session']);
    const session = cookie.session;

    if(session){
        return;
    }
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    function handleLogin(){

        fetch('http://localhost:3000/account/login?' + new URLSearchParams({username: username, password: password,}).toString(),{
            method: 'GET',
            credentials: 'include' // Ensure cookies are included
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            if(data.content && data.content.accountId !== ''){
                setCookie('session', data.content, { path: '/' });
                window.location.href = '/';
            } else {
                window.location.href = '/login';
            }
        });
    }

    return (
        <>
        <div className="clearfix"></div>
        <div className="dashboard-container">
        <div className="dashboard-content-container" data-simplebar>
            <div className="dashboard-content-inner" >
            <div className="row">
                <div className="col-xl-12 offset-xl-12">
                    <div className="login-register-page margin-top-50" style={{maxWidth: '500px', margin:'auto'}}>
                        
                        <form method="post" id="login-form">
                            <div style={{textAlign: 'center', padding: '40px 0px'}}>
                                <img src="/src/assets/images/logo.png" alt="" />
                                <div><strong>Unified Academic Communication System</strong></div>
                            </div>
                            <div className="input-with-icon-left">
                                <i className="icon-material-baseline-mail-outline"></i>
                                <input type="text" className="input-text with-border" name="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Email Address" required/>
                            </div>
                            <div className="input-with-icon-left">
                                <i className="icon-material-outline-lock"></i>
                                <input type="password" className="input-text with-border" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required/>
                            </div>
                        </form>

                        <button 
                            className="button full-width button-sliding-icon ripple-effect margin-top-10" 
                            onClick={handleLogin}>Log In <i className="icon-material-outline-arrow-right-alt"></i>
                        </button>
                    </div>
                </div>  
            </div>
            <div className="margin-top-70"></div>

            </div>
        </div>
        </div>
        </>
    )
}

export default Login;