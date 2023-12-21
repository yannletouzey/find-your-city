export const SelectLimit = ({ setLimit }) => {
    const handleChange = (e) => {
        setLimit(e.target.value);
    }
    return (
        <select onChange={handleChange}>
            <option value="2">2 résultats</option>
            <option value="5">5 résultats</option>
            <option value="10">10 résultats</option>
            <option value="1000">Tous résultats</option>
        </select>
    )
}