import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from 'react-router-dom';
import './Saison.css'

export default function Saison() {
    const [episode, setEpisode] = useState(null);
    const id_serie = useLocation().state.state.toString()
    const [episodedelasaison, setEpisodedelasaison] = useState(null);
    const [refresh, setRefresh] = useState(0);
    const token = localStorage.getItem('token');



    useEffect(() => {
        axios.get("https://api.betaseries.com/shows/display?client_id=91a576165315&id=" + id_serie)
            .then((res) => {
                setEpisode(res.data.show.seasons_details)
            })
    }, []);

    useEffect(() => {
        axios.get("https://api.betaseries.com/shows/episodes?client_id=91a576165315&token=" + token + "&id=" + id_serie)
            .then((resp) => {
                setEpisodedelasaison(resp.data.episodes)
            })
    }, [refresh])

    function vu(e) {
        let id_ep = e.target.value
        axios.post("https://api.betaseries.com/episodes/watched?client_id=91a576165315&token=" + token + "&id=" + id_ep)
            .then((res) => {
                setRefresh(refresh + 1)
            })
    }
    function decocher(e) {
        let id_ep = e.target.value
        axios.delete("https://api.betaseries.com/episodes/watched?client_id=91a576165315&token=" + token + "&id=" + id_ep)
            .then((res) => {
                setRefresh(refresh + 1)
            })
    }

    return (
        <div>
            <div className="sideBarre">
                <h1 className="t-name">Saisons :</h1>
                <hr className="t-hr"></hr>
                <div className="divSelect">
                    {episode?.map((item) => (
                        <div className="user-box" key={episode.indexOf(item)}>
                            <div className="user-id">
                                <div className="user-name"><p>Saison : {item.number}  Nombre d'episode : {item.episodes}</p></div>
                                <div>
                                    <div className="dropdown-arrow"></div>
                                    <div className="dropdown-menu">
                                        <ul>
                                            {episodedelasaison?.map((value) => (
                                                value.season === item.number ?
                                                    value.user.seen === true ?
                                                        <div className='d-flex'>
                                                            <li key={value.id} style={{ backgroundColor: "#7FFF00" }}>
                                                                <Link to={"/episode/" + value.id} state={{ data: value.id }}>{value.code} {value.title}</Link></li>
                                                            <button value={value.id} onClick={(e) => decocher(e)}> &#x2714; </button>
                                                        </div>
                                                        :
                                                        <div className='d-flex'>
                                                            <li key={value.id}>
                                                            <Link to={"/episode/" + value.id} state={{ data: value.id }}>{value.code} {value.title}</Link></li>
                                                            <button value={value.id} onClick={(e) => vu(e)}>VU</button>
                                                        </div>
                                                    : null
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

    )
}
