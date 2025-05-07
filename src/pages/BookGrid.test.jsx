import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import BookGrid from './BookGrid';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';
import { SocketProvider } from '../context/SocketContext';

// Mock the modules
jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));
jest.mock('bcryptjs', () => ({
  compare: jest.fn().mockResolvedValue(true)
}));

// Mock socket context
const mockSocket = {
  on: jest.fn(),
  off: jest.fn(),
  emit: jest.fn(),
  connect: jest.fn(),
  disconnect: jest.fn()
};

const mockUnreadCounts = {
  '1': 2,
  '2': 1
};

jest.mock('../context/SocketContext', () => ({
  useSocket: () => ({
    socket: mockSocket,
    unreadCounts: mockUnreadCounts,
    isConnected: true
  }),
  SocketProvider: ({ children }) => children
}));

describe('BookGrid Component', () => {
  const mockUser = {
    id: '123',
    username: 'testuser',
    email: 'test@example.com',
    pincode: '110001',
    password: 'hashedpassword'
  };

  const mockBooks = [
    {
      id: '1',
      userId: 'seller123',
      bookName: 'Test Book 1',
      price: '500',
      pincode: '110001',
      imageUrl: '/test-image1.jpg',
      listingType: 'SELL'
    },
    {
      id: '2',
      userId: 'seller456',
      bookName: 'Test Book 2',
      price: '300',
      pincode: '110005',
      imageUrl: '/test-image2.jpg',
      listingType: 'RENT'
    }
  ];

  const mockRequests = [
    {
      bookId: '1',
      bookName: 'Test Book 1',
      bookPrice: '500',
      date: new Date().toISOString(),
      status: 'APPROVED'
    },
    {
      bookId: '2',
      bookName: 'Test Book 2',
      bookPrice: '300',
      date: new Date().toISOString(),
      status: 'REJECTED'
    }
  ];

  const mockSeller = {
    userId: 'seller123',
    username: 'Seller User',
    email: 'seller@example.com'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    axios.get.mockImplementation((url) => {
      if (url === 'http://localhost:5000/check-auth') {
        return Promise.resolve({ data: { authenticated: true } });
      } else if (url === 'http://localhost:5000/explore') {
        return Promise.resolve({ data: { user: mockUser, books: mockBooks } });
      } else if (url === 'http://localhost:5000/status') {
        return Promise.resolve({ data: { requests: mockRequests } });
      } else if (url.includes('http://localhost:5000/sellerdetails/')) {
        return Promise.resolve({ data: { user: mockSeller } });
      }
      return Promise.reject(new Error('Not found'));
    });

    jest.spyOn(React, 'useEffect').mockImplementation(f => f());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderWithProviders = (component) => {
    return render(
      <BrowserRouter>
        <SocketProvider>
          {component}
        </SocketProvider>
      </BrowserRouter>
    );
  };

  test('renders the component with books and user info', async () => {
    await act(async () => {
      renderWithProviders(<BookGrid />);
    });

    await waitFor(() => {
      expect(screen.getByText('testuser')).toBeInTheDocument();
      expect(screen.getByText('Test Book 1')).toBeInTheDocument();
      expect(screen.getByText('Test Book 2')).toBeInTheDocument();
    });
  });

  test('handles search functionality', async () => {
    await act(async () => {
      renderWithProviders(<BookGrid />);
    });

    await waitFor(() => {
      expect(screen.getByText('Test Book 1')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search by book name...');
    fireEvent.change(searchInput, { target: { value: 'Test Book 1' } });

    await waitFor(() => {
      expect(screen.getByText('Test Book 1')).toBeInTheDocument();
      expect(screen.queryByText('Test Book 2')).not.toBeInTheDocument();
    });
  });

  test('displays unread message count', async () => {
    await act(async () => {
      renderWithProviders(<BookGrid />);
    });

    await waitFor(() => {
      expect(screen.getByText('3 unread messages')).toBeInTheDocument();
    });
  });

  test('handles book details modal', async () => {
    await act(async () => {
      renderWithProviders(<BookGrid />);
    });

    await waitFor(() => {
      expect(screen.getByText('Test Book 1')).toBeInTheDocument();
    });

    const seeDetailsButton = screen.getAllByText('See Details')[0];
    fireEvent.click(seeDetailsButton);

    await waitFor(() => {
      expect(screen.getByText('Seller Details')).toBeInTheDocument();
      expect(screen.getByText('Seller User')).toBeInTheDocument();
      expect(screen.getByText('seller@example.com')).toBeInTheDocument();
    });
  });

  test('handles buy request', async () => {
    axios.post.mockResolvedValueOnce({ data: { message: 'Request sent successfully' } });

    await act(async () => {
      renderWithProviders(<BookGrid />);
    });

    await waitFor(() => {
      expect(screen.getByText('Test Book 1')).toBeInTheDocument();
    });

    const seeDetailsButton = screen.getAllByText('See Details')[0];
    fireEvent.click(seeDetailsButton);

    await waitFor(() => {
      const buyButton = screen.getByText('Buy');
      fireEvent.click(buyButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Confirm Buy Request')).toBeInTheDocument();
      const confirmButton = screen.getByText('Confirm');
      fireEvent.click(confirmButton);
    });

    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:5000/request',
      expect.any(Object),
      { withCredentials: true }
    );
  });

  test('handles sort by pincode', async () => {
    await act(async () => {
      renderWithProviders(<BookGrid />);
    });

    await waitFor(() => {
      expect(screen.getByText('Sort by Nearest')).toBeInTheDocument();
    });

    const sortButton = screen.getByText('Sort by Nearest');
    fireEvent.click(sortButton);

    expect(screen.getByText('Clear Sorting')).toBeInTheDocument();
  });

  test('displays request history', async () => {
    await act(async () => {
      renderWithProviders(<BookGrid />);
    });

    await waitFor(() => {
      expect(screen.getByText('Browse Books')).toBeInTheDocument();
    });

    const myRequestsButton = screen.getByText('My Requests');
    fireEvent.click(myRequestsButton);

    await waitFor(() => {
      expect(screen.getByText('Test Book 1')).toBeInTheDocument();
      expect(screen.getByText('APPROVED')).toBeInTheDocument();
      expect(screen.getByText('Test Book 2')).toBeInTheDocument();
      expect(screen.getByText('REJECTED')).toBeInTheDocument();
    });
  });

  test('handles logout', async () => {
    axios.post.mockResolvedValueOnce({ status: 200 });

    await act(async () => {
      renderWithProviders(<BookGrid />);
    });

    await waitFor(() => {
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:5000/logout',
      {},
      { withCredentials: true }
    );
  });

  test('handles chat functionality', async () => {
    await act(async () => {
      renderWithProviders(<BookGrid />);
    });

    await waitFor(() => {
      expect(screen.getByText('Test Book 1')).toBeInTheDocument();
    });

    const seeDetailsButton = screen.getAllByText('See Details')[0];
    fireEvent.click(seeDetailsButton);

    await waitFor(() => {
      const showChatButton = screen.getByText('Show Chat');
      fireEvent.click(showChatButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Hide Chat')).toBeInTheDocument();
    });
  });
});