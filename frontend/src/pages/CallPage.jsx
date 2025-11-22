import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { useCallback, useRef, useState } from "react";
import { useEffect } from "react";
import { User, PhoneCall, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setError, uploadSummary } from "../redux/summarySlice";

const CALL_STATE = {
  INITIALIZING: "INITIALIZING", // Waiting for microphone access
  RECORDING: "RECORDING", // Recording is active and timer is running
  UPLOADING: "UPLOADING", // Stopped recording, sending file to BE
  ERROR: "ERROR",
  DONE: "DONE",
};

function CallPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.summary);

  const [callState, setCallState] = useState(CALL_STATE.CONNECTING);
  const [duration, setDuration] = useState(0);
  const [timer, setTimer] = useState("00:00");
  const [mimeType, setMimeType] = useState("audio/webm");

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const formatDuration = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const handleDataAvailable = (event) => {
    if (event.data.size > 0) {
      audioChunksRef.current.push(event.data);
    }
  };

  const handleUpload = async () => {
    setCallState(CALL_STATE.UPLOADING);

    const mimeType = mediaRecorderRef.current.mimeType || "audio/webm";
    const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });

    try {
      const summaryData = await dispatch(uploadSummary(audioBlob));

      if (summaryData && summaryData._id) {
          navigate(`/summary/${summaryData._id}`);
          setCallState(CALL_STATE.DONE);
      } else if (error) {
          // If Redux state shows an error
          setCallState(CALL_STATE.ERROR);
      } else {
          throw new Error("Upload succeeded, but no summary ID returned.");
      }
    } catch (error) {
      console.error("Failed to upload audio or process summary:", error);
      setCallState(CALL_STATE.ERROR);
    }
  };

  const onRecordingStopped = useCallback(() => {
    if (!mediaRecorderRef.current) return;
    
    // FIX: Use the custom property 'mediaStream' to access the stream for stopping tracks.
    const stream = mediaRecorderRef.current.mediaStream; 
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    handleUpload();
  }, [handleUpload]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // --- FIX: Robust MimeType Selection ---
      let recordingMimeType = "audio/webm";
      // Check for preferred WebM support
      if (MediaRecorder.isTypeSupported("audio/webm")) {
        recordingMimeType = "audio/webm";
      } 
      // Fallback to MP4/M4A if WebM is not supported
      else if (MediaRecorder.isTypeSupported("audio/mp4")) {
        recordingMimeType = "audio/mp4";
      }
      // Last resort: find any supported mime type
      else {
        const supportedTypes = [
          "audio/ogg", 
          "audio/wav", 
          "audio/mpeg",
          ...MediaRecorder.supportedTypes
        ];
        const supported = supportedTypes.find(type => MediaRecorder.isTypeSupported(type));
        if (supported) {
            recordingMimeType = supported;
        } else {
             // If no type is found, we can't record.
             throw new Error("No supported audio recording formats found.");
        }
      }
      
      setMimeType(recordingMimeType);
      
      const recorder = new MediaRecorder(stream, { mimeType: recordingMimeType });
      
      mediaRecorderRef.current = recorder;
      
      // FIX: Store the stream under a non-conflicting name (mediaStream) 
      // instead of 'stream' to avoid the TypeError.
      mediaRecorderRef.current.mediaStream = stream; 
      
      audioChunksRef.current = [];

      recorder.ondataavailable = handleDataAvailable;
      // Ensure onRecordingStopped is correctly bound
      recorder.onstop = onRecordingStopped; 

      recorder.start();
      setCallState(CALL_STATE.RECORDING);
      console.log(`Recording started with MIME type: ${recordingMimeType}`);
      
    } catch (err) {
      console.error("Microphone access denied or error occurred:", err);
      // Set the error message to be more informative
      const errorMessage = err.name === 'NotAllowedError' 
        ? "Microphone access denied by user or browser security policy." 
        : err.message === "No supported audio recording formats found."
        ? "Recording failed: Browser does not support necessary audio formats."
        : `Recording failed: ${err.message || "Unknown hardware error."}`;
      
      dispatch(setError(errorMessage)); // Update Redux state with detail
      setCallState(CALL_STATE.ERROR);
    }
  };

  useEffect(() => {
    startRecording();
  }, []);

  useEffect(() => {
    let interval;
    if (callState === CALL_STATE.RECORDING) {
      interval = setInterval(() => {
        setDuration((prevSeconds) => prevSeconds + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState]);

  useEffect(() => {
    setTimer(formatDuration(duration));
  }, [duration]);

  const getStatusText = () => {
    switch (callState) {
      case CALL_STATE.INITIALIZING:
        return "Accessing microphone...";
      case CALL_STATE.RECORDING:
        return timer;
      case CALL_STATE.UPLOADING:
        return (
          <span className="flex items-center gap-2 text-red-600">
            <Loader2 className="animate-spin w-5 h-5" />
            Uploading & Processing...
          </span>
        );
      case CALL_STATE.ERROR:
        return "Recording Failed.";
      case CALL_STATE.DONE:
        return "Call Ended. Redirecting...";
      default:
        return "Initializing...";
    }
  };

  const handleEndCall = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
    }
    if (
      callState === CALL_STATE.INITIALIZING ||
      callState === CALL_STATE.ERROR
    ) {
      navigate("/call/disconnect");
    }
  };

  return (
    <div className="h-full flex flex-col bg-white min-h-screen">
      <Header text={"Care Center 165"}></Header>

      <div className="flex flex-col justify-evenly items-center flex-grow p-6">
        <div className="flex flex-col justify-center items-center gap-4">
          <div className="p-5 rounded-full border-4 border-blue-500 text-blue-500">
            <User size={48} />
          </div>
          <div className="flex flex-col justify-center items-center">
            <h3 className="text-xl font-semibold text-gray-800">
              Call Center 165
            </h3>
            <p
              className={`text-sm h-8 mt-1 font-mono 
                            ${
                              callState === CALL_STATE.RECORDING
                                ? "text-red-500 font-bold"
                                : "text-gray-500"
                            }
                        `}
            >
              {getStatusText()}
            </p>
          </div>
        </div>

        {/* Disconnect/End Call Button */}
        <button
          onClick={handleEndCall}
          disabled={
            callState === CALL_STATE.UPLOADING || callState === CALL_STATE.DONE
          }
          className={`
                        text-white p-5 rounded-full shadow-2xl transition-all duration-300 transform
                        ${
                          callState === CALL_STATE.RECORDING ||
                          callState === CALL_STATE.INITIALIZING
                            ? "bg-red-600 hover:bg-red-700 hover:scale-105"
                            : "bg-gray-400 cursor-not-allowed"
                        }
                    `}
          style={{
            boxShadow:
              callState === CALL_STATE.RECORDING
                ? "0 0 15px rgba(239, 68, 68, 0.9), 0 0 5px rgba(239, 68, 68, 0.5)"
                : "0 10px 15px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* The PhoneCall icon is rotated 132 degrees to look like a disconnect icon */}
          <PhoneCall size={36} className="transform rotate-[132deg]" />
        </button>
      </div>
    </div>
  );
}

export default CallPage;
