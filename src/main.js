import './style.css'
import { Chart, registerables } from 'chart.js'

// Register Chart.js components
Chart.register(...registerables)

// CoinGecko API configuration
const API_BASE = '/api/v3'
const COINS_TO_FETCH = 12
const UPDATE_INTERVAL = 60000 // 60 seconds to avoid rate limiting

// Global variables
let priceChart = null
let marketCapChart = null
let cryptoData = []

// Utility functions
const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

const formatLargeCurrency = (value) => {
  if (value >= 1e12) {
    return `$${(value / 1e12).toFixed(2)}T`
  } else if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`
  } else if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`
  }
  return formatCurrency(value)
}

const formatPercentage = (value) => {
  const formatted = value.toFixed(2)
  return `${value >= 0 ? '+' : ''}${formatted}%`
}

// Mock data for development
const mockCryptoData = [
  {
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    current_price: 43250.50,
    market_cap: 847392847392,
    market_cap_rank: 1,
    total_volume: 23847392847,
    high_24h: 44100.25,
    low_24h: 42800.75,
    price_change_percentage_24h: 2.45
  },
  {
    id: "ethereum",
    symbol: "eth",
    name: "Ethereum",
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    current_price: 2650.75,
    market_cap: 318472847392,
    market_cap_rank: 2,
    total_volume: 15847392847,
    high_24h: 2720.50,
    low_24h: 2580.25,
    price_change_percentage_24h: 1.85
  },
  {
    id: "tether",
    symbol: "usdt",
    name: "Tether",
    image: "https://assets.coingecko.com/coins/images/325/large/Tether.png",
    current_price: 1.00,
    market_cap: 95847392847,
    market_cap_rank: 3,
    total_volume: 45847392847,
    high_24h: 1.001,
    low_24h: 0.999,
    price_change_percentage_24h: 0.05
  },
  {
    id: "binancecoin",
    symbol: "bnb",
    name: "BNB",
    image: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
    current_price: 315.25,
    market_cap: 47384729384,
    market_cap_rank: 4,
    total_volume: 1847392847,
    high_24h: 325.50,
    low_24h: 308.75,
    price_change_percentage_24h: -1.25
  },
  {
    id: "solana",
    symbol: "sol",
    name: "Solana",
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    current_price: 98.45,
    market_cap: 43847392847,
    market_cap_rank: 5,
    total_volume: 2847392847,
    high_24h: 102.75,
    low_24h: 95.25,
    price_change_percentage_24h: 3.75
  },
  {
    id: "ripple",
    symbol: "xrp",
    name: "XRP",
    image: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
    current_price: 0.62,
    market_cap: 33847392847,
    market_cap_rank: 6,
    total_volume: 1247392847,
    high_24h: 0.65,
    low_24h: 0.59,
    price_change_percentage_24h: -2.15
  },
  {
    id: "usd-coin",
    symbol: "usdc",
    name: "USDC",
    image: "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png",
    current_price: 1.00,
    market_cap: 28847392847,
    market_cap_rank: 7,
    total_volume: 5847392847,
    high_24h: 1.001,
    low_24h: 0.999,
    price_change_percentage_24h: 0.02
  },
  {
    id: "cardano",
    symbol: "ada",
    name: "Cardano",
    image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    current_price: 0.48,
    market_cap: 16847392847,
    market_cap_rank: 8,
    total_volume: 847392847,
    high_24h: 0.52,
    low_24h: 0.46,
    price_change_percentage_24h: 4.25
  },
  {
    id: "avalanche-2",
    symbol: "avax",
    name: "Avalanche",
    image: "https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png",
    current_price: 36.75,
    market_cap: 14847392847,
    market_cap_rank: 9,
    total_volume: 647392847,
    high_24h: 39.25,
    low_24h: 35.50,
    price_change_percentage_24h: 2.85
  },
  {
    id: "dogecoin",
    symbol: "doge",
    name: "Dogecoin",
    image: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
    current_price: 0.085,
    market_cap: 12847392847,
    market_cap_rank: 10,
    total_volume: 547392847,
    high_24h: 0.089,
    low_24h: 0.082,
    price_change_percentage_24h: -1.85
  },
  {
    id: "chainlink",
    symbol: "link",
    name: "Chainlink",
    image: "https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png",
    current_price: 14.25,
    market_cap: 8847392847,
    market_cap_rank: 11,
    total_volume: 447392847,
    high_24h: 15.10,
    low_24h: 13.85,
    price_change_percentage_24h: 1.95
  },
  {
    id: "polygon",
    symbol: "matic",
    name: "Polygon",
    image: "https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png",
    current_price: 0.92,
    market_cap: 8547392847,
    market_cap_rank: 12,
    total_volume: 347392847,
    high_24h: 0.98,
    low_24h: 0.89,
    price_change_percentage_24h: 3.15
  }
]

