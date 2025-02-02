import { useState, useContext, useEffect } from "react";
import { SocketContext } from "../Context";
import Cookies from "js-cookie";
import db_con from "../components/dbconfig";

const getUsers = async () => {
  try {
    const { data, error } = await db_con
      .from("users")
      .select("username, peer_id") // Fetch Peer ID instead of user_id
      .neq("user_id", JSON.parse(Cookies.get("auth"))["user_id"]) // Exclude self
      .neq("peer_id", null)
      .neq("peer_id", ""); // Exclude null peer_id rows

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

const updatePeerId = async (peerId) => {
  const userId = JSON.parse(Cookies.get("auth"))["user_id"]; // Get logged-in user ID
  const { error } = await db_con
    .from("users")
    .update({ peer_id: peerId })
    .eq("user_id", userId);

  if (error) {
    console.error("Error updating peer ID:", error.message);
  } else {
    console.log("Peer ID updated successfully!");
  }
};

const Options = () => {
  const { callAccepted, setName, callEnded, leaveCall, callUser } =
    useContext(SocketContext);
  const [users, setUsers] = useState([]);
  const { me } = useContext(SocketContext);

  useEffect(() => {
    const fetchUsers = async () => {
      const result = await getUsers();
      if (result.success) {
        setUsers(result.users);
        console.log("Users Loaded!");
      } else {
        console.log("Message:", result.message);
      }
    };
    fetchUsers();
    setName(JSON.parse(Cookies.get("auth"))["username"]);
    updatePeerId(me);
  }, []);

  return (
    <div className="lg:pr-6 lg:border-r">
      <div className="mt-6">
        {/* Users List */}
        <div className="mt-6">
          <p className="text-lg font-semibold">Invite Users</p>
          <div className="flex flex-col gap-2 p-3 mt-3 rounded-lg bg-base-100">
            {users.length > 0 ? (
              users.map((user) => (
                <div
                  key={user.user_id}
                  className="flex items-center justify-between gap-2 p-2 rounded-md bg-base-200"
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
