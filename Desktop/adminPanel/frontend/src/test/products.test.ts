import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { getAllProducts } from '../services/productsService';

const mock = new MockAdapter(axios);

describe('getAllProducts', () => {
  afterEach(() => {
    mock.reset();
  });

  it('should return products when API call is successful', async () => {
    const mockData = [
      { id: 1, name: 'Laptop', price: 1200 },
      { id: 2, name: 'Mouse', price: 25 },
    ];

    mock.onGet('http://localhost:3000/api/products').reply(200, { results: mockData });

    const result = await getAllProducts();

    expect(result).toEqual(mockData);
  });

  it('should return empty array when API call fails', async () => {
    mock.onGet('http://localhost:3000/api/products').networkError();

    const result = await getAllProducts();

    expect(result).toEqual([]);
  });
});
