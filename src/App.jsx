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
</nav>
      <div className="app">
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
              <h2>🌱 AI Analysis Result</h2>
              <pre>{result}</pre>
            </div>
          )}
        </div>

        <section className="about" id="about">
          <h2>About CropSentry AI</h2>

          <p>
            CropSentry AI is an intelligent crop disease detection system
            that helps farmers identify crop diseases using Artificial
            Intelligence. Users can select a crop, enter symptoms,
            upload an image, and receive treatment and prevention advice.
          </p>
        </section>

        <section className="contact" id="contact">
          <h2>Contact Us</h2>

          <p>📧 Email: cropsentryai@gmail.com</p>
          <p>📍 Peshawar, Pakistan</p>
          <p>📞 +92 300 1234567</p>
        </section>
      </div>

      <footer className="footer">
        <p>© 2026 CropSentry AI | Developed by Kifayat Ullah</p>
      </footer>
    </>
  );
}

export default App;
            