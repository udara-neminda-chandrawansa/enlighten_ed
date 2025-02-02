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
        //console.log("Users Loaded!");
      } else {
        console.log("Message:", result.message);
      }
    };
    fetchUsers();
  });

  useEffect(() => {
    setName(JSON.parse(Cookies.get("auth"))["username"]);
    updatePeerId(me);
  }, []);

  return (
    <div className="lg:pr-6 lg:border-r">
      {/* Users List */}
      <div className="">
        <p className="text-lg font-semibold">Invite Users</p>
        <div className="flex flex-col gap-2 mt-3 rounded-lg bg-base-100">
          {users.length > 0 ? (
            users.map((user) => (
              <div
                key={user.user_id}
                className="flex items-center justify-between gap-2 p-2 rounded-md bg-base-200"
              >
                <span>{user.username}</span>
                {!callAccepted && (
                  <button
                    className="flex items-center gap-2 px-3 py-1 text-sm text-white bg-green-500 rounded-md"
                    onClick={() => callUser(user.peer_id)} // Use peer_id instead of user_id
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-telephone-fill"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"
                      />
                    </svg>
                    Call
                  </button>
                )}
                {callAccepted && !callEnded ? (
                  <button
                    className="flex items-center gap-2 px-3 py-1 text-sm text-white bg-red-500 rounded-md"
                    onClick={leaveCall}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-telephone-minus-fill"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877zM10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5"
                      />
                    </svg>
                    Hang up
                  </button>
                ) : null}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No users available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Options;
