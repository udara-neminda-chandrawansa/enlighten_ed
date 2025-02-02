import { useState, useContext } from "react";
import { SocketContext } from "../Context";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Cookies from "js-cookie";

const Options = () => {
  const { me, callAccepted, name, setName, callEnded, leaveCall, callUser } =
    useContext(SocketContext);
  const [idToCall, setIdToCall] = useState("");

  return (
    <div className="lg:pr-6 lg:border-r">
      <p className="text-lg font-semibold">Options</p>
      <div className="mt-6">
        {/*data*/}
        <div className="flex flex-col gap-3 p-3 rounded-lg bg-base-200">
          <p>{name}</p>
          {me && (
            <CopyToClipboard text={me}>
              <button
                onClick={() =>
                  setName(JSON.parse(Cookies.get("auth"))["username"])
                }
                className="p-1 text-sm rounded-md bg-base-300"
              >
                Copy ID
              </button>
            </CopyToClipboard>
          )}
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
