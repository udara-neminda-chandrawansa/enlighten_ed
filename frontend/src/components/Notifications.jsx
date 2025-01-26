import { useContext } from "react";
import { SocketContext } from "../Context";

const Notifications = () => {
  const { answerCall, call, callAccepted } = useContext(SocketContext);

  return (
    <div>
      <p className="text-lg font-semibold">Notifications</p>
      {call.isReceivingCall && !callAccepted && (
        <div className="flex items-center gap-3">
          <p> {call.name} is calling... </p>
          <button
            onClick={answerCall}
            className="p-1 text-sm rounded-md bg-base-300"
          >
            Answer Call
          </button>
        </div>
      )}
      {callAccepted && (
        <p className="text-sm font-semibold text-red-500">Do not refresh the browser or move to other dashboard tabs while participating in a call!</p>
      )}
    </div>
  );
};
export default Notifications;
