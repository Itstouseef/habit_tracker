import React, { useState } from "react";
import "./FeatureFlags.css";

const FeatureFlags = () => {
  // In a real app, these would be fetched from Laravel
  const [flags, setFlags] = useState([
    { id: "maintenance", name: "Maintenance Mode", enabled: false, description: "Disable all user access to the app." },
    { id: "snowfall", name: "Winter Snowfall", enabled: true, description: "Show the snow effect on the login page." },
    { id: "signup", name: "Allow New Signups", enabled: true, description: "Enable or disable the registration page." },
  ]);

  const toggleFlag = (id) => {
    setFlags(flags.map(flag => 
      flag.id === id ? { ...flag, enabled: !flag.enabled } : flag
    ));
    // TODO: Dispatch a Redux action to save this state to Laravel
    console.log(`Flag ${id} toggled!`);
  };

  return (
    <div className="feature-flags-page">
      <h2>Feature Flags & Configuration</h2>
      <p className="subtitle">Instantly toggle app features for all users.</p>

      <div className="flags-grid">
        {flags.map((flag) => (
          <div key={flag.id} className={`flag-card ${flag.enabled ? "active" : ""}`}>
            <div className="flag-info">
              <h3>{flag.name}</h3>
              <p>{flag.description}</p>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={flag.enabled} 
                onChange={() => toggleFlag(flag.id)} 
              />
              <span className="slider round"></span>
            </label>
          </div>
        ))}
      </div>
      
      <button className="save-flags-btn" onClick={() => alert("Settings Saved!")}>
        Save Configuration
      </button>
    </div>
  );
};

export default FeatureFlags;