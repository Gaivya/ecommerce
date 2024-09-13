import { Outlet } from "react-router-dom";
import NavBar from "./Components/NavBar";
import Footer from "./Components/Footer";

export default function App() {
  return (
    <>
      <NavBar />
      <div className=" pt-[139px] lg:pt-[128px]" id="detail">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
