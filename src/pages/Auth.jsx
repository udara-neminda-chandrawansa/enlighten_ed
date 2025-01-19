function Auth({ reqType }) {
  return (
    <div className="flex flex-grow p-6">
      <div className="flex flex-col flex-grow gap-6 p-6 border rounded-lg">
        <h1 className="text-3xl text-center">{reqType}</h1>
        <label className="flex items-center gap-2 input input-bordered">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-4 h-4 opacity-70"
          >
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
          </svg>
          <input type="text" className="grow" placeholder="Username" />
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
            />
          </label>
        </span>
        {reqType === "Sign Up" ? (
          <div className="flex gap-6 max-sm:flex-col">
            <p>Account Type:</p>
            <div className="flex items-center">
              <input
                defaultChecked
                id="student"
                type="radio"
                name="default-radio"
                className="radio"
              />
              <label
                htmlFor="student"
                className="text-sm font-medium ms-2"
              >
                Student
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="teacher"
                type="radio"
                name="default-radio"
                className="radio"
              />
              <label
                htmlFor="teacher"
                className="text-sm font-medium ms-2"
              >
                Teacher
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="parent"
                type="radio"
                name="default-radio"
                className="radio"
              />
              <label
                htmlFor="parent"
                className="text-sm font-medium ms-2"
              >
                Parent
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="admin"
                type="radio"
                name="default-radio"
                className="radio"
              />
              <label htmlFor="admin" className="text-sm font-medium ms-2">
                Admin
              </label>
            </div>
          </div>
        ) : (
          ""
        )}
        <button
          type="submit"
          className="bg-[#00367E] text-white rounded-md p-2"
        >
          {reqType}
        </button>
      </div>
    </div>
  );
}

export default Auth;
