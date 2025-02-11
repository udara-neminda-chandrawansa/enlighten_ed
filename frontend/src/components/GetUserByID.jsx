import db_con from "./dbconfig";
import { useState, useEffect } from "react";

const getUser = async (userID) => {
  try {
    const { data, error } = await db_con
      .from("users")
      .select("user_id, username, email, user_type") // Fetch all data
      .eq("user_id", userID) // using user_id
      .single();

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

const GetUserByID = ({ userID }) => {
  const [user, setUser] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (userID !== "0") {
        const result = await getUser(userID);
        if (result.success) {
          setUser(result.users);
          //console.log("Users Loaded!");
        } else {
          console.log("Message:", result.message, " | " , userID);
        }
      } else {
        setUser(["0"]);
      }
    };
    fetchUsers();
  }, []);

  return user;
};

export default GetUserByID;
