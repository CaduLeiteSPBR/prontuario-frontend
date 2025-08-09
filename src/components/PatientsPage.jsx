import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Eye, 
  UserX,
  UserCheck,
  Calendar,
  Phone,
  Mail,
  MapPin
} from 'lucide-react'

const PatientsPage = () => {
  const [patients, setPatients] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [showForm, setShowForm] = useState(false)
  const [editingPatient, setEditingPatient] = useState(null)
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 })

  // Estados do formulário
  const [formData, setFormData] = useState({
    full_name: '',
    cpf: '',
    birth_date: '',
    gender: '',
    phone: '',
    email: '',
    address_street: '',
    address_number: '',
    address_complement: '',
    address_neighborhood: '',
    address_city: '',
    address_state: '',
    address_zipcode: '',
    allergies: [],
    chronic_diseases: [],
    previous_surgeries: [],
    family_history: [],
    current_medications: [],
    smoking: 'never',
    alcohol_consumption: 'never',
    physical_activity: 'sedentary'
  })

  useEffect(() => {
    loadPatients()
  }, [searchQuery, pagination.page])

  const loadPatients = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        search: searchQuery,
        page: pagination.page.toString(),
        per_page: '10'
      })

      const response = await fetch(`/api/patients?${params}`)
      const data = await response.json()

      if (data.success) {
        setPatients(data.patients)
        setPagination(data.pagination)
      } else {
        setMessage({ type: 'error', text: data.error || 'Erro ao carregar pacientes' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao carregar pacientes' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const resetForm = () => {
    setFormData({
      full_name: '',
      cpf: '',
      birth_date: '',
      gender: '',
      phone: '',
      email: '',
      address_street: '',
      address_number: '',
      address_complement: '',
      address_neighborhood: '',
      address_city: '',
      address_state: '',
      address_zipcode: '',
      allergies: [],
      chronic_diseases: [],
      previous_surgeries: [],
      family_history: [],
      current_medications: [],
      smoking: 'never',
      alcohol_consumption: 'never',
      physical_activity: 'sedentary'
    })
    setEditingPatient(null)
    setShowForm(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const url = editingPatient ? `/api/patients/${editingPatient.id}` : '/api/patients'
      const method = editingPatient ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ 
          type: 'success', 
          text: editingPatient ? 'Paciente atualizado com sucesso!' : 'Paciente cadastrado com sucesso!' 
        })
        resetForm()
        loadPatients()
      } else {
        setMessage({ type: 'error', text: data.error || 'Erro ao salvar paciente' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao salvar paciente' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (patient) => {
    setFormData({
      full_name: patient.full_name || '',
      cpf: patient.cpf || '',
      birth_date: patient.birth_date || '',
      gender: patient.gender || '',
      phone: patient.phone || '',
      email: patient.email || '',
      address_street: patient.address?.street || '',
      address_number: patient.address?.number || '',
      address_complement: patient.address?.complement || '',
      address_neighborhood: patient.address?.neighborhood || '',
      address_city: patient.address?.city || '',
      address_state: patient.address?.state || '',
      address_zipcode: patient.address?.zipcode || '',
      allergies: patient.medical_info?.allergies || [],
      chronic_diseases: patient.medical_info?.chronic_diseases || [],
      previous_surgeries: patient.medical_info?.previous_surgeries || [],
      family_history: patient.medical_info?.family_history || [],
      current_medications: patient.medical_info?.current_medications || [],
      smoking: patient.lifestyle?.smoking || 'never',
      alcohol_consumption: patient.lifestyle?.alcohol_consumption || 'never',
      physical_activity: patient.lifestyle?.physical_activity || 'sedentary'
    })
    setEditingPatient(patient)
    setShowForm(true)
  }

  const handleToggleActive = async (patient) => {
    setIsLoading(true)
    try {
      const url = patient.active 
        ? `/api/patients/${patient.id}` 
        : `/api/patients/${patient.id}/activate`
      const method = patient.active ? 'DELETE' : 'POST'

      const response = await fetch(url, { method })
      const data = await response.json()

      if (data.success) {
        setMessage({ 
          type: 'success', 
          text: patient.active ? 'Paciente desativado' : 'Paciente reativado' 
        })
        loadPatients()
      } else {
        setMessage({ type: 'error', text: data.error || 'Erro ao alterar status' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao alterar status do paciente' })
    } finally {
      setIsLoading(false)
    }
  }

  const formatCPF = (cpf) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  const formatPhone = (phone) => {
    if (!phone) return ''
    return phone.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3')
  }

  if (showForm) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {editingPatient ? 'Editar Paciente' : 'Novo Paciente'}
              </h1>
              <p className="text-gray-600">
                {editingPatient ? 'Atualize as informações do paciente' : 'Cadastre um novo paciente no sistema'}
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={resetForm}>
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Pessoais */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Nome Completo *</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF *</Label>
                  <Input
                    id="cpf"
                    value={formData.cpf}
                    onChange={(e) => setFormData(prev => ({ ...prev, cpf: e.target.value }))}
                    placeholder="000.000.000-00"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birth_date">Data de Nascimento *</Label>
                  <Input
                    id="birth_date"
                    type="date"
                    value={formData.birth_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, birth_date: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gênero *</Label>
                  <select
                    id="gender"
                    value={formData.gender}
                    onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Selecione</option>
                    <option value="masculino">Masculino</option>
                    <option value="feminino">Feminino</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Endereço */}
          <Card>
            <CardHeader>
              <CardTitle>Endereço</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="address_street">Rua/Avenida</Label>
                  <Input
                    id="address_street"
                    value={formData.address_street}
                    onChange={(e) => setFormData(prev => ({ ...prev, address_street: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address_number">Número</Label>
                  <Input
                    id="address_number"
                    value={formData.address_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, address_number: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address_complement">Complemento</Label>
                  <Input
                    id="address_complement"
                    value={formData.address_complement}
                    onChange={(e) => setFormData(prev => ({ ...prev, address_complement: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address_neighborhood">Bairro</Label>
                  <Input
                    id="address_neighborhood"
                    value={formData.address_neighborhood}
                    onChange={(e) => setFormData(prev => ({ ...prev, address_neighborhood: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address_city">Cidade</Label>
                  <Input
                    id="address_city"
                    value={formData.address_city}
                    onChange={(e) => setFormData(prev => ({ ...prev, address_city: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address_state">Estado</Label>
                  <Input
                    id="address_state"
                    value={formData.address_state}
                    onChange={(e) => setFormData(prev => ({ ...prev, address_state: e.target.value }))}
                    maxLength="2"
                    placeholder="SP"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address_zipcode">CEP</Label>
                  <Input
                    id="address_zipcode"
                    value={formData.address_zipcode}
                    onChange={(e) => setFormData(prev => ({ ...prev, address_zipcode: e.target.value }))}
                    placeholder="00000-000"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : (editingPatient ? 'Atualizar' : 'Cadastrar')}
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
          <Users className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pacientes</h1>
            <p className="text-gray-600">Gerencie o cadastro de pacientes</p>
          </div>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Paciente
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nome ou CPF..."
              value={searchQuery}
              onChange={handleSearch}
              className="flex-1"
            />
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

      {/* Patients List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Lista de Pacientes ({pagination.total} encontrados)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Carregando pacientes...</p>
            </div>
          ) : patients.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {searchQuery ? 'Nenhum paciente encontrado' : 'Nenhum paciente cadastrado'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {patients.map((patient) => (
                <div
                  key={patient.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-lg">{patient.full_name}</h3>
                        <Badge variant={patient.active ? "default" : "secondary"}>
                          {patient.active ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <span className="font-medium">CPF:</span>
                          <span>{formatCPF(patient.cpf)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{patient.age} anos</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="font-medium">Gênero:</span>
                          <span className="capitalize">{patient.gender}</span>
                        </div>
                        {patient.phone && (
                          <div className="flex items-center space-x-1">
                            <Phone className="h-4 w-4" />
                            <span>{formatPhone(patient.phone)}</span>
                          </div>
                        )}
                        {patient.email && (
                          <div className="flex items-center space-x-1">
                            <Mail className="h-4 w-4" />
                            <span>{patient.email}</span>
                          </div>
                        )}
                        {patient.city && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{patient.city}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(patient)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(patient)}
                        className={patient.active ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                      >
                        {patient.active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
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
    </div>
  )
}

export default PatientsPage

