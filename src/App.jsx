import { useState } from "react";
import "./App.css";
import { analyzeCrop } from "./assets/geminiAI.js";

function App() {
  const [crop, setCrop] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  return (
    <>
      <nav className="navbar">
        <h2>🌱 CropSentry AI</h2>
        <ul>
          <li>Home</li>
          <li>About</li>
          <li>Detect Disease</li>
          <li>Contact</li>
        </ul>
      </nav>

      <div className="app">
        <h1>🌱 CropSentry AI</h1>

        <h2>Smart AI Crop Disease Detection System</h2>

        <p>
          Upload a crop image, enter symptoms, and receive instant AI-powered
          disease diagnosis, treatment recommendations, and prevention tips.
        </p>

        <button>Get Started</button>

        <div className="form">
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
                const answer = await analyzeCrop(crop, symptoms);
                setResult(answer);
              } catch (error) {
                setResult("❌ Error: Unable to analyze crop. Please try again.");
                console.error(error);
              }

              setLoading(false);
            }}
          >
            {loading ? "Analyzing..." : "Analyze with AI"}
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
            <div className="result">
              {result}
            </div>
          )}
        </div>
      </div>

      <footer className="footer">
        <p>© 2026 CropSentry AI | Developed by Kifayat Ullah</p>
      </footer>
    </>
  );
}

export default App;