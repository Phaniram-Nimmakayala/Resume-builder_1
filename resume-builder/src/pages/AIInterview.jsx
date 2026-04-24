import { useState, useEffect, useRef, useCallback } from "react";
import "../styles/AIInterview.css";

export default function AIInterview() {
  const [file, setFile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [started, setStarted] = useState(false);
  const [time, setTime] = useState(90);
  const [answer, setAnswer] = useState("");
  const [finalAnswer, setFinalAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  // 🎤 VOICE STATES
  const [listening, setListening] = useState(false);
  const [micPermission, setMicPermission] = useState("pending");
  const [audioLevel, setAudioLevel] = useState(0);
  const [selectedDevice, setSelectedDevice] = useState("default");
  const [availableDevices, setAvailableDevices] = useState([]);
  const [recognitionStatus, setRecognitionStatus] = useState("idle");
  const [noiseLevel, setNoiseLevel] = useState(0);
  const [isWearable, setIsWearable] = useState(false);

  // REFS
  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const sourceRef = useRef(null);
  const animationFrameRef = useRef(null);
  const noiseGateRef = useRef({ threshold: 0.02, enabled: true });
  const restartTimeoutRef = useRef(null);
  const transcriptBufferRef = useRef([]);
  const lastProcessedIndexRef = useRef(0);

  // 🎧 CHECK FOR WEARABLE/EARPHONE DEVICES
  const checkForWearableDevices = useCallback(async () => {
    try {
      // First, get permission to see device labels
      const tempStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      tempStream.getTracks().forEach(track => track.stop());

      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = devices.filter(d => d.kind === "audioinput");
      
      setAvailableDevices(audioInputs);

      // Detect earphones/headsets by common keywords in device labels
      const wearableKeywords = [
        "headset", "headphone", "earphone", "earbuds", "earpod",
        "airpod", "bluetooth", "wireless", "jabra", "sony", "bose",
        "sennheiser", "logitech", "jbl", "galaxy buds", "pixel buds",
        "usb", "external"
      ];

      const wearableDevice = audioInputs.find(device => {
        const label = device.label.toLowerCase();
        return wearableKeywords.some(keyword => label.includes(keyword));
      });

      if (wearableDevice) {
        setSelectedDevice(wearableDevice.deviceId);
        setIsWearable(true);
        console.log("🎧 Earphone/Headset detected:", wearableDevice.label);
        return wearableDevice.deviceId;
      }

      // If no wearable, prefer USB/external devices over built-in
      const externalDevice = audioInputs.find(device => {
        const label = device.label.toLowerCase();
        return label.includes("external") || label.includes("usb");
      });

      if (externalDevice) {
        setSelectedDevice(externalDevice.deviceId);
        return externalDevice.deviceId;
      }

      // Default to first non-default device (often better quality)
      if (audioInputs.length > 1) {
        const nonDefault = audioInputs.find(d => d.deviceId !== "default");
        if (nonDefault) {
          setSelectedDevice(nonDefault.deviceId);
          return nonDefault.deviceId;
        }
      }

      setSelectedDevice("default");
      return "default";
    } catch (err) {
      console.error("Device enumeration error:", err);
      return "default";
    }
  }, []);

  // 📊 AUDIO LEVEL MONITORING WITH NOISE ANALYSIS
  const setupAudioMonitoring = useCallback(async (stream) => {
    try {
      // Create audio context with specific settings for voice
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: 44100,
        channelCount: 1,
      });

      // Create analyser for audio level
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;
      analyserRef.current.smoothingTimeConstant = 0.8;

      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      sourceRef.current.connect(analyserRef.current);

      // Calculate ambient noise level for first 1 second
      const calculateNoiseFloor = () => {
        return new Promise((resolve) => {
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
          let samples = [];
          let sampleCount = 0;
          const maxSamples = 44; // ~1 second at 44100/1024

          const collectSample = () => {
            if (sampleCount >= maxSamples) {
              // Calculate average and set threshold above it
              const avgNoise = samples.reduce((a, b) => a + b, 0) / samples.length;
              // Set noise gate threshold 3x above noise floor
              noiseGateRef.current.threshold = Math.min(0.15, Math.max(0.02, avgNoise * 3));
              setNoiseLevel(avgNoise);
              console.log("Noise floor calculated:", avgNoise, "Threshold:", noiseGateRef.current.threshold);
              resolve(noiseGateRef.current.threshold);
              return;
            }

            analyserRef.current.getByteTimeDomainData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              const amplitude = (dataArray[i] - 128) / 128;
              sum += amplitude * amplitude;
            }
            const rms = Math.sqrt(sum / dataArray.length);
            samples.push(rms);
            sampleCount++;

            requestAnimationFrame(collectSample);
          };

          collectSample();
        });
      };

      // Start monitoring
      const monitorAudio = () => {
        if (!analyserRef.current) return;

        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteTimeDomainData(dataArray);

        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          const amplitude = (dataArray[i] - 128) / 128;
          sum += amplitude * amplitude;
        }
        const rms = Math.sqrt(sum / dataArray.length);
        const level = Math.min(100, rms * 500); // Scale to 0-100
        
        setAudioLevel(level);
        animationFrameRef.current = requestAnimationFrame(monitorAudio);
      };

      monitorAudio();

      // Calculate noise floor
      await calculateNoiseFloor();

    } catch (err) {
      console.error("Audio monitoring setup error:", err);
    }
  }, []);

  // 🎤 INIT SPEECH RECOGNITION
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMicPermission("unsupported");
      return;
    }

    // Check for earphone devices on mount
    checkForWearableDevices();

    return () => {
      // Cleanup
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch(e) {}
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
    };
  }, [checkForWearableDevices]);

  // 🎤 CREATE RECOGNITION INSTANCE
  const createRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) return null;

    const recognition = new SpeechRecognition();
    
    // OPTIMIZED SETTINGS FOR NOISY ENVIRONMENTS
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 3; // Get multiple interpretations
    
    // Try to set service URI if available (some browsers support this)
    if (recognition.setServiceURI) {
      recognition.setServiceURI("");
    }

    let isFinalTranscriptProcessed = false;

    recognition.onstart = () => {
      setRecognitionStatus("listening");
      console.log("🎤 Recognition started");
    };

    recognition.onresult = (event) => {
      let interimTranscript = "";
      let finalTranscript = "";
      
      transcriptBufferRef.current = [];

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        
        if (result.isFinal) {
          // Take the first (most confident) alternative for final results
          finalTranscript += result[0].transcript + " ";
          transcriptBufferRef.current.push({
            text: result[0].transcript,
            isFinal: true,
            confidence: result[0].confidence
          });
        } else {
          // For interim, take the first alternative
          interimTranscript += result[0].transcript;
        }
      }

      // Combine: all previous finals + current interim
      const allFinals = transcriptBufferRef.current
        .filter(t => t.isFinal)
        .map(t => t.text)
        .join(" ");

      const combinedText = (allFinals + " " + interimTranscript).trim();
      
      if (combinedText) {
        setAnswer(combinedText);
      }
    };

    recognition.onerror = (event) => {
      console.error("Recognition error:", event.error);
      
      switch (event.error) {
        case "no-speech":
          // This is common in noisy environments - don't stop, just continue
          setRecognitionStatus("no-speech");
          break;
        case "audio-capture":
          setRecognitionStatus("audio-error");
          setListening(false);
          setIsRunning(false);
          break;
        case "not-allowed":
          setMicPermission("denied");
          setListening(false);
          setIsRunning(false);
          break;
        case "network":
          setRecognitionStatus("network-error");
          // Auto-retry after delay
          restartTimeoutRef.current = setTimeout(() => {
            if (listening) {
              try {
                recognition.start();
              } catch(e) {}
            }
          }, 1000);
          break;
        case "aborted":
          // User intentionally stopped, don't restart
          break;
        default:
          setRecognitionStatus("error");
          // For other errors, try to restart if still supposed to be listening
          if (listening && event.error !== "aborted") {
            restartTimeoutRef.current = setTimeout(() => {
              try {
                recognition.start();
              } catch(e) {}
            }, 500);
          }
      }
    };

    recognition.onend = () => {
      setRecognitionStatus("ended");
      
      // Auto-restart if we're still supposed to be listening
      // This handles Chrome's automatic stopping behavior
      if (listening) {
        const delay = 100; // Small delay before restart
        restartTimeoutRef.current = setTimeout(() => {
          try {
            recognition.start();
          } catch(e) {
            console.log("Restart failed:", e);
          }
        }, delay);
      }
    };

    return recognition;
  }, [listening]);

  // 🎤 START RECORDING
  const startRecording = async () => {
    try {
      // First, get the audio stream with specific constraints
      const audioConstraints = {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        // Use specific device if selected
        ...(selectedDevice !== "default" && { deviceId: { exact: selectedDevice } })
      };

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: audioConstraints 
      });

      mediaStreamRef.current = stream;
      setMicPermission("granted");

      // Setup audio monitoring for noise analysis
      await setupAudioMonitoring(stream);

      // Create and start recognition
      const recognition = createRecognition();
      if (!recognition) {
        alert("Speech recognition not supported in this browser. Please use Chrome.");
        return;
      }

      recognitionRef.current = recognition;
      
      // Clear previous transcript
      transcriptBufferRef.current = [];
      lastProcessedIndexRef.current = 0;

      recognition.start();
      setListening(true);
      setIsRunning(true);
      setAnswer("");
      setFinalAnswer("");

      console.log("🎤 Recording started with device:", selectedDevice);

    } catch (err) {
      console.error("Failed to start recording:", err);
      
      if (err.name === "NotAllowedError") {
        setMicPermission("denied");
        alert("Microphone permission denied. Please allow microphone access and try again.");
      } else if (err.name === "NotFoundError") {
        alert("No microphone found. Please connect a microphone and try again.");
      } else {
        alert("Failed to access microphone: " + err.message);
      }
    }
  };

  // ⏹ STOP RECORDING
  const stopRecording = () => {
    // Clear any pending restart
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }

    // Stop recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort(); // Use abort instead of stop to prevent onend restart
      } catch(e) {}
    }

    // Stop media stream
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }

    // Stop audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    // Stop animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Save final answer
    setFinalAnswer(answer);
    
    setListening(false);
    setIsRunning(false);
    setAudioLevel(0);
    setRecognitionStatus("idle");

    console.log("⏹ Recording stopped. Final answer:", answer);
  };

  // ⏱ TIMER
  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTime(prev => {
        if (prev <= 1) {
          stopRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning]);

  // ✅ NEXT QUESTION WITH AI EVALUATION
  const handleNext = async () => {
    // Ensure recording is stopped
    if (listening) {
      stopRecording();
    }

    const currentAnswer = answer || finalAnswer;

    // Evaluate with AI if there's an answer
    if (currentAnswer.trim() !== "") {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/evaluate-answer/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: questions[current],
            answer: currentAnswer
          }),
        });

        if (response.ok) {
          const result = await response.json();
          setTotalScore(prev => prev + (result.score || 0));
          console.log("Evaluation:", result);
        } else {
          // Fallback: just count as answered
          setTotalScore(prev => prev + 1);
        }
      } catch (err) {
        console.error("Evaluation error:", err);
        // Fallback: just count as answered
        setTotalScore(prev => prev + 1);
      }
    }

    // Reset for next question
    setAnswer("");
    setFinalAnswer("");
    setTime(90);

    if (current + 1 < questions.length) {
      setCurrent(prev => prev + 1);
      setIsRunning(false);
    } else {
      setCurrent(questions.length);
    }
  };

  // 📄 UPLOAD + AI
  const handleUpload = async () => {
    if (!file) {
      alert("Please upload your resume");
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
      const certifications = data?.data?.certifications || [];

      const aiRes = await fetch("http://127.0.0.1:8000/api/generate-questions/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ skills, certifications }),
      });

      const aiData = await aiRes.json();

      const allQuestions = aiData?.questions || [
        "Tell me about yourself",
        "Explain your most challenging project",
        "What are your key technical strengths?",
        "Why should we hire you?",
        "Describe a problem you solved innovatively",
        "Where do you see yourself in 5 years?"
      ];

      // Shuffle and pick 5
      const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
      const randomQuestions = shuffled.slice(0, 5);

      setQuestions(randomQuestions);
      setStarted(true);

    } catch (err) {
      console.error(err);
      alert("Error generating questions. Using fallback questions.");

      setQuestions([
        "Tell me about yourself",
        "Explain your most challenging project",
        "What are your key technical strengths?",
        "Why should we hire you?",
        "Describe a problem you solved innovatively"
      ]);

      setStarted(true);
    }

    setLoading(false);
  };

  // 🔄 RESTART RECOGNITION (if it stops unexpectedly)
  const restartRecognition = () => {
    if (recognitionRef.current && listening) {
      try {
        recognitionRef.current.abort();
        setTimeout(() => {
          const newRecognition = createRecognition();
          if (newRecognition) {
            recognitionRef.current = newRecognition;
            newRecognition.start();
          }
        }, 100);
      } catch(e) {}
    }
  };

  // 📱 DEVICE CHANGE HANDLER
  const handleDeviceChange = async (deviceId) => {
    setSelectedDevice(deviceId);
    
    // Check if it's a wearable
    const device = availableDevices.find(d => d.deviceId === deviceId);
    const wearableKeywords = ["headset", "headphone", "earphone", "earbuds", "bluetooth", "wireless"];
    if (device) {
      const isWear = wearableKeywords.some(k => device.label.toLowerCase().includes(k));
      setIsWearable(isWear);
    }

    // If currently recording, restart with new device
    if (listening) {
      stopRecording();
      setTimeout(() => startRecording(), 200);
    }
  };

  // 🎉 RESULT SCREEN
  if (started && current >= questions.length) {
    const maxPossibleScore = questions.length * 10;
    const percentage = Math.round((totalScore / maxPossibleScore) * 100);
    
    return (
      <div className="ai-page">
        <div className="upload-card result-card">
          <h2>Interview Completed 🎉</h2>
          
          <div className="score-display">
            <div className="score-circle">
              <span className="score-number">{totalScore}</span>
              <span className="score-max">/ {maxPossibleScore}</span>
            </div>
            <div className="percentage">{percentage}%</div>
          </div>

          <div className="score-breakdown">
            <p>Questions Answered: {questions.length}</p>
            <p>Average Score per Question: {(totalScore / questions.length).toFixed(1)}</p>
          </div>

          <button className="restart-btn" onClick={() => window.location.reload()}>
            🔄 Restart Interview
          </button>
        </div>
      </div>
    );
  }

  // GET AUDIO LEVEL COLOR
  const getAudioColor = () => {
    if (!listening) return "#666";
    if (audioLevel < 10) return "#4CAF50";
    if (audioLevel < 30) return "#8BC34A";
    if (audioLevel < 50) return "#FFC107";
    if (audioLevel < 70) return "#FF9800";
    return "#F44336";
  };

  // GET TIMER COLOR
  const getTimerColor = () => {
    if (time > 30) return "#4CAF50";
    if (time > 15) return "#FFC107";
    return "#F44336";
  };

  return (
    <div className="ai-page">

      {!started ? (
        <div className="upload-card">
          <h2>AI Interview Bot 🤖</h2>
          <p className="subtitle">Upload your resume to start AI-powered interview</p>

          {/* MIC PERMISSION STATUS */}
          {micPermission === "denied" && (
            <div className="error-message">
              ⚠️ Microphone permission denied. Please allow access in browser settings.
            </div>
          )}
          {micPermission === "unsupported" && (
            <div className="error-message">
              ⚠️ Speech recognition not supported. Please use Google Chrome.
            </div>
          )}

          {/* DEVICE SELECTOR */}
          {availableDevices.length > 1 && (
            <div className="device-selector">
              <label>🎙️ Microphone:</label>
              <select 
                value={selectedDevice} 
                onChange={(e) => handleDeviceChange(e.target.value)}
              >
                {availableDevices.map((device, index) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || `Microphone ${index + 1}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setFile(e.target.files[0])}
            className="file-input"
          />

          <button 
            onClick={handleUpload} 
            disabled={loading || micPermission === "denied" || micPermission === "unsupported"}
            className="start-interview-btn"
          >
            {loading ? (
              <span className="loading-spinner">Generating Questions...</span>
            ) : (
              "🚀 Start Interview"
            )}
          </button>

          <div className="tips">
            <h4>Tips for best experience:</h4>
            <ul>
              <li>🎧 Use earphones with microphone for better noise isolation</li>
              <li>🔇 Find a quiet environment if possible</li>
              <li>🗣️ Speak clearly at normal volume</li>
              <li>🌐 Use Google Chrome for best speech recognition</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="interview-card">

          {/* TOP BAR */}
          <div className="top-bar">
            <div className="question-counter">
              <span className="current-q">{current + 1}</span>
              <span className="separator">/</span>
              <span className="total-q">{questions.length}</span>
            </div>

            <div className="timer-container">
              <svg className="timer-svg" viewBox="0 0 36 36">
                <path
                  className="timer-bg"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="timer-progress"
                  strokeDasharray={`${(time / 90) * 100}, 100`}
                  stroke={getTimerColor()}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="timer-text" style={{ color: getTimerColor() }}>{time}</span>
            </div>
          </div>

          {/* DEVICE INDICATOR */}
          <div className="device-indicator">
            {isWearable ? "🎧 Using Headset" : "🎙️ Using Microphone"}
            {noiseLevel > 0 && (
              <span className="noise-indicator">
                (Noise level: {(noiseLevel * 100).toFixed(0)}%)
              </span>
            )}
          </div>

          {/* QUESTION */}
          <h2 className="question-title">INTERVIEW QUESTION</h2>
          <p className="question">{questions[current]}</p>

          {/* AUDIO LEVEL VISUALIZER */}
          {listening && (
            <div className="audio-visualizer">
              <div className="audio-bars">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="audio-bar"
                    style={{
                      height: `${Math.max(4, (audioLevel / 100) * 60 * Math.sin((i + 1) * 0.5))}px`,
                      backgroundColor: getAudioColor(),
                      opacity: audioLevel > 5 ? 1 : 0.3
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* STATUS MESSAGES */}
          {recognitionStatus === "no-speech" && (
            <div className="status-message warning">
              🤫 No speech detected. Try speaking louder or move closer to the mic.
            </div>
          )}
          {recognitionStatus === "network-error" && (
            <div className="status-message error">
              🌐 Network issue. Reconnecting...
            </div>
          )}

          {/* TEXTAREA */}
          <div className="answer-container">
            <textarea
              placeholder="Click 🎤 Start to begin speaking, or type your answer here..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="answer-textarea"
              rows={6}
            />
            <div className="char-count">{answer.length} characters</div>
          </div>

          {/* CONTROLS */}
          <div className="controls">
            <div className="mic-controls">
              {!listening ? (
                <button 
                  className="start-btn" 
                  onClick={startRecording}
                  disabled={time === 0}
                >
                  <span className="btn-icon">🎤</span>
                  <span className="btn-text">Start Speaking</span>
                </button>
              ) : (
                <button className="stop-btn" onClick={stopRecording}>
                  <span className="btn-icon">⏹</span>
                  <span className="btn-text">Stop</span>
                </button>
              )}
              
              {listening && (
                <button 
                  className="restart-recognition-btn" 
                  onClick={restartRecognition}
                  title="Restart recognition if stuck"
                >
                  🔄
                </button>
              )}
            </div>

            <button 
              className="next-btn" 
              onClick={handleNext}
              disabled={loading}
            >
              {current + 1 < questions.length ? "Next Question →" : "Finish Interview ✓"}
            </button>
          </div>

          {/* TIPS DURING INTERVIEW */}
          <div className="interview-tips">
            {listening && audioLevel < 5 && (
              <p className="tip">💡 Speak now - your voice is not being detected</p>
            )}
            {listening && audioLevel > 80 && (
              <p className="tip">📉 You might be too loud - try moving away from the mic</p>
            )}
            {time <= 15 && time > 0 && (
              <p className="tip warning">⏰ Time is running out! Wrap up your answer.</p>
            )}
          </div>

        </div>
      )}

    </div>
  );
}