const mockGlobalData = {
  total_market_cap: { usd: 1847392847392 },
  total_volume: { usd: 89847392847 },
  market_cap_percentage: { btc: 45.8 }
}

// API functions
async function fetchCryptoData() {
  try {
    // Try real API first
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${COINS_TO_FETCH}&page=1&sparkline=false&price_change_percentage=24h`
    )

    if (!response.ok) {
      console.warn('API not available, using mock data')
      return mockCryptoData
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.warn('Error fetching crypto data, using mock data:', error)
    return mockCryptoData
  }
}

async function fetchGlobalData() {
  try {
    // Try real API first
    const response = await fetch(`https://api.coingecko.com/api/v3/global`)

    if (!response.ok) {
      console.warn('Global API not available, using mock data')
      return mockGlobalData
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.warn('Error fetching global data, using mock data:', error)
    return mockGlobalData
  }
}

// Rendering functions
function renderCryptoCard(crypto, index) {
  const isPositive = crypto.price_change_percentage_24h >= 0
  const changeClass = isPositive ? 'text-emerald-400' : 'text-red-400'
  const bgGradient = isPositive ? 'from-emerald-500/20 to-green-500/20' : 'from-red-500/20 to-pink-500/20'
  const borderColor = isPositive ? 'border-emerald-500/30' : 'border-red-500/30'

  return `
    <div class="modern-crypto-card" style="animation-delay: ${index * 0.15}s">
      <!-- Header Section -->
      <div class="card-header">
        <div class="crypto-info">
          <div class="crypto-avatar">
            <img src="${crypto.image}" alt="${crypto.name}" class="crypto-image">
            <div class="rank-badge">#${crypto.market_cap_rank}</div>
          </div>
          <div class="crypto-details">
            <h3 class="crypto-name">${crypto.name}</h3>
            <span class="crypto-symbol">${crypto.symbol.toUpperCase()}</span>
          </div>
        </div>
        <div class="price-section">
          <div class="current-price">${formatCurrency(crypto.current_price)}</div>
          <div class="price-change ${changeClass}">
            ${isPositive ? '+' : ''}${formatPercentage(crypto.price_change_percentage_24h)}
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-label">Market Cap</div>
          <div class="stat-value">${formatLargeCurrency(crypto.market_cap)}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Volume 24h</div>
          <div class="stat-value">${formatLargeCurrency(crypto.total_volume)}</div>
        </div>
      </div>

      <!-- Price Range -->
      <div class="price-range">
        <div class="range-header">24h Range</div>
        <div class="range-bar">
          <div class="range-track">
            <div class="range-fill"></div>
            <div class="current-position" style="left: ${((crypto.current_price - crypto.low_24h) / (crypto.high_24h - crypto.low_24h)) * 100}%"></div>
          </div>
          <div class="range-labels">
            <span class="range-low">${formatCurrency(crypto.low_24h)}</span>
            <span class="range-high">${formatCurrency(crypto.high_24h)}</span>
          </div>
        </div>
      </div>

      <!-- Trend Indicator -->
      <div class="trend-indicator ${bgGradient} ${borderColor}">
        <div class="trend-icon">${isPositive ? '📈' : '📉'}</div>
        <div class="trend-text">${isPositive ? 'Bullish' : 'Bearish'} Trend</div>
      </div>
    </div>
  `
}

function renderCryptoGrid(cryptos) {
  const grid = document.getElementById('cryptoGrid')
  grid.innerHTML = cryptos.map((crypto, index) => renderCryptoCard(crypto, index)).join('')
}

function renderGlobalStats(globalData) {
  // Update main values
  document.getElementById('totalMarketCap').textContent = formatLargeCurrency(globalData.total_market_cap.usd)
  document.getElementById('totalVolume').textContent = formatLargeCurrency(globalData.total_volume.usd)
  document.getElementById('btcDominance').textContent = `${globalData.market_cap_percentage.btc.toFixed(1)}%`

  // Update market cap change
  const marketCapChangeElement = document.getElementById('marketCapChange')
  if (marketCapChangeElement) {
    const marketCapChange = globalData.market_cap_change_percentage_24h_usd || 2.4
    const changeValue = marketCapChangeElement.querySelector('.change-value')
    if (changeValue) {
      changeValue.textContent = `${marketCapChange >= 0 ? '+' : ''}${marketCapChange.toFixed(1)}%`
      changeValue.className = `change-value ${marketCapChange >= 0 ? 'positive' : 'negative'}`
    }
  }

  // Update volume change
  const volumeChangeElement = document.getElementById('volumeChange')
  if (volumeChangeElement) {
    const volumeChange = 8.7 // Mock data - would come from API
    const changeValue = volumeChangeElement.querySelector('.change-value')
    if (changeValue) {
      changeValue.textContent = `${volumeChange >= 0 ? '+' : ''}${volumeChange.toFixed(1)}%`
    }
  }

  // Update dominance change
  const dominanceChangeElement = document.getElementById('dominanceChange')
  if (dominanceChangeElement) {
    const dominanceChange = -0.3 // Mock data
    const changeValue = dominanceChangeElement.querySelector('.change-value')
    if (changeValue) {
      changeValue.textContent = `${dominanceChange >= 0 ? '+' : ''}${dominanceChange.toFixed(1)}%`
    }
  }

  // Update dominance fill
  const dominanceFill = document.getElementById('dominanceFill')
  if (dominanceFill) {
    dominanceFill.style.width = `${globalData.market_cap_percentage.btc.toFixed(1)}%`
  }

  // Update Fear & Greed Index (mock data)
  const fearGreedElement = document.getElementById('fearGreedIndex')
  if (fearGreedElement) {
    fearGreedElement.textContent = '76'
  }

  // Update active cryptos (mock data)
  const activeCryptosElement = document.getElementById('activeCryptos')
  if (activeCryptosElement) {
    activeCryptosElement.textContent = '2,847'
  }

  // Update active exchanges (mock data)
  const activeExchangesElement = document.getElementById('activeExchanges')
  if (activeExchangesElement) {
    activeExchangesElement.textContent = '587'
  }
}

function updateLastUpdateTime() {
  const now = new Date()
  const timeString = now.toLocaleTimeString('es-ES')
  document.getElementById('lastUpdate').textContent = `Última actualización: ${timeString}`
}

// Chart functions
function createPriceChart(cryptos) {
  const ctx = document.getElementById('priceChart').getContext('2d')

  if (priceChart) {
    priceChart.destroy()
  }

  const top8Cryptos = cryptos.slice(0, 8)

  priceChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: top8Cryptos.map(crypto => crypto.symbol.toUpperCase()),
      datasets: [{
        label: 'Precio USD',
        data: top8Cryptos.map(crypto => crypto.current_price),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(168, 85, 247, 0.8)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(168, 85, 247, 1)'
        ],
        borderWidth: 2,
        borderRadius: 12,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          titleColor: 'white',
          bodyColor: 'white',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          borderWidth: 1,
          cornerRadius: 12,
          padding: 12,
          titleFont: {
            size: 14,
            weight: 'bold'
          },
          bodyFont: {
            size: 13
          },
          callbacks: {
            label: function(context) {
              return `💰 ${formatCurrency(context.parsed.y)}`
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.05)',
            lineWidth: 1
          },
          ticks: {
            color: 'rgba(255, 255, 255, 0.6)',
            font: {
              size: 11,
              weight: '500'
            },
            callback: function(value) {
              return formatCurrency(value)
            }
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: 'rgba(255, 255, 255, 0.7)',
            font: {
              size: 12,
              weight: '600'
            }
          }
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      },
      animation: {
        duration: 1000,
        easing: 'easeOutQuart'
      }
    }
  })
}

