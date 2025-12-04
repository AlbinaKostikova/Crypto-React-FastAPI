import CryptoAnalysisCard from './components/CryptoAnalysisCard.jsx'
import CryptocurrencyCard from './components/CryptocurrencyCard.jsx'
import React, { useEffect, useState, useMemo } from 'react'
import { Menu, Spin, Input, AutoComplete } from 'antd'
import axios from 'axios'
import { SearchOutlined } from '@ant-design/icons'

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

  // Меню
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
    <div className="flex min-h-screen">
      <div className="flex flex-col w-64 border-r">
        <div className="p-4 border-b">
          <AutoComplete
            options={searchOptions}
            onSelect={handleSearchSelect}
            onChange={handleSearchChange} 
            placeholder="Поиск криптовалюты..."
            style={{ width: '100%' }}
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
        
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex justify-center items-center h-40"><Spin /></div>
          ) : (
            <Menu
              onClick={(e) => setCurrencyId(Number(e.key))}
              selectedKeys={currencyId ? [String(currencyId)] : []}
              mode="inline"
              items={menuItems}
              className="h-full"
            />
          )}
        </div>
      </div>
      
      <div className="flex-1 p-6">
        {currencyData ? (
          <div className="flex flex-col lg:flex-row gap-6 justify-center">
            <CryptocurrencyCard currency={currencyData} className="w-full max-w-[600px]" />
            <CryptoAnalysisCard currency={currencyData} className="w-full max-w-[600px]" />
          </div>
        ) : (
          <div className="flex justify-center items-center h-[calc(100vh-2rem)]">
            <Spin size="large" tip="Загрузка данных..." />
          </div>
        )}
      </div>
    </div>
  )
}

export default App