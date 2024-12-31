import { Route, Routes } from "react-router-dom"
import { EstudiantesNavbar } from "../components/EstudiantesComponents/EstudiantesNavbar"
import { EstudiantesAsistencias } from "../components/EstudiantesComponents/EstudiantesAsistencias/EstudiantesAsistencias"
import { EstudiantesEstudiantes } from "../components/EstudiantesComponents/EstudiantesEstudiantes/EstudiantesEstudiantes"
import { EstudiantesEventos } from "../components/EstudiantesComponents/EstudiantesEventos/EstudiantesEventos"
import { EstudiantesNotas } from "../components/EstudiantesComponents/EstudiantesNotas/EstudiantesNotas"
import EstudiantePlanDeFormacion from "../components/EstudiantesComponents/EstudiantePlanDeFormacion/EstudiantePlanDeFormacion"

export const Estudianteroutes = () => {
  return (
    <div>

      <EstudiantesNavbar/>
    
    <Routes>
       
    <Route path="/Plan" element={<EstudiantePlanDeFormacion/>} />
    <Route path="/Notas" element={<EstudiantesNotas/>} />
    <Route path="/Asistencias" element={<EstudiantesAsistencias/>} />
    <Route path="/Eventos" element={<EstudiantesEventos/>} />
    <Route path="/Estudiantes" element={<EstudiantesEstudiantes/>} />


   
   

  

    </Routes>
    </div>
    
  )
}
