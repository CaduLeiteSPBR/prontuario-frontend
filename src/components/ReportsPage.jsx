import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { 
  FileText, 
  TrendingUp, 
  Calendar, 
  User,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Download,
  Filter,
  Eye,
  Building,
  Stethoscope
} from 'lucide-react'

const ReportsPage = () => {
  const [patients, setPatients] = useState([])
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [medicalRecord, setMedicalRecord] = useState(null)
  const [timeline, setTimeline] = useState([])
  const [trends, setTrends] = useState(null)
  const [summary, setSummary] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [activeTab, setActiveTab] = useState('summary')
  const [filters, setFilters] = useState({
    start_date: '',
    end_date: '',
    exam_type: '',
    parameter: '',
    months: 12
  })

  useEffect(() => {
    loadPatients()
  }, [])

  useEffect(() => {
    if (selectedPatient) {
      loadPatientData()
    }
  }, [selectedPatient])

  const loadPatients = async () => {
    try {
      const response = await fetch('/api/patients?per_page=100')
      const data = await response.json()

      if (data.success) {
        setPatients(data.patients)
      }
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error)
    }
  }

  const loadPatientData = async () => {
    if (!selectedPatient) return

    setIsLoading(true)
    try {
      // Carrega resumo
      const summaryResponse = await fetch(`/api/patients/${selectedPatient.id}/summary`)
      const summaryData = await summaryResponse.json()
      if (summaryData.success) {
        setSummary(summaryData.summary)
      }

      // Carrega timeline
      const timelineResponse = await fetch(`/api/patients/${selectedPatient.id}/timeline`)
      const timelineData = await timelineResponse.json()
      if (timelineData.success) {
        setTimeline(timelineData.timeline)
      }

      // Carrega tendências
      const trendsResponse = await fetch(`/api/patients/${selectedPatient.id}/trends?months=${filters.months}`)
      const trendsData = await trendsResponse.json()
      if (trendsData.success) {
        setTrends(trendsData)
      }

    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao carregar dados do paciente' })
    } finally {
      setIsLoading(false)
    }
  }

  const loadMedicalRecord = async () => {
    if (!selectedPatient) return

    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.start_date) params.append('start_date', filters.start_date)
      if (filters.end_date) params.append('end_date', filters.end_date)
      if (filters.exam_type) params.append('exam_type', filters.exam_type)

      const response = await fetch(`/api/patients/${selectedPatient.id}/medical-record?${params}`)
      const data = await response.json()

      if (data.success) {
        setMedicalRecord(data)
      } else {
        setMessage({ type: 'error', text: data.error || 'Erro ao carregar prontuário' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao carregar prontuário' })
    } finally {
      setIsLoading(false)
    }
  }

  const loadTrends = async (parameter = '') => {
    if (!selectedPatient) return

    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        months: filters.months.toString()
      })
      if (parameter) params.append('parameter', parameter)

      const response = await fetch(`/api/patients/${selectedPatient.id}/trends?${params}`)
      const data = await response.json()

      if (data.success) {
        setTrends(data)
      } else {
        setMessage({ type: 'error', text: data.error || 'Erro ao carregar tendências' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao carregar tendências' })
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getTimelineIcon = (type) => {
    switch (type) {
      case 'patient_created':
        return <User className="h-4 w-4" />
      case 'exam_uploaded':
        return <FileText className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getTimelineColor = (color) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-500'
      case 'green':
        return 'bg-green-500'
      case 'yellow':
        return 'bg-yellow-500'
      case 'red':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  const renderSummaryTab = () => (
    <div className="space-y-6">
      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{summary?.exams_statistics?.total || 0}</p>
                <p className="text-sm text-gray-600">Total de Exames</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{summary?.exams_statistics?.completed || 0}</p>
                <p className="text-sm text-gray-600">Processados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{summary?.exams_statistics?.pending || 0}</p>
                <p className="text-sm text-gray-600">Pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{summary?.exams_statistics?.completion_rate || 0}%</p>
                <p className="text-sm text-gray-600">Taxa de Sucesso</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas */}
      {summary?.alerts && (
        <div className="space-y-3">
          {summary.alerts.pending_exams && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-700">
                Existem exames pendentes de processamento
              </AlertDescription>
            </Alert>
          )}
          
          {summary.alerts.error_exams && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                Alguns exames apresentaram erro no processamento
              </AlertDescription>
            </Alert>
          )}
          
          {summary.alerts.altered_values && (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-700">
                Foram encontrados valores alterados em exames recentes
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Último Exame */}
      {summary?.last_exam && (
        <Card>
          <CardHeader>
            <CardTitle>Último Exame</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{summary.last_exam.original_filename}</h3>
                <p className="text-sm text-gray-600">
                  {summary.last_exam.exam_type} • {formatDate(summary.last_exam.created_at)}
                </p>
              </div>
              <Badge className={
                summary.last_exam.processing_status === 'completed' ? 'bg-green-100 text-green-800' :
                summary.last_exam.processing_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }>
                {summary.last_exam.status_display}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Valores Alterados Recentes */}
      {summary?.recent_altered_values && summary.recent_altered_values.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Valores Alterados Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {summary.recent_altered_values.slice(0, 5).map((valor, index) => (
                <div key={index} className="border-l-4 border-red-500 pl-4 py-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{valor.parameter}</div>
                      <div className="text-sm text-gray-600">
                        Valor: {valor.value} | Referência: {valor.reference}
                      </div>
                      <div className="text-xs text-gray-500">
                        {valor.exam_type} • {formatDate(valor.exam_date)}
                      </div>
                    </div>
                    <Badge variant="destructive">
                      {valor.alteration_type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )

  const renderTimelineTab = () => (
    <Card>
      <CardHeader>
        <CardTitle>Timeline do Paciente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {timeline.map((event, index) => (
            <div key={event.id} className="flex items-start space-x-4">
              <div className={`w-8 h-8 rounded-full ${getTimelineColor(event.color)} flex items-center justify-center text-white`}>
                {getTimelineIcon(event.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{event.title}</h3>
                  <span className="text-sm text-gray-500">{formatDate(event.date)}</span>
                </div>
                <p className="text-sm text-gray-600">{event.description}</p>
                {event.exam_date && (
                  <p className="text-xs text-gray-500">Data do exame: {formatDate(event.exam_date)}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  const renderTrendsTab = () => (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros de Tendências</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Período (meses)</Label>
              <select
                value={filters.months}
                onChange={(e) => {
                  setFilters(prev => ({ ...prev, months: parseInt(e.target.value) }))
                  loadTrends()
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value={3}>Últimos 3 meses</option>
                <option value={6}>Últimos 6 meses</option>
                <option value={12}>Último ano</option>
                <option value={24}>Últimos 2 anos</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label>Parâmetro</Label>
              <select
                value={filters.parameter}
                onChange={(e) => {
                  setFilters(prev => ({ ...prev, parameter: e.target.value }))
                  loadTrends(e.target.value)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Todos os parâmetros</option>
                {trends?.available_parameters?.map((param) => (
                  <option key={param} value={param}>{param}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <Button onClick={() => loadTrends(filters.parameter)}>
                <Filter className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráficos de Tendências */}
      {trends?.trends_by_parameter && Object.keys(trends.trends_by_parameter).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(trends.trends_by_parameter).map(([parameter, data]) => (
            <Card key={parameter}>
              <CardHeader>
                <CardTitle>Tendência: {parameter}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => formatDate(value)}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => `Data: ${formatDate(value)}`}
                      formatter={(value, name) => [value, 'Valor']}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      dot={{ fill: '#8884d8' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : trends?.trends_data && trends.trends_data.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Tendência: {trends.selected_parameter}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={trends.trends_data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => formatDate(value)}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => `Data: ${formatDate(value)}`}
                  formatter={(value, name) => [value, 'Valor']}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ fill: '#8884d8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              Nenhum dado de tendência disponível para o período selecionado
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BarChart3 className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
            <p className="text-gray-600">Análises e visualizações dos dados dos pacientes</p>
          </div>
        </div>
      </div>

      {/* Seleção de Paciente */}
      <Card>
        <CardHeader>
          <CardTitle>Selecionar Paciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <select
              value={selectedPatient?.id || ''}
              onChange={(e) => {
                const patient = patients.find(p => p.id === parseInt(e.target.value))
                setSelectedPatient(patient || null)
                setMedicalRecord(null)
                setTimeline([])
                setTrends(null)
                setSummary(null)
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione um paciente</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.full_name} - {patient.cpf}
                </option>
              ))}
            </select>
            
            {selectedPatient && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="font-medium">{selectedPatient.full_name}</div>
                <div className="text-sm text-gray-600">
                  {selectedPatient.age} anos • {selectedPatient.cpf}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {message.text && (
        <Alert className={message.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
          <AlertDescription className={message.type === 'error' ? 'text-red-700' : 'text-green-700'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      {/* Conteúdo dos Relatórios */}
      {selectedPatient && (
        <div className="space-y-6">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('summary')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'summary'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Resumo
              </button>
              <button
                onClick={() => setActiveTab('timeline')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'timeline'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Timeline
              </button>
              <button
                onClick={() => setActiveTab('trends')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'trends'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Tendências
              </button>
            </nav>
          </div>

          {/* Conteúdo das Tabs */}
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Carregando dados...</p>
            </div>
          ) : (
            <div>
              {activeTab === 'summary' && renderSummaryTab()}
              {activeTab === 'timeline' && renderTimelineTab()}
              {activeTab === 'trends' && renderTrendsTab()}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ReportsPage

