import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Accordion, AccordionItem, Divider, Input } from "@nextui-org/react";
import AuthContext from "../../../context/AuthContext";
import "react-toastify/dist/ReactToastify.css";

export default function EstudiantePlanDeFormacion() {
    const { user } = useContext(AuthContext);
    const [estudiantes, setEstudiantes] = useState(null); // Un único estudiante
    const [planesDeFormacion, setPlanesDeFormacion] = useState({});
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [centro, setCentro] = useState(null);

    // Petición para obtener el estudiante
    const fetchEstudiantes = async () => {
        try {
            const response = await axios.get(`http://localhost:4023/estudiantes/${user.id}`);
            
            setEstudiantes(response.data);
            setFilteredStudents([response.data]); // Envolvemos el objeto en un array
            setError('');
        } catch (error) {
            console.error('Error al obtener el estudiante:', error);
            setError('Error al obtener el estudiante. Intenta nuevamente más tarde.');
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);

        if (
            estudiantes &&
            (estudiantes.Nombres?.toLowerCase().includes(value) ||
                estudiantes.Apellidos?.toLowerCase().includes(value))
        ) {
            setFilteredStudents([estudiantes]);
        } else {
            setFilteredStudents([]);
        }
    };

    const fetchCentro = async () => {
        try {
            const response = await axios.get(`http://localhost:4023/centro/${user.centro_id}`);
            setCentro(response.data);
        } catch (error) {
            console.error("Error al obtener el centro:", error);
        }
    };

    const fetchPlanDeFormacion = async (estudianteId) => {
        try {
            const response = await fetch(`http://localhost:4023/plan-de-formacion/${estudianteId}`);
            if (response.status === 404) {
                setPlanesDeFormacion((prevState) => ({
                    ...prevState,
                    [estudianteId]: null,
                }));
            } else {
                const result = await response.json();
                setPlanesDeFormacion((prevState) => ({
                    ...prevState,
                    [estudianteId]: result || null,
                }));
            }
        } catch (error) {
            console.error("Error obteniendo el plan de formación:", error);
            setPlanesDeFormacion((prevState) => ({
                ...prevState,
                [estudianteId]: null,
            }));
        }
    };

    useEffect(() => {
        fetchEstudiantes();
        fetchCentro();
    }, [user.centro_id, user.anio]);

    useEffect(() => {
        if (estudiantes) {
            fetchPlanDeFormacion(estudiantes.Estudiante_ID);
        }
    }, [estudiantes]);

    return (
        <div className="background-image-blue flex flex-col items-center h-screen p-9">
            <div className="flex justify-between items-center w-full max-w-6xl m-3">
                <Input
                    clearable
                    placeholder="Buscar..."
                    className="w-60"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>

            <Divider className="my-1" />

            {centro && (
                <div className="w-full max-w-7xl text-center my-2">
                    <h2 className="text-xl font-bold">Centro: {centro.Nombre}</h2>
                    <p>{centro.Descripcion} - {centro.Lugar}</p>
                </div>
            )}

            <Divider className="my-2" />

            <div className="w-full max-w-7xl p-2 overflow-x-auto overflow-y-auto" style={{ marginTop: "20px" }}>
            <Accordion variant="shadow">
    {error ? (
        <AccordionItem title="Error">
            <p>{error}</p>
        </AccordionItem>
    ) : filteredStudents.length > 0 ? (
        filteredStudents.map((estudiante) => {
            const plan = planesDeFormacion[estudiante.Estudiante_ID];
            return (
                <AccordionItem
                    key={estudiante.Estudiante_ID}
                    title={`Estudiante: ${estudiante.Nombres} ${estudiante.Apellidos}`}
                >
                    {plan ? (
                        plan.actividades.length > 0 ? (
                            <Accordion>
                                {plan.actividades.map((actividad) => (
                                    <AccordionItem
                                        key={actividad.Actividades_ID}
                                        title={actividad.Nombre_Actividades}
                                    >
                                        <p>{actividad.Descripcion}</p>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        ) : (
                            <p>No hay actividades en este plan de formación.</p>
                        )
                    ) : (
                        "No hay planes de formación disponibles para este estudiante."
                    )}
                </AccordionItem>
            );
        })
    ) : (
        <AccordionItem title="Sin resultados">
            <p>No hay estudiantes que coincidan con la búsqueda.</p>
        </AccordionItem>
    )}
</Accordion>

            </div>
        </div>
    );
}
