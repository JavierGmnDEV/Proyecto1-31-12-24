import { render, screen, waitFor } from "@testing-library/react";
import { EstudiantesEventos } from './EstudiantesEventos';
import AuthContext from '../../../context/AuthContext';
import { describe, test, beforeEach, expect, vi } from 'vitest';

describe('Prueba de integración para Eventos de Estudiantes', () => {
    beforeEach(() => {
        // Mock de fetch global
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
                    }
                    // Más eventos si es necesario
                ]),
            })
        );
    });

    test('debe integrar el contexto de autenticación y renderizar correctamente los eventos', async () => {
        const mockUser = { anio: 2023 };

        render(
            <AuthContext.Provider value={{ user: mockUser }}>
                <EstudiantesEventos />
            </AuthContext.Provider>
        );

        // Verifica que el fetch fue llamado con el URL adecuado según el año de usuario en el contexto
        expect(globalThis.fetch).toHaveBeenCalledWith("http://localhost:4023/evento?anio=2023");

        // Verifica que el título "Eventos" se muestra en el DOM
        await waitFor(() => {
            expect(screen.getByText("Eventos")).toBeDefined();
        });

        // Verifica que los eventos de la respuesta de fetch se renderizan correctamente
        await waitFor(() => {
            expect(screen.getByText("Taller de Bases de Datos")).toBeDefined();
            expect(screen.getByText("Un taller práctico sobre principios de Bases de Datos")).toBeDefined();
            expect(screen.getByText("Fecha: 10/11/2024")).toBeDefined(); // Ajusta el formato si es necesario

            expect(screen.getByText("XETI")).toBeDefined();
            expect(screen.getByText("Centro principal de investigación")).toBeDefined();
        });
    });

    test('debe manejar correctamente una respuesta vacía de eventos', async () => {
        // Mock de fetch que simula una respuesta vacía
        globalThis.fetch.mockResolvedValueOnce({
            json: () => Promise.resolve([]),
        });

        render(
            <AuthContext.Provider value={{ user: { anio: 2023 } }}>
                <EstudiantesEventos />
            </AuthContext.Provider>
        );

        // Verifica que fetch fue llamado
        expect(globalThis.fetch).toHaveBeenCalledWith("http://localhost:4023/evento?anio=2023");

        // Verifica que se muestra un mensaje indicando que no hay eventos
        await waitFor(() => {
            expect(screen.getByText("No hay eventos disponibles.")).toBeDefined();
        });
    });

   
    
});
