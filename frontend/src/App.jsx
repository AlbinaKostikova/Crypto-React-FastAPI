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
  const [currencyId, setCurrencyId] = useState(null)
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
              return { label: c.name, key: String(c.id) }
            }),
            'group',
          ),
        ]
        setCurrencies(menuItems)

        if (!currencyId && currencyResponse.length > 0) {
          setCurrencyId(Number(currencyResponse[0].id))
        }
      })
      .catch(err => console.error(err))
  }
  const fetchCurrency = () => {
    if (!currencyId) return
    axios
      .get(`http://127.0.0.1:8000/cryptocurrencies/${currencyId}`)
      .then(r => {
        setCurrencyData(r.data)
      })
      .catch(err => {
        console.error(err)
        setCurrencyData(null)
      })
  }

  useEffect(() => {
    fetchCurrencies()
  }, [])

  useEffect(() => {
    setCurrencyData(null)
    if (currencyId) fetchCurrency()
  }, [currencyId])

  const onClick = e => {
    setCurrencyId(Number(e.key))
  }
  return (
    <div className="flex ">
      <Menu
        onClick={onClick}
        style={{ width: 256 }}
        selectedKeys={currencyId ? [String(currencyId)] : []}
        mode="inline"
        items={currencies}
        className="h-screen overflow-scroll"
      />
      <div className="mx-auto my-auto">
        {currencyData ? <CryptocurrencyCard currency={currencyData} /> : <Spin size="large" />}
      </div>
    </div>
  )
}
export default App