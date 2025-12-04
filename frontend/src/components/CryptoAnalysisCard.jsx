import React, { useMemo, useState } from 'react'
import { Card, Button, Spin } from 'antd'
import axios from 'axios'

const formatMarketCapShort = value => {
  if (value == null || Number.isNaN(Number(value))) return '—'
  const units = [
    { div: 1e12, suffix: 'T' },
    { div: 1e9, suffix: 'B' },
    { div: 1e6, suffix: 'M' },
    { div: 1e3, suffix: 'K' },
  ]
  for (const u of units) {
    if (value >= u.div) {
      const scaled = value / u.div
      return `${scaled.toFixed(3)}${u.suffix}`
    }
  }
  return Number(value).toFixed(3)
}
const computeAnalysis = (currency, randomness = 0) => {
  const quoteUSD = currency?.quote?.USD ?? {}
  const price = Number(quoteUSD.price ?? currency?.price ?? 0)
  const percent24 = Number(quoteUSD.percent_change_24h ?? currency?.percent_change_24h ?? 0)
  const marketCap = Number(quoteUSD.market_cap ?? currency?.market_cap ?? 0)

  const vol = Math.min(Math.abs(percent24), 100)

  let scaleFactor = 1
  if (marketCap >= 1e12) scaleFactor = 0.25
  else if (marketCap >= 1e9) scaleFactor = 0.5
  else if (marketCap >= 1e6) scaleFactor = 1.0
  else scaleFactor = 1.5

  const baseChangePct = percent24 * 1.2 * scaleFactor + randomness * 0.5
  const bullPct = baseChangePct + vol * 0.8
  const bearPct = baseChangePct - vol * 0.8

  const basePrice = price * (1 + baseChangePct / 100)
  const bullPrice = price * (1 + bullPct / 100)
  const bearPrice = price * (1 + bearPct / 100)

  const commentaryParts = []
  commentaryParts.push(`За 24 часа: ${percent24.toFixed(2)}%. Капитализация: ${formatMarketCapShort(marketCap)}.`)
  if (Math.abs(percent24) > 10) commentaryParts.push('Высокая краткосрочная волатильность.')
  else if (Math.abs(percent24) > 3) commentaryParts.push('Средняя волатильность.')
  else commentaryParts.push('Низкая волатильность.')

  commentaryParts.push(
    'По простому эвристическому прогнозу — базовый сценарий учитывает недавнюю динамику и размер рынка.',
  )

  return {
    commentary: commentaryParts.join(' '),
    forecast: {
      bear: { pct: bearPct, price: bearPrice },
      base: { pct: baseChangePct, price: basePrice },
      bull: { pct: bullPct, price: bullPrice },
    },
  }
}

const CryptoAnalysisCard = ({ currency, width = 340 }) => {
  const [seed, setSeed] = useState(0)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiText, setAiText] = useState(null)
  const [aiError, setAiError] = useState(null)

  const analysis = useMemo(() => {
    if (!currency) return null
    const randomness = (seed % 7) - 3
    return computeAnalysis(currency, randomness)
  }, [currency, seed])

  if (!currency) {
    return (
      <Card title="Аналитика (ИИ)" style={{ width, marginTop: 16 }}>
        <div className="flex justify-center items-center h-40">
          <Spin size="large" />
        </div>
      </Card>
    )
  }

  if (!analysis) {
    return (
      <Card title="Аналитика (ИИ)" style={{ width, marginTop: 16 }}>
        <div className="flex justify-center items-center h-40">
          <Spin size="large" />
          <span className="ml-2">Анализ данных...</span>
        </div>
      </Card>
    )
  }

  const { commentary, forecast } = analysis

  const formatPct = (v) =>
    `${Number(v).toFixed(2).replace('.', ',')}%`
  const formatPrice = (p) =>
    `$${Number(p).toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}`

  const askAI = async () => {
  setAiLoading(true)
  setAiError(null)
  setAiText(null)
  
  try {
    // Минимальные данные для теста
    const requestData = {
      currency: {
        id: currency.id || 1,
        name: currency.name || "Bitcoin",
        symbol: currency.symbol || "BTC"
      }
    }
    
    const resp = await axios.post(
      'http://127.0.0.1:8000/ai/commentary',
      requestData
    )
    

    setAiText(resp.data)
    
  } catch (err) {
    console.error('Ошибка:', err)
    
    // Простая проверка
    if (err.response?.status === 405) {
      setAiError('Метод не разрешен. Убедитесь, что endpoint ожидает POST запрос.')
    } else if (err.response?.status === 422) {
      setAiError('Некорректные данные. Проверьте формат отправляемого currency объекта.')
    } else {
      setAiError(`Ошибка: ${err.message}`)
    }
  } finally {
    setAiLoading(false)
  }
}
  return (
    <Card
      title="Аналитика и прогноз (эвристика)"
      style={{ width, marginTop: 16 }}
    >
      <p style={{ marginBottom: 8, whiteSpace: 'pre-wrap' }}>{commentary}</p>

      <div style={{ marginTop: 8 }}>
        <div style={{ marginBottom: 6 }}>
          <strong>Bear (пессимистичный):</strong>{' '}
          <span>
            {formatPct(forecast.bear.pct)} → {formatPrice(forecast.bear.price)}
          </span>
        </div>
        <div style={{ marginBottom: 6 }}>
          <strong>Base (базовый):</strong>{' '}
          <span>
            {formatPct(forecast.base.pct)} → {formatPrice(forecast.base.price)}
          </span>
        </div>
        <div style={{ marginBottom: 6 }}>
          <strong>Bull (оптимистичный):</strong>{' '}
          <span>
            {formatPct(forecast.bull.pct)} → {formatPrice(forecast.bull.price)}
          </span>
        </div>
      </div>

      <div style={{ marginTop: 20, borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <strong style={{ fontSize: '16px' }}>AI-анализ</strong>
          <Button 
            type="primary" 
            onClick={askAI} 
            disabled={aiLoading}
            loading={aiLoading}
            size="middle"
          >
            {aiLoading ? 'Генерация...' : 'Запросить анализ ИИ'}
          </Button>
        </div>
        
        <div style={{ minHeight: 80, padding: '12px', background: '#fafafa', borderRadius: '6px' }}>
          {aiLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 60 }}>
              <Spin tip="Генерация комментария..." />
            </div>
          ) : aiError ? (
            <div style={{ color: '#ff4d4f' }}>
              <div style={{ fontWeight: 'bold', marginBottom: 4 }}>Ошибка:</div>
              <div>{aiError}</div>
              <Button 
                type="link" 
                onClick={askAI}
                style={{ padding: 0, marginTop: 8 }}
              >
                Попробовать снова
              </Button>
            </div>
          ) : aiText ? (
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{aiText}</div>
          ) : (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: 60,
              color: '#8c8c8c' 
            }}>
              <div>Нажмите кнопку выше для получения</div>
              <div>анализа от искусственного интеллекта</div>
            </div>
          )}
        </div>
        
        <div style={{ marginTop: 12, fontSize: '12px', color: '#8c8c8c' }}>
          Анализ предоставляется с использованием AI-модели и может содержать неточности.
        </div>
      </div>
    </Card>
  )
}


export default CryptoAnalysisCard