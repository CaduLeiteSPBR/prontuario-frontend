import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  FileText, 
  Upload, 
  Eye, 
  Download, 
  Trash2,
  RefreshCw,
  Image,
  FileImage,
  Calendar,
  Building,
  User,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react'

const ExamsPage = () => {
  const [patients, setPatients] = useState([])
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [exams, setExams] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [showUpload, setShowUpload] = useState(false)
  const [selectedExam, setSelectedExam] = useState(null)
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 })

  // Estados do upload
  const [uploadData, setUploadData] = useState({
    file: null,
    exam_type: '',
    exam_date: '',
    lab_name: '',
    doctor_name: ''
  })

  useEffect(() => {
    loadPatients()
  }, [])

  useEffect(() => {
    if (selectedPatient) {
      loadExams()
    }
  }, [selectedPatient, pagination.page])

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

  const loadExams = async () => {
    if (!selectedPatient) return

    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        per_page: '10'
      })

      const response = await fetch(`/api/patients/${selectedPatient.id}/exams?${params}`)
      const data = await response.json()

      if (data.success) {
        setExams(data.exams)
        setPagination(data.pagination)
      } else {
        setMessage({ type: 'error', text: data.error || 'Erro ao carregar exames' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao carregar exames' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Verifica tamanho (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Arquivo muito grande. Máximo 10MB.' })
        return
      }

      // Verifica tipo
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/tiff', 'application/pdf']
      if (!allowedTypes.includes(file.type)) {
        setMessage({ type: 'error', text: 'Tipo de arquivo não suportado. Use imagens ou PDF.' })
        return
      }

      setUploadData(prev => ({ ...prev, file }))
      setMessage({ type: '', text: '' })
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    
    if (!uploadData.file) {
      setMessage({ type: 'error', text: 'Selecione um arquivo' })
      return
    }

    setIsLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const formData = new FormData()
      formData.append('file', uploadData.file)
      
      if (uploadData.exam_type) formData.append('exam_type', uploadData.exam_type)
      if (uploadData.exam_date) formData.append('exam_date', uploadData.exam_date)
      if (uploadData.lab_name) formData.append('lab_name', uploadData.lab_name)
      if (uploadData.doctor_name) formData.append('doctor_name', uploadData.doctor_name)

      const response = await fetch(`/api/patients/${selectedPatient.id}/exams`, {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: 'success', text: 'Exame enviado com sucesso! Processamento iniciado.' })
        setShowUpload(false)
        setUploadData({
          file: null,
          exam_type: '',
          exam_date: '',
          lab_name: '',
          doctor_name: ''
        })
        loadExams()
      } else {
        setMessage({ type: 'error', text: data.error || 'Erro ao enviar exame' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao enviar exame' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewExam = async (exam) => {
    try {
      const response = await fetch(`/api/exams/${exam.id}`)
      const data = await response.json()

      if (data.success) {
        setSelectedExam(data.exam)
      } else {
        setMessage({ type: 'error', text: 'Erro ao carregar detalhes do exame' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao carregar detalhes do exame' })
    }
  }

  const handleReprocess = async (examId) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/exams/${examId}/reprocess`, {
        method: 'POST'
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: 'success', text: 'Reprocessamento iniciado' })
        loadExams()
      } else {
        setMessage({ type: 'error', text: data.error || 'Erro ao reprocessar' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao reprocessar exame' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteExam = async (examId) => {
    if (!confirm('Tem certeza que deseja remover este exame?')) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/exams/${examId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: 'success', text: 'Exame removido com sucesso' })
        loadExams()
      } else {
        setMessage({ type: 'error', text: data.error || 'Erro ao remover exame' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao remover exame' })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'processing':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  if (selectedExam) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Detalhes do Exame</h1>
              <p className="text-gray-600">{selectedExam.original_filename}</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => setSelectedExam(null)}>
            Voltar
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Arquivo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                {selectedExam.file_type === 'image' ? 
                  <Image className="h-4 w-4" /> : 
                  <FileImage className="h-4 w-4" />
                }
                <span className="font-medium">Tipo:</span>
                <span className="capitalize">{selectedExam.file_type}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4" />
                <span className="font-medium">Tamanho:</span>
                <span>{selectedExam.file_size_formatted}</span>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(selectedExam.processing_status)}
                <span className="font-medium">Status:</span>
                <Badge className={getStatusColor(selectedExam.processing_status)}>
                  {selectedExam.status_display}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">Enviado em:</span>
                <span>{formatDate(selectedExam.created_at)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Informações do Exame */}
          <Card>
            <CardHeader>
              <CardTitle>Dados do Exame</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedExam.exam_type && (
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span className="font-medium">Tipo:</span>
                  <span>{selectedExam.exam_type}</span>
                </div>
              )}
              {selectedExam.exam_date && (
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Data do Exame:</span>
                  <span>{formatDate(selectedExam.exam_date)}</span>
                </div>
              )}
              {selectedExam.lab_name && (
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4" />
                  <span className="font-medium">Laboratório:</span>
                  <span>{selectedExam.lab_name}</span>
                </div>
              )}
              {selectedExam.doctor_name && (
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">Médico:</span>
                  <span>{selectedExam.doctor_name}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Texto Extraído */}
        {selectedExam.extracted_text && (
          <Card>
            <CardHeader>
              <CardTitle>Texto Extraído</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm">{selectedExam.extracted_text}</pre>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Análise da IA */}
        {selectedExam.ai_summary && (
          <Card>
            <CardHeader>
              <CardTitle>Resumo da Análise</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{selectedExam.ai_summary}</p>
            </CardContent>
          </Card>
        )}

        {/* Valores Extraídos */}
        {selectedExam.extracted_values && selectedExam.extracted_values.valores && selectedExam.extracted_values.valores.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Valores Encontrados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {selectedExam.extracted_values.valores.map((valor, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="font-medium">{valor.nome}</div>
                    <div className="text-sm text-gray-600">
                      {valor.valor} {valor.unidade}
                      {valor.referencia && ` (Ref: ${valor.referencia})`}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Erro de Processamento */}
        {selectedExam.processing_error && (
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Erro no Processamento</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700">{selectedExam.processing_error}</p>
              <Button 
                onClick={() => handleReprocess(selectedExam.id)}
                className="mt-3"
                disabled={isLoading}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reprocessar
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  if (showUpload && selectedPatient) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Upload className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Novo Exame</h1>
              <p className="text-gray-600">Paciente: {selectedPatient.full_name}</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => setShowUpload(false)}>
            Cancelar
          </Button>
        </div>

        {message.text && (
          <Alert className={message.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
            <AlertDescription className={message.type === 'error' ? 'text-red-700' : 'text-green-700'}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleUpload} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload do Arquivo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file">Arquivo do Exame *</Label>
                <Input
                  id="file"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  required
                />
                <p className="text-sm text-gray-600">
                  Formatos aceitos: Imagens (JPG, PNG, GIF, BMP, TIFF) e PDF. Máximo 10MB.
                </p>
              </div>

              {uploadData.file && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    {uploadData.file.type.startsWith('image/') ? 
                      <Image className="h-4 w-4 text-blue-600" /> : 
                      <FileImage className="h-4 w-4 text-blue-600" />
                    }
                    <span className="font-medium">{uploadData.file.name}</span>
                    <span className="text-sm text-gray-600">
                      ({(uploadData.file.size / (1024 * 1024)).toFixed(2)} MB)
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações do Exame (Opcional)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="exam_type">Tipo do Exame</Label>
                  <Input
                    id="exam_type"
                    value={uploadData.exam_type}
                    onChange={(e) => setUploadData(prev => ({ ...prev, exam_type: e.target.value }))}
                    placeholder="Ex: Hemograma, Glicemia..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exam_date">Data do Exame</Label>
                  <Input
                    id="exam_date"
                    type="date"
                    value={uploadData.exam_date}
                    onChange={(e) => setUploadData(prev => ({ ...prev, exam_date: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lab_name">Laboratório</Label>
                  <Input
                    id="lab_name"
                    value={uploadData.lab_name}
                    onChange={(e) => setUploadData(prev => ({ ...prev, lab_name: e.target.value }))}
                    placeholder="Nome do laboratório"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctor_name">Médico Solicitante</Label>
                  <Input
                    id="doctor_name"
                    value={uploadData.doctor_name}
                    onChange={(e) => setUploadData(prev => ({ ...prev, doctor_name: e.target.value }))}
                    placeholder="Nome do médico"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={() => setShowUpload(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || !uploadData.file}>
              {isLoading ? 'Enviando...' : 'Enviar Exame'}
            </Button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Exames</h1>
            <p className="text-gray-600">Gerencie exames e laudos dos pacientes</p>
          </div>
        </div>
        {selectedPatient && (
          <Button onClick={() => setShowUpload(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Novo Exame
          </Button>
        )}
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
                setExams([])
                setPagination({ page: 1, total: 0, pages: 0 })
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

      {/* Lista de Exames */}
      {selectedPatient && (
        <Card>
          <CardHeader>
            <CardTitle>
              Exames do Paciente ({pagination.total} encontrados)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Carregando exames...</p>
              </div>
            ) : exams.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Nenhum exame encontrado</p>
                <Button onClick={() => setShowUpload(true)} className="mt-3">
                  <Upload className="h-4 w-4 mr-2" />
                  Enviar Primeiro Exame
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {exams.map((exam) => (
                  <div
                    key={exam.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {exam.file_type === 'image' ? 
                            <Image className="h-5 w-5 text-blue-600" /> : 
                            <FileImage className="h-5 w-5 text-red-600" />
                          }
                          <h3 className="font-semibold">{exam.original_filename}</h3>
                          <Badge className={getStatusColor(exam.processing_status)}>
                            {getStatusIcon(exam.processing_status)}
                            <span className="ml-1">{exam.status_display}</span>
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm text-gray-600">
                          {exam.exam_type && (
                            <div className="flex items-center space-x-1">
                              <span className="font-medium">Tipo:</span>
                              <span>{exam.exam_type}</span>
                            </div>
                          )}
                          {exam.exam_date && (
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(exam.exam_date)}</span>
                            </div>
                          )}
                          {exam.lab_name && (
                            <div className="flex items-center space-x-1">
                              <Building className="h-4 w-4" />
                              <span>{exam.lab_name}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <Activity className="h-4 w-4" />
                            <span>{exam.file_size_formatted}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewExam(exam)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {exam.processing_status === 'error' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReprocess(exam.id)}
                            disabled={isLoading}
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteExam(exam.id)}
                          className="text-red-600 hover:text-red-700"
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center space-x-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                >
                  Anterior
                </Button>
                <span className="flex items-center px-3 text-sm text-gray-600">
                  Página {pagination.page} de {pagination.pages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.pages}
                >
                  Próxima
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default ExamsPage

