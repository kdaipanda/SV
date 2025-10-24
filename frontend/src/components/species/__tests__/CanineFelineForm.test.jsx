import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CanineFelineForm from '../CanineFelineForm';
import axios from 'axios';

jest.mock('axios');

describe('CanineFelineForm', () => {
  beforeEach(() => jest.clearAllMocks());

  test('muestra errores cuando faltan campos obligatorios', async () => {
    render(<CanineFelineForm />);

    fireEvent.click(screen.getByText(/Enviar consulta/i));

    await waitFor(() => {
      expect(screen.getByText(/La fecha es obligatoria/i)).toBeInTheDocument();
      expect(screen.getByText(/El nombre de la mascota es obligatorio/i)).toBeInTheDocument();
      expect(screen.getByText(/El nombre del dueño es obligatorio/i)).toBeInTheDocument();
    });
  });

  test('envía datos correctamente cuando está completo', async () => {
    axios.post.mockResolvedValueOnce({ data: { id: 1 } });

    render(<CanineFelineForm />);

    fireEvent.input(screen.getByLabelText(/FECHA/i), { target: { value: '2025-10-24' } });
    fireEvent.input(screen.getByLabelText(/NOMBRE DE LA MASCOTA/i), { target: { value: 'Firulais' } });
    fireEvent.input(screen.getByLabelText(/NOMBRE DEL DUEÑO/i), { target: { value: 'Juan' } });

    fireEvent.click(screen.getByText(/Enviar consulta/i));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/animal-consults', expect.objectContaining({
        pet_name: 'Firulais',
        owner_name: 'Juan',
        date: '2025-10-24'
      }));
    });
  });
});