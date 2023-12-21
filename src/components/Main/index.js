import { Result } from "../Results";
import { Form } from "../Form";
import { SelectTypeSearch } from "../Select/SelectTypeSearch";
import { formatPopulation } from "../ButtonFormatPopulation/PerPoint/formatPopulation";
import { ButtonFormatPopulation } from "../ButtonFormatPopulation/PerPoint";
import { SelectLimit } from "../Select/SelectLimit";
import { Map } from "../Map";
import { popData } from "../../popData.js";
import { Legend } from "../Legend";
import { useEffect, useState } from "react";
import * as dotenv from 'dotenv';
import { indexWeather } from "./nomenclature";
dotenv.config();

const KEY_API_WEATHER = process.env.KEY_API_WEATHER;

export const Main = ({dataApi, setDataApi, getData, search, setSearch, typeSearch, setTypeSearch, weather, setWeather}) => {

    const [codeDep, setCodeDep] = useState(null);

    const getDataWeather = async () => {
        try {
            const responce = await fetch(`https://api.meteo-concept.com/api/forecast/daily?token=${KEY_API_WEATHER}&insee=${codeDep}`);
            const data = await responce.json();
            if (codeDep) {
                let w
                indexWeather.map((item, id) => {
                    if (item.id == data.forecast[0].weather) {
                        w = `${item.weather.toLocaleLowerCase()} ${item.img ? item.img : ''}`
                    }
                })
                setWeather(`${data.city.name} - ${w} avec temp max ${data.forecast[0].tmax}°C et min ${data.forecast[0].tmin}°C`);
            }
        } catch (error) {
            console.error(error.message)
        }
    }
    useEffect( () => {
        getDataWeather()
    }, [codeDep])

    const [activeButtonFormat, setActiveButtonFormat] = useState(false);
    const [limit, setLimit] = useState(2);
    const newDataApi = dataApi?.slice(0, limit);
    const paths = document.querySelectorAll('.mapFrance path');
    
    paths.forEach(function (path){
        path.style.fill = 'white';
        popData.map((item, id) => {
            let newId = item.code_departement
            if (newId == "2A") {
                newId = 20
            } else if (newId == "2B") {
                newId = 21
            } else if (item.code_departement >= 21) {
                newId = parseInt(item.code_departement) + 1
            } else {
                newId = item.code_departement
            }
            if (newId == path.id) {
                if (item.population < 500000) path.style.fill = 'lightgreen'
                if (item.population > 500000) path.style.fill = 'yellow'
                if (item.population > 1000000) path.style.fill = 'orange'
                if (item.population > 1500000) path.style.fill = 'pink'
                if (item.population > 2000000) path.style.fill = 'red'
            }
        })
        newDataApi?.map((item, index) => {
            let newId = item.codeDepartement
            if (newId == "2A") {
                newId = 20
            } else if (newId == "2B") {
                newId = 21
            } else if (item.codeDepartement >= 21) {
                newId = parseInt(item.codeDepartement) + 1
            } else {
                newId = item.codeDepartement
            }
            if (newId == path.id) path.style.fill = 'black'
        })
    })
    return (
        <main className="main">
            <section className="main__city">
                <section className="main__city__container__map">
                        <Map />
                        <Legend />
                </section>
                <section className="main__city__container__search">
                    {dataApi?.length > 0 && <div className="boxResult">
                        <h3>Pour {search} il y a {dataApi?.length} {dataApi?.length == 1 ? "résultat" : "résultats"} total</h3>
                    </div>}
                    <h3>Recherche par {typeSearch === "nom" ? "nom de commune" : "code postal"}</h3>
                    <div className="selectSearch">
                        <SelectTypeSearch
                            setTypeSearch={setTypeSearch}
                            setSearch={setSearch}
                            setDataApi={setDataApi}
                            setWeather={setWeather}
                        />
                        <SelectLimit
                            setLimit={setLimit}
                        />
                    </div>
                    <Form
                        search={search}
                        setSearch={setSearch}
                        getData={getData}
                    />
                </section>
            </section>
            {dataApi?.length > 0 && <section className="main__weather">
                <div>
                    <p className="weather">{weather}</p>
                    <ButtonFormatPopulation 
                        activeButtonFormat={activeButtonFormat} 
                        setActiveButtonFormat={setActiveButtonFormat}
                    />
                </div>
                <ul className='result'>
                    {newDataApi?.map((item, id) => 
                        <Result 
                            key={id} 
                            name={item.nom} 
                            nb_department={item.codeDepartement} 
                            code_department={item.code} 
                            population={activeButtonFormat ? formatPopulation(item.population) : item.population}
                            setCodeDep={setCodeDep}
                        />)}
                </ul>
            </section>}
        </main>
    )
}