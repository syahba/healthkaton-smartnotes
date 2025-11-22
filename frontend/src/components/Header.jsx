import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

function Header({ text }) {
  const navigate = useNavigate();

  return (
    <div className="h-18 w-full bg-[linear-gradient(to_right,#68E7FF_0%,#3992E5_25%,#D146CB_75%,#C9448A_100%)] flex items-center justify-center relative">
      <p className="text-[var(--paragraph)] text-white font-bold text-center">{text}</p>
      <button className="absolute top-6 left-6 cursor-pointer" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} style={{color: "#FFF"}} />
      </button>
    </div>
  );
}

export default Header;