import { useState, useContext, useEffect } from "react";
import { SocketContext } from "../Context";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Cookies from "js-cookie";
import db_con from "../components/dbconfig";

const getUsers = async () => {
  try {
    const { data, error } = await db_con
      .from("users")
      .select("username, peer_id") // Fetch Peer ID instead of user_id
      .neq("peer_id", JSON.parse(Cookies.get("auth"))["peer_id"]); // Exclude self

    if (error) {
      console.log("Users Loading error:", error.message);
      return { success: false, message: "Load Failed!" };
    }
    return { success: true, users: data };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "Something went wrong!" };
  }
};

const Options = () => {
  const { me, callAccepted, name, setName, callEnded, leaveCall, callUser } =
    useContext(SocketContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const result = await getUsers();
      if (result.success) {
        setUsers(result.users);
      } else {
        console.log("Message:", result.message);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="lg:pr-6 lg:border-r">
      <p className="text-lg font-semibold">Options</p>
      <div className="mt-6">
        {/* User Info */}
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
        </div>

        {/* Users List */}
        <div className="mt-6">
          <p className="text-lg font-semibold">Invite Users</p>
          <div className="flex flex-col gap-2 p-3 mt-3 rounded-lg bg-base-100">
            {users.length > 0 ? (
              users.map((user) => (
                <div
                  key={user.user_id}
                  className="flex items-center justify-between p-2 rounded-md bg-base-200"
                >
                  <span>{user.username}</span>
                  <button
                    className="p-1 text-sm text-white bg-green-500 rounded-md"
                    onClick={() => callUser(user.peer_id)} // Use peer_id instead of user_id
                  >
                    Invite
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No users available</p>
            )}
          </div>
        </div>

        {/* Call Controls */}
        <div className="mt-6">
          {callAccepted && !callEnded ? (
            <button
              className="p-1 text-sm text-white bg-red-500 rounded-md"
              onClick={leaveCall}
            >
              Hang up
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Options;
