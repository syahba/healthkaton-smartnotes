import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";

function CallPage() {
  const navigate = useNavigate();
  const [isRinging, setIsRinging] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3);
  const [duration , setDuration] = useState(0);
  const [timer, setTimer] = useState('00:00');

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsRinging(true);
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft == 0) {
      const interval = setInterval(() => {
        setDuration(prevSeconds => prevSeconds + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timeLeft]);

  useEffect(() => {
    const time = formatDuration(duration);
    setTimer(time);
  }, [duration])

  const formatDuration = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
  };

  return (
    <div className="h-full flex flex-col">
      <Header text={"Care Center 165"}></Header>

      <div className="flex flex-col justify-evenly  items-center h-full">
        <div className="flex flex-col justify-center items-center gap-4">
          <FontAwesomeIcon
            icon={faUser}
            style={{ color: "var(--primary)" }}
            className="text-4xl outline-3 outline-[var(--primary)] py-5 px-4 rounded-full"
          />
          <div className="flex flex-col justify-center items-center">
            <h3 className="heading text-[var(--neutral)]">Call Center 165</h3>
            <p className="text-[var(--disabled)] paragraph">{isRinging ? timer : 'Calling...'}</p>
          </div>
        </div>

        <button onClick={() => navigate('/call/disconnect')} className="text-white bg-[#EA364C] px-3 py-4 rounded-full shadow-2xl cursor-pointer hover:bg-white hover:outline-3 hover:outline-[#EA364C] hover:text-[#EA364C] transition-all duration-300">
          <FontAwesomeIcon
            icon={faPhone}
            transform={{ rotate: 132 }}
            className="text-4xl"
          />
        </button>
      </div>
    </div>
  );
}

export default CallPage;
