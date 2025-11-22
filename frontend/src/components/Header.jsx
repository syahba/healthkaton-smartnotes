import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

function Header({ text, isDetail = false }) {
  const navigate = useNavigate();

  return (
    <div className={`${isDetail ? 'h-32 rounded-b-[40px]' : 'h-18'} w-full bg-[linear-gradient(to_right,#68E7FF_0%,#3992E5_25%,#D146CB_75%,#C9448A_100%)] shadow-md`}>
      <div className="flex items-center justify-center relative mt-6">
      <p className="text-[var(--paragraph)] text-white font-bold text-center">{text}</p>
      <button className="absolute left-6 cursor-pointer" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} style={{color: "#FFF"}} />
      </button>
      </div>
    </div>
  );
}

export default Header;