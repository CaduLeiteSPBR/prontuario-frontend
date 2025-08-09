import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { 
  Settings, 
  Key, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react'

const ConfigPage = () => {
  const [apiKey, setApiKey] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [isConfigured, setIsConfigured] = useState(false)
  const [maxFileSize, setMaxFileSize] = useState('10')
  const [retentionDays, setRetentionDays] = useState('365')

  // Carrega configurações ao montar o componente
  useEffect(() => {
    loadConfigs()
  }, [])

  const loadConfigs = async () => {
    try {
      const response = await fetch('/api/config')
      const data = await response.json()
      
      if (data.success) {
        // Verifica se a API da OpenAI está configurada
        if (data.configs.openai_api_key) {
          setIsConfigured(data.configs.openai_api_key.configured)
        }
        
        // Carrega outras configurações
        if (data.configs.max_file_size) {
          setMaxFileSize(data.configs.max_file_size.value || '10')
        }
        if (data.configs.retention_days) {
          setRetentionDays(data.configs.retention_days.value || '365')
        }
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error)
    }
  }

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      setMessage({ type: 'error', text: 'Por favor, insira uma chave de API válida.' })
      return
    }

    if (!apiKey.startsWith('sk-')) {
      setMessage({ type: 'error', text: 'A chave da API deve começar com "sk-".' })
      return
    }

    setIsLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const response = await fetch('/api/config/openai_api_key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          value: apiKey,
          is_encrypted: true
        })
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: 'success', text: 'Chave da API salva com sucesso!' })
        setIsConfigured(true)
        setApiKey('')
      } else {
        setMessage({ type: 'error', text: data.error || 'Erro ao salvar a chave da API.' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao salvar a chave da API. Tente novamente.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestConnection = async () => {
    setIsLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const response = await fetch('/api/config/test-openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: 'success', text: data.message })
      } else {
        setMessage({ type: 'error', text: data.error || 'Falha ao conectar com a API da OpenAI.' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao testar conexão. Tente novamente.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveAdditionalConfigs = async () => {
    setIsLoading(true)
    setMessage({ type: '', text: '' })

    try {
      // Salva tamanho máximo de arquivo
      await fetch('/api/config/max_file_size', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          value: maxFileSize,
          is_encrypted: false
        })
      })

      // Salva retenção de dados
      await fetch('/api/config/retention_days', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          value: retentionDays,
          is_encrypted: false
        })
      })

      setMessage({ type: 'success', text: 'Configurações adicionais salvas com sucesso!' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao salvar configurações adicionais.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Settings className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configurações do Sistema</h1>
          <p className="text-gray-600">Configure as integrações e parâmetros do sistema</p>
        </div>
      </div>

      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Status do Sistema</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              {isConfigured ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              )}
              <div>
                <p className="font-medium text-sm">API da OpenAI</p>
                <p className="text-xs text-gray-600">
                  {isConfigured ? 'Configurada' : 'Não configurada'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-sm">Banco de Dados</p>
                <p className="text-xs text-gray-600">Conectado</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-sm">Segurança</p>
                <p className="text-xs text-gray-600">Ativa</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Configuration Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key className="h-5 w-5" />
            <span>Configuração da API da OpenAI</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900">Segurança da Chave da API</p>
                <p className="text-blue-700 mt-1">
                  Sua chave da API será criptografada e armazenada de forma segura. 
                  Ela nunca será exibida em texto plano após ser salva.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiKey">Chave da API da OpenAI</Label>
            <div className="relative">
              <Input
                id="apiKey"
                type={showApiKey ? "text" : "password"}
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-600">
              Você pode encontrar sua chave da API no painel da OpenAI em platform.openai.com
            </p>
          </div>

          {message.text && (
            <Alert className={message.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
              <AlertDescription className={message.type === 'error' ? 'text-red-700' : 'text-green-700'}>
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex space-x-3">
            <Button 
              onClick={handleSaveApiKey}
              disabled={isLoading || !apiKey.trim()}
              className="flex-1"
            >
              {isLoading ? 'Salvando...' : 'Salvar Chave da API'}
            </Button>
            {isConfigured && (
              <Button 
                variant="outline"
                onClick={handleTestConnection}
                disabled={isLoading}
              >
                {isLoading ? 'Testando...' : 'Testar Conexão'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Additional Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações Adicionais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxFileSize">Tamanho Máximo de Arquivo (MB)</Label>
              <Input
                id="maxFileSize"
                type="number"
                value={maxFileSize}
                onChange={(e) => setMaxFileSize(e.target.value)}
                min="1"
                max="50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="retentionDays">Retenção de Dados (dias)</Label>
              <Input
                id="retentionDays"
                type="number"
                value={retentionDays}
                onChange={(e) => setRetentionDays(e.target.value)}
                min="30"
                max="3650"
              />
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleSaveAdditionalConfigs}
            disabled={isLoading}
          >
            {isLoading ? 'Salvando...' : 'Salvar Configurações Adicionais'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default ConfigPage