function createMarketCapChart(cryptos) {
  const ctx = document.getElementById('marketCapChart').getContext('2d')

  if (marketCapChart) {
    marketCapChart.destroy()
  }

  const top6Cryptos = cryptos.slice(0, 6)

  marketCapChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: top6Cryptos.map(crypto => crypto.name),
      datasets: [{
        data: top6Cryptos.map(crypto => crypto.market_cap),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(236, 72, 153, 1)'
        ],
        borderWidth: 2,
        hoverBorderWidth: 4,
        hoverBorderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: 'rgba(255, 255, 255, 0.8)',
            padding: 20,
            usePointStyle: true,
            pointStyle: 'circle',
            font: {
              size: 12,
              weight: '500'
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          titleColor: 'white',
          bodyColor: 'white',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          borderWidth: 1,
          cornerRadius: 12,
          padding: 12,
          titleFont: {
            size: 14,
            weight: 'bold'
          },
          bodyFont: {
            size: 13
          },
          callbacks: {
            label: function(context) {
              const label = context.label || ''
              const value = formatLargeCurrency(context.parsed)
              const total = context.dataset.data.reduce((a, b) => a + b, 0)
              const percentage = ((context.parsed / total) * 100).toFixed(1)
              return `🏆 ${label}: ${value} (${percentage}%)`
            }
          }
        }
      },
      cutout: '65%',
      animation: {
        animateRotate: true,
        animateScale: true,
        duration: 1200,
        easing: 'easeOutQuart'
      }
    }
  })

  // Update market summary
  updateMarketSummary(cryptos)
}

