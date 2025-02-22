import { useLocation } from "wouter";
import React, { useState, useEffect } from "react";
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
  LogOut,
  Calendar,
} from "lucide-react";
import VideoPlayer from "../components/VideoPlayer";
import UpdateAccount from "../components/UpdateAccount";
import VirtualClassMgmt from "../components/VirtualClassMgmt";
import ChatApp from "../components/ChatApp";
import db_con from "../components/dbconfig";
import LoadUsers from "../components/LoadUsers";
import ExamCreator from "../components/ExamCreator";
import ExamPortal from "../components/ExamPortal";
import TaskManagement from "../components/TaskManagement";

// this is to reset peer_id before user closes the browser/tab
const resetPeerID = async () => {
  try {
    // Update the user data
    const { data, error } = await db_con
      .from("users")
      .update({ peer_id: null }) // Set peer_id to null
      .eq("user_id", JSON.parse(Cookies.get("auth"))["user_id"]) // Identify the user by ID
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

function Dashboard() {
  const [activeSpace, setActiveSpace] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [location, navigate] = useLocation();
  const [reciever, setReciever] = useState("0"); // for messaging

  // auth cookie data & related methods
  const isAuthenticated = !!Cookies.get("auth");

  {
    /*
  useEffect(()=>{
    console.log(reciever);
  }, [reciever]);
    */
  }

  // logout method
  const handleLogout = () => {
    resetPeerID();
    Cookies.remove("auth");
    navigate("/sign-in");
  };
  // if auth cookie is absent, go back to login
  if (!isAuthenticated) {
    navigate("/sign-in");
    return null; // Return null to prevent rendering anything else
  }

  // this is to reset peer_id before user closes the browser/tab
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      resetPeerID();
      event.preventDefault();
      event.returnValue = ""; // Some browsers require this for the confirmation dialog
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const menuItemsForStudents = [
    [<Video />, "Video Conference"],
    [<Paperclip />, "Exam Mode"],
    [<Users2Icon />, "Commune Space"],
    [<Flag />, "Quiz Space"],
    [<Calendar />, "Calendar"],
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
              <ChatApp receiver={"0"} />
            </div>
          </div>
        );
      case "Exam Mode":
        return (
          <div className="p-6">
            <h2 className="mb-4 text-2xl font-bold">Exam Mode Space</h2>
            <div className="p-4 rounded-lg bg-base-100">
              <ExamPortal />
            </div>
          </div>
        );
      case "Exam Creation Space":
        return (
          <div className="p-6">
            <h2 className="mb-4 text-2xl font-bold">Exam Creation Space</h2>
            <div className="p-4 rounded-lg bg-base-100">
              <ExamCreator />
            </div>
          </div>
        );
      case "Virtual Classrooms":
        return (
          <div className="p-6">
            <h2 className="mb-4 text-2xl font-bold">
              Virtual Classrooms Space
            </h2>
            <div className="p-4 rounded-lg bg-base-100">
              <VirtualClassMgmt />
            </div>
          </div>
        );
      case "Commune Space":
        return (
          <div className="p-6">
            <h2 className="mb-4 text-2xl font-bold">Commune Space</h2>
            <div className="p-4 rounded-lg bg-base-100">
              <div className="flex max-md:flex-col">
                <div className="flex flex-col gap-2 md:border-r md:pr-2 md:mr-2 md:w-1/2">
                  <div
                    className={`px-2 py-3 cursor-pointer rounded-md bg-base-200 ${
                      reciever === "0" ? "border shadow-md font-semibold" : ""
                    }`}
                    onClick={() => setReciever("0")}
                  >
                    Public Channel
                  </div>
                  {LoadUsers().map((user, index) => (
                    <div
                      key={index}
                      className={`px-2 py-3 cursor-pointer rounded-md bg-base-200 ${
                        reciever === user["user_id"]
                          ? "border shadow-md font-semibold"
                          : ""
                      }`}
                      onClick={() => setReciever(user["user_id"])}
                    >
                      {user["username"]}
                    </div>
                  ))}
                </div>
                <ChatApp receiver={reciever} />
              </div>
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
      case "Calendar":
        return (
          <div className="p-6">
            <h2 className="mb-4 text-2xl font-bold">Calendar</h2>
            <div className="p-4 rounded-lg bg-base-100">
              <TaskManagement/>
            </div>
          </div>
        );
      case "Account Management":
        return (
          <div className="p-6">
            <h2 className="mb-4 text-2xl font-bold">Account Management</h2>
            <UpdateAccount />
            <div className="mt-6">
              <button
                className="text-white btn btn-error btn-sm"
                onClick={() => handleLogout()}
              >
                <LogOut />
                Logout
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
        <div className="flex-1 overflow-auto no-scrollbar">
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
}

export default Dashboard;
