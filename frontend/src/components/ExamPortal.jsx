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

const saveExamResults = async (examId, studentId, marks) => {
  try {
    const { data, error } = await db_con
      .from("exams_students")
      .insert([
        {
          exam_id: examId,
          student_id: studentId,
          marks: marks,
        },
      ]);

    if (error) {
      console.log("Error saving results:", error.message);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error saving results:", error);
    return false;
  }
};

function ExamPortal() {
  const [myClasses, setMyClasses] = useState([]); // registered classes list
  const [myExams, setMyExams] = useState([]);
  const [selectedClass, setSelectedClass] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    answers: ["", "", "", ""],
    correctAnswer: 0,
    exam_id: 0,
  });
  const [questions, setQuestions] = useState([]); // Store all questions
  const [currentExamID, setCurrentExamID] = useState(0); // Store current exam id
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track current question index
  const [selectedAnswers, setSelectedAnswers] = useState([]); // Track selected answers
  const [examCompleted, setExamCompleted] = useState(false); // Track if exam is completed

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

  // Load exam questions and open modal
  const loadExamQuestions = (exam) => {
    const parsedQuestions = JSON.parse(exam.exam_qs);
    if (parsedQuestions.length > 0) {
      setQuestions(parsedQuestions);
      setCurrentExamID(exam.exam_id);
      setCurrentQuestionIndex(0);
      setCurrentQuestion(parsedQuestions[0]);
      setSelectedAnswers([]); // Reset selected answers
      setExamCompleted(false); // Reset exam completion state
      document.getElementById("mcqModal").showModal();
    }
  };

  // Handle selecting an answer
  const handleSelectAnswer = (index) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentQuestionIndex] = index;
    setSelectedAnswers(updatedAnswers);
  };

  // Load next question
  const loadNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setCurrentQuestion(questions[nextIndex]);
    } else {
      setExamCompleted(true); // Mark exam as completed
      calculateAndSaveResults();
      document.getElementById("mcqModal").close(); // Close modal if no more questions
    }
  };

  // Calculate and save results
  const calculateAndSaveResults = async () => {
    let correctAnswersCount = 0;

    // Count correct answers
    selectedAnswers.forEach((selectedAnswer, index) => {
      if (selectedAnswer === questions[index].correctAnswer) {
        correctAnswersCount += 1;
      }
    });

    const percentage = (correctAnswersCount / questions.length) * 100;
    const studentId = JSON.parse(Cookies.get("auth"))["user_id"];
    const examId = currentExamID; // Assuming exam_id is the same for all questions
    const resultSaved = await saveExamResults(examId, studentId, percentage);
    if (resultSaved) {
      alert(`Your score: ${correctAnswersCount} / ${questions.length} (${percentage.toFixed(2)}%)`);
    } else {
      alert("There was an error saving your results.");
    }
  };

  return (
    <div>
      <h1 className="font-semibold">My Classes</h1>
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

        <div className="mt-2">
          <p className="font-semibold">Exam Space</p>
          {selectedClass !== 0 && (
            <div className="flex gap-2 mt-4 max-md:flex-col">
              {myExams.map((exam, index) => (
                <button
                  className="btn btn-sm"
                  key={index}
                  onClick={() => loadExamQuestions(exam)}
                >
                  Answer {exam.exam_name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <dialog id="mcqModal" className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">New Question</h3>
          <div className="flex flex-col gap-3 pt-4">
            <p>{currentQuestion.question}</p>
            {currentQuestion.answers.map((answer, index) => (
              <span key={index} className="flex items-center gap-2">
                <input
                  type="radio"
                  className="radio radio-success"
                  name="ans"
                  onChange={() => handleSelectAnswer(index)}
                  checked={selectedAnswers[currentQuestionIndex] === index}
                />
                <p>{answer}</p>
              </span>
            ))}
          </div>
          <div className="modal-action">
            {examCompleted ? (
              <button className="btn" onClick={() => window.location.reload()}>
                Finish
              </button>
            ) : (
              <button className="btn" onClick={loadNextQuestion}>
                Next Question
              </button>
            )}
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default ExamPortal;
