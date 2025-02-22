import { SocketContext } from "../Context";
import { useContext, useState } from "react";
import Cookies from "js-cookie";
import Options from "./Options";
import Notifications from "./Notifications";

const VideoPlayer = () => {
  const [meetingMode, setMeetingMode] = useState("peer-peer");
  const [classroomName, setClassroomName] = useState("Test Class");
  const { myVideo, userVideo } = useContext(SocketContext);
  const { startClassroom, joinClassroom } = useContext(SocketContext);
  return (
    <div className="flex flex-col gap-6 max-md:flex-col">
      <div className="w-full">
        <button
          className={`m-2 btn ${
            meetingMode === "virt-class" ? "btn-active text-white" : ""
          }`}
          onClick={() => {
            setMeetingMode("virt-class");
            document.getElementById("virtClassModal").showModal();
          }}
        >
          Virtual Classroom Mode
        </button>
        <button
          className={`m-2 btn ${
            meetingMode === "peer-peer" ? "btn-active text-white" : ""
          }`}
          onClick={() => {
            setMeetingMode("peer-peer");
          }}
        >
          Peer to Peer Mode
        </button>
        {meetingMode === "virt-class" && (
          <div
            id="jitsi-container"
            className="border-y"
            style={{ width: "100%", height: "500px" }}
          ></div>
        )}
        {meetingMode === "peer-peer" && (
          <div className="relative">
            <video
              playsInline
              ref={userVideo}
              autoPlay
              className="w-full aspect-video bg-black/20"
            />
            <div className="w-[100px] max-md:w-[50px] max-sm:w-8 absolute right-0 top-0 bg-black/50">
              <video
                playsInline
                muted
                ref={myVideo}
                autoPlay
                className="w-full aspect-video"
              />
            </div>
            <div className="flex gap-6 max-lg:flex-col lg:py-6 lg:border-y">
              <Options />
              <Notifications />
            </div>
          </div>
        )}
      </div>
      {/*modal*/}
      <dialog id="virtClassModal" className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">
            Start or Join a Virtual Classroom
          </h3>
          <p className="py-4">Provide Class Name</p>
          <input
            type="text"
            className="input"
            value={classroomName}
            onChange={(e) => setClassroomName(e.target.value)}
          />
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="absolute btn btn-sm btn-circle btn-ghost right-2 top-2">
                ✕
              </button>
              <button
                className="btn"
                onClick={() =>
                  JSON.parse(Cookies.get("auth"))["user_type"] === "lecturer"
                    ? startClassroom(classroomName)
                    : joinClassroom(classroomName)
                }
              >
                {JSON.parse(Cookies.get("auth"))["user_type"] === "lecturer"
                  ? "Start Classroom"
                  : "Join Classroom"}
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};
export default VideoPlayer;
