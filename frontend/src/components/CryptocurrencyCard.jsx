import { Card } from 'antd';
function CryptocurrencyCard() {
  const { currency } = props;
  const price = Math.round(currency.quote.USD.price)
  return (
    <>
      <Card 
        title={ 
          <div className="flex items-center gap-3">
            <img src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${currency.id}.png" alt="Bitcoin`} />
           <span>{currency.name}</span>
          </div>
        }
        style={{
          width: 300,
        }}
          >
          <p>Текущая цена: ${price}</p>
          <p>Card</p>
          <p>Card</p>
      </Card>
    </>
  )
}

export default CryptocurrencyCard
