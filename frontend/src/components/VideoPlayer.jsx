import { SocketContext } from "../Context";
import { useContext } from "react";
const VideoPlayer = () => {
  const { myVideo, userVideo } = useContext(SocketContext);
  return (
    <div className="flex gap-6 max-md:flex-col">
      <div className="md:w-1/2">
        <p className="text-lg font-semibold">My Video</p>
        <video
          playsInline
          muted
          ref={myVideo}
          autoPlay
          className="w-full mt-6"
        />
      </div>
      <div className="md:w-1/2">
        <p className="text-lg font-semibold">Caller Video</p>
        <video playsInline ref={userVideo} autoPlay className="w-full mt-6" />
      </div>
    </div>
  );
};
export default VideoPlayer;
