import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [videoDevices, setVideoDevices] = useState([]);
  const [audioDevices, setAudioDevices] = useState([]);
  const [selectedVideoDevice, setSelectedVideoDevice] = useState(null);
  const [selectedAudioDevice, setSelectedAudioDevice] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    async function getInitialStreamAndDevices() {
      try {
        // Get a stream to prompt for permission
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        // Stop the stream immediately since we just want permission
        stream.getTracks().forEach((track) => track.stop());

        // Now enumerate devices since permission has been granted
        const deviceInfos = await navigator.mediaDevices.enumerateDevices();
        const videoDeviceInfos = deviceInfos.filter(
          (device) => device.kind === "videoinput"
        );
        const audioDeviceInfos = deviceInfos.filter(
          (device) => device.kind === "audioinput"
        );

        setVideoDevices(videoDeviceInfos);
        setAudioDevices(audioDeviceInfos);

        if (videoDeviceInfos.length > 0) {
          setSelectedVideoDevice(videoDeviceInfos[0].deviceId);
        }

        if (audioDeviceInfos.length > 0) {
          setSelectedAudioDevice(audioDeviceInfos[0].deviceId);
        }
      } catch (err) {
        console.error("Error accessing media devices:", err);
      }
    }

    getInitialStreamAndDevices();
  }, []);


  useEffect(() => {
    if (selectedVideoDevice || selectedAudioDevice) {
      const constraints = {
        video: selectedVideoDevice ? { deviceId: selectedVideoDevice } : false,
        audio: selectedAudioDevice ? { deviceId: selectedAudioDevice } : false,
      };

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((error) => {
          console.error("Error accessing media devices:", error);
        });
    }
  }, [selectedVideoDevice, selectedAudioDevice]);

  return (
    <div className="App">
      <header className="App-header">
        {videoDevices.length > 0 && (
          <div>
            <label>Video Source: </label>
            <select
              value={selectedVideoDevice}
              onChange={(e) => setSelectedVideoDevice(e.target.value)}
            >
              {videoDevices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Device ${device.deviceId}`}
                </option>
              ))}
            </select>
          </div>
        )}

        {audioDevices.length > 0 && (
          <div>
            <label>Audio Source: </label>
            <select
              value={selectedAudioDevice}
              onChange={(e) => setSelectedAudioDevice(e.target.value)}
            >
              {audioDevices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Device ${device.deviceId}`}
                </option>
              ))}
            </select>
          </div>
        )}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          width="640"
          height="480"
        ></video>
      </header>
    </div>
  );
}

export default App;
