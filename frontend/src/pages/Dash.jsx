import { useLocation } from "wouter";
import React, { useState } from "react";
import Cookies from "js-cookie";
import {
  Menu,
  X,
  Video,
  Paperclip,
  Users2Icon,
  Flag,
  User2Icon,
  UserCog2,
  School,
  Bookmark,
} from "lucide-react";
import VideoPlayer from "../components/VideoPlayer";
import Options from "../components/Options";
import Notifications from "../components/Notifications";

const Dashboard = () => {
  const [userID, setUserID] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [activeSpace, setActiveSpace] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [location, navigate] = useLocation();

  // auth cookie data & related methods
  const isAuthenticated = !!Cookies.get("auth");

  // logout method
  const handleLogout = () => {
    Cookies.remove("auth");
    navigate("/sign-in");
  };
  // if auth cookie is absent, go back to login
  if (!isAuthenticated) {
    navigate("/sign-in");
    return null; // Return null to prevent rendering anything else
  }

  const updateAccount = async (userId, username, email, password) => {
    try {
      // Check if the email already exists for a different user
      const { data: existingUser } = await db_con
        .from("users")
        .select("email")
        .eq("email", email)
        .neq("id", userId) // Exclude current user's email
        .single();
  
      if (existingUser) {
        return { success: false, message: "Email already in use by another user!" };
      }
  
      // Update the user data
      const { data, error } = await db_con
        .from("users")
        .update({ username, email, password }) // You might want to hash the password
        .eq("id", userId) // Identify the user by ID
        .select()
        .single();
  
      if (error) {
        console.log("Update error:", error.message);
        return { success: false, message: "Update Failed!" };
      }
  
      return { success: true, user: data };
    } catch (error) {
      console.error("Error:", error);
      return { success: false, message: "Something went wrong!" };
    }
  };
  

  const handleAccountUpdate = async (event) => {
    event.preventDefault();
    // alert("Test");
    const result = await updateAccount(JSON.parse(Cookies.get("auth"))["user"], username, email, password);
  }

  const menuItemsForStudents = [
    [<Video />, "Video Conference"],
    [<Paperclip />, "Exam Mode"],
    [<Users2Icon />, "Commune Space"],
    [<Flag />, "Quiz Space"],
    [<User2Icon />, "Account Management"],
  ];

  const menuItemsForLecturers = [
    [<School />, "Virtual Classrooms"],
    [<Video />, "Video Conference"],
    [<Paperclip />, "Exam Creation Space"],
    [<Flag />, "Quiz/Challenge Creation Space"],
    [<Bookmark />, "Report Generation"],
    [<User2Icon />, "Account Management"],
  ];

  const menuItemsForAdmin = [
    [<School />, "Institute Management"],
    [<UserCog2 />, "Lecturer Management"],
    [<Bookmark />, "Report Generation"],
    [<User2Icon />, "Account Management"],
  ];

  const renderContent = () => {
    switch (activeSpace) {
      case "Video Conference":
        return (
          <div className="p-6">
            <h2 className="mb-4 text-2xl font-bold">Video Conference Space</h2>
            <div className="flex flex-col gap-6 p-4 rounded-lg bg-base-100">
              <VideoPlayer />
              <div className="flex gap-6 max-lg:flex-col lg:pt-6 lg:border-t">
                <Options />
                <Notifications />
              </div>
            </div>
          </div>
        );
      case "Exam Mode":
        return (
          <div className="p-6">
            <h2 className="mb-4 text-2xl font-bold">Exam Mode Space</h2>
            <div className="p-4 rounded-lg bg-base-100">
              <p>Exam settings and controls will go here</p>
            </div>
          </div>
        );
      case "Commune Space":
        return (
          <div className="p-6">
            <h2 className="mb-4 text-2xl font-bold">Commune Space</h2>
            <div className="p-4 rounded-lg bg-base-100">
              <p>Community interaction features will go here</p>
            </div>
          </div>
        );
      case "Quiz Space":
        return (
          <div className="p-6">
            <h2 className="mb-4 text-2xl font-bold">Quiz Space</h2>
            <div className="p-4 rounded-lg bg-base-100">
              <p>Quiz creation and management tools will go here</p>
            </div>
          </div>
        );
      case "Account Management":
        return (
          <div className="p-6">
            <h2 className="mb-4 text-2xl font-bold">Account Management</h2>
            <div className="flex flex-col gap-6 p-4 rounded-lg bg-base-100">
              <label className="flex items-center gap-2 input input-bordered">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4 opacity-70"
                >
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                </svg>
                <input
                  type="text"
                  className="grow"
                  placeholder="Username"
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                />
              </label>
              <span className="flex justify-center gap-6 max-sm:flex-col">
                <label className="flex items-center gap-2 sm:w-1/2 input input-bordered">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="w-4 h-4 opacity-70"
                  >
                    <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                    <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                  </svg>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    className="grow"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                </label>
                <label className="flex items-center gap-2 sm:w-1/2 input input-bordered">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="w-4 h-4 opacity-70"
                  >
                    <path
                      fillRule="evenodd"
                      d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="grow"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  />
                </label>
              </span>
              <button
                type="submit"
                className="bg-[#00367E] text-white rounded-md p-2"
                onClick={handleAccountUpdate}
              >
                Update Account
              </button>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-6">
            <h2 className="mb-4 text-2xl font-bold">
              Welcome to EnlightenEd Dashboard 👋
            </h2>
            <div className="p-4 rounded-lg bg-base-100">
              <p>Select something from the menu</p>
            </div>
          </div>
        );
    }
  };
  // this is the dash that is ultimatelt returned. modify this according to the user type encountered in each login instance
  const SampleDash = ({ userType }) => {
    return (
      <div className="flex h-[92dvh] bg-base-200">
        {/* Sidebar */}
        <div
          className={`relative bg-base-100 shadow-lg transition-all duration-300 ease-in-out h-full
          ${isSidebarOpen ? "w-64" : "w-16"} overflow-hidden`}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h1
              className={`text-xl line-clamp-1 font-bold transition-opacity duration-300 ${
                isSidebarOpen ? "opacity-100" : "opacity-0 lg:opacity-0"
              }`}
            >
              Welcome {JSON.parse(Cookies.get("auth"))["username"]}!
            </h1>
          </div>
          <nav className="mt-4">
            {userType === "student"
              ? menuItemsForStudents.map((item) => (
                  <button
                    key={item[1]}
                    onClick={() => setActiveSpace(item[1])}
                    className={`w-full text-left px-4 py-3 transition-colors duration-200 whitespace-nowrap
                ${
                  activeSpace === item[1]
                    ? "bg-blue-500 text-white"
                    : "hover:bg-base-100"
                }`}
                  >
                    {isSidebarOpen ? item[1] : item[0]}
                  </button>
                ))
              : userType === "lecturer"
              ? menuItemsForLecturers.map((item) => (
                  <button
                    key={item[1]}
                    onClick={() => setActiveSpace(item[1])}
                    className={`w-full text-left px-4 py-3 transition-colors duration-200 whitespace-nowrap
                ${
                  activeSpace === item[1]
                    ? "bg-blue-500 text-white"
                    : "hover:bg-base-100"
                }`}
                  >
                    {isSidebarOpen ? item[1] : item[0]}
                  </button>
                ))
              : menuItemsForAdmin.map((item) => (
                  <button
                    key={item[1]}
                    onClick={() => setActiveSpace(item[1])}
                    className={`w-full text-left px-4 py-3 transition-colors duration-200 whitespace-nowrap
                ${
                  activeSpace === item[1]
                    ? "bg-blue-500 text-white"
                    : "hover:bg-base-100"
                }`}
                  >
                    {isSidebarOpen ? item[1] : item[0]}
                  </button>
                ))}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          {/* Toggle Button */}
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="relative top-0 left-0 z-50 p-2 transition-colors duration-200 rounded-md shadow-md max-lg:hidden bg-base-100 hover:bg-base-100"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="">{renderContent()}</div>
        </div>
      </div>
    );
  };
  {
    if (isAuthenticated) {
      return (
        <SampleDash userType={JSON.parse(Cookies.get("auth"))["user_type"]} />
      );
    }
  }
};

export default Dashboard;
