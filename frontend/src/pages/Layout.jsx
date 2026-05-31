import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import api from "../lib/api";
import { useLang } from "../context/LangContext";
import Background from "../components/Background";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Loader } from "../components/ui";

export default function Layout() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const loc = useLocation();
  const { lang } = useLang();

  // Re-fetch the profile whenever the language changes so the hero/nav/footer
  // immediately reflect the selected language.
  useEffect(() => {
    api.get("/profile").then(({ data }) => setProfile(data)).finally(() => setLoading(false));
  }, [lang]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [loc.pathname]);

  return (
    <>
      <Background />
      <Navbar profile={profile} />
      <main className="container-x min-h-[60vh] pt-10 sm:pt-14">
        {loading ? <Loader /> : <Outlet context={{ profile }} />}
      </main>
      <Footer profile={profile} />
    </>
  );
}
