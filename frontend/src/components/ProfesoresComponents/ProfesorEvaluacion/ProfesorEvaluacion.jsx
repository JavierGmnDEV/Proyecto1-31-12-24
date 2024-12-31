import { useContext, useEffect, useState } from "react";
import { faAdd, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Modal,
  Input,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardHeader,
  Divider,
  CardBody,
  CardFooter,
} from "@nextui-org/react";
import AuthContext from "../../../context/AuthContext";

export const ProfesorEvaluacion = () => {
  const { user } = useContext(AuthContext);
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [evaluacionData, setEvaluacionData] = useState({
    Profesor_ID: "",
    Tipo_Evaluacion: "Presencial",
    Tema_A_Evaluar: "",
    Año_Dirigido: "",
    Fecha_Evaluacion: "",
  });
  const [evaluacionEditData, setEvaluacionEditData] = useState(null);

  useEffect(() => {
    const fetchEvaluaciones = async () => {
      try {
        const response = await fetch(`http://localhost:4023/evaluacion?id=${user.id}`);
        const result = await response.json();
        setEvaluaciones(result);
      } catch (error) {
        console.error("Error fetching evaluaciones:", error);
      }
    };
    fetchEvaluaciones();
  }, [user.id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const { message, isValid } = validateField(name, value);

  
  
    setFieldMessages((prev) => ({ ...prev, [name]: message }));
    setFieldValidity((prev) => ({ ...prev, [name]: isValid }));
    setEvaluacionData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddEvaluacion = async () => {
    try {
      const requestBody = {
        ...evaluacionData,
        Profesor_ID: user.id, // Asignar el ID del profesor desde user
      };


      const response = await fetch(
        `http://localhost:4023/evaluacion?centro=${user.centro_id}&anio=${user.anio}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );
      
      const result = await response.json();
     
      
      // Actualizar la lista de evaluaciones con la nueva evaluación
      setEvaluaciones([...evaluaciones, result]);
      setIsModalOpen(false);

      // Limpiar el formulario después de guardar
      setEvaluacionData({
        Profesor_ID: "",
        Tipo_Evaluacion: "Presencial",
        Tema_A_Evaluar: "",
        Año_Dirigido: "",
        Fecha_Evaluacion: "",
      });
    } catch (error) {
      console.error("Error agregando evaluacion:", error);
    }
  };

  const handleDeleteEvaluacion = async (evaluacionId) => {
    try {
      const response = await fetch(`http://localhost:4023/evaluacion/${evaluacionId}?centro=${user.centro_id}&anio=${user.anio}`, {
        method: "DELETE",
      });
       await response.text();
      
      setEvaluaciones(evaluaciones.filter((evaluacion) => evaluacion.Evaluacion_ID !== evaluacionId));
    } catch (error) {
      console.error("Error eliminando evaluacion:", error);
    }
  };

  const openEditModal = (evaluacion) => {
    setEvaluacionEditData(evaluacion);
    setIsEditModalOpen(true);
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
  
  
  

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
   
    setEvaluacionEditData({ ...evaluacionEditData, [name]: value });
  };

  const handleEditEvaluacion = async () => {
    try {
      const response = await fetch(`http://localhost:4023/evaluacion/${evaluacionEditData.Evaluacion_ID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(evaluacionEditData),
      });
       await response.json();
      
      setEvaluaciones(
        evaluaciones.map((evaluacion) =>
          evaluacion.Evaluacion_ID === evaluacionEditData.Evaluacion_ID ? evaluacionEditData : evaluacion
        )
      );
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error editando evaluacion:", error);
    }
  };

  return (
    <div className="background-image-blue flex flex-col items-center h-screen p-9">
      <div className="flex justify-between items-center w-full max-w-6xl m-5">
        <Button color="primary" onClick={() => setIsModalOpen(true)}>
          <FontAwesomeIcon icon={faAdd} /> Añadir Evaluación
        </Button>
      </div>

      <div className="w-full max-w-7xl p-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {evaluaciones.length > 0 ? (
          evaluaciones.map((evaluacion) => (
            <Card key={evaluacion.Evaluacion_ID} className="max-w-[400px]">
              <CardHeader className="flex gap-3">
                <div className="flex flex-col">
                  <p className="text-md font-bold">{evaluacion.Tema_A_Evaluar}</p>
                  <p className="text-sm text-default-500">
                    Año Dirigido: {evaluacion.Año_Dirigido}
                  </p>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <p className="text-sm text-default-500">
                  Tipo: {evaluacion.Tipo_Evaluacion}
                </p>
                <p className="text-sm text-default-500">
                  Fecha: {new Date(evaluacion.Fecha_Evaluacion).toLocaleDateString()}
                </p>
              </CardBody>
              <Divider />
              <CardFooter className="flex justify-end gap-2">
                <Button auto size="xs" onClick={() => openEditModal(evaluacion)}>
                  <FontAwesomeIcon icon={faEdit} />
                </Button>
                <Button auto size="xs" color="error" onClick={() => handleDeleteEvaluacion(evaluacion.Evaluacion_ID)}>
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p className="col-span-2 text-center">No hay evaluaciones disponibles.</p>
        )}
      </div>

      {/* Modal para añadir evaluación */}
      <Modal isOpen={isModalOpen} onOpenChange={() => setIsModalOpen(!isModalOpen)}>
        <ModalContent>
          <ModalHeader>Añadir Evaluación</ModalHeader>
          <ModalBody>
            <Input
              name="Profesor_ID"
              label="ID del Profesor"
              type="number"
              value={user.id}
              onChange={handleInputChange}
              readOnly
            />
            <Input
              name="Tipo_Evaluacion"
              label="Tipo de Evaluación"
              value={evaluacionData.Tipo_Evaluacion}
              onChange={handleInputChange}
            />
            <Input
              name="Tema_A_Evaluar"
              label="Tema a Evaluar"
              value={evaluacionData.Tema_A_Evaluar}
              onChange={handleInputChange}
            />
            <Input
              name="Año_Dirigido"
              label="Año Dirigido"
              type="number"
              value={user.anio}
              onChange={handleInputChange}
              readOnly
            />
            <Input
              name="Fecha_Evaluacion"
              label="Fecha de Evaluación"
              type="datetime-local"
              value={evaluacionData.Fecha_Evaluacion}
              onChange={handleInputChange}
              color={
                fieldValidity.Fecha_Evaluacion === true
                    ? "success"
                    : fieldValidity.Fecha_Evaluacion === false
                        ? "danger"
                        : "default"
            }
        />
        <small className="text-red-500">{fieldMessages.Fecha_Evaluacion}</small>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onClick={() => setIsModalOpen(false)}>Cerrar</Button>
            <Button color="primary" onClick={handleAddEvaluacion}>Guardar Evaluación</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal para editar evaluación */}
      <Modal isOpen={isEditModalOpen} onOpenChange={() => setIsEditModalOpen(!isEditModalOpen)}>
        <ModalContent>
          <ModalHeader>Editar Evaluación</ModalHeader>
          <ModalBody>
            <Input name="Profesor_ID" label="ID del Profesor" type="number" value={user.id} onChange={handleEditInputChange} readOnly />
            <Input name="Tipo_Evaluacion" label="Tipo de Evaluación" value={evaluacionEditData?.Tipo_Evaluacion || ""} onChange={handleEditInputChange} />
            <Input name="Tema_A_Evaluar" label="Tema a Evaluar" value={evaluacionEditData?.Tema_A_Evaluar || ""} onChange={handleEditInputChange} />
            <Input name="Año_Dirigido" label="Año Dirigido" type="number" value={user.anio} onChange={handleEditInputChange} readOnly/>
            <Input name="Fecha_Evaluacion" label="Fecha de Evaluación" type="datetime-local" value={evaluacionEditData?.Fecha_Evaluacion || ""} onChange={handleEditInputChange}               color={
                fieldValidity.Fecha_Evaluacion === true
                    ? "success"
                    : fieldValidity.Fecha_Evaluacion === false
                        ? "danger"
                        : "default"
            }
        />
        <small className="text-red-500">{fieldMessages.Fecha_Evaluacion}</small>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onClick={() => setIsEditModalOpen(false)}>Cerrar</Button>
            <Button color="primary" onClick={handleEditEvaluacion}>Guardar Cambios</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
