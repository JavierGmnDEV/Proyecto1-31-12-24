import { useContext, useEffect, useState } from "react";
import { faAdd, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Accordion, AccordionItem, Button, Divider, Modal, Input, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import AuthContext from "../../../context/AuthContext";
//import { isValidFutureDate, isValidNumberInRange } from "../../../utils/utils";
import 'react-toastify/dist/ReactToastify.css';
import { Bounce, toast, ToastContainer } from "react-toastify";
export const ProfesorPlanDeClase = () => {
  
  const { user,  } = useContext(AuthContext);
  const [planDeClase, setPlanDeClase] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClaseModalOpen, setIsClaseModalOpen] = useState(false);

  // Estados para los modales de edición
  const [isEditTemaModalOpen, setIsEditTemaModalOpen] = useState(false);
  const [isEditClaseModalOpen, setIsEditClaseModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false); // Estado para el modal de añadir plan
  //const [errors, setErrors] = useState({});

  const [newPlanData, setNewPlanData] = useState({
    Año_Dirigido: "",
    Profesor_ID: user.id,
    Centro_ID: user.centro_id ,
  });

  const [temaData, setTemaData] = useState({
    Plan_Clase_ID: 1,
    Nombre_Tema: "",
    Año_Dirigido: "",
    Descripcion: ""
  });
  const [claseData, setClaseData] = useState({
    Tema_ID: 1,
    Asunto: "",
    Fecha: "",
    Descripcion: "",
    Lugar: ""
  });

  // Estados para los datos de edición
  const [temaEditData, setTemaEditData] = useState(null);
  const [claseEditData, setClaseEditData] = useState(null);

  // Fetch inicial de datos desde la API
  useEffect(() => {
    
    fetchPlanDeClase();
  }, []);
  const handleNewPlanInputChange = (e) => {
    const { name, value } = e.target;
    setNewPlanData({ ...newPlanData, [name]: value });
  };
  const fetchPlanDeClase = async () => {
    try {
      const response = await fetch(`http://localhost:4023/plan-de-clase/${user.id}`);
      const result = await response.json();
      setPlanDeClase(result);
    } catch (error) {
      console.error("Error fetching plan de clase:", error);
    }
  };
  // Nueva función para añadir un plan de clase
  const handleAddPlan = async () => {
    try {
      const response = await fetch("http://localhost:4023/plan-de-clase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPlanData),
      });
      const result = await response.json();
      
      setIsPlanModalOpen(false);
      setPlanDeClase((prev) => [...prev, result]); // Actualizar la lista de planes
      setNewPlanData({ Año_Dirigido: "", Profesor_ID: 4, Centro_ID: 3 }); // Resetear campos del formulario
    } catch (error) {
      console.error("Error agregando plan de clase:", error);
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTemaData({ ...temaData, [name]: value });
  };

  const handleClaseInputChange = (e) => {
    const { name, value } = e.target;
    
    setClaseData({ ...claseData, [name]: value });
  };

  // Función para enviar el nuevo tema
  const handleAddTema = async () => {
    try {
      const response = await fetch("http://localhost:4023/tema", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(temaData),
      });
       await response.json();
      
      setIsModalOpen(false);
      setTemaData({ Plan_Clase_ID: 1, Nombre_Tema: "", Año_Dirigido: "", Descripcion: "" });
      fetchPlanDeClase();
      toast.success('Tema agregado', {
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
      console.error("Error agregando tema:", error);
    }
  };

  // Función para enviar la nueva clase
  const handleAddClase = async () => {
    try {
      const response = await fetch("http://localhost:4023/clase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(claseData),
      });
       await response.json();
      
      setIsClaseModalOpen(false);
      setClaseData({ Tema_ID: 1, Asunto: "", Fecha: "", Descripcion: "", Lugar: "" });
      fetchPlanDeClase();
    } catch (error) {
      console.error("Error agregando clase:", error);
    }
  };

  // Función para eliminar un tema
  const handleDeleteTema = async (temaId) => {
    try {
      const response = await fetch(`http://localhost:4023/tema/${temaId}`, {
        method: "DELETE",
      });
      await response.text();
      
      // Actualizar el estado para reflejar la eliminación del tema
      fetchPlanDeClase();
    } catch (error) {
      console.error("Error eliminando tema:", error);
    }
  };


  const confirmDeletTema = (temaId,nombre) => {
    toast(
      <div>
        <p>{`¿Estás seguro de que quieres eliminar esta ${nombre}?`}</p>
        <div>
          <button
            onClick={() => {handleDeleteTema(temaId),toast.dismiss()}}
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

 

  // Función para eliminar una clase
  const handleDeleteClase = async (claseId, ) => {
    try {
      const response = await fetch(`http://localhost:4023/clase/${claseId}`, {
        method: "DELETE",
      });
      await response.text();
      
      // Actualizar el estado para reflejar la eliminación de la clase
      fetchPlanDeClase();
    } catch (error) {
      console.error("Error eliminando clase:", error);
    }
  };
  const confirmDeleteClase = (ClaseId,nombre) => {
    toast(
      <div>
        <p>{`¿Estás seguro de que quieres eliminar este ${nombre}?`}</p>
        <div>
          <button
            onClick={() => {handleDeleteClase(ClaseId),toast.dismiss()}}
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
  // Lógica de edición de tema
  const openEditTemaModal = (tema) => {
    setTemaEditData(tema);
    setIsEditTemaModalOpen(true);
  };

  const handleEditTemaInputChange = (e) => {
    const { name, value } = e.target;
    setTemaEditData({ ...temaEditData, [name]: value });
  };

  const handleEditTema = async () => {
    try {
      const response = await fetch(`http://localhost:4023/tema/${temaEditData.Tema_ID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(temaEditData),
      });
       await response.json();
      
      setIsEditTemaModalOpen(false);
      fetchPlanDeClase();
    } catch (error) {
      console.error("Error editando tema:", error);
    }
  };

  // Lógica de edición de clase
  const openEditClaseModal = (clase) => {
    setClaseEditData(clase);
    setIsEditClaseModalOpen(true);
  };

  const handleEditClaseInputChange = (e) => {
    const { name, value } = e.target;
    setClaseEditData({ ...claseEditData, [name]: value });
  };

  const handleEditClase = async () => {
    try {
      const response = await fetch(`http://localhost:4023/clase/${claseEditData.Clase_ID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(claseEditData),
      });
       await response.json();
   
      setIsEditClaseModalOpen(false);
      fetchPlanDeClase();
    } catch (error) {
      console.error("Error editando clase:", error);
    }
  };

  return (
    <div className="background-image-blue flex flex-col items-center h-screen p-9">
      <div className="flex justify-between items-center w-full max-w-6xl m-5">
        <div className="flex items-center gap-2">
         {/* Mostrar botón sólo si no hay planes de clase */}
         {!planDeClase || planDeClase.length === 0 ? (
            <Button color="primary" onClick={() => setIsPlanModalOpen(true)}>
              <FontAwesomeIcon icon={faAdd} /> Añadir Plan
            </Button>
          ) : null}
          <Button color="primary" onClick={() => setIsModalOpen(true)}>
            <FontAwesomeIcon icon={faAdd} /> Añadir Tema
          </Button>
          <Button color="primary" onClick={() => setIsClaseModalOpen(true)}>
            <FontAwesomeIcon icon={faAdd} /> Añadir Clase
          </Button>
        </div>
      </div>

      <Divider className="my-1" />

      <div className="w-full max-w-7xl p-2 overflow-x-auto" style={{ marginTop: "20px" }}>
  {planDeClase && planDeClase.length > 0 ? (
    <Accordion variant="splitted">
      {planDeClase.map((planDeClase) => (
        <AccordionItem
          key={planDeClase.Plan_Clase_ID}
          title={`Plan de Clase - Año Dirigido: ${planDeClase.Año_Dirigido} | Id del Plan de Clase: ${planDeClase.Plan_Clase_ID}`}
        >
          {planDeClase.temas && planDeClase.temas.length > 0 ? (
            planDeClase.temas.map((tema) => (
              <Accordion key={tema.Tema_ID} variant="shadow" className="m-1">
                {/* Cada tema tiene su propio AccordionItem */}
                <AccordionItem
                  key={tema.Tema_ID}
                  title={`Tema: ${tema.Nombre_Tema} - Año Dirigido: ${tema.Año_Dirigido} - Id del Tema: ${tema.Tema_ID}`}
                >
                  <p>{tema.Descripcion}</p>
                  <div className="flex justify-end">
                    <Button
                      auto
                      size="xs"
                      onClick={() => openEditTemaModal(tema, planDeClase.Plan_Clase_ID)}
                      className="ml-2"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Button>
                    <Button
                      auto
                      size="xs"
                      onClick={() => confirmDeletTema(tema.Tema_ID,'Tema')}
                      className="ml-2"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </div>
                  <Divider className="my-2" />

                  {/* Ahora los temas tienen un acordeón para las clases */}
                  {tema.clases && tema.clases.length > 0 ? (
                    <Accordion variant="shadow" className="m-1">
                      {tema.clases.map((clase) => (
                        <AccordionItem
                          key={clase.Clase_ID}
                          title={`Clase: ${clase.Asunto} - Fecha: ${new Date(clase.Fecha).toLocaleDateString()} | Id de la clase: ${clase.Clase_ID}`}
                        >
                          <p>{clase.Descripcion}</p>
                          <p>Lugar: {clase.Lugar}</p>
                          <div className="flex justify-end">
                            <Button
                              auto
                              size="xs"
                              onClick={() => openEditClaseModal(clase, tema.Tema_ID)}
                              className="ml-2"
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </Button>
                            <Button
                              auto
                              size="xs"
                              onClick={() => confirmDeleteClase(clase.Clase_ID,'Clase')}
                              className="ml-2"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                          </div>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  ) : (
                    <p>No hay clases para este tema.</p>
                  )}
                </AccordionItem>
              </Accordion>
            ))
          ) : (
            <p>No hay temas para este plan de clase.</p>
          )}
        </AccordionItem>
      ))}
    </Accordion>
  ) : (
    <p>No hay planes de clase disponibles.</p>
  )}
</div>



      {/* Modal para editar tema */}
      <Modal isOpen={isEditTemaModalOpen} onOpenChange={() => setIsEditTemaModalOpen(!isEditTemaModalOpen)}>
        <ModalContent>
          <ModalHeader>Editar Tema</ModalHeader>
          <ModalBody>
            <Input
              name="Nombre_Tema"
              label="Nombre del Tema"
              value={temaEditData?.Nombre_Tema || ""}
              onChange={handleEditTemaInputChange}
            />
            <Input
              name="Año_Dirigido"
              label="Año Dirigido"
              type="number"
              value={temaEditData?.Año_Dirigido || ""}
              onChange={handleEditTemaInputChange}
            />
            <Input
              name="Descripcion"
              label="Descripción"
              value={temaEditData?.Descripcion || ""}
              onChange={handleEditTemaInputChange}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onClick={() => setIsEditTemaModalOpen(false)}>
              Cerrar
            </Button>
            <Button color="primary" onClick={handleEditTema}>
              Guardar Cambios
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal para editar clase */}
      <Modal isOpen={isEditClaseModalOpen} onOpenChange={() => setIsEditClaseModalOpen(!isEditClaseModalOpen)}>
        <ModalContent>
          <ModalHeader>Editar Clase</ModalHeader>
          <ModalBody>
            <Input
              name="Asunto"
              label="Asunto"
              value={claseEditData?.Asunto || ""}
              onChange={handleEditClaseInputChange}
            />
            <Input
              name="Fecha"
              label="Fecha"
              type="datetime-local"
              value={claseEditData?.Fecha || ""}
              onChange={handleEditClaseInputChange}
            />
            <Input
              name="Descripcion"
              label="Descripción"
              value={claseEditData?.Descripcion || ""}
              onChange={handleEditClaseInputChange}
            />
            <Input
              name="Lugar"
              label="Lugar"
              value={claseEditData?.Lugar || ""}
              onChange={handleEditClaseInputChange}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onClick={() => setIsEditClaseModalOpen(false)}>
              Cerrar
            </Button>
            <Button color="primary" onClick={handleEditClase}>
              Guardar Cambios
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal para añadir tema */}
      <Modal isOpen={isModalOpen} onOpenChange={() => setIsModalOpen(!isModalOpen)}>
        <ModalContent>
          <ModalHeader>Añadir Tema</ModalHeader>
          <ModalBody>
            <Input
              name="Plan_Clase_ID"
              label="Plan Clase ID"
              type="number"
              value={temaData.Plan_Clase_ID}
              onChange={handleInputChange}
            />
            <Input
              name="Nombre_Tema"
              label="Nombre del Tema"
              placeholder="Ingrese nombre del tema"
              value={temaData.Nombre_Tema}
              onChange={handleInputChange}
            />
            <Input
              name="Año_Dirigido"
              label="Año Dirigido"
              type="number"
              placeholder="Ingrese el año dirigido"
              value={temaData.Año_Dirigido}
              onChange={handleInputChange}
            />
            <Input
              name="Descripcion"
              label="Descripción"
              placeholder="Ingrese una descripción"
              value={temaData.Descripcion}
              onChange={handleInputChange}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onClick={() => setIsModalOpen(false)}>
              Cerrar
            </Button>
            <Button color="primary" onClick={handleAddTema}>
              Guardar Tema
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal para añadir clase */}
      <Modal isOpen={isClaseModalOpen} onOpenChange={() => setIsClaseModalOpen(!isClaseModalOpen)}>
        <ModalContent>
          <ModalHeader>Añadir Clase</ModalHeader>
          <ModalBody>
            <Input
              name="Tema_ID"
              label="Tema ID"
              type="number"
              value={claseData.Tema_ID}
              onChange={handleClaseInputChange}
            />
            <Input
              name="Asunto"
              label="Asunto de la Clase"
              placeholder="Ingrese el asunto de la clase"
              value={claseData.Asunto}
              onChange={handleClaseInputChange}
            />
            <Input
              name="Fecha"
              label="Fecha"
              placeholder="Ingrese la fecha"
              type="datetime-local"
              value={claseData.Fecha}
              onChange={handleClaseInputChange}
            />
            <Input
              name="Descripcion"
              label="Descripción"
              placeholder="Ingrese la descripción"
              value={claseData.Descripcion}
              onChange={handleClaseInputChange}
            />
            <Input
              name="Lugar"
              label="Lugar"
              placeholder="Ingrese el lugar"
              value={claseData.Lugar}
              onChange={handleClaseInputChange}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onClick={() => setIsClaseModalOpen(false)}>
              Cerrar
            </Button>
            <Button color="primary" onClick={handleAddClase}>
              Guardar Clase
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal para añadir plan de clase */}
      <Modal isOpen={isPlanModalOpen} onOpenChange={() => setIsPlanModalOpen(!isPlanModalOpen)}>
        <ModalContent>
          <ModalHeader>Añadir Plan de Clase</ModalHeader>
          <ModalBody>
            <Input
              name="Año_Dirigido"
              label="Año Dirigido"
              type="number"
              value={newPlanData.Año_Dirigido}
              onChange={handleNewPlanInputChange}
            />
            <Input
              name="Profesor_ID"
              label="ID del Profesor"
              type="number"
              value={newPlanData.Profesor_ID}
              onChange={handleNewPlanInputChange}
              readOnly
            />
            <Input
              name="Centro_ID"
              label="ID del Centro"
              type="number"
              value={newPlanData.Centro_ID}
              onChange={handleNewPlanInputChange}
              readOnly
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onClick={() => setIsPlanModalOpen(false)}>
              Cerrar
            </Button>
            <Button color="primary" onClick={handleAddPlan}>
              Guardar Plan
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <ToastContainer />
    </div>
  );
};
