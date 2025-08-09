import { useState } from 'react'
import Layout from './components/Layout.jsx'
import ConfigPage from './components/ConfigPage.jsx'
import PatientsPage from './components/PatientsPage.jsx'
import ExamsPage from './components/ExamsPage.jsx'
import ReportsPage from './components/ReportsPage.jsx'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('config')

  const renderPage = () => {
    switch (currentPage) {
      case 'config':
        return <ConfigPage />
      case 'patients':
        return <PatientsPage />
      case 'exams':
        return <ExamsPage />
      case 'reports':
        return <ReportsPage />
      default:
        return <ConfigPage />
    }
  }

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  )
}

export default App
