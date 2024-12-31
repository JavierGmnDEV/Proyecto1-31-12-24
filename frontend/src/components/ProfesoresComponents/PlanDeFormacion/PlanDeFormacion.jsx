import { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
    Accordion,
    AccordionItem,
    Divider,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    ModalContent,
    Input,

} from "@nextui-org/react";
import AuthContext from "../../../context/AuthContext";
import { Bounce, toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function PlanesDeFormacion() {
    const { user } = useContext(AuthContext); // Obtén datos del usuario (centro_id y anio)
    const [estudiantes, setEstudiantes] = useState([]);
    const [planesDeFormacion, setPlanesDeFormacion] = useState({});
    const [error, setError] = useState('');
    const [selectedEstudianteId, setSelectedEstudianteId] = useState(null);
    const [selectedPlanId, setSelectedPlanId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [editingActividad, setEditingActividad] = useState(null);
    const [centro, setCentro] = useState(null); // Estado para almacenar los datos del centro

    const [actividadData, setActividadData] = useState({});

    // useDisclosure para el modal de agregar plan
    const { isOpen: isAddPlanModalOpen, onOpen: openAddPlanModal, onClose: closeAddPlanModal } = useDisclosure();
    // useDisclosure para el modal de agregar actividad
    const { isOpen: isAddActividadModalOpen, onOpen: openAddActividadModal, onClose: closeAddActividadModal } = useDisclosure();
    const { isOpen: isEditActividadModalOpen, onOpen: openEditActividadModal, onClose: closeEditActividadModal } = useDisclosure();
    // Petición para obtener los estudiantes
    const fetchEstudiantes = async () => {
        try {
            const response = await axios.get(`http://localhost:4023/estudiantes?centroId=${user.centro_id}&anio=${user.anio}`);
            if (response.data.length === 0) {
                setError('No se encontraron estudiantes.');
            } else {
                setEstudiantes(response.data);
                setFilteredStudents(response.data)
                setError('');
            }
        } catch (error) {
            console.error('Error al obtener los estudiantes:', error);
            setError('Error al obtener los estudiantes. Intenta nuevamente más tarde.');
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        const filtered = estudiantes.filter((student) =>
            student.Nombres.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredStudents(filtered);
    };

    const fetchCentro = async () => {
        try {
            const response = await fetch(`http://localhost:4023/centro/${user.centro_id}`);
            const data = await response.json();
            setCentro(data); // Guardamos los datos del centro en el estado
        } catch (error) {
            console.error("Error al obtener el centro:", error);
        }
    };
    // Petición para obtener el plan de formación de un estudiante
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
            console.error('Error obteniendo el plan de formación:', error);
            setPlanesDeFormacion((prevState) => ({
                ...prevState,
                [estudianteId]: null,
            }));
        }
    };

    useEffect(() => {
        fetchEstudiantes();
        fetchCentro()
    }, [user.centro_id, user.anio]);

    useEffect(() => {
        if (estudiantes.length > 0) {
            estudiantes.forEach((estudiante) => {
                fetchPlanDeFormacion(estudiante.Estudiante_ID);
            });
        }
    }, [estudiantes]);

    // Función para agregar el plan de formación
    const handleAddPlanDeFormacion = async () => {
        const raw = JSON.stringify({
            "añoDirigido": user.anio,
            "profesorId": user.id,
            "centroId": user.centro_id,
        });

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: raw,
        };

        try {
            const response = await fetch(`http://localhost:4023/plan-de-formacion/estudiante/${selectedEstudianteId}`, requestOptions);
       await response.text();
            fetchPlanDeFormacion(selectedEstudianteId);
            closeAddPlanModal(); // Cerrar el modal después de agregar
            fetchEstudiantes()
        } catch (error) {
            console.error('Error al agregar el plan de formación:', error);
        }
    };

    // Función para agregar una actividad
    const handleAddActividad = async () => {
        const raw = JSON.stringify({
            "PlanDeFormacion_ID": selectedPlanId,
            "Estudiante_ID": actividadData.Estudiante_ID,
            "Nombre_Actividades": actividadData.Nombre_Actividades,
            "Año_Dirigido": user.anio,
            "Descripcion": actividadData.Descripcion,
            "Profesor_ID": user.id,
            "Tipo_Evaluacion": actividadData.Tipo_Evaluacion,
            "Tema_A_Evaluar": actividadData.Tema_A_Evaluar,
            "Fecha_Evaluacion": actividadData.Fecha_Evaluacion,
        });

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: raw,
        };

        try {
            const response = await fetch("http://localhost:4023/actividades", requestOptions);
            await response.text();
            
            closeAddActividadModal(); // Cerrar el modal después de agregar
            fetchEstudiantes()
            toast.success('Actividad Agregada', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
        } catch (error) {
            console.error('Error al agregar actividad:', error);
        }
    };


    const confirmDeleteActividad = (ActividaId, nombre) => {
        toast(
            <div>
                <p>{`¿Estás seguro de que quieres eliminar esta ${nombre}?`}</p>
                <div>
                    <button
                        onClick={() => { handleDeleteActividad(ActividaId), toast.dismiss() }}
                        style={{ marginRight: '10px', color: 'black' }}
                    >
                        Confirmar
                    </button>
                    <button
                        onClick={() => toast.dismiss()}  // Dismiss to cancel
                        style={{ color: 'black' }}
                    >
                        Cancelar
                    </button>
                </div>
            </div>,
            {
                position: "bottom-center",
                autoClose: false,  // Evita el cierre automático
                closeOnClick: false,
                hideProgressBar: true
            }
        );
        // Muestra el toast de confirmación

    };

    const handleDeleteActividad = async (actividadId) => {
        const requestOptions = {
            method: 'DELETE',
            redirect: 'follow',
        };

        try {
            const response = await fetch(`http://localhost:4023/actividades/${actividadId}`, requestOptions);
            if (response.ok) {
                
                // Actualizar la lista de estudiantes y actividades después de eliminar
                fetchEstudiantes();
            } else {
                console.error(`Error al eliminar la actividad ${actividadId}:`, response.statusText);
            }
        } catch (error) {
            console.error('Error al realizar la solicitud DELETE:', error);
        }
    };
    const handleEditActividad = (actividad) => {
        setEditingActividad(actividad);
        openEditActividadModal();
    };
    const handleSaveActividad = async () => {
        try {
            const response = await axios.put(`http://localhost:4023/actividades/${editingActividad.Actividades_ID}`, editingActividad);
            if (response.status === 200) {
               
                closeEditActividadModal();
                fetchEstudiantes(); // Actualizar los datos
                toast.success('Actividad actualizada', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                });
            }
        } catch (error) {
            console.error("Error al actualizar la actividad:", error);
        }
    };


    const validateField = (name, value) => {
        let message = "";
        let isValid = false;
    
        // Obtener la fecha de hoy como Date y establecer la hora en 00:00
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Setear la hora a 00:00 para comparar solo las fechas
    
        // Convertir el valor del input a Date
        const fechaEvaluacion = new Date(value); 
        fechaEvaluacion.setHours(0, 0, 0, 0); // También setear la hora a 00:00
    
     
    
        switch (name) {
            case "Fecha_Evaluacion":
                if (!value) {
                    message = "La fecha de evaluación es obligatoria.";
                    isValid=false
                } else if (fechaEvaluacion < today) {
                    isValid=false
                    message = "La fecha no puede ser una fecha pasada.";
                } else {
                    isValid = true;
                }
                break;
            default:
                break;
        }
    
        return { message, isValid };
    };
    
    
    const [fieldMessages, setFieldMessages] = useState({});
    const [fieldValidity, setFieldValidity] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const { message, isValid } = validateField(name, value);
    
       
    
        setFieldMessages((prev) => ({ ...prev, [name]: message }));
        setFieldValidity((prev) => ({ ...prev, [name]: isValid }));
    };
    

    return (
        <div className="background-image-blue flex flex-col items-center h-screen p-9">
            <div className="flex justify-between items-center w-full max-w-6xl m-3">
                <div className="flex justify-between items-center w-full max-w-4xl m-2">
                    <Input
                        clearable
                        placeholder="Buscar..."
                        className="w-60"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
            </div>

            <Divider className="my-1" />
            {/* Nombre del Centro */}
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
                        <div>{error}</div> // Si hay un error, lo mostramos
                    ) : (
                        filteredStudents.map((estudiante) => {
                            const plan = planesDeFormacion[estudiante.Estudiante_ID];
                            if (!plan) {
                                return (
                                    <AccordionItem key={estudiante.Estudiante_ID} title={`No se ha encontrado el plan de formación para el Estudiante: ${estudiante.Nombres} ${estudiante.Apellidos} ID: ${estudiante.Estudiante_ID}`}>

                                        <Button onPress={() => { setSelectedEstudianteId(estudiante.Estudiante_ID); openAddPlanModal(); }}>
                                            Agregar Plan
                                        </Button>
                                    </AccordionItem>
                                );
                            }

                            return (
                                <AccordionItem key={estudiante.Estudiante_ID} title={`Estudiante: ${estudiante.Nombres} ${estudiante.Apellidos} ID: ${estudiante.Estudiante_ID}`}>
                                    {plan === null ? (
                                        'No hay planes de formación disponibles para este estudiante.'
                                    ) : (
                                        <>

                                            {plan.actividades && plan.actividades.length > 0 ? (
                                                <Accordion variant="shadow" className="m-2">

                                                    {plan.actividades.map((actividad) => (

                                                        <AccordionItem
                                                            key={actividad.Actividades_ID}
                                                            aria-label={actividad.Nombre_Actividades}
                                                            title={(actividad.Nombre_Actividades)}

                                                        >
                                                            <p>{actividad.Descripcion}</p>
                                                            <div className="flex justify-end">
                                                                <Button color="warning" variant="light" onPress={() => handleEditActividad(actividad)}>Editar</Button>
                                                                <Button color="danger" variant="light"
                                                                    onPress={() => {
                                                                        confirmDeleteActividad(actividad.Actividades_ID, "Actividad")

                                                                    }}
                                                                >
                                                                    Eliminar Actividad
                                                                </Button>
                                                            </div>

                                                        </AccordionItem>
                                                    ))}
                                                </Accordion>
                                            ) : (

                                                <div >

                                                    <p>No hay actividades en este plan de formación.</p>

                                                </div>
                                            )}

                                            <div className="flex justify-end">

                                                <Button color="primary" variant="flat"
                                                    onPress={() => {
                                                        setSelectedPlanId(plan.PlanDeFormacion_ID);
                                                        openAddActividadModal(); setActividadData({ ...actividadData, Estudiante_ID: estudiante.Estudiante_ID })
                                                    }}
                                                >
                                                    Agregar Actividad
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </AccordionItem>
                            );
                        })
                    )}
                </Accordion>
            </div>

            {/* Modal para agregar el plan de formación */}
            <Modal isOpen={isAddPlanModalOpen} onOpenChange={closeAddPlanModal}>
                <ModalContent>
                    {

                        (closeAddPlanModal) => (
                            <>
                                <ModalHeader>Agregar Plan de Formación</ModalHeader>
                                <ModalBody>
                                    <form onSubmit={(e) => { e.preventDefault(); handleAddPlanDeFormacion(); }}>
                                        <div>
                                            <label>Año Dirigido:</label>
                                            <Input
                                                type="text"
                                                value={user.anio}
                                                readOnly
                                            />
                                        </div>
                                        <div>
                                            <label>Profesor ID:</label>
                                            <Input
                                                type="text"
                                                value={user.id}
                                                readOnly
                                            />
                                        </div>
                                        <div>
                                            <label>Centro ID:</label>
                                            <Input
                                                type="text"
                                                value={user.centro_id}
                                                readOnly
                                            />
                                        </div>
                                        {/* Mostrar el estudiante seleccionado */}
                                        <div>
                                            <label>Estudiante:</label>
                                            <Input
                                                type="text"
                                                value={selectedEstudianteId} // Usamos el ID del estudiante seleccionado
                                                readOnly
                                            />
                                        </div>
                                    </form>
                                </ModalBody>
                                <ModalFooter>
                                    <Button auto onPress={handleAddPlanDeFormacion}>Guardar</Button>
                                    <Button auto flat onPress={closeAddPlanModal}>Cancelar</Button>
                                </ModalFooter>
                            </>
                        )
                    }
                </ModalContent>
            </Modal>

            {/* Modal para agregar actividad */}
            <Modal isOpen={isAddActividadModalOpen} onOpenChange={closeAddActividadModal}>
                <ModalContent>

                    {
                        (closeAddActividadModal) =>

                        (
                            <>

                                <ModalHeader>Agregar Actividad</ModalHeader>
                                <ModalBody>
                                    <form onSubmit={(e) => { e.preventDefault(); handleAddActividad(); }}>
                                        <div>
                                            <label>Nombre de la Actividad:</label>
                                            <Input
                                                type="text"
                                                value={actividadData.Nombre_Actividades || ""}
                                                onChange={(e) => setActividadData({ ...actividadData, Nombre_Actividades: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label>Descripción:</label>
                                            <Input
                                                value={actividadData.Descripcion || ""}
                                                onChange={(e) => setActividadData({ ...actividadData, Descripcion: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label>Tipo de Evaluación:</label>
                                            <Input
                                                type="text"
                                                value={actividadData.Tipo_Evaluacion || ""}
                                                onChange={(e) => setActividadData({ ...actividadData, Tipo_Evaluacion: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label>Tema a Evaluar:</label>
                                            <Input
                                                type="text"
                                                value={actividadData.Tema_A_Evaluar || ""}
                                                onChange={(e) => setActividadData({ ...actividadData, Tema_A_Evaluar: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label>Fecha de Evaluación:</label>
                                            <Input
                                            name="Fecha_Evaluacion"
                                                type="datetime-local"
                                                value={actividadData.Fecha_Evaluacion || ""}
                                                onChange={(e) => {setActividadData({ ...actividadData, Fecha_Evaluacion: e.target.value });
                                                handleInputChange(e);
                                            
                                            
                                            }}
                                                color={
                                                    fieldValidity.Fecha_Evaluacion === true
                                                        ? "success"
                                                        : fieldValidity.Fecha_Evaluacion === false
                                                            ? "danger"
                                                            : "default"
                                                }
                                            />
                                            <small className="text-red-500">{fieldMessages.Fecha_Evaluacion}</small>
                                        </div>
                                    </form>
                                </ModalBody>
                                <ModalFooter>
                                    <Button auto onPress={handleAddActividad}>Guardar</Button>
                                    <Button auto flat onPress={closeAddActividadModal}>Cancelar</Button>
                                </ModalFooter>
                            </>
                        )
                    }

                </ModalContent>
            </Modal>
            {/* Modal para editar actividad */}
            <Modal isOpen={isEditActividadModalOpen} onOpenChange={closeEditActividadModal}>
                <ModalContent>
                    {closeEditActividadModal => (
                        <>
                            <ModalHeader>Editar Actividad</ModalHeader>
                            <ModalBody>
                                <div>
                                    <label>Nombre de la Actividad:</label>
                                    <Input
                                        type="text"
                                        value={editingActividad?.Nombre_Actividades || ""}
                                        onChange={(e) =>
                                            setEditingActividad({ ...editingActividad, Nombre_Actividades: e.target.value })
                                        }
                                    />
                                </div>
                                <div>
                                    <label>Descripción:</label>
                                    <Input
                                        type="text"
                                        value={editingActividad?.Descripcion || ""}
                                        onChange={(e) =>
                                            setEditingActividad({ ...editingActividad, Descripcion: e.target.value })
                                        }
                                    />
                                </div>



                            </ModalBody>
                            <ModalFooter>
                                <Button auto onPress={handleSaveActividad}>Guardar</Button>
                                <Button auto flat onPress={closeEditActividadModal}>Cancelar</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <ToastContainer />
        </div>
    );
}
