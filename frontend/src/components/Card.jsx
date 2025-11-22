import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faHeadset, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

function Card({ data, isDetail }) {
  const navigate = useNavigate();

  const handleSummary = () => {
    navigate(`/summary/${data._id}`);
  };

  return (
    <div className={`bg-white shadow-lg rounded-xl w-80 p-3 ${isDetail && 'absolute top-18 left-8'}`}>
      <div className={`flex justify-between items-start ${isDetail ? 'mb-5' : 'mb-1'}`}>
        <p className="label text-[var(--neutral)] font-bold max-w-44">
          {data.topic}
        </p>
        <p className="caption text-[var(--disabled)]">{data.datetime}</p>
      </div>

      <div className={isDetail ? 'flex justify-between items-end' : 'flex flex-col gap-4'}>
        <div className="text-[var(--neutral)]">
          <div className="flex items-center gap-1">
            <FontAwesomeIcon icon={faHeadset} />
            <p className="paragraph">{data.csName}</p>
          </div>

          {isDetail && (
            <div className="flex items-center gap-1">
              <FontAwesomeIcon icon={faUser} />
              <p className="paragraph">{data.customerName}</p>
            </div>
          )}
        </div>

        <div
          className={`flex items-center ${
            isDetail ? "justify-end" : "justify-between"
          }`}
        >
          {data.isFinished && (<div className="text-[var(--neutral)] flex items-center gap-1">
            <FontAwesomeIcon icon={faCircleCheck} className="text-[#1EAD2E]" />
            <p className="paragraph">Selesai</p>
          </div>)}

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
