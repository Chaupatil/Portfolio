import React, { useState, useEffect, useRef } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { BiLogoGmail } from "react-icons/bi";
import {
  Mail,
  Menu,
  X,
  Moon,
  Sun,
  ChevronUp,
  Code,
  Database,
  Cloud,
  Cpu,
} from "lucide-react";
import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, TorusKnot } from "@react-three/drei";
import emailjs from "emailjs-com";

function HeroObject() {
  const meshRef = useRef();

  // Make the object follow the mouse and subtly pulsate
  useFrame((state) => {
    if (meshRef.current) {
      // Mouse interaction for rotation
      meshRef.current.rotation.x = state.mouse.y * 0.2;
      meshRef.current.rotation.y = state.mouse.x * 0.2;

      // Subtle pulsation effect
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05; // Adjust speed and intensity
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    // Keep Float for gentle overall movement
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1.0}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} /> {/* Smooth sphere */}
        <meshStandardMaterial
          color="#8A2BE2" // A nice violet color, can be changed
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
}

function Hero3D() {
  return (
    <Canvas camera={{ position: [0, 0, 3] }}>
      <ambientLight intensity={0.5} />
      {/* Directional light from top-right for general scene illumination */}
      <directionalLight position={[10, 10, 5]} intensity={1.0} />
      {/* Spot light for more focused highlight */}
      <spotLight
        position={[0, 5, 5]}
        angle={0.5}
        penumbra={1}
        intensity={0.8}
        color="#ADD8E6" // Light blue highlight
      />
      {/* Point light to give the orb an internal glow, matching its color */}
      <pointLight position={[0, 0, 0]} intensity={1.5} color="#8A2BE2" />

      <HeroObject />
    </Canvas>
  );
}

const sectionFadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeInOut" },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Stagger animation for child elements
    },
  },
};

const itemFadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [formStatus, setFormStatus] = useState("");
  const [activeSection, setActiveSection] = useState("home");
  const currentYear = new Date().getFullYear();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  // Apply dark mode to document root
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
      const sections = ["home", "about", "projects", "contact"];
      const current = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setFormStatus("sending");

    emailjs
      .sendForm(
        "service_nf3ogxd", // Your EmailJS Service ID
        "template_1bksbkp", // Replace with your actual Template ID
        e.target, // Form element to auto-capture values
        "fbMFDsAR8fBPMgTYm" // Your EmailJS public key (user_XXXX or public_XXXX)
      )
      .then(
        (result) => {
          console.log(result.text);
          setFormStatus("success");
          setTimeout(() => setFormStatus(""), 3000);
        },
        (error) => {
          console.error(error.text);
          setFormStatus("error");
        }
      );
  };

  const skills = [
    {
      name: "React",
      icon: <Code className="w-6 h-6" />,
      color: "from-cyan-500 to-blue-500",
    },
    {
      name: "Node.js",
      icon: <Cpu className="w-6 h-6" />,
      color: "from-green-500 to-emerald-500",
    },
    {
      name: "PostgreSQL",
      icon: <Database className="w-6 h-6" />,
      color: "from-blue-600 to-indigo-600",
    },
    {
      name: "AWS",
      icon: <Cloud className="w-6 h-6" />,
      color: "from-orange-500 to-amber-500",
    },
    {
      name: "Express.js",
      icon: <Code className="w-6 h-6" />,
      color: "from-gray-600 to-gray-700",
    },
    {
      name: "Tailwind CSS",
      icon: <Code className="w-6 h-6" />,
      color: "from-teal-500 to-cyan-500",
    },
  ];

  const projects = [
    {
      title: "Stockgenius.ai",
      description:
        "Real-time stock analytics platform with automated financial news scraping and AI-powered insights.",
      tech: ["React", "Tailwind", "Express", "Python"],
      gradient: "from-blue-500 via-purple-600 to-pink-500",
      image:
        "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop",
    },
    {
      title: "Dashboard Application",
      description:
        "Interactive analytics dashboard with stunning data visualizations and real-time updates.",
      tech: ["React", "AWS S3", "Recharts"],
      gradient: "from-emerald-500 via-teal-600 to-cyan-500",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop",
    },
    {
      title: "Forecasting Platform",
      description:
        "Advanced forecasting with machine learning integration and beautiful data presentation.",
      tech: ["React", "Vite", "Tailwind", "SSO"],
      gradient: "from-orange-500 via-red-600 to-pink-600",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop",
    },
    {
      title: "Chatbot Application",
      description:
        "Intelligent chatbot with natural language processing and persistent conversation history.",
      tech: ["React", "Node.js", "AWS S3"],
      gradient: "from-pink-500 via-rose-600 to-red-500",
      image:
        "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&auto=format&fit=crop",
    },
    {
      title: "Document Generator",
      description:
        "Rich text editor with collaborative features and instant cloud synchronization.",
      tech: ["React", "Tiptap", "AWS S3"],
      gradient: "from-indigo-500 via-blue-600 to-purple-600",
      image:
        "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop",
    },
    {
      title: "Testmate",
      description:
        "Comprehensive test management with seamless Jira integration and automated workflows.",
      tech: ["React", "Jira API", "Jenkins"],
      gradient: "from-violet-500 via-purple-600 to-fuchsia-600",
      image:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-black text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Floating Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg z-50 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SP
            </div>
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8">
              {["home", "about", "projects", "contact"].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className={`capitalize transition-colors ${
                    activeSection === item
                      ? "text-blue-600 dark:text-blue-400 font-semibold"
                      : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {darkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </motion.button>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 rounded-lg bg-gray-200 dark:bg-gray-800"
              >
                {menuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <div className="px-4 py-4 space-y-3">
              {["home", "about", "projects", "contact"].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="block w-full text-left px-4 py-2 rounded-lg capitalize hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>
      {/* Hero Section */}
      <section
        id="home"
        className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center space-y-8">
            {/* --- REPLACED STATIC DIV WITH 3D COMPONENT --- */}
            <div className="w-56 h-56 mx-auto">
              <Hero3D />
            </div>
            {/* --- END REPLACEMENT --- */}

            <h1 className="text-5xl sm:text-7xl font-bold">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Shravan Gowda Patil
              </span>
            </h1>
            <p className="text-2xl sm:text-3xl text-gray-600 dark:text-gray-400 font-light">
              Full Stack Developer
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Building scalable web applications with React, Node.js, and AWS.
              Passionate about creating intuitive user experiences and robust
              backend solutions.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <motion.button
                onClick={() => scrollToSection("projects")}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-2xl transition-shadow duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Projects
              </motion.button>
              <motion.button
                onClick={() => scrollToSection("contact")}
                className="px-8 py-3 border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 rounded-full font-semibold hover:bg-blue-600 hover:text-white dark:hover:bg-blue-400 dark:hover:text-gray-900 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Me
              </motion.button>
            </div>
            <div className="flex justify-center space-x-6 pt-8">
              <motion.a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-gray-200 dark:bg-gray-800 rounded-full hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-colors duration-300"
                whileHover={{ scale: 1.2, rotate: 10 }}
              >
                <FaGithub className="w-6 h-6" />
              </motion.a>
              <motion.a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-gray-200 dark:bg-gray-800 rounded-full hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-colors duration-300"
                whileHover={{ scale: 1.2, rotate: -10 }}
              >
                <FaLinkedin className="w-6 h-6" />
              </motion.a>
              <motion.a
                href="mailto:patilchau@gmail.com"
                className="p-3 bg-gray-200 dark:bg-gray-800 rounded-full hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-colors duration-300"
                whileHover={{ scale: 1.2 }}
              >
                <BiLogoGmail className="w-6 h-6" />
              </motion.a>
            </div>
          </div>
        </div>
      </section>
      {/* About Section */}
      <section
        id="about"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900/50"
      >
        <motion.div
          className="max-w-7xl mx-auto"
          variants={sectionFadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              About Me
            </span>
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Full Stack Developer with over 2+ years of experience at Sweet
                Design Hub, specializing in building and deploying scalable web
                applications. I transform Figma designs into responsive,
                pixel-perfect interfaces while architecting robust backend
                solutions.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                My expertise spans the entire development lifecycle, from
                creating modular React components to implementing optimized
                database schemas and deploying to cloud platforms like AWS and
                Azure.
              </p>
              <div className="pt-4">
                <h3 className="text-xl font-semibold mb-4">Education</h3>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 p-6 rounded-xl">
                  <p className="font-semibold text-lg">
                    Bachelor of Engineering - Computer Science
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Dayananda Sagar College of Engineering
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    2014 - 2018, Bengaluru
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-8 text-center">
                Tech Stack
              </h3>
              <motion.div
                className="grid grid-cols-2 gap-4"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                {skills.map((skill, index) => (
                  <motion.div
                    key={index}
                    className="group relative overflow-hidden bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
                    variants={itemFadeInUp}
                    whileHover={{ y: -8, scale: 1.05 }}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${skill.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                    ></div>
                    <div className="relative flex flex-col items-center space-y-3">
                      <div
                        className={`p-3 bg-gradient-to-br ${skill.color} rounded-lg text-white`}
                      >
                        {skill.icon}
                      </div>
                      <p className="font-semibold text-center">{skill.name}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>
      {/* Projects Section */}
      <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-7xl mx-auto"
          variants={sectionFadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Featured Projects
            </span>
          </h2>
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {projects.map((project, index) => (
              <motion.div
                key={index}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
                variants={itemFadeInUp}
                whileHover={{ y: -8, scale: 1.03 }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center"></div>
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-bold">{project.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>
      {/* Contact Section */}
      <section
        id="contact"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900/50"
      >
        <motion.div
          className="max-w-4xl mx-auto"
          variants={sectionFadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Get In Touch
            </span>
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <p className="text-lg text-gray-600 dark:text-gray-400">
                I'm always interested in hearing about new projects and
                opportunities. Whether you have a question or just want to say
                hi, feel free to reach out!
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Mail className="w-6 h-6 text-blue-600" />
                  <a
                    href="mailto:patilchau@gmail.com"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    patilchau@gmail.com
                  </a>
                </div>
                <div className="flex items-center space-x-4">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-400">
                    Bengaluru, Karnataka, India
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <input
                    type="text"
                    name="user_name" // ✅ Required for EmailJS
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="email"
                    name="user_email" // ✅ Required for EmailJS
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  />
                </div>
                <div className="mb-6">
                  <textarea
                    name="message" // ✅ Required for EmailJS
                    placeholder="Your Message"
                    rows="4"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all resize-none"
                  ></textarea>
                </div>
                <motion.button
                  type="submit" // ✅ Important! Don't use onClick here
                  disabled={formStatus === "sending"}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-xl transition-shadow duration-300 disabled:opacity-50"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {formStatus === "sending" ? "Sending..." : "Send Message"}
                </motion.button>
              </form>
              {formStatus === "success" && (
                <div className="p-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-lg text-center animate-pulse">
                  Message sent successfully!
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </section>
      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} Shravan Gowda Patil. All rights
            reserved.
          </p>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-2xl z-40"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronUp className="w-6 h-6" />
        </motion.button>
      )}
    </div>
  );
}
