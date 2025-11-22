import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faPhone } from "@fortawesome/free-solid-svg-icons";
import Header from "../components/Header";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchSummaries } from "../redux/summarySlice";

function SummaryListPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, summaryList } = useSelector((state) => state.summary);

  useEffect(() => {
    dispatch(fetchSummaries())
  }, [summaryList]);

  console.log(summaryList, loading);
  return (
    <div className="h-full flex flex-col">
      <Header text={"List Ringkasan"}></Header>

      <div className="flex flex-col h-full items-center">
        <h1 className="heading text-[var(--neutral)] my-5">
          Ringkasan Panggilan CS
        </h1>

        {/* <div className="relative">
          <input
            type="text"
            placeholder="Cari berdasarkan topic"
            className="w-72 py-1.5 pr-4 pl-9 rounded-full bg-white shadow-md"
          />
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="absolute left-2 top-2.5 text-[#a7a7a7]"
          />
        </div> */}

        
        <div className={`flex flex-col justify-evenly items-center h-full hidden `}>
          <div className="flex flex-col justify-center items-center gap-4">
            <FontAwesomeIcon
              icon={faPhone}
              className="text-6xl text-[var(--primary)] rounded-full"
            />
            <div className="flex flex-col justify-center items-center">
              <h3 className="heading text-[var(--neutral)]">
                Belum Ada Panggilan
              </h3>
              <p className="text-[var(--disabled)] paragraph">
                Lakukan panggilan dengan Customer Service
              </p>
            </div>
          </div>

          <Button
            text={"Mulai Panggilan CS"}
            onClick={() => navigate("/call")}
          ></Button>
        </div>

        <div className="flex flex-col gap-4">
          {summaryList.map(v => (
            <Card data={v}></Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SummaryListPage;
