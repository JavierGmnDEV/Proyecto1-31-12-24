import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Adminroutes } from "./routes/Adminroutes"
import { ProfesorRoutes } from "./routes/ProfesorRoutes"
import { AuthProvider } from './context/AuthContext'; 
import Login from "./routes/Loginroute";
import { Estudianteroutes } from "./routes/Estudianteroutes";


function App() {
 

  return (
    <>
    <BrowserRouter>
    <AuthProvider>
    <Routes>
    <Route path="/Admin/*" element={<Adminroutes/>} />
    <Route path="/Profesor/*" element={ <ProfesorRoutes/>} />
    <Route path="/Estudiantes/*" element={ <Estudianteroutes/>} />

    <Route path="/*" element={ <Login/>} />
   
   
    </Routes>
    </AuthProvider>

    </BrowserRouter>
    </>
  )
}

export default App
