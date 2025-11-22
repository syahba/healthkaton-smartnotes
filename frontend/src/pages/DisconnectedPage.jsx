import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Button from "../components/Button";

function DisconnectedPage() {
  const navigate = useNavigate();
  const dispacth = useDispa

  const handleSummary = () => {
    navigate('/summary')
  }

  return (
    <div className="h-full flex flex-col">
      <Header text={"Care Center 165"}></Header>

      <div className="flex flex-col justify-evenly  items-center h-full">
        <div className="flex flex-col justify-center items-center gap-4">
          <FontAwesomeIcon
            icon={faPhone}
            transform={{ rotate: 132 }}
            className="text-4xl text-[var(--primary)] outline-3 outline-[var(--primary)] px-4 py-5 rounded-full"
          />
          <div className="flex flex-col justify-center items-center">
            <h3 className="heading text-[var(--neutral)]">Panggilan Berakhir</h3>
            <p className="text-[var(--disabled)] paragraph">Panggilan dan koneksi Anda telah berakhir</p>
          </div>
        </div>

        <Button text={'Lihat Ringkasan'} onClick={handleSummary}></Button>
      </div>
    </div>
  );
}

export default DisconnectedPage;