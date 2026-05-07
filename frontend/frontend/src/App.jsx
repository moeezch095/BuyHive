import { BrowserRouter } from "react-router-dom";
// import SearchBarr from "../src/components/SearchCategoiesDropdown";
import AppRoutes from "./routes/AppRoute";


function App() {
  return (
  <BrowserRouter>
    {/* <SearchBarr /> */}
  <AppRoutes/>
  </BrowserRouter>
  );
}

export default App;