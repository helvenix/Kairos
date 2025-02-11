// Module
import { useState, useEffect } from 'react'

// CSS
import './css/App.css'

// Components
import AccessGate from './components/AccessGate.jsx'

function formatTime(ms){
    const pad = (num, size) => String(num).padStart(size, '0');

    const totalSeconds = Math.floor(ms / 1000);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const hours = Math.floor(totalSeconds / 3600) % 24;
    const days = Math.floor(totalSeconds / 86400);
    return `${pad(days, 2)}:${pad(hours, 2)}:${pad(minutes, 2)}:${pad(seconds, 2)}`;
}

function App() {
    const [access, setAccess] = useState(true)
    const [assignments, setAssignments] = useState([])

    useEffect(() => {
        fetch('/assignments.json')
            .then((response) => response.json())
            .then((data) => setAssignments(data))
            .catch((error) => console.error("Error fetching assignments:", error));

        const intervalId = setInterval(() => {
            setAssignments(prev => prev.map((assignment) => {
                const now = new Date();
                const deadline = new Date(assignment.deadline);
                const start = new Date(assignment.start)
                const duration = deadline - start
                const timeRemaining = deadline - now;
                return {
                    ...assignment,
                    duration: duration > 0 ? duration : 0,
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
                        {assignments
                            .slice()
                            .sort((a,b) => a.remaining - b.remaining)
                            .map((assignment) => (
                            <div className='assignment' key={assignment.id}>
                                <div className="title">{assignment.title}</div>
                                <div className="progressContainer">
                                    <div className="progressBar">
                                        <div className="progressNow" style={{width: `${assignment[3]}%`}}></div>
                                    </div>
                                    <div className="progressLabel"></div>
                                </div>
                                <div className="due">due date: {assignment.deadline}</div>
                                <div 
                                    className="countdown"
                                    style={{
                                        color: (()=>{
                                            const timeRatio = assignment.remaining/assignment.duration
                                            if(assignment.remaining < 24*60*60*1000 || timeRatio < 0.25){
                                                return "#B03A2E"
                                            }else if(timeRatio < 0.5){
                                                return "#D4AF37"
                                            }else if(timeRatio >= 0.5){
                                                return "#478A50"
                                            }else{
                                                return "#F4F4F4"
                                            }
                                        })()
                                    }}
                                >
                                    {assignment.remaining !== undefined ?
                                        formatTime(assignment.remaining)
                                    :
                                        "Calculating..."
                                    }
                                </div>
                                <div className="options">
                                    <div className="markAsDone buttons">
                                        <h1>mark<br />as<br />done</h1>
                                        <div className="bg1"></div>
                                        <div className="bg2"></div>
                                    </div>
                                    <div className="details buttons">
                                        <h1>details</h1>
                                        <div className="bg1"></div>
                                        <div className="bg2"></div>
                                    </div>
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
