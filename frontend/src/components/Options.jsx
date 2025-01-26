import { useState, useContext } from "react";
import { SocketContext } from "../Context";
import { CopyToClipboard } from "react-copy-to-clipboard";

const Options = () => {
  const { me, callAccepted, name, setName, callEnded, leaveCall, callUser } =
    useContext(SocketContext);
  const [idToCall, setIdToCall] = useState("");

  return (
    <div className="lg:pr-6 lg:border-r">
      <p className="text-lg font-semibold">Options</p>
      <div className="flex gap-5 mt-6 max-sm:flex-col">
        {/*my data*/}
        <div className="flex flex-col gap-3 p-3 rounded-lg bg-base-200">
          <label htmlFor="myName">My Name</label>
          <input
            type="text"
            name="myName"
            id="myName"
            className="p-1 border-black rounded-md border-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <CopyToClipboard text={me}>
            <button className="p-1 text-sm rounded-md bg-base-300">
              Copy ID
            </button>
          </CopyToClipboard>
        </div>
        {/*user data*/}
        <div className="flex flex-col gap-3 p-3 rounded-lg bg-base-200">
          <label htmlFor="callerID">Caller ID</label>
          <input
            type="text"
            name="callerID"
            id="callerID"
            className="p-1 border-black rounded-md border-1"
            value={idToCall}
            onChange={(e) => setIdToCall(e.target.value)}
          />
          {callAccepted && !callEnded ? (
            <button
              className="p-1 text-sm rounded-md bg-base-300"
              onClick={leaveCall}
            >
              Hang up
            </button>
          ) : (
            <button
              className="p-1 text-sm rounded-md bg-base-300"
              onClick={() => callUser(idToCall)}
            >
              Call
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default Options;
