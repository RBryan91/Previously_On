import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Md5 } from 'ts-md5';


export default function Login() {

    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("diGH_*EE44ec8T4")
    const [error, setError] = useState(null);
    const navigate = useNavigate()

    useEffect(() => {
        if (error !== null) {
            setLogin("")
            setPassword("")
            alert("identifiants incorrect")
        }
    }, [error])


    function connection(e) {
        e.preventDefault()
        const passMD5 = Md5.hashStr(password)
        axios.post("https://api.betaseries.com/members/auth?login=" + login + "&password=" + passMD5 + "&client_id=91a576165315")
            .then((res) => {
                if (res.data.token !== undefined) {
                    setError(null)
                    localStorage.setItem("token", res.data.token)
                    navigate("/home")
                }
            })
            .catch(setError);
    }

    return (
        <div className='container cont2 col-md-7'>
            <form className='form2 col-md-5'>
                <div className="form-group emaildiv2">
                    <label htmlFor="exampleInputEmail1">Login</label>
                    <input type="text" className="form-control" onChange={(e) => setLogin(e.target.value)} value={login} id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="login"></input>
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                </div>
                <button id='button' className="btn btn-primary" onClick={(e) => connection(e)}>Connection</button>
            </form>
        </div>
    );
}