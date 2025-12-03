import CryptocurrencyCard from './components/CryptocurrencyCard.jsx'
import React, { useEffect, useState } from 'react'
import { Menu, Spin } from 'antd'
import axios from 'axios'

function getItem(label, key, icon = null, children = [], type = null) {
  return {
    key,
    icon,
    children,
    label,
    type,
  }
}
const App = () => {
  const [currencies, setCurrencies] = useState([])
  const [currencyId, setCurrencyId] = useState(1)
  const [currencyData, setCurrencyData] = useState(null)

  const fetchCurrencies = () => {
    axios
      .get('http://127.0.0.1:8000/cryptocurrencies')
      .then(r => {
        const currencyResponse = r.data

        const menuItems = [
          getItem(
            'Список валют',
            'g1',
            null,
            currencyResponse.map(c => {
              return { label: c.name, key: c.id }
            }),
            'group',
          ),
        ]
        setCurrencies(menuItems)
      })
      .catch(err => console.error(err))
  }
  const fetchCurrency = () => {
    axios
      .get(`http://127.0.0.1:8000/cryptocurrencies/${currencyId}`)
      .then(r => {
        setCurrencyData(r.data)

        const menuItems = [
          getItem(
            'Список валют',
            'g1',
            null,
            currencyResponse.map(c => {
              return { label: c.name, key: c.id }
            }),
            'group',
          ),
        ]
        setCurrencies(menuItems)
      })
      .catch(err => console.error(err))
  }

  useEffect(() => {
    fetchCurrencies()
  }, [])

    useEffect(() => {
    setCurrencyData(null)
    fetchCurrency()
  }, [currencyId])

  const onClick = e => {
    setCurrencyId(e.key)
  }
  return (
    <div className="flex ">
      <Menu
        onClick={onClick}
        style={{ width: 256 }}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
        items={currencies}
        className="h-screen overflow-scroll"
      />
      <div className="mx-auto my-auto">
        {currencyData ? <CryptocurrencyCard currency={currencyData} /> : <Spin size="large"/>}
      </div>
    </div>
  )
}
export default App
