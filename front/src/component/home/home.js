import axios from 'axios';
import { useEffect, useState ,useLocation } from 'react';
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import './home.css'


export default function Home() {
  const [data, setData] = useState()
  const [series, setSeries] = useState(null)
  const [titre, setTitre] = useState("")
  const token = localStorage.getItem('token')
  const [length, setLength] = useState(0)

  useEffect(() => {
    axios.get('https://api.betaseries.com/shows/member?client_id=91a576165315&token=' + token)
      .then((res) => {
        setData(res.data.shows)
      })
  }, [length]);

  useEffect(() => {
    if (titre !== "") {
      axios.get("https://api.betaseries.com/shows/search?client_id=91a576165315&summary=true&title=" + titre)
        .then((resp) => {
          setSeries(resp.data.shows)
        })
    }
  }, [titre])

  function archiver(e) {
    let id_serie = e.target.value
    axios.post("https://api.betaseries.com/shows/archive?token=cbaa768acde2&client_id=91a576165315&id=" + id_serie)
      .then((res) => {
        setLength(length + 1)
      })
  }

  function ajouter(e) {
    let id_serie = e.target.value
    axios.post("https://api.betaseries.com/shows/show?token=cbaa768acde2&client_id=91a576165315&id=" + id_serie)
      .then((res) => {
        setTitre("")
        setSeries(null)
        setLength(length + 1)
      })
  }

  function supprimer(e) {
    let id_serie = e.target.value
    axios.delete("https://api.betaseries.com/shows/show?token=cbaa768acde2&client_id=91a576165315&id=" + id_serie)
      .then((res) => {
        setTitre("")
        setSeries(null)
        setLength(length + 1)
      })
  }


  return (
    <div>
      <h1>Vos séries :</h1>
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>Illustration</th>
            <th>Titre</th>
            <th>Prochain episode :</th>
            <th>Total</th>
            <th>Reste :</th>
            <th>Archiver</th>
            <th>Tout voir</th>
          </tr>
        </thead>
        <tbody>
          {data !== null && data !== undefined ?
            data.map((item) => (
              item.user.archived === false ?
                <tr key={item.id}>
                  <td className="text-center"><Link to={"/serie/" + item.id} state={{ data: item.id }}><img src={item.images.box} alt="bannière"></img></Link></td>
                  <td>{item.title}</td>
                  <td><Link to={"/episode/"+item.user.next.id} state={{data : item.user.next.id}}>{item.user.next.code}</Link></td>
                  <td>{item.seasons} saisons, {item.episodes} episodes</td>
                  <td>{item.user.status}%  | {item.user.remaining} ép.</td>
                  <button id="archive" value={item.id} onClick={(e) => archiver(e)}>&#10007;</button>
                  <td className="text-center align-middle"><Link to={"/saison"} state={{state : item.id}}>&dArr;</Link></td>
                  
                </tr>
                : null
            ))
            : null
          }
        </tbody>
      </Table>

      <h1>Vos séries archivées :</h1>
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>Illustration</th>
            <th>Titre</th>
            <th>Total</th>
            <th>Supprimer</th>
          </tr>
        </thead>
        <tbody>
          {data !== null && data !== undefined ?
            data.map((item) => (
              item.user.archived === true ?
                <tr key={item.id}>
                  <td className="text-center"><Link to={"/serie/" + item.id} state={{ data: item.id }}><img src={item.images.box} alt="bannière"></img></Link></td>
                  <td>{item.title}</td>
                  <td>{item.seasons} saisons, {item.episodes} episodes</td>
                  <button id="archive" value={item.id} onClick={(e) => supprimer(e)}>&#10007;</button>
                </tr>
                : null
            ))
            : null
          }

        </tbody>
      </Table>

      <div className='recherche'>
        <h3>Ajouter une série :</h3>
        <hr className="col-md-12"></hr>
        <input type="text" className='inID' id='searchBarre' value={titre} onChange={(e) => setTitre(e.target.value)} placeholder="Recherche" />
      </div>
      {series !== null ?
        <div className='resultSearch'>
          {series.map((item) => (
            <button value={item.id} key={item.id} state={{ data: item.id }} onClick={(e) => ajouter(e)}>{item.title}</button>
          ))}
        </div>
        : null
      }
    </div>
  )
}