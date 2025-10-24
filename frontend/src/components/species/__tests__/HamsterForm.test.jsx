import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HamsterForm from '../HamsterForm';
import axios from 'axios';

jest.mock('axios');

describe('HamsterForm', () => {
  beforeEach(() => jest.clearAllMocks());

  test('valida campos requeridos', async () => {
    render(<HamsterForm />);

    fireEvent.click(screen.getByText(/Enviar consulta/i));

    await waitFor(() => {
      expect(screen.getByText(/Selecciona la subespecie/i)).toBeInTheDocument();
      expect(screen.getByText(/Nombre del paciente es obligatorio/i)).toBeInTheDocument();
      expect(screen.getByText(/Nombre del dueño es obligatorio/i)).toBeInTheDocument();
    });
  });

  test('llama axios.post cuando el formulario es válido', async () => {
    axios.post.mockResolvedValueOnce({ data: { id: 2 } });

    render(<HamsterForm />);

    fireEvent.change(screen.getByLabelText(/Subespecie/i), { target: { value: 'sirio' } });
    fireEvent.input(screen.getByLabelText(/Nombre del paciente/i), { target: { value: 'Chispa' } });
    fireEvent.input(screen.getByLabelText(/Nombre del dueño/i), { target: { value: 'Ana' } });

    fireEvent.click(screen.getByText(/Enviar consulta/i));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/animal-consults', expect.objectContaining({
        name: 'Chispa',
        owner_name: 'Ana'
      }));
    });
  });
});