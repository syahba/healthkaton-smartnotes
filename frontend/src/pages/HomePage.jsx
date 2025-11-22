import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faHeadset } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function HomePage() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleMenu = () => {
    if (!isOpen) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <div
      className="relative w-full h-screen bg-cover bg-center flex justify-center items-center"
      style={{ backgroundImage: `url('home.svg')` }}
    >
      <div className="absolute right-0 top-20 flex flex-row-reverse gap-2">
        <button
          onClick={handleMenu}
          className="cursor-pointer hover:scale-105 transition-all duration-300"
        >
          <img src="./cs-profile.svg" alt="floating-button"></img>
        </button>

        {isOpen && (
          <div className="flex flex-col gap-2">
            <button
              onClick={() => navigate("/call")}
              className="bg-white shadow-md py-2 px-2.5 rounded-full cursor-pointer hover:bg-[var(--primary-lighter)] hover:scale-105 transition-all duration-300"
            >
              <FontAwesomeIcon icon={faHeadset} />
            </button>
            <button
              onClick={() => navigate("/summary")}
              className="bg-white shadow-md py-2 px-2.5 rounded-full cursor-pointer hover:bg-[var(--primary-lighter)] hover:scale-105 transition-all duration-300"
            >
              <FontAwesomeIcon icon={faBook} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
