// Module
import { useState, useEffect } from 'react'

// CSS
import './css/App.css'

// Components
import AccessGate from './components/AccessGate.jsx'

function formatTime(ms){
    const totalSeconds = Math.floor(ms / 1000);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const hours = Math.floor(totalSeconds / 3600) % 24;
    const days = Math.floor(totalSeconds / 86400);
    return `${days}:${hours}:${minutes}:${seconds}`;
}

function App() {
    const [access, setAccess] = useState(false)

    const [assignments, setAssignments] = useState([])

    useEffect(() => {
        const initialAssignments = [
            {
                id: 1,
                title: "LTM MPKT",
                start: 'Feb 3, 2025 15:30:00',
                deadline: 'Feb 9, 2025 23:59:00'
            },
            {
                id: 2,
                title: "Worksheet MatDis 2",
                start: 'Feb 7, 2025 18:00:00',
                deadline: 'Feb 12, 2025 23:59:00'
            }
        ]
        setAssignments(initialAssignments)

        const intervalId = setInterval(() => {
            setAssignments(prev => prev.map((assignment) => {
                const now = new Date();
                const deadline = new Date(assignment.deadline);
                const timeRemaining = deadline - now;
                return {
                    ...assignment,
                    remaining: timeRemaining > 0 ? timeRemaining : 0
                };
            }));
        }, 1000)

        return () => clearInterval(intervalId)
    }, [])

    return (
        access ?
            (
                <div id="container">
                    <div id="threshold">

                    </div>
                    <div id="assignmentsList">
                        {assignments.map((assignment) => (
                            <div key={assignment.id}>
                                <div className="title">{assignment.title}</div>
                                {/* <div className="progressContainer">
                                    <div className="progressBar">
                                        <div className="progressNow" style={{width: `${assignment[3]}%`}}></div>
                                    </div>
                                    <div className="progressLabel"></div>
                                </div> */}
                                <div id="countdown">
                                    {assignment.remaining !== undefined ?
                                        formatTime(assignment.remaining)
                                    :
                                        "Calculating..."
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )
        :
            (
                <AccessGate setAccess={setAccess} /> 
            )    
    )
}

export default App