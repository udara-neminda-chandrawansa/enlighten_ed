import { useState, useEffect } from "react";
import db_con from "./dbconfig";
import Cookies from "js-cookie";

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

function ExamCreator() {
  const [myClasses, setMyClasses] = useState([]); // list of classes
  const [examName, setExamName] = useState("");
  const [examType, setExamType] = useState("mcq");
  const [selectedClass, setSelectedClass] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [qsCount, setQsCount] = useState(1);

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

  return (
    <div>
      <h1 className="font-semibold">MCQ Exam Creator</h1>
      <button
        className="mt-4 btn"
        onClick={() => {
          myClasses.length > 0
            ? document.getElementById("examDetailsModal").showModal()
            : alert(
                "You don't have any classes yet! Add a class to create an exam"
              );
        }}
      >
        Create Exam
      </button>
      {/*mcq qs modal*/}
      <dialog id="mcqModal" className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">New Question</h3>
          <p className="flex flex-col gap-3 py-4">
            <input
              type="text"
              className="w-full input input-bordered"
              placeholder="Question?"
            />
            <span className="flex items-center gap-2">
              <input type="radio" className="radio radio-success" name="ans" />
              <input
                type="text"
                className="w-full input input-bordered"
                placeholder="Answer 1"
              />
            </span>
            <span className="flex items-center gap-2">
              <input type="radio" className="radio radio-success" name="ans" />
              <input
                type="text"
                className="w-full input input-bordered"
                placeholder="Answer 2"
              />
            </span>
            <span className="flex items-center gap-2">
              <input type="radio" className="radio radio-success" name="ans" />
              <input
                type="text"
                className="w-full input input-bordered"
                placeholder="Answer 3"
              />
            </span>
            <span className="flex items-center gap-2">
              <input type="radio" className="radio radio-success" name="ans" />
              <input
                type="text"
                className="w-full input input-bordered"
                placeholder="Answer 4"
              />
            </span>
          </p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Add Question</button>
            </form>
          </div>
        </div>
      </dialog>
      {/*exam details modal*/}
      <dialog id="examDetailsModal" className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">New Exam</h3>
          <div className="flex flex-col gap-6 py-4">
            <input
              type="text"
              className="w-full input input-bordered"
              placeholder="Exam Name"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
            />
            <span className="flex items-center gap-3">
              <input
                type="radio"
                name="exa_type"
                onClick={() => setExamType("mcq")}
                defaultChecked
                className="radio"
              />
              MCQ
              <input
                type="radio"
                name="exa_type"
                onClick={() => setExamType("essay")}
                className="radio"
              />
              Essay
            </span>
            <select
              name="vclass"
              className="select select-bordered"
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                console.log(e.target.value);
              }}
            >
              <option value="0" defaultValue>
                Select a class
              </option>
              {myClasses.length > 0 ? (
                myClasses.map((vclass) => (
                  <option key={vclass.class_id} value={vclass.class_id}>
                    {vclass.class_id} - {vclass.classname}
                  </option>
                ))
              ) : (
                <option value="0">You have no classes!</option>
              )}
            </select>
            <input
              type="number"
              name="qsCount"
              className="input input-bordered"
              min={1}
              max={30}
              value={qsCount}
              onChange={(e) => setQsCount(e.target.value)}
              placeholder="Number of Questions"
            />
          </div>
          <div className="modal-action">
            <form method="dialog">
              {/* after providing basic info, start collecting qs info */}
              <button
                className="btn"
                onClick={() => {
                  document.getElementById("mcqModal").showModal(),
                    console.log(selectedClass);
                }}
              >
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default ExamCreator;
