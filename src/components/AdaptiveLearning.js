import React from "react";
import "../App.css";

export default function AdaptiveLearning({ score }) {
  const getLevel = () => {
    if (score === null) return "Take a quiz to see your level!";
    if (score <= 5) return "Beginner: Focus on Fundamentals";
    if (score <= 10) return "Intermediate: Building Logic";
    return "Advanced: Mastery & Optimization";
  };

  // Resources linked to YouTube search queries for the best results
  const recommendations = {
    "Beginner: Focus on Fundamentals": [
      { title: "HTML5 Crash Course", url: "https://www.youtube.com/results?search_query=html5+basics+tutorial" },
      { title: "CSS for Absolute Beginners", url: "https://www.youtube.com/results?search_query=css+basics+tutorial" },
      { title: "JavaScript Variables & Logic", url: "https://www.youtube.com/results?search_query=javascript+basics+for+beginners" }
    ],
    "Intermediate: Building Logic": [
      { title: "ES6 Array Methods (Map/Filter)", url: "https://www.youtube.com/results?search_query=javascript+array+methods+tutorial" },
      { title: "Mastering DOM Manipulation", url: "https://www.youtube.com/results?search_query=javascript+dom+manipulation+tutorial" },
      { title: "Working with APIs & Fetch", url: "https://www.youtube.com/results?search_query=javascript+fetch+api+tutorial" }
    ],
    "Advanced: Mastery & Optimization": [
      { title: "React Design Patterns", url: "https://www.youtube.com/results?search_query=advanced+react+design+patterns" },
      { title: "Node.js Performance Tuning", url: "https://www.youtube.com/results?search_query=node+js+performance+optimization" },
      { title: "Full Stack System Design", url: "https://www.youtube.com/results?search_query=system+design+fundamentals+for+developers" }
    ]
  };

  const level = getLevel();
  const list = recommendations[level] || [];

  return (
    <div className="quiz-container">
      <h2>🧠 Adaptive Learning Path</h2>
      <div className="score-box" style={{ borderLeft: "5px solid var(--accent)" }}>
        <p style={{ margin: 0, color: "var(--text-dim)", fontSize: "0.9rem" }}>Based on your score:</p>
        <h3 style={{ margin: "5px 0", color: "var(--accent)" }}>{level}</h3>
      </div>

      <p style={{ margin: "20px 0 10px 0" }}>Click a resource to browse tutorials:</p>
      
      <div className="learning-grid">
        {list.map((item, i) => (
          <a 
            key={i} 
            href={item.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="resource-card"
          >
            <div className="resource-content">
              <span className="play-icon">▶</span>
              <span>{item.title}</span>
            </div>
            <span className="platform-tag">Watch on YouTube</span>
          </a>
        ))}
      </div>
    </div>
  );
}