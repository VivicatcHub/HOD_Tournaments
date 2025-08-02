import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock fetch globally
global.fetch = jest.fn();

describe('App Error Handling', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders loading state initially', async () => {
    fetch.mockImplementationOnce(() => new Promise(() => {})); // Never resolves

    await act(async () => {
      render(<App />);
    });
    
    // Wait a bit for the loading state to appear
    await waitFor(() => {
      expect(screen.getByText('Chargement des données...')).toBeInTheDocument();
    });
  });

  test('displays error message when network request fails', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText('Erreur de chargement')).toBeInTheDocument();
      expect(screen.getByText('Erreur de connexion réseau')).toBeInTheDocument();
    });
  });

  test('displays retry button when error is retryable', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText('Réessayer')).toBeInTheDocument();
    });
  });

  test('handles HTTP errors appropriately', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found'
    });

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText(/Données non trouvées/)).toBeInTheDocument();
    });
  });

  test('handles quota exceeded error', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 429,
      statusText: 'Too Many Requests'
    });

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText(/Limite de requêtes dépassée/)).toBeInTheDocument();
    });
  });

  test('retry button triggers new fetch request', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText('Réessayer')).toBeInTheDocument();
    });

    // Reset the fetch mock for the retry
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ rows: [] })
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Réessayer'));
    });

    // Wait for the new fetch to be called
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
    }, { timeout: 3000 });
  });

  test('handles invalid data format error', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ invalid: 'data' })
    });

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText(/Format de données invalide/)).toBeInTheDocument();
    });
  });

  test('disables controls during loading', async () => {
    fetch.mockImplementationOnce(() => new Promise(() => {})); // Never resolves

    await act(async () => {
      render(<App />);
    });

    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  test('displays ranking data when fetch succeeds', async () => {
    const mockData = {
      rows: [
        { Nom: 'Player 1', Score: '100' },
        { Nom: 'Player 2', Score: '90' }
      ]
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    });

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText('Player 1')).toBeInTheDocument();
      expect(screen.getByText('Player 2')).toBeInTheDocument();
    });
  });
});