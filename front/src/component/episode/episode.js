import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';

export default function Episode() {
    const ep_id = useLocation().state.data;
    const [infos, setInfos] = useState(null)
    const [image, setImage] = useState(null)
    const [commentaires, setCommentaires] = useState(null)
    const [envoyercom, setEnvoyercom] = useState(null)


    useEffect(() => {
        axios.get("https://api.betaseries.com/pictures/episodes?client_id=91a576165315&id=" + ep_id)
            .then((resp) => {
                console.log(resp.data)
                setImage(resp.config.url)
            })
        axios.get("https://api.betaseries.com/episodes/display?client_id=91a576165315&id=" + ep_id)
            .then((res) => {
                setInfos(res.data.episode)
            })
        axios.get("https://api.betaseries.com/comments/comments?client_id=8e5e3832e2c7&token=87c53f44167d&type=episode&nbpp=5&order=desc&id=" + ep_id)
            .then((rep) => {
                setCommentaires(rep.data.comments)
            })

    }, [envoyercom])

    function envoyer() {
        axios.post("https://api.betaseries.com/comments/comment?client_id=8e5e3832e2c7&token=87c53f44167d&type=episode&id=" + ep_id + "&text=" + envoyercom)
            .then((res) => {
                setEnvoyercom("")
            })
    }
    return (
        <div>
            {infos !== null ?
                <div className="Single_product">
                    <div className="img_product">
                        <img
                            src={image}
                            alt={infos.title}
                        />
                    </div>
                    <div className="product">
                        <hr className="col-md-12"></hr>
                        <div className='product_code'>{infos.code}</div>
                        <div className="product_date">Diffusé le : {infos.date}</div>
                        <div className="product_note">note : {infos.note.mean.toFixed(1)}/5</div>
                    </div>
                    <div className="product_desc">
                        <div className="product_title"><h2>{infos.title}</h2></div>
                        <h3>Description :</h3>
                        <p>{infos.description}</p>
                        <input type="text" value={envoyercom} onChange={(e) => setEnvoyercom(e.target.value)} placeholder='Donne ton avis..'></input><button onClick={envoyer}>Envoyer</button>
                        {commentaires?.map((item) => (
                            <p className="pistache">{item.login} : {item.text}</p>
                        ))

                        }
                    </div>

                </div>
                : null}
        </div>
    )
}