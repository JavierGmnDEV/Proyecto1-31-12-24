import { useContext, useEffect, useState } from "react";
import { faAdd, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Modal, Input, ModalContent, ModalHeader, ModalBody, ModalFooter, Card, CardHeader,  Divider, CardBody, CardFooter } from "@nextui-org/react";
import AuthContext from "../../../context/AuthContext";


export const ProfesorEventos = () => {
    const { user,  } = useContext(AuthContext);
    const [eventos, setEventos] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [eventoData, setEventoData] = useState({
      Profesor_ID: user.id|| "",
      Nombre: "",
      Año_Dirigido: user.anio || "",
      Fecha: "",
      Descripcion: ""
    });
    const [eventoEditData, setEventoEditData] = useState(null);
  
    // Fetch inicial de eventos
    useEffect(() => {
      const fetchEventos = async () => {
        try {
          const response = await fetch(`http://localhost:4023/evento/profesor?id=${user.id}`);
          const result = await response.json();
          setEventos(result);
        } catch (error) {
          console.error("Error fetching eventos:", error);
        }
      };
      fetchEventos();
    }, []);
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      const { message, isValid } = validateField(name, value);
    
     
  
      setFieldMessages((prev) => ({ ...prev, [name]: message }));
      setFieldValidity((prev) => ({ ...prev, [name]: isValid }));

      setEventoData({ ...eventoData, [name]: value });
    };
  
    // Crear un nuevo evento
    const handleAddEvento = async () => {
     

      try {
        const response = await fetch("http://localhost:4023/evento", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventoData),
        });
        const result = await response.json();
       
        setEventos([...eventos, result]);
        setIsModalOpen(false);
        setEventoData({ Profesor_ID: "", Nombre: "", Año_Dirigido: "", Fecha: "", Descripcion: "" });
      } catch (error) {
        console.error("Error agregando evento:", error);
      }
    };
  
    // Eliminar un evento
    const handleDeleteEvento = async (eventoId) => {
      try {
        const response = await fetch(`http://localhost:4023/evento/${eventoId}`, {
          method: "DELETE",
        });
         await response.text();
       
        setEventos(eventos.filter((evento) => evento.Evento_ID !== eventoId));
      } catch (error) {
        console.error("Error eliminando evento:", error);
      }
    };
  
    // Abrir el modal de edición
    const openEditModal = (evento) => {
      setEventoEditData(evento);
      setIsEditModalOpen(true);
    };
  
    // Editar un evento
    const handleEditInputChange = (e) => {
      const { name, value } = e.target;

      
      setEventoEditData({ ...eventoEditData, [name]: value });
    };
  
    const handleEditEvento = async () => {
      try {
        const response = await fetch(`http://localhost:4023/evento/${eventoEditData.Evento_ID}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventoEditData),
        });
        await response.json();
        
        setEventos(
          eventos.map((evento) => (evento.Evento_ID === eventoEditData.Evento_ID ? eventoEditData : evento))
        );
        setIsEditModalOpen(false);
      } catch (error) {
        console.error("Error editando evento:", error);
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
          case "Fecha":
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


    return (
      <div className="background-image-blue flex flex-col items-center h-screen p-9">
        <div className="flex justify-between items-center w-full max-w-6xl m-5">
          <Button color="primary" onClick={() => setIsModalOpen(true)}>
            <FontAwesomeIcon icon={faAdd} /> Añadir Evento
          </Button>
        </div>
        <div className="w-full max-w-7xl p-2 overflow-y-auto max-h-[80vh]">
        <div className="w-full max-w-7xl p-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
      {eventos.length > 0 ? (
        eventos.map((evento) => (
          <Card key={evento.Evento_ID} className="max-w-[400px]">
            <CardHeader className="flex gap-3">
             
              <div className="flex flex-col">
                <p className="text-md font-bold">{evento.Nombre}</p>
                <p className="text-sm text-default-500">
                  Año Dirigido: {evento.Año_Dirigido}
                </p>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              <p>{evento.Descripcion}</p>
              <p className="text-sm text-default-500">
                Fecha: {new Date(evento.Fecha).toLocaleDateString()}
              </p>
            </CardBody>
            <Divider />
            <CardFooter className="flex justify-end gap-2">
              <Button
                auto
                size="xs"
                onClick={() => openEditModal(evento)}
              >
                <FontAwesomeIcon icon={faEdit} />
              </Button>
              <Button
                auto
                size="xs"
                color="error"
                onClick={() => handleDeleteEvento(evento.Evento_ID)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </Button>
            </CardFooter>
          </Card>
        ))
      ) : (
        <p className="col-span-2 text-center">No hay eventos disponibles.</p>
      )}
    </div>
    </div>
  
        {/* Modal para añadir evento */}
        <Modal isOpen={isModalOpen} onOpenChange={() => setIsModalOpen(!isModalOpen)}>
          <ModalContent>
            <ModalHeader>Añadir Evento</ModalHeader>
            <ModalBody>
              <Input name="Profesor_ID" label="ID del Profesor" type="number" value={user.id} onChange={handleInputChange} readOnly/>
              <Input name="Nombre" label="Nombre del Evento" value={eventoData.Nombre} onChange={handleInputChange} />
              <Input name="Año_Dirigido" label="Año Dirigido" type="number" value={user.anio} onChange={handleInputChange} readOnly/>
              <Input name="Fecha" label="Fecha" type="datetime-local" value={eventoData.Fecha} onChange={handleInputChange} 
              color={
                fieldValidity.Fecha === true
                    ? "success"
                    : fieldValidity.Fecha === false
                        ? "danger"
                        : "default"
            }
        />
        <small className="text-red-500">{fieldMessages.Fecha}</small>
              
              <Input name="Descripcion" label="Descripción" value={eventoData.Descripcion} onChange={handleInputChange} />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onClick={() => setIsModalOpen(false)}>Cerrar</Button>
              <Button color="primary" onClick={handleAddEvento}>Guardar Evento</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
  
        {/* Modal para editar evento */}
        <Modal isOpen={isEditModalOpen} onOpenChange={() => setIsEditModalOpen(!isEditModalOpen)}>
          <ModalContent>
            <ModalHeader>Editar Evento</ModalHeader>
            <ModalBody>
              <Input name="Profesor_ID" label="ID del Profesor" type="number" value={user.id} onChange={handleEditInputChange} readOnly/>
              <Input name="Nombre" label="Nombre del Evento" value={eventoEditData?.Nombre || ""} onChange={handleEditInputChange} />
              <Input name="Año_Dirigido" label="Año Dirigido" type="number" value={user.anio} onChange={handleEditInputChange} readOnly />
              <Input name="Fecha" label="Fecha" type="datetime-local" value={eventoEditData?.Fecha || ""} onChange={handleEditInputChange} 
              
              
              color={
                fieldValidity.Fecha === true
                    ? "success"
                    : fieldValidity.Fecha === false
                        ? "danger"
                        : "default"
            }
        />
        <small className="text-red-500">{fieldMessages.Fecha}</small>
              <Input name="Descripcion" label="Descripción" value={eventoEditData?.Descripcion || ""} onChange={handleEditInputChange} />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onClick={() => setIsEditModalOpen(false)}>Cerrar</Button>
              <Button color="primary" onClick={handleEditEvento}>Guardar Cambios</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    );
  };