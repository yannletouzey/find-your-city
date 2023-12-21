export const Result = ({name, nb_department, code_department, population, setCodeDep}) => {
    const handleClick = async () => {
        setCodeDep(code_department);
    }
    return (
        <>
            <li onClick={handleClick} >
                <p>{name} - {nb_department}</p>
                <p>Code - {code_department}</p>
                <p>Population - {population}</p>
            </li>
        </>
    )
}