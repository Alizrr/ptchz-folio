import { Routes, Route, Navigate } from "react-router-dom";

// Public
import Layout from "./pages/Layout";
import About from "./pages/About";
import Resume from "./pages/Resume";
import Publications from "./pages/Publications";
import Experience from "./pages/Experience";
import Teaching from "./pages/Teaching";
import Skills from "./pages/Skills";
import Awards from "./pages/Awards";
import Contact from "./pages/Contact";

// Admin
import Login from "./admin/Login";
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/Dashboard";
import ProfileEditor from "./admin/ProfileEditor";
import Customize from "./admin/Customize";
import Account from "./admin/Account";
import CrudManager from "./admin/CrudManager";

export default function App() {
  return (
    <Routes>
      {/* Public site */}
      <Route path="/" element={<Layout />}>
        <Route index element={<About />} />
        <Route path="resume" element={<Resume />} />
        <Route path="publications" element={<Publications />} />
        <Route path="experience" element={<Experience />} />
        <Route path="teaching" element={<Teaching />} />
        <Route path="skills" element={<Skills />} />
        <Route path="awards" element={<Awards />} />
        <Route path="contact" element={<Contact />} />
      </Route>

      {/* Admin login */}
      <Route path="/admin" element={<Login />} />

      {/* Protected admin area */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<ProfileEditor />} />
        <Route path="customize" element={<Customize />} />
        <Route path="news" element={<CrudManager section="news" />} />
        <Route path="education" element={<CrudManager section="education" />} />
        <Route path="publications" element={<CrudManager section="publications" />} />
        <Route path="experience" element={<CrudManager section="experience" />} />
        <Route path="projects" element={<CrudManager section="projects" />} />
        <Route path="teaching" element={<CrudManager section="teaching" />} />
        <Route path="students" element={<CrudManager section="students" />} />
        <Route path="skills" element={<CrudManager section="skills" />} />
        <Route path="certifications" element={<CrudManager section="certifications" />} />
        <Route path="languages" element={<CrudManager section="languages" />} />
        <Route path="awards" element={<CrudManager section="awards" />} />
        <Route path="account" element={<Account />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
