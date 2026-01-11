import Footer from "../components/Footer";
import Header from "../components/headers/Header";
import Landing from "../components/Landing";
import { useEffect, useState } from "react";
import { getLandingData } from "../api/http";


export default function Landingpage() {
  const [backendStatus, setBackendStatus] = useState<string>("");

  useEffect(() => {
    getLandingData().then((data) => setBackendStatus(data.status)).catch(() => setBackendStatus("Error connecting to backend"));
  })
  return (
    <>
      <Header />
      <Landing backendStatus={backendStatus} />
      <Footer />
    </>
  );
}
