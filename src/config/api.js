// Configuração da API baseada no ambiente
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
}

// Helper para fazer requisições
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  
  const config = {
    ...options,
    headers: {
      ...apiConfig.headers,
      ...options.headers,
    },
  }

  try {
    const response = await fetch(url, config)
    return response
  } catch (error) {
    console.error('API Request Error:', error)
    throw error
  }
}

export default apiConfig

