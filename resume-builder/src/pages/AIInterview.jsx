import { useState, useEffect, useRef } from "react";
import "../styles/AIInterview.css";

export default function AIInterview() {

  const [file, setFile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [started, setStarted] = useState(false);
  const [time, setTime] = useState(60);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  // 🎤 VOICE STATES
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  // 🎤 INIT SPEECH RECOGNITION
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let transcript = "";

      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript + " ";
      }

      setAnswer(transcript);
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const startRecording = () => {
  if (!recognitionRef.current) return;

  setListening(true);
  setIsRunning(true); // ✅ START TIMER
  recognitionRef.current.start();
};

const stopRecording = () => {
  if (!recognitionRef.current) return;

  recognitionRef.current.stop();
  setListening(false);
  setIsRunning(false); // ❌ STOP TIMER (NO RESUME)
};

  // ⏱ TIMER
  useEffect(() => {
  if (!isRunning) return; // ✅ ONLY RUN WHEN START CLICKED

  const timer = setInterval(() => {
    setTime(prev => {
      if (prev <= 1) {
        stopRecording(); // auto stop
        return 0; // don't reset automatically ❗
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(timer);
}, [isRunning]);

  // ✅ NEXT QUESTION
  const handleNext = () => {
  stopRecording(); // ensure stopped

  if (answer.trim() !== "") {
    setScore(prev => prev + 1);
  }

  setAnswer("");

  if (current + 1 < questions.length) {
    setCurrent(prev => prev + 1);
    setTime(60);       // ✅ reset here only
    setIsRunning(false); // ensure stopped
  } else {
    setCurrent(questions.length);
  }
};

  // 📄 UPLOAD + AI
  const handleUpload = async () => {

  if (!file) {
    alert("Upload resume");
    return;
  }

  setLoading(true);

  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://127.0.0.1:8000/api/upload-resume/", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    const skills = data?.data?.skills || [];

    const aiRes = await fetch("http://127.0.0.1:8000/api/generate-questions/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ skills }),
    });

    const aiData = await aiRes.json();

    const allQuestions = aiData?.questions || [
      "Tell me about yourself",
      "Explain your project",
      "What are your strengths?",
      "Why should we hire you?",
      "What challenges did you face?",
      "Describe a problem you solved"
    ];

    // 🔥 SHUFFLE
    const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

    const randomQuestions = shuffle(allQuestions).slice(0, 5);

    setQuestions(randomQuestions);

    // ✅ IMPORTANT (YOU MISSED THIS)
    setStarted(true);

  } catch (err) {
    console.error(err);
    alert("Error generating questions");

    // fallback
    setQuestions([
      "Tell me about yourself",
      "Explain your project",
      "What are your strengths?",
      "Why should we hire you?",
      "Describe a challenge you solved"
    ]);

    setStarted(true);
  }

  setLoading(false);
};

  // 🎉 RESULT
  if (started && current >= questions.length) {
    return (
      <div className="ai-page">
        <div className="upload-card">
          <h2>Interview Completed 🎉</h2>
          <h3>Score: {score} / {questions.length}</h3>

          <button onClick={() => window.location.reload()}>
            Restart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-page">

      {!started ? (
        <div className="upload-card">
          <h2>AI Interview Bot 🤖</h2>

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button onClick={handleUpload} disabled={loading}>
            {loading ? "Generating..." : "Start Interview"}
          </button>
        </div>
      ) : (
        <div className="interview-card">

  <div className="top-bar">
    <h3>QUESTION {current + 1} / {questions.length}</h3>

    <div className="timer-circle">
      {time}
    </div>
  </div>

  <h2 className="question-title">INTERVIEW QUESTION</h2>
  <p className="question">{questions[current]}</p>

  <textarea
    placeholder="Click the microphone to start speaking, or type here..."
    value={answer}
    onChange={(e) => setAnswer(e.target.value)}
  />

  <div className="controls">
    {!listening ? (
      <button className="start-btn" onClick={startRecording}>
        🎤 Start
      </button>
    ) : (
      <button className="stop-btn" onClick={stopRecording}>
        ⏹ Stop
      </button>
    )}

    <button className="next-btn" onClick={handleNext}>
      Next Question →
    </button>
  </div>

</div>
      )}

    </div>
  );
}