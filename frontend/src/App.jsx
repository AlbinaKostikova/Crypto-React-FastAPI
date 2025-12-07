import CryptoAnalysisCard from './components/CryptoAnalysisCard.jsx'
import CryptocurrencyCard from './components/CryptocurrencyCard.jsx'
import React, { useEffect, useState, useMemo } from 'react'
import { Menu, Spin, Input, AutoComplete, Layout } from 'antd'
import axios from 'axios'
import { SearchOutlined } from '@ant-design/icons'
import Header from './components/Header.jsx'

const { Content, Sider } = Layout

const App = () => {
  const [currencyId, setCurrencyId] = useState(null)
  const [currencyData, setCurrencyData] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [allCurrencies, setAllCurrencies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const { data: currencies } = await axios.get('http://127.0.0.1:8000/cryptocurrencies')
        setAllCurrencies(currencies)
        if (!currencyId && currencies.length > 0) {
          setCurrencyId(Number(currencies[0].id))
        }
      } catch (err) {
        console.error('Ошибка загрузки:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const fetchCurrency = async () => {
      if (!currencyId) return
      setCurrencyData(null)
      try {
        const { data } = await axios.get(`http://127.0.0.1:8000/cryptocurrencies/${currencyId}`)
        setCurrencyData(data)
      } catch (err) {
        console.error('Ошибка загрузки валюты:', err)
      }
    }
    fetchCurrency()
  }, [currencyId])

  const searchOptions = useMemo(() => {
    if (!searchText.trim()) {
      return allCurrencies.map(c => ({
        value: c.id.toString(),
        label: `${c.name} (${c.symbol})`,
        id: c.id,
      }))
    }
    
    const searchLower = searchText.toLowerCase()
    return allCurrencies
      .filter(c => 
        c.name.toLowerCase().includes(searchLower) || 
        c.symbol.toLowerCase().includes(searchLower)
      )
      .map(c => ({
        value: c.id.toString(),
        label: `${c.name} (${c.symbol})`,
        id: c.id,
      }))
  }, [allCurrencies, searchText])

  const filteredCurrencies = useMemo(() => {
    if (!searchText.trim()) return allCurrencies
    
    const searchLower = searchText.toLowerCase()
    return allCurrencies.filter(c => 
      c.name.toLowerCase().includes(searchLower) || 
      c.symbol.toLowerCase().includes(searchLower)
    )
  }, [allCurrencies, searchText])

  const menuItems = useMemo(() => [
    {
      key: 'currencies-group',
      label: 'Список валют',
      type: 'group',
      children: filteredCurrencies.map(c => ({
        key: String(c.id),
        label: `${c.name} (${c.symbol})`,
      }))
    }
  ], [filteredCurrencies])

  const handleSearchSelect = (value, option) => {
    if (option.id) {
      setCurrencyId(option.id)
      setSearchText('')
    }
  }

  const handleSearchChange = (value) => {
    setSearchText(value)
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="flex mt-14">
        <div className="w-72 border-r bg-white h-[calc(100vh-4rem)] overflow-hidden">
          <div className="p-4 border-b bg-[#0d132b]">
            <AutoComplete
              options={searchOptions}
              onSelect={handleSearchSelect}
              onChange={handleSearchChange}
              placeholder="Поиск криптовалюты..."
              className="w-full"
            >
              <Input
                prefix={<SearchOutlined />}
                size="middle"
                allowClear
                value={searchText}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </AutoComplete>
          </div>

          <div className="h-[calc(100%-73px)] overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <Spin />
              </div>
            ) : (
              <Menu
                onClick={(e) => setCurrencyId(Number(e.key))}
                selectedKeys={currencyId ? [String(currencyId)] : []}
                mode="inline"
                items={menuItems}
                className="h-full border-0"
              />
            )}
          </div>
        </div>

        <div className="flex overflow-auto mx-auto">
          {currencyData ? (
            <div className="flex flex-col lg:flex-row items-center gap-20">
              <div className="w-full max-w-2xl">
                <CryptocurrencyCard currency={currencyData} />
              </div>
              <div className="w-full max-w-2xl">
                <CryptoAnalysisCard currency={currencyData} width={600} />
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-full">
              <Spin size="large" tip="Загрузка данных..." />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


export default App