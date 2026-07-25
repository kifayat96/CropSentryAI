import { useState, useEffect } from "react";
import "./App.css";
import { analyzeCrop } from "./assets/geminiAI.js";
import { jsPDF } from "jspdf";

function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      resolve(reader.result.split(",")[1]);
    };

    reader.onerror = (error) => reject(error);
  });
}
function App() {
  const [crop, setCrop] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [history, setHistory] = useState([]);
  useEffect(() => {
  const savedHistory = localStorage.getItem("history");

  if (savedHistory) {
    setHistory(JSON.parse(savedHistory));
  }
}, []);
useEffect(() => {
  localStorage.setItem("history", JSON.stringify(history));
}, [history]);
  const [darkMode, setDarkMode] = useState(false);
  const downloadPDF = () => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("CropSentry AI Report", 20, 20);

  doc.setFontSize(12);
  doc.text(result || "No Result Available", 20, 35);

  doc.save("CropSentryAI_Report.pdf");
};
  const clearHistory = () => {
  setHistory([]);
  localStorage.removeItem("history");
};


  return (
    <>
      <nav className="navbar">
  <h2>🌱 CropSentry AI</h2>

  <ul>
    <li onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
      Home
    </li>

    <li
      onClick={() =>
        document.getElementById("about").scrollIntoView({
          behavior: "smooth",
        })
      }
    >
      About
    </li>

    <li
      onClick={() =>
        document.getElementById("detect").scrollIntoView({
          behavior: "smooth",
        })
      }
    >
      Detect Disease
    </li>

    <li
      onClick={() =>
        document.getElementById("contact").scrollIntoView({
          behavior: "smooth",
        })
      }
    >
      Contact
    </li>
  </ul>
  <a
  href="https://github.com/kifayat96/CropSentryAI"
  target="_blank"
  rel="noreferrer"
>
  <button>💻 GitHub</button>
</a>

<a
  href="#"
  target="_blank"
  rel="noreferrer"
>
  <button>🌐 Live Demo</button>
</a>
  <button
  onClick={() => setDarkMode(!darkMode)}
  style={{ marginLeft: "20px" }}
>
  {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
</button>
</nav>
      <div className={darkMode ? "app dark" : "app"}>
        <h1>🌱 CropSentry AI</h1>

        <h2>Smart AI Crop Disease Detection System</h2>

        <p>
          Upload a crop image, enter symptoms, and receive instant AI-powered
          disease diagnosis, treatment recommendations, and prevention tips.
        </p>

       <button
  onClick={() =>
    document.getElementById("detect").scrollIntoView({
      behavior: "smooth",
    })
  }
>
  Get Started
</button>


       <div className="form" id="detect">
          <h3>Select Crop</h3>

          <select
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
          >
            <option value="">Select a Crop</option>
            <option value="Wheat">Wheat</option>
            <option value="Rice">Rice</option>
            <option value="Maize">Maize</option>
            <option value="Tomato">Tomato</option>
            <option value="Potato">Potato</option>
          </select>

          <h3>Enter Symptoms</h3>

          <textarea
            placeholder="Example: Yellow leaves, brown spots, wilting..."
            rows="5"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
          ></textarea>

          <h3>Upload Crop Image</h3>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              setImage(file);

              if (file) {
                setPreview(URL.createObjectURL(file));
              }
            }}
          />

          {preview && (
            <img
              src={preview}
              alt="Crop Preview"
              className="preview-image"
            />
          )}

          <br />
          <br />

          <button
            onClick={async () => {
              if (!crop || !symptoms) {
                alert("Please select a crop and enter symptoms.");
                return;
              }

              setLoading(true);

              try {
               let imageBase64 = null;
let mimeType = null;

if (image) {
  imageBase64 = await convertToBase64(image);
  mimeType = image.type;
}

const answer = await analyzeCrop(
  crop,
  symptoms,
  imageBase64,
  mimeType
);
                setResult(answer);
                setHistory((prev) => [
  {
    crop: crop,
    symptoms: symptoms,
    result: answer,
    date: new Date().toLocaleString(),
  },
  ...prev,
]);
              } catch (error) {
                setResult("❌ Error: Unable to analyze crop. Please try again.");
                console.error(error);
              }

              setLoading(false);
            }}
          >
           {loading ? "🔄 Analyzing Crop..." : "🌱 Analyze with AI"}

