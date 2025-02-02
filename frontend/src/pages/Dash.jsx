import { useLocation } from "wouter";
import React, { useState, useEffect, useContext } from "react";
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
import UpdateAccount from "../components/UpdateAccount";
import { SocketContext } from "../Context";

function Dashboard() {
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
            <UpdateAccount />
            <div className="mt-6">
              <button
                className="flex items-center gap-3 p-2 text-white bg-red-500 rounded-md"
                onClick={() => handleLogout()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-box-arrow-left"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"
                  />
                  <path
                    fillRule="evenodd"
                    d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"
                  />
                </svg>
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
}

export default Dashboard;
