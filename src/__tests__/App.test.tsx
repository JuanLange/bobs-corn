import { render, screen, fireEvent, act } from '@testing-library/react';
import App from '../App';
import { toast } from 'sonner';

// Mock de axios con jest.fn()
const mockGet = jest.fn();
const mockPost = jest.fn();

jest.mock('../lib/axios', () => ({
  __esModule: true,
  default: {
    get: (...args: any[]) => mockGet(...args),
    post: (...args: any[]) => mockPost(...args)
  }
}));

// Mock de Sonner toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  },
  Toaster: () => null
}));

describe('Funcionalidad de Compra de Maíz', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock del GET inicial
    mockGet.mockResolvedValue({
      data: {
        history: [
          {
            client_ip: '127.0.0.1',
            total_purchases: 5,
            last_purchase: new Date().toISOString()
          }
        ],
        dailyPurchases: [
          {
            date: new Date().toISOString(),
            total: 5
          }
        ]
      }
    });
  });

  it('permite comprar cuando no hay rate limiting', async () => {
    // Simular una compra exitosa
    mockPost.mockResolvedValueOnce({
      data: {
        message: 'Purchase successful! 🌽',
        totalPurchases: 6
      }
    });

    render(<App />);
    const buyButton = screen.getByRole('button', { name: /buy corn/i });
    
    await act(async () => {
      fireEvent.click(buyButton);
    });

    // Verificar que se llamó a la API correctamente
    expect(mockPost).toHaveBeenCalledWith('/corn/buy');
    // Verificar que se mostró el mensaje de éxito
    expect(toast.success).toHaveBeenCalledWith('Purchase successful! 🌽');
  });

  it('muestra error cuando hay rate limiting', async () => {
    // Simular rate limiting
    mockPost.mockRejectedValueOnce({
      response: {
        status: 429,
        data: {
          message: 'You must wait before buying more corn',
          nextAvailable: new Date(Date.now() + 30000).toISOString()
        }
      }
    });

    render(<App />);
    const buyButton = screen.getByRole('button', { name: /buy corn/i });
    
    await act(async () => {
      fireEvent.click(buyButton);
    });

    // Verificar que se mostró el mensaje de error
    expect(toast.error).toHaveBeenCalled();
  });

  it('muestra correctamente el historial de compras', async () => {
    const mockDate = new Date();
    const mockHistory = {
      client_ip: '127.0.0.1',
      total_purchases: 5,
      last_purchase: mockDate.toISOString()
    };

    mockGet.mockResolvedValueOnce({
      data: {
        history: [mockHistory],
        dailyPurchases: [{
          date: mockDate.toISOString(),
          total: 5
        }]
      }
    });

    render(<App />);
    
    // Abrir el panel
    const toggleButton = screen.getByRole('button', { name: /\+/i });
    fireEvent.click(toggleButton);

    // Verificar que se muestra la información del historial
    expect(await screen.findByText('127.0.0.1')).toBeInTheDocument();
    expect(await screen.findByText('5')).toBeInTheDocument();
  });
});
