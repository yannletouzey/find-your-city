import { Header } from "../Header";
import { Main } from "../Main";
import { useState, useEffect } from "react";

export const App = () => {
    
    const [dataApi, setDataApi] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [search, setSearch] = useState('');
    const [typeSearch, setTypeSearch] = useState('nom');
    const [weather, setWeather] = useState('');

    const getData = async () => {
        try {
            // const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
            // const arrayAlphabet = alphabet.split('');
            // const arraySearch = search.split('');
            // if (typeSearch === 'codePostal') {
            //     arraySearch.map((item, id) => {
            //         if (arrayAlphabet.includes(item)) {
            //             setErrorMsg('Veuillez entrer un code postal valide');
            //             return;
            //         } else {
            //             setErrorMsg(null);
            //         }
            //     })
            // }
            const responce = await fetch(`https://geo.api.gouv.fr/communes?${typeSearch}=${search}`);
            const data = await responce.json();
            setDataApi(data);
            if (data.length != 0) {
                setWeather('Cliquer sur une ville pour afficher la météo')
            }
        } catch (error) {
            console.error(error.message)
        }
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <>
            <Header />
            <Main 
                dataApi={dataApi} 
                setDataApi={setDataApi}
                getData={getData} 
                search={search} 
                setSearch={setSearch} 
                typeSearch={typeSearch} 
                setTypeSearch={setTypeSearch}
                weather={weather}
                setWeather={setWeather}
            />
        </>
    )
}