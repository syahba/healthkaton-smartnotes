import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faHeadset, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import Button from "./Button";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function Card({ data, isDetail }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSummary = () => {
    // dispatch();
    navigate("/summary/1");
  };

  return (
    <div className={`bg-white shadow-lg rounded-xl w-80 p-3 ${isDetail && 'absolute top-18 left-8'}`}>
      <div className={`flex justify-between items-start ${isDetail ? 'mb-5' : 'mb-1'}`}>
        <p className="label text-[var(--neutral)] font-bold max-w-44">
          Cara reaktivasi BPJS
        </p>
        <p className="caption text-[var(--disabled)]">10 Nov 2025, 14:25</p>
      </div>

      <div className={isDetail ? 'flex justify-between items-end' : 'flex flex-col gap-4'}>
        <div className="text-[var(--neutral)]">
          <div className="flex items-center gap-1">
            <FontAwesomeIcon icon={faHeadset} />
            <p className="paragraph">Erland</p>
          </div>

          {isDetail && (
            <div className="flex items-center gap-1">
              <FontAwesomeIcon icon={faUser} />
              <p className="paragraph">Morrissey</p>
            </div>
          )}
        </div>

        <div
          className={`flex items-center ${
            isDetail ? "justify-end" : "justify-between"
          }`}
        >
          <div className="text-[var(--neutral)] flex items-center gap-1">
            <FontAwesomeIcon icon={faCircleCheck} className="text-[#1EAD2E]" />
            <p className="paragraph">Selesai</p>
          </div>

          <div className={isDetail ? "hidden" : ""}>
            <Button
              text={"Selengkapnya"}
              onClick={handleSummary}
              isSmall={true}
            ></Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
