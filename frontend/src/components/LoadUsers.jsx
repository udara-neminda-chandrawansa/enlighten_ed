import db_con from "../components/dbconfig";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

const getUsers = async () => {
  try {
    const { data, error } = await db_con
      .from("users")
      .select("username, user_id") // Fetch user_id and username
      .neq("user_id", JSON.parse(Cookies.get("auth"))["user_id"]); // Exclude self

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

const LoadUsers = () => {
  const [users, setUsers] = useState([]);

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
  }, []);

  return users;
};

export default LoadUsers;
