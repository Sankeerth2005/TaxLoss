import { TaxHarvestingProvider } from './context/TaxHarvestingContext'
import { Dashboard } from './components/Dashboard'

function App() {
  return (
    <TaxHarvestingProvider>
      <Dashboard />
    </TaxHarvestingProvider>
  )
}

export default App
