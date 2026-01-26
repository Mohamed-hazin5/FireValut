import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "react-oidc-context";
import { gsap } from "gsap";
import "./App.css";

function App() {
  const auth = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([]);
  const cardRef = useRef();

  const API_BASE = process.env.REACT_APP_API_BASE;

  // GSAP animation
  useEffect(() => {
    gsap.from(cardRef.current, {
      y: 80,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });
  }, []);

  // Fetch files
  const fetchFiles = async () => {
    try {
      const res = await fetch(`${API_BASE}/files`, {
        headers: {
          Authorization: auth.user.id_token,
        },
      });
      const data = await res.json();
      setFiles(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Upload file
  const handleUploadClick = async () => {
    if (!selectedFile) {
      alert("Please choose a file first");
      return;
    }

    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const base64String = reader.result.split(",")[1];

        await fetch(`${API_BASE}/upload`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: auth.user.id_token,
          },
          body: JSON.stringify({
            userId: auth.user.profile.sub,
            fileName: selectedFile.name,
            fileContent: base64String,
          }),
        });

        alert("✅ File uploaded!");
        fetchFiles();
      } catch (err) {
        console.error(err);
      }
    };

    reader.readAsDataURL(selectedFile);
  };

  useEffect(() => {
    if (auth.isAuthenticated) {
      fetchFiles();
    }
  }, [auth.isAuthenticated]);

  if (auth.isAuthenticated) {
    return (
      <div className="container">
        <div className="card" ref={cardRef}>
          <h2>Cloud File Vault</h2>
          <p className="email">{auth.user?.profile.email}</p>

          <input
            type="file"
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />

          <button className="btn login" onClick={handleUploadClick}>
            Upload File
          </button>

          <h3 style={{ marginTop: "20px" }}>📂 My Uploaded Files</h3>

          {files.length === 0 ? (
            <p>No files uploaded yet</p>
          ) : (
            <ul>
              {files.map((file, index) => (
                <li key={index}>{file.fileName}</li>
              ))}
            </ul>
          )}

          <button className="btn logout" onClick={() => auth.removeUser()}>
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card" ref={cardRef}>
        <h2>Cloud File Vault</h2>
        <p>Secure storage powered by AWS</p>
        <button className="btn login" onClick={() => auth.signinRedirect()}>
          Login with Cognito
        </button>
      </div>
    </div>
  );
}

export default App;
