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

const getMyExams = async () => {
  try {
    const { data, error } = await db_con
      .from("exams")
      .select(
        "exam_id, class_id, lecturer_id, exam_name, exam_type, exam_qs, created_at"
      )
      .eq("lecturer_id", JSON.parse(Cookies.get("auth"))["user_id"])
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

const saveExam = async (
  class_id,
  lecturer_id,
  exam_name,
  exam_type,
  exam_qs
) => {
  try {
    // save exam
    const { data, error } = await db_con
      .from("exams")
      .insert([{ class_id, lecturer_id, exam_name, exam_type, exam_qs }])
      .select()
      .single();

    if (error) {
      console.log("Save error:", error.message);
      return { success: false, message: "Save Failed!" };
    }

    return { success: true, exam: data };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "Something went wrong!" };
  }
};

function ExamCreator() {
  const [myClasses, setMyClasses] = useState([]); // list of classes
  const [myExams, setMyExams] = useState([]); // list of exams
  const [selectedQuestions, setSelectedQuestions] = useState([]); // for displaying questions of a specific exam using a modal
  // below data for creating and saving exams (used in form elements)
  const [examName, setExamName] = useState("");
  const [examType, setExamType] = useState("mcq");
  const [selectedClass, setSelectedClass] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [qsCount, setQsCount] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    answers: ["", "", "", ""],
    correctAnswer: 0,
  });
  const [currentQsIndex, setCurrentQsIndex] = useState(0);

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

    const fetchMyExams = async () => {
      const result = await getMyExams();
      if (result.success) {
        setMyExams(result.exams);
      } else {
        console.log("Message:", result.message);
      }
    };

    fetchMyExams();
  }, [currentQuestion]);

  const handleAddQuestion = () => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions, currentQuestion];
      console.log("Updated Questions:", updatedQuestions); // Correctly logs updated list
      return updatedQuestions;
    });

    setCurrentQuestion({
      question: "",
      answers: ["", "", "", ""],
      correctAnswer: 0,
    });

    if (currentQsIndex < qsCount - 1) {
      setCurrentQsIndex((prevIndex) => prevIndex + 1);

      setTimeout(() => {
        document.getElementById("mcqModal").showModal();
      }, 100);
    } else {
      setTimeout(() => {
        document.getElementById("mcqModal").close();
      }, 100);
    }
  };

  const handleExamSave = async (event) => {
    event.preventDefault();
    const result = await saveExam(
      selectedClass,
      JSON.parse(Cookies.get("auth"))["user_id"],
      examName,
      examType,
      JSON.stringify(questions)
    );

    if (result.success) {
      alert(`Save successful! The page will be reloaded now.`);
      window.location.reload();
    } else {
      alert(result.message);
    }
  };

  // Logs the final updated state when it changes
  {
    /*
  useEffect(() => {
    console.log("All questions after update:", questions);
  }, [questions]);
  */
  }

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
      {questions.length > 0 && (
        <button className="mt-4 ml-4 btn" onClick={handleExamSave}>
          Save Exam
        </button>
      )}
      {questions.length > 0 && (
        <div className="mt-4 overflow-x-auto border">
          <table className="table table-zebra">
            {/* Table Head */}
            <thead>
              <tr>
                <th>#</th>
                <th>Question</th>
                <th>Answer 1</th>
                <th>Answer 2</th>
                <th>Answer 3</th>
                <th>Answer 4</th>
                <th>Correct Answer</th>
              </tr>
            </thead>
            {/* Table Body */}
            <tbody>
              {questions.map((question, index) => (
                <tr key={index}>
                  <th>{index + 1}</th>
                  <td>{question.question}</td>
                  <td>{question.answers[0]}</td>
                  <td>{question.answers[1]}</td>
                  <td>{question.answers[2]}</td>
                  <td>{question.answers[3]}</td>
                  <td className="font-bold">
                    {question.answers[question.correctAnswer]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h1 className="mt-4 font-semibold">My Exams</h1>
      <div className="mt-4 overflow-x-auto border">
        <table className="table table-zebra">
          {/* Table Head */}
          <thead>
            <tr>
              <th>#</th>
              <th>Exam Name</th>
              <th>Exam Type</th>
              <th>For Class</th>
              <th>Exam Questions</th>
              <th>Created At</th>
            </tr>
          </thead>
          {/* Table Body */}
          <tbody>
            {myExams.map((exam, index) => (
              <tr key={index}>
                <th>{index + 1}</th>
                <td>{exam.exam_name}</td>
                <td>{exam.exam_type}</td>
                <td>{exam.class_id}</td>
                <td>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => {
                      setSelectedQuestions(JSON.parse(exam.exam_qs));
                      document.getElementById("examQsDisplayModal").showModal();
                    }}
                  >
                    View Questions
                  </button>
                </td>
                <td>{new Date(exam.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/*mcq qs modal*/}
      <dialog id="mcqModal" className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">New Question</h3>
          <p className="flex flex-col gap-3 py-4">
            <input
              type="text"
              className="w-full input input-bordered"
              placeholder="Question?"
              value={currentQuestion.question}
              onChange={(e) =>
                setCurrentQuestion({
                  ...currentQuestion,
                  question: e.target.value,
                })
              }
            />
            {[0, 1, 2, 3].map((index) => (
              <span key={index} className="flex items-center gap-2">
                <input
                  type="radio"
                  className="radio radio-success"
                  name="ans"
                  checked={currentQuestion.correctAnswer === index}
                  onChange={() =>
                    setCurrentQuestion({
                      ...currentQuestion,
                      correctAnswer: index,
                    })
                  }
                />
                <input
                  type="text"
                  className="w-full input input-bordered"
                  placeholder={`Answer ${index + 1}`}
                  value={currentQuestion.answers[index]}
                  onChange={(e) => {
                    const newAnswers = [...currentQuestion.answers];
                    newAnswers[index] = e.target.value;
                    setCurrentQuestion({
                      ...currentQuestion,
                      answers: newAnswers,
                    });
                  }}
                />
              </span>
            ))}
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn" onClick={handleAddQuestion}>
                Add Question
              </button>
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
              onChange={(e) => setQsCount(parseInt(e.target.value) || 1)}
              placeholder="Number of Questions"
            />
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button
                className="btn"
                onClick={() => {
                  document.getElementById("mcqModal").showModal();
                  setCurrentQsIndex(0); // Reset the question index
                }}
              >
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
      {/*exam questions display modal*/}
      <dialog id="examQsDisplayModal" className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Questions</h3>
          {selectedQuestions.map((q, index) => (
            <div key={index} className="mt-4">
              <p>
                <strong>Q{index + 1}:</strong> {q.question}
              </p>
              <ul>
                {q.answers.map((answer, i) => (
                  <li
                    key={i}
                    className={`${
                      q.correctAnswer === i
                        ? "font-semibold text-green-800 underline"
                        : ""
                    }`}
                  >
                    {answer}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}

export default ExamCreator;
