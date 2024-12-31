import { render, screen, waitFor } from "@testing-library/react";
import { EstudiantesEventos } from './EstudiantesEventos';
import AuthContext from '../../../context/AuthContext';
import { describe, test, beforeEach, expect, vi } from 'vitest';

describe('Prueba de Eventos de Estudiantes', () => {
    beforeEach(() => {
        globalThis.fetch = vi.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve([
                    {
                        Evento_ID: 2,
                        Profesor_ID: 4,
                        Nombre: "Taller de Bases de Datos",
                        Año_Dirigido: 2023,
                        Fecha: "2024-11-10T02:15:00.000Z",
                        Descripcion: "Un taller práctico sobre principios de Bases de Datos"
                    },
                    {
                        Evento_ID: 3,
                        Profesor_ID: 4,
                        Nombre: "XETI",
                        Año_Dirigido: 2023,
                        Fecha: "2024-11-22T02:25:00.000Z",
                        Descripcion: "Centro principal de investigación"
                    },
                    {
                        Evento_ID: 5,
                        Profesor_ID: 6,
                        Nombre: "las bambas",
                        Año_Dirigido: 2023,
                        Fecha: "2024-11-22T22:08:00.000Z",
                        Descripcion: "lolalalala"
                    },
                    {
                        Evento_ID: 6,
                        Profesor_ID: 4,
                        Nombre: "locos por el arte",
                        Año_Dirigido: 2023,
                        Fecha: "2024-11-14T22:44:00.000Z",
                        Descripcion: "Primeros pasos"
                    }
                ]),
            })
        );
    });

   

    test('debe renderizar el título "Eventos" y los elementos de eventos', async () => {
        const mockUser = { anio: 2023 };

        render(
            <AuthContext.Provider value={{ user: mockUser }}>
                <EstudiantesEventos />
            </AuthContext.Provider>
        );

        // Verifica que el fetch fue llamado con el URL adecuado
        expect(globalThis.fetch).toHaveBeenCalledWith("http://localhost:4023/evento?anio=2023");

        // Espera que el título "Eventos" esté en el documento
        await waitFor(() => {
            expect(screen.getByText("Eventos")).toBeDefined();
        });

        // Verifica que varios eventos de la respuesta simulada se rendericen en el DOM
        await waitFor(() => {
            expect(screen.getByText("Taller de Bases de Datos")).toBeDefined();
            expect(screen.getByText("Un taller práctico sobre principios de Bases de Datos")).toBeDefined();
            expect(screen.getByText("Fecha: 10/11/2024")).toBeDefined(); // Ajusta el formato si es necesario

            expect(screen.getByText("XETI")).toBeDefined();
            expect(screen.getByText("Centro principal de investigación")).toBeDefined();

            expect(screen.getByText("las bambas")).toBeDefined();
            expect(screen.getByText("lolalalala")).toBeDefined();

            expect(screen.getByText("locos por el arte")).toBeDefined();
            expect(screen.getByText("Primeros pasos")).toBeDefined();
        });
    });
});
