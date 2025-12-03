import { Card } from 'antd'

const formatMarketCap = (value) => {
  if (value == null) return '—'

  const units = [
    { div: 1e12, suffix: 'T' },
    { div: 1e9,  suffix: 'B' },
    { div: 1e6,  suffix: 'M' },
    { div: 1e3,  suffix: 'K' },
  ]

  const unit = units.find(u => value >= u.div)
  const scaled = unit ? value / unit.div : value

  return `${scaled.toFixed(3)}${unit?.suffix ?? ''}`
}

const CryptocurrencyCard = ({ currency }) => {
  if (!currency) return null

  const quoteUSD = currency?.quote?.USD ?? {}
  const rawPrice = quoteUSD.price ?? currency?.price ?? null
  const price = rawPrice != null ? Math.round(rawPrice) : null
  const displayPrice = rawPrice == null
      ? '—'
      : `$${Number(rawPrice).toLocaleString('en-US', {
          minimumFractionDigits: 3,
          maximumFractionDigits: 3,
        })}`

  const percent24 = quoteUSD.percent_change_24h ?? currency?.percent_change_24h ?? null
  const formattedPercent =
    percent24 == null ? '—' : `${Number(percent24).toFixed(2).replace('.', ',')}%`
  const percentColor = percent24 == null ? '#6b7280' : percent24 > 0 ? '#16a34a' : '#ef4444'

  const marketCap = quoteUSD.market_cap ?? currency?.market_cap ?? null
  const displayMarketCap = formatMarketCap(marketCap)

  return (
    <Card
      title={
        <div className="flex items-center gap-3">
          <img
            src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${currency.id}.png`}
            alt={currency.name ?? 'coin'}
            width={32}
            height={32}
          />
          <span>{currency.name}</span>
        </div>
      }
      style={{ width: 340 }}
    >
      <p>Текущая цена: {displayPrice}</p>
      <p>
        Изменение цены за 24 часа:{' '}
        <span style={{ color: percentColor, fontWeight: 600 }}>{formattedPercent}</span>
      </p>
      <p>Капитализация: <span style={{ fontWeight: 600 }}>{displayMarketCap}</span></p>
      <p>Символ: {currency.symbol ?? '—'}</p>
      <p>ID: {currency.id ?? '—'}</p>
    </Card>
  )
}

export default CryptocurrencyCard