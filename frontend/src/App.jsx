import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CallPage from "./pages/CallPage";
import DisconnectedPage from "./pages/DisconnectedPage";
import SummaryListPage from "./pages/SummaryListPage";
import SummaryDetailPage from "./pages/SummaryDetailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" elements={<HomePage></HomePage>}></Route>
        <Route path="/call" element={<CallPage></CallPage>}></Route>
        <Route path="/call/disconnect" element={<DisconnectedPage></DisconnectedPage>}></Route>
        <Route path="/summary" element={<SummaryListPage></SummaryListPage>}></Route>
        <Route path="/summary/details" element={<SummaryDetailPage></SummaryDetailPage>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