{loading && (
  <p style={{ color: "green", marginTop: "15px" }}>
    ⏳ Please wait... AI is analyzing your crop.
  </p>
)}
           {loading && <div className="spinner"></div>}
          </button>

          <br />
          <br />

                    <button
            onClick={() => {
              setCrop("");
              setSymptoms("");
              setImage(null);
              setPreview("");
              setResult("");
              
  
            }}
          >
            Clear Form
          </button>

          <br />
          <br />

          {result && (
  <>
    <div className="result">
      <h2>🌱 AI Analysis Result</h2>
      <div className="confidence-box">
  <strong>🎯 AI Confidence</strong>

  <div className="confidence-bar">
    <div className="confidence-fill"></div>
  </div>

  <p>95%</p>
</div>
      <pre>{result}</pre>
    </div>

    <br />

    <button onClick={downloadPDF}>
      📄 Download PDF Report
      
    </button>
    
  </>
)}
{history.length > 0 && (
  <section className="history">
  <h2>🕒 Analysis History</h2>

  <button
    onClick={clearHistory}
    style={{
      background: "#d32f2f",
      marginBottom: "20px",
    }}
  >
    🗑 Clear History
  </button>

  {history.map((item, index) => (
    <div className="history-card" key={index}>
      <h3>🌱 {item.crop}</h3>

      <p>
        <strong>Symptoms:</strong> {item.symptoms}
      </p>

      <pre>{item.result}</pre>

      <small>{item.date}</small>
    </div>
  ))}
</section>
)}
        </div>

        <section className="about" id="about">
          <h2>About CropSentry AI</h2>

          <p>
            CropSentry AI is an intelligent crop disease detection system that helps farmers identify crop diseases using Artificial Intelligence. Users can upload crop images, enter symptoms, and receive AI-powered disease diagnosis, treatment recommendations, and prevention tips.
          </p>
        </section>

        <section className="contact" id="contact">
          <h2>Contact Us</h2>

          <p>📧 Email: kifayatullah9611@gmail.com</p>
          <p>📍  Buner, Khyber Pakhtunkhwa, Pakistan</p>
          <p>📞 Available on Request</p>
        </section>
      </div>
      <section className="stats">
  <h2>📊 CropSentry AI Statistics</h2>

  <div className="stats-box">
    <div>
      <h3>{history.length}</h3>
      <p>Total Analyses</p>
    </div>

    <div>
      <h3>{history.filter(item => item.crop === "Potato").length}</h3>
      <p>🥔 Potato</p>
    </div>

    <div>
      <h3>{history.filter(item => item.crop === "Tomato").length}</h3>
      <p>🍅 Tomato</p>
    </div>

    <div>
      <h3>{history.filter(item => item.crop === "Wheat").length}</h3>
      <p>🌾 Wheat</p>
    </div>

    <div>
      <h3>{history.filter(item => item.crop === "Rice").length}</h3>
      <p>🌾 Rice</p>
    </div>

    <div>
      <h3>{history.filter(item => item.crop === "Maize").length}</h3>
      <p>🌽 Maize</p>
    </div>
  </div>
</section>

      <footer className="footer">
  <h3>🌱 CropSentry AI</h3>

  <p>🌱 CropSentry AI

Developed by Kifayat Ullah
BS Artificial Intelligence
The University of Agriculture Peshawar

© 2026 All Rights Reserved</p>

 
</footer>
    </>
  );
}

export default App;
            