import { useDispatch, useSelector } from "react-redux";
import Card from "../components/Card";
import Checklist from "../components/Checklist";
import Header from "../components/Header";
import { useEffect } from "react";
import { fetchSummaryDetail } from "../redux/summarySlice";
import { useParams } from "react-router-dom";

function SummaryDetailPage() {
  const dispatch = useDispatch();
  const { id } = useParams();
  
  const { loading, error, summaryDetail } = useSelector((state) => state.summary);

  useEffect(() => {
    dispatch(fetchSummaryDetail(id))
  }, [summaryDetail])

  if (summaryDetail) {
    return (
      <div className="h-full flex flex-col relative overflow-auto">
        <Header text={"Ringkasan Panggilan"} isDetail={true}></Header>
  
        <Card data={summaryDetail} isDetail={true}></Card>
        <div className="flex flex-col h-full pt-32 mx-8 gap-3">
          <div className="text-[var(--neutral)] flex flex-col gap-2">
            <h1 className="heading">Ringkasan Percakapan</h1>
            <p className="paragraph text-justify">
              {summaryDetail.summary}
            </p>
          </div>
  
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <h1 className="heading text-[var(--neutral)]">Tindak Lanjut</h1>
              {/* <p className="caption text-[var(--disabled)]">{summaryDetail.progress}% Selesai</p> */}
            </div>
  
            <div className="flex flex-col gap-2">
              {summaryDetail.steps.map(v => (
                <Checklist data={v}></Checklist>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SummaryDetailPage;
