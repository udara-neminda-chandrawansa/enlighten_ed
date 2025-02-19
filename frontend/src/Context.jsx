import { createContext, useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";

const SocketContext = createContext();
// local: http://localhost:8080
// global: https://enlighten-ed.onrender.com
const socket = io("https://enlighten-ed.onrender.com", {
  path: "/socket.io", // Explicitly set the socket.io path
  // path: '/',
  transports: ["websocket"],
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});
const ContextProvider = ({ children }) => {
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState();
  const [screenStream, setScreenStream] = useState(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [name, setName] = useState("");
  const [call, setCall] = useState({});
  const [me, setMe] = useState("");
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      })
      .catch((err) => console.error("Media access error:", err));

    socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    socket.on("me", (id) => {
      console.log("Received socket ID:", id);
      setMe(id);
    });

    socket.on("callUser", ({ from, name: callerName, signal }) => {
      console.log("Incoming call from:", callerName, "ID:", from); // Debugging
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    return () => {
      socket.off("me");
      socket.off("connect");
      socket.off("callUser");
      socket.off("connect_error");
    };
  }, []);

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({ initiator: false, trickle: false, stream });
    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: call.from });
    });
    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });
    peer.signal(call.signal);
    connectionRef.current = peer;
  };

  const callUser = (peerId) => {
    if (!peerId) {
      console.error("Invalid Peer ID");
      return;
    }

    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", (data) => {
      console.log("Calling Peer ID:", peerId);
      socket.emit("callUser", {
        userToCall: peerId, // Use peer ID from database
        signalData: data,
        from: me, // My Peer ID
        name,
      });
    });

    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
    window.location.reload();
  };

  // **Screen Sharing**
  const shareScreen = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
  
      if (!connectionRef.current) {
        console.error("No active connection to share screen.");
        return;
      }
  
      const peer = connectionRef.current; // Get the active peer connection
  
      // Replace existing video track with the new screen-sharing track
      const screenTrack = screenStream.getTracks()[0];
  
      // Find the sender for the video track
      const sender = peer._pc.getSenders().find((s) => s.track?.kind === "video");
  
      if (sender) {
        sender.replaceTrack(screenTrack);
      } else {
        peer.addTrack(screenTrack, screenStream); // Add screen track if not already there
      }
  
      console.log("Screen sharing started.");
      setIsScreenSharing(true);
      
      // Stop sharing when user turns off screen share
      screenTrack.onended = () => {
        stopSharing();
      };
    } catch (error) {
      console.error("Error sharing screen:", error);
    }
  };
  
  // Function to stop sharing and revert to webcam
  const stopSharing = async () => {
    try {
      const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
  
      if (!connectionRef.current) {
        console.error("No active connection to stop screen sharing.");
        return;
      }
  
      const peer = connectionRef.current;
      const cameraTrack = cameraStream.getTracks()[0];
  
      const sender = peer._pc.getSenders().find((s) => s.track?.kind === "video");
  
      if (sender) {
        sender.replaceTrack(cameraTrack);
      }
  
      console.log("Switched back to camera.");
      setIsScreenSharing(false);
    } catch (error) {
      console.error("Error switching back to camera:", error);
    }
  };
  

  return (
    <SocketContext.Provider
      value={{
        call,
        callAccepted,
        myVideo,
        userVideo,
        stream,
        name,
        setName,
        callEnded,
        me,
        callUser,
        leaveCall,
        answerCall,
        shareScreen,
        stopSharing,
        isScreenSharing,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
export { ContextProvider, SocketContext };
