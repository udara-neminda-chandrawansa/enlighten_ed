import { useState, useEffect } from "react";
import db_con from "./dbconfig";
import Cookies from "js-cookie";

const getMyClasses = async () => {
  try {
    const { data, error } = await db_con
      .from("classrooms_students")
      .select("class_id, classrooms(classname)") // Select classname from classrooms
      .eq("student_id", JSON.parse(Cookies.get("auth"))["user_id"]);

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

const getMyExams = async (class_id) => {
  try {
    const { data, error } = await db_con
      .from("exams")
      .select(
        "exam_id, class_id, lecturer_id, exam_name, exam_type, exam_qs, created_at"
      )
      .eq("class_id", class_id)
      .order("exam_id", { ascending: true });

    if (error) {
      console.log("Exams Loading error:", error.message);
      return { success: false, message: "Load Failed!" };
    }
    return { success: true, exams: data };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "Something went wrong!" };
  }
};

function ExamPortal() {
  const [myClasses, setMyClasses] = useState([]); // registered classes list
  const [myExams, setMyExams] = useState([]);
  const [selectedClass, setSelectedClass] = useState(0);

  useEffect(() => {
    const fetchMyClasses = async () => {
      const result = await getMyClasses();
      if (result.success) {
        setMyClasses(result.classes);
      } else {
        console.log("Message:", result.message);
      }
    };

    fetchMyClasses();
  }, []);

  useEffect(() => {
    const fetchMyExams = async () => {
      const result = await getMyExams(selectedClass);
      if (result.success) {
        setMyExams(result.exams);
      } else {
        console.log("Message:", result.message);
      }
    };

    fetchMyExams();
  }, [selectedClass]);

  return (
    <div>
      <h1 className="font-semibold">My Classes</h1>
      {/*classes list*/}
      <div>
        <ul className="flex flex-col gap-2 mt-4">
          {myClasses.map((class_item, index) => (
            <li
              key={index}
              className="flex gap-2 pt-2 border-t sm:items-center max-sm:flex-col"
            >
              <p className="font-semibold">{class_item.class_id}.</p>
              {class_item.classrooms.classname}
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setSelectedClass(class_item.class_id)}
              >
                Show Exams
              </button>
            </li>
          ))}
        </ul>
        {/*exam space*/}
        <div className="mt-2">
          <p className="font-semibold">Exam Space</p>
          {selectedClass !== 0 && (
            <div className="flex gap-2 mt-4 max-md:flex-col">
              {myExams.map((exam, index) => (
                <button className="btn btn-sm" key={index}>Answer {exam.exam_name}</button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExamPortal;
