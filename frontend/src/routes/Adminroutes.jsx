import { Route, Routes } from "react-router-dom"
import { MenuAdmin } from "../components/navbar/navbar"
import { TablaAdminTodosEstudiantesConAsistencia } from "../components/TablaEstudiantesconAsistencia/TablaAdmin"
import { TablaCentros } from "../components/TablaCentros/Centrostabla"
import { TablaAdminTodosProfesores } from "../components/TablaProfesores/TablaProfesoresTodos"
import { TablaEstudiantesTodos } from "../components/TablaEstudiantesTodos/TablaEstudiantesTodos"
import { TablaAdministradores } from "../components/TablaAdministradores/TablaAdministradores"
import '../assets/fondo.css'
import { TablaEvaluacionesTodosAdmin } from "../components/TablaEvaluacionesTodosAdmin/TablaEvaluacionesTodosAdmin"
export const Adminroutes = () => {
  return (
    <>
        
        <MenuAdmin/>
        <Routes>
           
            <Route path="/Asistencias" element={<TablaAdminTodosEstudiantesConAsistencia/>} />
        <Route path="/Centros" element={<TablaCentros/>} />
        <Route path="/Profesores" element={<TablaAdminTodosProfesores/>} />
        <Route path="/Estudiantes" element={<TablaEstudiantesTodos/>} />
        <Route path="/Administracion" element={<TablaAdministradores/>} />
        <Route path="/Evaluaciones" element={<TablaEvaluacionesTodosAdmin/>} />


        
        
           
       

        

        </Routes>
        
        
        
        
        </>
  )
}
