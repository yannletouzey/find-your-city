export const Legend = () => {
  return (
    <ul className="legend">
      <li>
        <p>Population par département</p>
      </li>
      <li style={{ backgroundColor: 'red' }}>
        <p>⬆️ 2.000.000</p>
      </li>
      <li style={{ backgroundColor: 'pink' }}>
        <p>⬆️ 1.500.000</p>
      </li>
      <li style={{ backgroundColor: 'orange' }}>
        <p>⬆️ 1.000.000</p>
      </li>
      <li style={{ backgroundColor: 'yellow' }}>
        <p>⬆️ 500.000</p>
      </li>
      <li style={{ backgroundColor: 'lightgreen' }}>
        <p>⬇️ 500.000</p>
      </li>
    </ul>
  )
}