export const SelectTypeSearch = ({ setTypeSearch, setSearch, setDataApi, setWeather }) => {
    const handleChange = (e) => {
        setTypeSearch(e.target.value);
        setSearch('')
        setDataApi(null)
        setWeather('')
    }
    return (
        <select onChange={handleChange} onClick={handleChange}>
            <option value="nom">Nom</option>
            <option value="codePostal">Code postal</option>
        </select>
    )
}