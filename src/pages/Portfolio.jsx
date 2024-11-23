import { useState } from "react";
import { Link } from "react-router-dom";

const Portfolio = () => {
  // const [isOpen, setIsOpen] = useState(false);
  //
  // // const toggleMenu = () => {
  // //   setIsOpen(!isOpen);
  // // };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission, e.g., send data to an API or email service
    console.log(formData);
    // Reset form
    setFormData({ name: "", email: "", message: "" });
  };
  return (
    <div>
      <main className="pt-1">
        <section id="home" className="pt-24 pb-12 bg-gray-100">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-bold">
              Hello, I&#39;m <span className="text-blue-500">Your Name</span>
            </h1>
            <p className="mt-4 text-xl text-gray-700">
              I&#39;m a passionate Web Developer.
            </p>
            <Link
              to="contact"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
              className="mt-8 inline-block bg-blue-500 text-white px-8 py-3 rounded-full hover:bg-blue-600 cursor-pointer"
            >
              Contact Me
            </Link>
          </div>
        </section>
        <section id="about" className="py-12 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-8">About Me</h2>
            <div className="md:flex md:items-center">
              <div className="md:w-1/2">
                <img
                  src="https://i.pravatar.cc/300"
                  alt="Your Name"
                  className="rounded-full w-64 h-64 mx-auto md:mx-0"
                />
              </div>
              <div className="md:w-1/2 mt-6 md:mt-0 md:px-6">
                <p className="text-gray-700 text-lg">
                  {/* Your bio or introduction */}
                  I&#39;m a web developer with a passion for creating beautiful
                  and functional websites. With experience in HTML, CSS,
                  JavaScript, and various frameworks, I&#39;m dedicated to
                  building responsive and user-friendly applications.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section id="projects" className="py-12 bg-gray-100">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-8">Projects</h2>
            <div className="flex flex-wrap -mx-4">
              {/* Project 1 */}
              <div className="w-full md:w-1/2 lg:w-1/3 px-4 mb-8">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <img
                    src="https://i.pravatar.cc/300"
                    alt="Project 1"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">Project Title</h3>
                    <p className="text-gray-700 mb-4">
                      Brief description of the project.
                    </p>
                    <a href="#" className="text-blue-500 hover:text-blue-600">
                      View Project &rarr;
                    </a>
                  </div>
                </div>
              </div>
              {/* Add more project cards as needed */}
            </div>
          </div>
        </section>
        <section id="skills" className="py-12 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-8">Skills</h2>
            <div className="flex flex-wrap justify-center">
              {/* Skill 1 */}
              <div className="w-1/2 md:w-1/4 px-4 mb-6 text-center">
                <i className="fab fa-html5 fa-3x text-orange-600"></i>
                <p className="mt-2 text-gray-700">HTML5</p>
              </div>
              {/* Skill 2 */}
              <div className="w-1/2 md:w-1/4 px-4 mb-6 text-center">
                <i className="fab fa-css3-alt fa-3x text-blue-600"></i>
                <p className="mt-2 text-gray-700">CSS3</p>
              </div>
              {/* Skill 3 */}
              <div className="w-1/2 md:w-1/4 px-4 mb-6 text-center">
                <i className="fab fa-js-square fa-3x text-yellow-500"></i>
                <p className="mt-2 text-gray-700">JavaScript</p>
              </div>
              {/* Skill 4 */}
              <div className="w-1/2 md:w-1/4 px-4 mb-6 text-center">
                <i className="fab fa-react fa-3x text-blue-500"></i>
                <p className="mt-2 text-gray-700">React</p>
              </div>
              {/* Add more skills as needed */}
            </div>
          </div>
        </section>
        <section id="contact" className="py-12 bg-gray-100">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-8">Contact Me</h2>
            <form className="w-full max-w-lg mx-auto" onSubmit={handleSubmit}>
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                  <label
                    htmlFor="name"
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  >
                    Name
                  </label>
                  <input
                    className="appearance-none block w-full bg-white text-gray-700 border border-gray-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:border-blue-500"
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                  <label
                    htmlFor="email"
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  >
                    Email
                  </label>
                  <input
                    className="appearance-none block w-full bg-white text-gray-700 border border-gray-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:border-blue-500"
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Your Email Address"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                  <label
                    htmlFor="message"
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    className="appearance-none block w-full bg-white text-gray-700 border border-gray-300 rounded py-3 px-4 leading-tight focus:outline-none focus:border-blue-500 h-32 resize-none"
                    id="message"
                    name="message"
                    placeholder="Your Message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>
              <div className="flex justify-center">
                <button
                  className="bg-blue-500 text-white font-bold py-3 px-6 rounded-full hover:bg-blue-600 focus:outline-none"
                  type="submit"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </section>
        <footer className="bg-white py-6">
          <div className="container mx-auto px-6 text-center">
            <p className="text-gray-700">
              © {new Date().getFullYear()} Your Name. All rights reserved.
            </p>
            {/* Social Media Icons */}
            <div className="flex justify-center mt-4 space-x-6">
              <a
                href="#"
                className="text-gray-700 hover:text-blue-500"
                aria-label="GitHub"
              >
                <i className="fab fa-github fa-lg"></i>
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-blue-500"
                aria-label="LinkedIn"
              >
                <i className="fab fa-linkedin fa-lg"></i>
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-blue-500"
                aria-label="Twitter"
              >
                <i className="fab fa-twitter fa-lg"></i>
              </a>
              {/* Add more social icons as needed */}
            </div>
          </div>
        </footer>
        <Link
          spy={true}
          smooth={true}
          offset={-70}
          duration={500}
          className="fixed bottom-5 right-5 bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 cursor-pointer"
        >
          <i className="fas fa-arrow-up"></i>
        </Link>
      </main>
    </div>
  );
};
export default Portfolio;
