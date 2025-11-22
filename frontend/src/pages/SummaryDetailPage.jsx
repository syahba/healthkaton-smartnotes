import Card from "../components/Card";
import Checklist from "../components/Checklist";
import Header from "../components/Header";

function SummaryDetailPage() {
  return (
    <div className="h-full flex flex-col relative">
      <Header text={"Ringkasan Panggilan"} isDetail={true}></Header>

      <Card isDetail={true}></Card>
      <div className="flex flex-col h-full pt-26 mx-8 gap-6">
        <div className="text-[var(--neutral)] flex flex-col gap-2">
          <h1 className="heading">Ringkasan Percakapan</h1>
          <p className="paragraph text-justify">
            Customer ingin tahu cara mendaftar BPJS. CS menjelaskan
            langkah-langkah pendaftaran, yaitu membuka menu pendaftaran, mengisi
            data diri, menunggu OTP, dan mengaktifkan BPJS.
          </p>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <h1 className="heading text-[var(--neutral)]">Tindak Lanjut</h1>
            <p className="caption text-[var(--disabled)]">25% Selesai</p>
          </div>

          <div className="flex flex-col gap-4">
            <Checklist></Checklist>
            <Checklist></Checklist>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SummaryDetailPage;
