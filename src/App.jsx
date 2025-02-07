// Module
import { useState } from 'react'

// CSS
import './css/App.css'

// Components
import AccessGate from './components/AccessGate.jsx'

function App() {
    const [access, setAccess] = useState(false)
    return (
        access ?
            (
                <div id="container">

                </div>
            )
        :
            (
                <AccessGate setAccess={setAccess} /> 
            )    
    )
}

export default App