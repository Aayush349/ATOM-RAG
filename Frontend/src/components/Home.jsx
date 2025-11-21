import React, { useState, useRef, useEffect } from "react";
import { IoSendSharp } from "react-icons/io5";
import { MdOutlineMicNone } from "react-icons/md";
import { BsRobot } from "react-icons/bs";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import robotImg from "../assets/hello-mascot.png"; // Adjust path as needed

export default function HomePage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const chatContainerRef = useRef(null);

  const speakText = (text) => {
  const synth = window.speechSynthesis;

  if (!synth) return;

  // If already speaking, pressing again stops it
  if (synth.speaking) {
    synth.cancel();
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.pitch = 1;
  utterance.rate = 1;

  synth.speak(utterance);
};

  // Greet user when file is uploaded and chat window opens
  useEffect(() => {
    if (file && messages.length === 1) {
      setMessages([
        messages[0],
        {
          sender: "bot",
          text: "👋 Hello! I am **Rag Agent ATOM**.\n\nHow can I help you today?"
        }
      ]);
    }
    // eslint-disable-next-line
  }, [file]);

  useEffect(() => {
    if (file) {
      chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, file]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input })
      });

      if (!response.ok) throw new Error("Server returned an error.");

      const data = await response.json();
      const botReply = data.response;
      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
      //speakText(botReply);

    } catch (err) {
      setMessages((prev) => [...prev, { sender: "bot", text: "❌ Failed to fetch response." }]);
      setError(err.message);
    }
    setInput("");
  };

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;
    setFile(uploadedFile);
    setError("");
    const formData = new FormData();
    formData.append("file", uploadedFile);

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData
      });

      if (!response.ok) throw new Error("File upload failed.");

      const data = await response.json();
      setMessages([
        { sender: "bot", text: `📄 File uploaded: ${uploadedFile.name}` },
        { sender: "bot", text: "👋 Hello! I am **Rag Agent ATOM**.\n\nHow can I help you today?" }
      ]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: "bot", text: "❌ Failed to upload file." }]);
      setError(err.message);
    }
  };

  const handleVoiceRecord = async () => {
  if (!navigator.mediaDevices) {
    setError("🎙️ Microphone not supported in this browser.");
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks = [];

    mediaRecorder.ondataavailable = event => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
      const formData = new FormData();
      formData.append("audio", audioBlob, "voice.wav");

      try {
        const response = await fetch("http://localhost:5000/voice", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        const transcription = data.transcription || "";

        if (transcription) {
          setInput(""); // optional
          setMessages(prev => [...prev, { sender: "user", text: transcription }]);

          const chatResponse = await fetch("http://localhost:5000/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: transcription }),
          });

          const chatData = await chatResponse.json();
          const botReply = chatData.response;
          setMessages(prev => [...prev, { sender: "bot", text: botReply }]);
          //speakText(botReply);

        } else {
          setMessages(prev => [...prev, { sender: "bot", text: "❌ Could not understand your voice." }]);
        }
      } catch (err) {
        setMessages(prev => [...prev, { sender: "bot", text: "❌ Voice processing failed." }]);
        setError(err.message);
      }
    };

    mediaRecorder.start();
    setMessages(prev => [...prev, { sender: "bot", text: "🎙️ Listening... please speak now." }]);

    setTimeout(() => {
      mediaRecorder.stop();
    }, 4000); // Record for 4 seconds
  } catch (err) {
    console.error(err);
    setError("Could not access microphone.");
  }
};


  // Animation variants
  const messageVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const inputVariants = {
    initial: { y: 40, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { delay: 0.2, type: "spring", stiffness: 200 } }
  };

  return (
    <div className="flex flex-col items-center h-screen bg-gradient-to-tr from-[#141E30] via-[#243B55] to-[#141E30] text-white p-4 relative overflow-hidden">
      {/* Animated background blobs */}
      <motion.div
        className="absolute top-[-100px] left-[-100px] w-[350px] h-[350px] bg-pink-500 opacity-30 rounded-full blur-3xl z-0"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 360, 0] }}
        transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-purple-600 opacity-25 rounded-full blur-3xl z-0"
        animate={{ scale: [1, 1.1, 1], rotate: [0, -360, 0] }}
        transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
      />

      {/* Always show heading at the top */}
      <motion.h1
        initial={{ opacity: 0, y: -30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, type: "spring" }}
        className={`font-extrabold tracking-wide drop-shadow-lg bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent select-none text-center w-full
          ${file ? "text-2xl md:text-3xl mt-4 mb-2" : "text-4xl md:text-5xl mt-12 mb-8"}
        `}
      >
        <span className="inline-block animate-pulse">ATOM</span>
      </motion.h1>

      {/* Main content below heading */}
      <div
        className={`flex flex-col items-center w-full z-10 transition-all duration-700 ${
          file ? "pt-2" : "justify-center flex-1"
        }`}
      >
        {/* Animated Rag Agent ATOM below heading when file is uploaded */}
        {file && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 180 }}
            className="mb-2"
          >
            <span className="inline-block text-xl md:text-2xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent drop-shadow-lg animate-pulse tracking-wider px-4 py-2 rounded-xl shadow-lg border-2 border-pink-400 border-dashed">
              Rag Agent <span className="text-pink-500 animate-bounce">ATOM</span>
            </span>
          </motion.div>
        )}
        {/* Show file name under heading when file is uploaded */}
        {file && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg md:text-xl font-semibold text-purple-200 bg-[#232526]/70 px-4 py-2 rounded-xl shadow mb-4"
          >
            {file.name}
          </motion.div>
        )}
        {/* Show upload button and agent name only if file is not uploaded */}
        {!file && (
          <motion.div
            variants={inputVariants}
            initial="initial"
            animate="animate"
            className="flex flex-col items-center w-full max-w-4xl z-10 justify-center"
          >
            <div className="flex flex-col md:flex-row items-center justify-center w-full">
              {/* Animated Robot Image */}
              <motion.img
                src={robotImg}
                alt="Welcome Robot"
                className="w-60 h-55 md:mr-6 mb-4 md:mb-0"
                animate={{ y: [0, -20, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                style={{ maxWidth: 180 }}
              />
              <div className="flex flex-col items-center">
                {/* Welcome message */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, type: "spring", stiffness: 180 }}
                  className="mb-4 text-lg md:text-xl font-semibold text-purple-200 text-center"
                >
                  <motion.span
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, type: "spring", stiffness: 120 }}
                    className="inline-block"
                  >
                    Welcome! Upload a document to start chatting with{" "}
                    <span className="text-pink-400 font-bold animate-pulse">Rag Agent ATOM</span>.
                  </motion.span>
                </motion.div>
                {/* Animated and styled RAG Agent ATOM text */}
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 180 }}
                  className="mb-6"
                >
                  <span className="inline-block text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent drop-shadow-lg animate-pulse tracking-wider px-4 py-2 rounded-xl shadow-lg border-2 border-pink-400 border-dashed">
                    Rag Agent <span className="text-pink-500 animate-bounce">ATOM</span>
                  </span>
                </motion.div>
                <input
                  type="file"
                  accept=".pdf,.txt,.docx"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-lg"
                >
                  Upload Document
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-red-300 font-semibold bg-red-800 bg-opacity-40 p-2 rounded-xl mb-2 max-w-4xl w-full shadow z-10"
          >
            ⚠️ {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat box only when file is uploaded */}
      {file && (
        <>
          <div
            ref={chatContainerRef}
            className="w-full max-w-5xl p-4 rounded-2xl mb-4 h-[70vh] overflow-y-auto z-10 mt-0
              bg-gradient-to-br from-[#232526] via-[#181924] to-[#414345]
              border-2 border-purple-700/60 shadow-2xl
              backdrop-blur-md
              transition-all duration-300
              scrollbar-thin scrollbar-thumb-pink-600 scrollbar-track-purple-900"
            style={{
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
              background: "linear-gradient(135deg, #232526 60%, #181924 100%, #414345 100%)",
              border: "2px solid rgba(168,139,250,0.25)"
            }}
          >
            <AnimatePresence initial={false}>
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
      exit={{ opacity: 0, transition: { duration: 0 } }} // <-- instant hide
                  layout
                  className={`my-2 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    className={`px-4 py-2 max-w-[75%] rounded-2xl text-sm font-medium whitespace-pre-wrap shadow-md border transition-all duration-200 break-words
  ${msg.sender === "user"
    ? "bg-gradient-to-br from-pink-600 to-purple-700 text-white border-pink-500"
    : "bg-[#232526]/80 text-purple-100 border-purple-400"
  }`}
                  >
                    {msg.sender === "bot" && (
                      <div className="flex items-center mb-1 text-purple-400 font-semibold">
                        <BsRobot className="mr-1 animate-bounce" /> ATOM
                      </div>
                    )}
                    <ReactMarkdown>{msg.text}</ReactMarkdown>

                    {/* 🔊 Speak Button */}
                    {msg.sender === "bot" && (
                      <button
                        onClick={() => speakText(msg.text)}
                        className="mt-1 text-xs text-blue-400 hover:underline focus:outline-none"
                      >
                        🔊 Speak
                      </button>
                    )}
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <motion.div
            variants={inputVariants}
            initial="initial"
            animate="animate"
            className="flex items-center space-x-3 w-full max-w-4xl z-10"
          >
            <motion.input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="flex-1 p-2 rounded-xl border border-slate-600 text-white bg-gray-900 shadow focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
              placeholder="Ask ATOM something..."
              whileFocus={{ scale: 1.03, borderColor: "#a78bfa" }}
            />
            <motion.button
              onClick={handleSend}
              whileTap={{ scale: 0.9 }}
              className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full shadow transition-all duration-20 focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <IoSendSharp size={20} />
            </motion.button>
            <motion.button
              onClick={handleVoiceRecord}
              whileTap={{ scale: 0.9, rotate: 10 }}
              className="bg-pink-600 hover:bg-pink-700 text-white p-2 rounded-full shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <MdOutlineMicNone size={20} />
            </motion.button>
          </motion.div>
        </>
      )}


<div className="flex flex-col md:flex-row justify-between items-center m-3">
          <p className="mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} <span className="text-pink-400 font-semibold">Rag Agent</span>. All rights reserved.
          </p>
          </div>

    </div>
  );
}