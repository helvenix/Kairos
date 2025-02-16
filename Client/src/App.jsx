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
    const [displayScreen, setDisplayScreen] = useState(false)
    const [screenInfo, setScreenInfo] = useState()

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

    function markAsDone(Id){
        setAssignments(prev => prev.map(assignment => assignment.id === Id ? {...assignment, completed: true} : assignment))
        setTimeout(() => setDisplayScreen(false), 300)
    }

    return (
        access ?
            (
                <div id="container">
                    <div id="threshold">

                    </div>
                    {displayScreen ? 
                        (
                            <>
                                <div id="outScreen"></div>
                                <div id="inScreen">
                                    <div 
                                        id="holdButton"
                                        onMouseDown={(e) => {
                                            const button = e.currentTarget;
                                            let startTime = Date.now();
                                            let holdTime = 4000
                                            button.classList.add('hovered');
                                            const interval = setInterval(() => {
                                                let elapsed = Date.now() - startTime;
                                                let progressDegrees = Math.min((elapsed / holdTime) * 360, 360);
                                                button.style.setProperty('--progress', `${progressDegrees}deg`);
                                                if (progressDegrees === 360) {
                                                    clearInterval(interval);
                                                    markAsDone(screenInfo)
                                                }
                                            }, 10);

                                            const clearHold = () => {
                                                clearInterval(interval);
                                                button.style.setProperty('--progress', '0deg');
                                                button.classList.remove('hovered');
                                                document.removeEventListener('mouseup', clearHold);
                                            };  
                                          
                                                document.addEventListener('mouseup', clearHold, { once: true });
                                        }}
                                    >
                                        <h1>Completed</h1>
                                        <div className="bg1"></div>
                                        <div className="bg2"></div>
                                    </div>
                                </div>
                            </>
                        ) : null
                    }
                    <div id="assignmentsList">
                        {assignments
                            .slice()
                            .filter(assignment => !assignment.completed)
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
                                    {assignment.remaining !== undefined ? formatTime(assignment.remaining):"Calculating..."}
                                </div>
                                <div className="options">
                                    <div 
                                        className="markAsDone buttons"
                                        onClick= {() => {
                                            setScreenInfo(assignment.id)
                                            setDisplayScreen(true)
                                        }}
                                    >
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