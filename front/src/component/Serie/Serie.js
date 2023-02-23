import axios from "axios"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import './serie.css'

export default function Serie() {
    const serie_id = useLocation().state.data
    const [infos, setInfos] = useState(null)
    const [genres, setGenres] = useState([])
    const [length, setLength] = useState(0)


    useEffect(() => {
        axios("https://api.betaseries.com/shows/display?id=" + serie_id + "&client_id=91a576165315")
            .then((response) => {
                setInfos(response.data.show)
                setLength(Object.keys(response.data.show.genres).length)
                for (const property in response.data.show.genres) {
                    setGenres(genres => [...genres, response.data.show.genres[property]])
                }
            })
    }, [])

    if (genres !== []) {
        genres.splice(length)
    }

    return (
        <div>
            {infos !== null ?
                <div className="Single_product">
                    <div className="img_product">
                        <img
                            src={infos.images.poster}
                            alt={infos.title}
                        />
                    </div>
                    <div className="product">
                        <div className="product_title"><h2>{infos.title}</h2></div>
                        <hr className="col-md-12"></hr>
                        <div className="product_episode">{infos.seasons} saisons</div>
                        <div className="product_price">{infos.episodes} épisodes</div>
                        <div className="product_length">Durée des épisodes : {infos.length} min</div>
                        <div className="product_note">note : {infos.notes.mean.toFixed(1)}/5</div>
                        <div className="genres">
                            <h3>Genres :</h3>
                            <ul>
                                {genres !== [] ?
                                    genres.map((item) => (
                                        <li>{item}</li>
                                    ))
                                    : null}
                            </ul>
                        </div>
                    </div>
                    <div className="product_desc">
                        <h3>Description :</h3>
                        <p>{infos.description}</p>
                    </div>
                </div>
                : null}
        </div>
    )
}