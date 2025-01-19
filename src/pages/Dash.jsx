import React, { useState } from 'react';
import { Menu, X, Video, Paperclip, Users2Icon, Flag, User2Icon } from 'lucide-react';

const Dashboard = ({username}) => {
  const [activeSpace, setActiveSpace] = useState('Video Conference');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    [<Video/>, 'Video Conference'],
    [<Paperclip/>, 'Exam Mode'],
    [<Users2Icon/>, 'Commune Space'],
    [<Flag/>, 'Quiz Space'],
    [<User2Icon/>, 'Account Management']
  ];

  const renderContent = () => {
    switch (activeSpace) {
      case 'Video Conference':
        return (
          <div className="p-6">
            <h2 className="mb-4 text-2xl font-bold">Video Conference Space</h2>
            <div className="p-4 rounded-lg bg-base-100">
              <p>Video conferencing features and controls will go here</p>
            </div>
          </div>
        );
      case 'Exam Mode':
        return (
          <div className="p-6">
            <h2 className="mb-4 text-2xl font-bold">Exam Mode Space</h2>
            <div className="p-4 rounded-lg bg-base-100">
              <p>Exam settings and controls will go here</p>
            </div>
          </div>
        );
      case 'Commune Space':
        return (
          <div className="p-6">
            <h2 className="mb-4 text-2xl font-bold">Commune Space</h2>
            <div className="p-4 rounded-lg bg-base-100">
              <p>Community interaction features will go here</p>
            </div>
          </div>
        );
      case 'Quiz Space':
        return (
          <div className="p-6">
            <h2 className="mb-4 text-2xl font-bold">Quiz Space</h2>
            <div className="p-4 rounded-lg bg-base-100">
              <p>Quiz creation and management tools will go here</p>
            </div>
          </div>
        );
      case 'Account Management':
        return (
          <div className="p-6">
            <h2 className="mb-4 text-2xl font-bold">Account Management</h2>
            <div className="p-4 rounded-lg bg-base-100">
              <p>User account settings and preferences will go here</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-[92dvh] bg-base-200">
      {/* Sidebar */}
      <div 
        className={`relative bg-base-100 shadow-lg transition-all duration-300 ease-in-out h-full
          ${isSidebarOpen ? 'w-64' : 'w-16'} overflow-hidden`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className={`text-xl line-clamp-1 font-bold transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:opacity-0'}`}>
            Welcome {username}!
          </h1>
        </div>
        <nav className="mt-4">
          {menuItems.map((item) => (
            <button
              key={item[1]}
              onClick={() => setActiveSpace(item[1])}
              className={`w-full text-left px-4 py-3 transition-colors duration-200 whitespace-nowrap
                ${activeSpace === item[1]
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-base-100'
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

        <div className="mt-16 lg:mt-0">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;