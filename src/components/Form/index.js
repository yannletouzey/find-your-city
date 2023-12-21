export const Form = ({setSearch, getData, search}) => {
    const handleChange = (e) => {
        setSearch(e.target.value);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        getData();
        // setSearch('');
    }
    return (
        <form onSubmit={handleSubmit}>
            <input type="search" id="search" value={search} onChange={handleChange} placeholder="Rechercher une commune"/>
            <button className="submit" type="submit">Lancer une recherche</button>
        </form>
    )
}