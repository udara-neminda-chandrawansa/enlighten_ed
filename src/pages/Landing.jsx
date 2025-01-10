import logo from "../assets/logo.png";
import admin from "../assets/roles/admin.webp";
import teacher from "../assets/roles/teacher.jpg";
import student from "../assets/roles/student.jpg";
import parent from "../assets/roles/parent.webp";

function Landing() {
  return (
    <div>
      {/*banner*/}
      <div className="hero bg-base-300">
        <div className="flex-col w-full p-6 hero-content lg:flex-row">
          <div>
            <h1 className="text-5xl font-bold max-md:text-3xl">
              Your educational partner | EnlightenEd
            </h1>
            <p className="py-6 text-justify">
              Discover a revolutionary way to learn with EnlightenEd, your
              ultimate online learning platform. Join virtual classrooms, engage
              in interactive discussions, and track your progress through
              advanced tools and gamification. Whether you're a student,
              teacher, or parent, EnlightenEd makes learning seamless,
              collaborative, and fun.
            </p>
            <div className="flex gap-6">
              <button className="btn btn-primary">Signup</button>
              <button className="btn btn-secondary">Sign In</button>
            </div>
          </div>
        </div>
      </div>
      {/*about us*/}
      <div className="flex flex-col gap-6 p-6">
        <h1 className="text-3xl">About Us</h1>
        <div className="justify-between w-full gap-6 md:flex">
          <div className="flex flex-col gap-6 md:w-2/3">
            <p className="text-justify">
              At EnlightenEd, we believe learning should inspire, engage, and
              empower. Founded with a mission to bridge gaps in education, we've
              created a dynamic platform that transforms traditional learning
              into a captivating online experience. By blending advanced
              technology with proven teaching strategies, EnlightenEd offers an
              inclusive space where students, educators, and parents thrive
              together.
            </p>
            <p className="text-justify">
              From gamified lessons to real-time collaboration, we're dedicated
              to making education accessible, innovative, and enjoyable for
              everyone, everywhere. Join us in redefining the future of
              learning!
            </p>
          </div>
          <div className="flex items-center justify-center md:w-1/3">
            <img src={logo} className="h-[100px] 2xl:h-[300px] w-full object-contain max-md:hidden" />
          </div>
        </div>
      </div>
      {/*roles*/}
      <h1 className="p-6 text-3xl">Available roles</h1>
      <div className="flex justify-center p-6 pt-0">
        <div className="grid grid-cols-4 gap-6 max-lg:grid-cols-2 max-md:grid-cols-1">
          {/*admin*/}
          <div className="shadow-xl card card-compact bg-base-100 max-xl:h-[400px]">
            <figure className="h-1/2">
              <img
                src={admin}
                alt="Admin img"
                className="object-cover w-full h-full"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">Admin</h2>
              <p>Manages a single institution</p>
              <div className="justify-end card-actions">
                <button className="btn btn-primary">Sign Up</button>
              </div>
            </div>
          </div>
          {/*teacher*/}
          <div className="shadow-xl card card-compact bg-base-100 max-xl:h-[400px]">
            <figure className="h-1/2">
              <img
                src={teacher}
                alt="Teacher img"
                className="object-cover w-full h-full"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">Teacher</h2>
              <p>
                Manages classrooms, students and relevant tests, assignments
                etc.
              </p>
              <div className="justify-end card-actions">
                <button className="btn btn-primary">Sign Up</button>
              </div>
            </div>
          </div>
          {/*student*/}
          <div className="shadow-xl card card-compact bg-base-100 max-xl:h-[400px]">
            <figure className="h-1/2">
              <img
                src={student}
                alt="Student img"
                className="object-cover w-full h-full"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">Student</h2>
              <p>The learner</p>
              <div className="justify-end card-actions">
                <button className="btn btn-primary">Sign Up</button>
              </div>
            </div>
          </div>
          {/*parent*/}
          <div className="shadow-xl card card-compact bg-base-100 max-xl:h-[400px]">
            <figure className="h-1/2">
              <img
                src={parent}
                alt="Parent img"
                className="object-cover w-full h-full"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">Parent</h2>
              <p>Guardian / Caretaker of learner</p>
              <div className="justify-end card-actions">
                <button className="btn btn-primary">Sign Up</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Landing;