// Function to update market summary
function updateMarketSummary(cryptos) {
  const totalMarketCap = cryptos.reduce((sum, crypto) => sum + crypto.market_cap, 0)
  const totalChange = cryptos.reduce((sum, crypto) => sum + crypto.price_change_percentage_24h, 0) / cryptos.length

  const totalMarketCapElement = document.getElementById('totalMarketCap')
  const marketChangeElement = document.getElementById('marketChange')

  if (totalMarketCapElement) {
    totalMarketCapElement.textContent = formatLargeCurrency(totalMarketCap)
  }

  if (marketChangeElement) {
    marketChangeElement.textContent = `${totalChange >= 0 ? '+' : ''}${totalChange.toFixed(1)}%`
    marketChangeElement.className = `summary-value ${totalChange >= 0 ? 'positive' : 'negative'}`
  }
}

// Function to update top performers
function updateTopPerformers(cryptos) {
  const topPerformers = cryptos
    .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
    .slice(0, 3)

  const performanceList = document.getElementById('topPerformers')
  if (performanceList) {
    performanceList.innerHTML = topPerformers.map(crypto => `
      <div class="performance-item">
        <div class="performance-crypto">
          <img src="${crypto.image}" alt="${crypto.name}" class="performance-avatar">
          <span class="performance-name">${crypto.name}</span>
        </div>
        <span class="performance-change ${crypto.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}">
          ${crypto.price_change_percentage_24h >= 0 ? '+' : ''}${crypto.price_change_percentage_24h.toFixed(1)}%
        </span>
      </div>
    `).join('')
  }
}

// Main functions
async function loadDashboard() {
  try {
    showLoading(true)

    // Fetch data in parallel
    const [cryptos, globalData] = await Promise.all([
      fetchCryptoData(),
      fetchGlobalData()
    ])

    // Store data globally
    cryptoData = cryptos

    // Render all components
    renderCryptoGrid(cryptos)
    renderGlobalStats(globalData)
    createPriceChart(cryptos)
    createMarketCapChart(cryptos)
    updateTopPerformers(cryptos)
    updateLastUpdateTime()

    showLoading(false)

    // Show success message if using mock data
    if (cryptos === mockCryptoData) {
      console.log('📊 Dashboard cargado con datos de demostración')
    } else {
      console.log('📊 Dashboard cargado con datos en tiempo real')
    }

  } catch (error) {
    console.error('Error loading dashboard:', error)
    // Even if there's an error, try to load with mock data
    try {
      cryptoData = mockCryptoData
      renderCryptoGrid(mockCryptoData)
      renderGlobalStats(mockGlobalData)
      createPriceChart(mockCryptoData)
      createMarketCapChart(mockCryptoData)
      updateTopPerformers(mockCryptoData)
      updateLastUpdateTime()
      showLoading(false)
      console.log('📊 Dashboard cargado con datos de respaldo')
    } catch (fallbackError) {
      showError('Error al cargar los datos. Mostrando modo demo.')
      showLoading(false)
    }
  }
}

function showLoading(show) {
  const loading = document.getElementById('loading')
  const dashboard = document.getElementById('dashboard')

  if (show) {
    loading.classList.remove('hidden')
    dashboard.classList.add('hidden')
  } else {
    loading.classList.add('hidden')
    dashboard.classList.remove('hidden')
  }
}

function showError(message) {
  const loading = document.getElementById('loading')
  loading.innerHTML = `
    <div class="text-center py-20">
      <div class="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-8">
        <span class="text-4xl">⚠️</span>
      </div>
      <h2 class="text-2xl font-bold text-white mb-4">Modo Demo Activado</h2>
      <p class="text-gray-300 text-lg mb-8">Mostrando datos de ejemplo mientras se conecta con la API</p>
      <button onclick="loadDashboard()" class="crypto-button flex items-center space-x-2">
        <span>🔄</span>
        <span>Reintentar Conexión</span>
      </button>
    </div>
  `
}

// Event listeners
function setupEventListeners() {
  const refreshBtn = document.getElementById('refreshBtn')
  refreshBtn.addEventListener('click', loadDashboard)

  // Auto-refresh every 30 seconds
  setInterval(loadDashboard, UPDATE_INTERVAL)
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners()
  loadDashboard()
})

// Make loadDashboard globally available for error retry
window.loadDashboard = loadDashboard
