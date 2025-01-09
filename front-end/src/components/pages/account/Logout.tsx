import { useEffect } from "react";
import { useCookies } from "react-cookie";

function Logout(){

    const [cookie, setCookie] = useCookies(['session']);

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

    useEffect(() => {
        // Execure when component Loads
        handleLogout();
    }, []);

    return (
        <p>Logging Out ...</p>
    )
}

export default Logout;