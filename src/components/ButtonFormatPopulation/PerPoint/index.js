export const ButtonFormatPopulation = ({ activeButtonFormat, setActiveButtonFormat }) => {
    return (
        <button className="buttonFormat formatPop" onClick={() => setActiveButtonFormat(!activeButtonFormat) } >format population</button>
    )
}