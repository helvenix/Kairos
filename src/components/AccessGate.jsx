import { useState } from 'react'
import '../css/accessGate.css'

function checkAccess(accessInput, setAccessInput, setAccess){
    if (accessInput == import.meta.env.VITE_ACCESS_KEY){
        setAccess(true)
        setAccessInput('')
    }
}

// eslint-disable-next-line react/prop-types
export default function AccessGate({setAccess}){
    const [accessInput, setAccessInput] = useState("")

    return (
        <div id="accessGate">
            <input 
                type="password" 
                id="accessInput" 
                value={accessInput} 
                autoComplete="off"
                onChange={e => setAccessInput(e.target.value)}
                onKeyDown={e => e.key == "Enter" ? checkAccess(accessInput, setAccessInput, setAccess) : null}
            />
            <h1>Enter Access Key</h1>
            <button
                id="accessSubmit"
                onClick={() => checkAccess(accessInput, setAccessInput, setAccess)}
            >
                <h1>Submit</h1>
                <div className="bg1"></div>
                <div className="bg2"></div>
            </button>
        </div>
    )
}