import {  Route, Routes } from "react-router-dom"
import { ProfesorNavbar } from "../components/ProfesoresComponents/ProfesorNavbar/ProfesorNavbar"
import { ProfesorNotas } from "../components/ProfesoresComponents/ProfesorNotas/ProfesorNotas"
import { ProfesorAsistencias } from "../components/ProfesoresComponents/ProfesorAsistencias.jsx/ProfesorAsistencias"
import { ProfesorEstudiantes } from "../components/ProfesoresComponents/ProfesorEstudiantes/ProfesorEstudiantes"
import { ProfesorEventos } from "../components/ProfesoresComponents/ProfesorEventos/ProfesorEventos"
import { ProfesorEvaluacion } from "../components/ProfesoresComponents/ProfesorEvaluacion/ProfesorEvaluacion"
import PlanesDeFormacion from "../components/ProfesoresComponents/PlanDeFormacion/PlanDeFormacion"

export const ProfesorRoutes = () => {
  return (
    <div>

    <ProfesorNavbar/>
    <Routes>
       
       
   
    <Route path="/PlanDeClase" element={<PlanesDeFormacion/>} />
    <Route path="/Notas" element={<ProfesorNotas/>} />
    <Route path="/Asistencias" element={<ProfesorAsistencias/>} />
    <Route path="/Estudiantes" element={<ProfesorEstudiantes/>} />
    <Route path="/Eventos" element={<ProfesorEventos/>} />
    <Route path="/Evaluaciones" element={<ProfesorEvaluacion/>} />
    




    
  
    
    </Routes>
    </div>
  )
}
