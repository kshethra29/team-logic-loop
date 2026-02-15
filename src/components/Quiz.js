import { useState, useEffect } from "react";

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [name, setName] = useState("");
  const [started, setStarted] = useState(false);
  
  // States for visual feedback & animations
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/questions")
      .then((res) => res.json())
      .then((data) => setQuestions(data));
  }, []);

  // --- NEW FEATURE: Personalized Feedback Logic ---
  const getFeedback = (finalScore) => {
    const total = questions.length || 15;
    const percentage = (finalScore / total) * 100;

    if (percentage === 100) {
      return { 
        msg: "Perfect Score! You're a Master.", 
        color: "#22c55e", 
        focus: "Advanced Software Architecture & System Design" 
      };
    } else if (percentage >= 80) {
      return { 
        msg: "Excellent Work! You have a strong grasp.", 
        color: "#06b6d4", 
        focus: "Performance Optimization & Design Patterns" 
      };
    } else if (percentage >= 50) {
      return { 
        msg: "Good Job! You're on the right track.", 
        color: "#eab308", 
        focus: "Logic Building & Intermediate API Handling" 
      };
    } else {
      return { 
        msg: "Keep Learning! Consistency is key.", 
        color: "#ef4444", 
        focus: "Core Fundamentals & Programming Syntax" 
      };
    }
  };

  function handleAnswer(option) {
    if (isAnimating) return; // Prevent double clicking during animation

    const correct = option === questions[current].answer;
    setSelectedOption(option);
    setIsAnimating(true);

    // Short delay so user can see the green/red color feedback
    setTimeout(() => {
      const newScore = score + (correct ? 1 : 0);
      setScore(newScore);

      if (current + 1 < questions.length) {
        setCurrent(current + 1);
        setSelectedOption(null);
        setIsAnimating(false);
      } else {
        setFinished(true);
        submitFinalScore(newScore);
      }
    }, 800); 
  }

  function submitFinalScore(finalScore) {
    fetch("http://localhost:5000/submit-score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, score: finalScore }),
    })
    .then(res => res.json())
    .then(data => {
      // Dispatch custom event to update Leaderboard.jsx in real-time
      const event = new CustomEvent("scoreSubmitted", { detail: data.leaderboard });
      window.dispatchEvent(event);
    });
  }

  // --- 1. Login Screen ---
  if (!started) {
    return (
      <div className="quiz-container login-box">
        <h2>Quiz Master</h2>
        <input 
          className="name-input"
          type="text" 
          placeholder="Enter Your Name" 
          value={name}
          onChange={(e) => setName(e.target.value)} 
        />
        <button className="start-btn" onClick={() => setStarted(true)} disabled={!name}>
          Start Quiz (15 Questions)
        </button>
      </div>
    );
  }

  // --- 2. Results Screen (Including Personalized Feedback) ---
  if (finished) {
    const feedback = getFeedback(score);
    return (
      <div className="quiz-container">
        <h2>Results</h2>
        <div className="score-box">
            <p>{name}, your final score is:</p>
            <h1 style={{ color: "var(--primary)", fontSize: "3.5rem", margin: "10px 0" }}>
              {score} / {questions.length}
            </h1>

            {/* NEW FEEDBACK CARD */}
            <div className="feedback-card" style={{ border: `2px solid ${feedback.color}`, marginTop: "20px", padding: "20px", borderRadius: "16px", background: "rgba(255,255,255,0.02)" }}>
              <h3 style={{ color: feedback.color, marginBottom: "10px" }}>{feedback.msg}</h3>
              <p style={{ fontSize: "0.95rem", color: "var(--text-dim)", margin: 0 }}>
                <strong>Personalized Focus:</strong> {feedback.focus}
              </p>
            </div>
        </div>
        <button className="start-btn" onClick={() => window.location.reload()}>Play Again</button>
      </div>
    );
  }

  // --- 3. Loading State ---
  if (questions.length === 0) return <p>Loading questions...</p>;

  const currentQ = questions[current];

  // --- 4. Main Quiz Interface ---
  return (
    <div className="quiz-container">
      {/* Visual Progress Bar */}
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${((current + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

      <p style={{ color: "var(--text-dim)" }}>Question {current + 1} of {questions.length}</p>
      <h3>{currentQ.question}</h3>
      
      {/* Vertical Stacking Options Grid */}
      <div className="options-grid">
        {currentQ.options.map((opt, i) => {
          let statusClass = "";
          if (selectedOption === opt) {
            statusClass = opt === currentQ.answer ? "correct" : "incorrect";
          } else if (selectedOption && opt === currentQ.answer) {
            statusClass = "correct"; // Highlight the correct answer if user missed it
          }

          return (
            <button 
              key={i} 
              className={`option-btn ${statusClass}`}
              onClick={() => handleAnswer(opt)}
              disabled={isAnimating}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}