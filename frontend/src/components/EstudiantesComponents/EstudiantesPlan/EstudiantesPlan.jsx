import { useContext, useEffect, useState } from "react";
import { Accordion, AccordionItem, Divider } from "@nextui-org/react";
import AuthContext from "../../../context/AuthContext";

export const EstudiantesPlan = () => {
  const { user,  } = useContext(AuthContext);
  const [planDeClase, setPlanDeClase] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch inicial para obtener los datos de estudiantes del plan de clase
  useEffect(() => {
    const fetchEstudiantes = async () => {
      const requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };

      try {
        const response = await fetch(`http://localhost:4023/plan-de-clase/centro/${user.centro_id}`, requestOptions);
        const result = await response.json();
        setPlanDeClase(result);
      } catch (error) {
        console.error("Error fetching estudiantes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEstudiantes();
  }, []);

  return (
    <div className="background-image-blue flex flex-col items-center h-screen p-9">
      <Divider className="my-2" />

      <h1 className="text-xl font-semibold m-5">Plan de Clase</h1>
      <Divider className="my-2" />

      <div className="w-full max-w-7xl p-2 overflow-x-auto" style={{ marginTop: "20px" }}>
        {isLoading ? (
          <p>Cargando estudiantes...</p>
        ) : planDeClase && planDeClase.length > 0 ? (
          <Accordion variant="splitted">
            {planDeClase.map((plan) => (
              <AccordionItem
                key={plan.Plan_Clase_ID}
                title={`Plan de Clase - Año Dirigido: ${plan.Año_Dirigido} | ID del Plan: ${plan.Plan_Clase_ID}`}
              >
                {plan.temas && plan.temas.length > 0 ? (
                  plan.temas.map((tema) => (
                    <Accordion key={tema.Tema_ID} variant="shadow" className="m-1">
                      <AccordionItem
                        key={tema.Tema_ID}
                        title={`Tema: ${tema.Nombre_Tema} - Año Dirigido: ${tema.Año_Dirigido}`}
                      >
                        <p>{tema.Descripcion}</p>
                        <Divider className="my-2" />

                        {/* Mostrar clases dentro de cada tema */}
                        {tema.clases && tema.clases.length > 0 ? (
                          <Accordion variant="shadow" className="m-1">
                            {tema.clases.map((clase) => (
                              <AccordionItem
                                key={clase.Clase_ID}
                                title={`Clase: ${clase.Asunto} - Fecha: ${new Date(clase.Fecha).toLocaleDateString()}`}
                              >
                                <p>{clase.Descripcion}</p>
                                <p>Lugar: {clase.Lugar}</p>
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
    </div>
  );
};
