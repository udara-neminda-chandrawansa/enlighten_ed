import { SocketContext } from "../Context";
import { useContext } from "react";
const VideoPlayer = () => {
  const { myVideo, userVideo } = useContext(SocketContext);
  return (
    <div className="flex gap-6 max-md:flex-col">
      <div className="relative w-full bg-black/20">
        <video playsInline ref={userVideo} autoPlay className="w-full aspect-video" />
        <div className="w-[100px] max-md:w-[50px] max-sm:w-8 absolute right-0 bottom-0 bg-black/50">
          <video
            playsInline
            muted
            ref={myVideo}
            autoPlay
            className="w-full aspect-video"
          />
        </div>
      </div>
    </div>
  );
};
export default VideoPlayer;
