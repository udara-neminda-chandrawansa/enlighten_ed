import db_con from "./dbconfig";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { UserPlus, School } from "lucide-react";

const getMyClasses = async () => {
  try {
    const { data, error } = await db_con
      .from("classrooms")
      .select("class_id, classname")
      .eq("lecturer_id", JSON.parse(Cookies.get("auth"))["user_id"]);

    if (error) {
      console.log("Classes Loading error:", error.message);
      return { success: false, message: "Load Failed!" };
    }
    return { success: true, classes: data };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "Something went wrong!" };
  }
};

// Fetch students belonging to a specific class
const getStudentsByClass = async (classId) => {
  try {
    const { data, error } = await db_con
      .from("classrooms_students")
      .select("student_id, users(username, email)")
      .eq("class_id", classId);

    if (error) {
      console.log(
        `Error fetching students for class ${classId}:`,
        error.message
      );
      return { success: false, students: [] };
    }

    // Map student records
    const students = data.map((record) => ({
      user_id: record.student_id,
      username: record.users.username,
      email: record.users.email,
    }));

    return { success: true, students };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, students: [] };
  }
};

function VirtualClassMgmt() {
  const [myClasses, setMyClasses] = useState([]);
  const [classStudents, setClassStudents] = useState({}); // Store students per class

  useEffect(() => {
    const fetchMyClasses = async () => {
      const result = await getMyClasses();
      if (result.success) {
        setMyClasses(result.classes);
        // Fetch students for each class
        result.classes.forEach(async (vclass) => {
          const studentResult = await getStudentsByClass(vclass.class_id);
          setClassStudents((prev) => ({
            ...prev,
            [vclass.class_id]: studentResult.students,
          }));
        });
      } else {
        console.log("Message:", result.message);
      }
    };

    fetchMyClasses();
  }, []);

  return (
    <div>
      <p className="text-xl font-semibold">Your Classes</p>
      <div className="flex flex-col gap-3 mt-3">
        {myClasses.length > 0 ? (
          myClasses.map((vclass) => (
            <div key={vclass.class_id}>
              <span className="flex items-center gap-2">
                {vclass.classname}
                <button
                  onClick={() =>
                    document.getElementById("addStudModal").showModal()
                  }
                  className="flex items-center gap-2 px-3 py-1 text-sm text-white bg-green-500 rounded-md"
                >
                  <UserPlus/>
                  Add Students
                </button>
              </span>
              <div className="mt-3 overflow-x-auto border border-b-[1px] rounded-md">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>User ID</th>
                      <th>Name</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classStudents[vclass.class_id]?.length > 0 ? (
                      classStudents[vclass.class_id].map((student) => (
                        <tr key={student.user_id}>
                          <td>{student.user_id}</td>
                          <td>{student.username}</td>
                          <td>{student.email}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center text-gray-500">
                          No students assigned
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No classes available</p>
        )}
      </div>
      <button
        onClick={() => document.getElementById("addClassModal").showModal()}
        className="flex items-center gap-2 px-3 py-1 mt-3 text-sm text-white bg-green-500 rounded-md"
      >
        <School/>
        Add a New Class
      </button>
      {/*add students modal*/}
      <dialog id="addStudModal" className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Add Students</h3>
          <div className="flex flex-col gap-3 mt-3">
            Students will be added here...
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
      {/*add classes modal*/}
      <dialog id="addClassModal" className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Add a Class</h3>
          <div className="flex flex-col gap-3 mt-3">
            Input Fields will be added here...
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}

export default VirtualClassMgmt;
