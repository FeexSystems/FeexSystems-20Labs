import "./global.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import IndexTest from "./pages/IndexTest";

const App = () => (
  <div className="dark">
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IndexTest />} />
        <Route path="*" element={<IndexTest />} />
      </Routes>
    </BrowserRouter>
  </div>
);

export default App;
