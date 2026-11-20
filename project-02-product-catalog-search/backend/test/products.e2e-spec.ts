import { ValidationPipe } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { ProductsController } from '../src/products/products.controller.js';
import { ProductsService } from '../src/products/products.service.js';

describe('ProductsController (HTTP integration)', () => {
  let app: INestApplication;

  const productId = '507f1f77bcf86cd799439011';

  const mockProduct = {
    _id: productId,
    name: 'Wireless Keyboard',
    description: 'A mechanical wireless keyboard',
    price: 2499,
    category: 'Electronics',
    stock: 15,
    sku: 'KEY-001',
    createdAt: new Date('2026-11-20T10:00:00.000Z'),
    updatedAt: new Date('2026-11-20T10:00:00.000Z'),
  };

  const mockProductsService = {
    create: vi.fn(),
    findAll: vi.fn(),
    findOne: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    // Match the validation configuration in src/main.ts.
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /products', () => {
    it('should create a product and return HTTP 201', async () => {
      mockProductsService.create.mockResolvedValue(mockProduct);

      const payload = {
        name: 'Wireless Keyboard',
        description: 'A mechanical wireless keyboard',
        price: 2499,
        category: 'Electronics',
        stock: 15,
        sku: 'KEY-001',
      };

      const response = await request(app.getHttpServer())
        .post('/products')
        .send(payload)
        .expect(201);

      expect(response.body.name).toBe('Wireless Keyboard');
      expect(response.body.sku).toBe('KEY-001');

      expect(mockProductsService.create).toHaveBeenCalledWith(payload);
    });

    it('should reject invalid product data with HTTP 400', async () => {
      const invalidPayload = {
        name: '',
        description: 'Invalid product',
        price: -100,
        category: 'Electronics',
        stock: -5,
        sku: '',
      };

      await request(app.getHttpServer())
        .post('/products')
        .send(invalidPayload)
        .expect(400);

      expect(mockProductsService.create).not.toHaveBeenCalled();
    });

    it('should reject unknown properties with HTTP 400', async () => {
      const payload = {
        name: 'Keyboard',
        description: 'A keyboard',
        price: 1000,
        category: 'Electronics',
        stock: 10,
        sku: 'KEY-002',
        unexpectedField: 'not allowed',
      };

      await request(app.getHttpServer())
        .post('/products')
        .send(payload)
        .expect(400);

      expect(mockProductsService.create).not.toHaveBeenCalled();
    });

    it('should return HTTP 409 when the service reports a duplicate SKU', async () => {
      const { ConflictException } = await import('@nestjs/common');

      mockProductsService.create.mockRejectedValue(
        new ConflictException('A product with this SKU already exists'),
      );

      const payload = {
        name: 'Keyboard',
        description: 'A keyboard',
        price: 1000,
        category: 'Electronics',
        stock: 10,
        sku: 'KEY-001',
      };

      await request(app.getHttpServer())
        .post('/products')
        .send(payload)
        .expect(409);
    });
  });

  describe('GET /products', () => {
    it('should return a paginated product list', async () => {
      const paginatedResult = {
        data: [mockProduct],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };

      mockProductsService.findAll.mockResolvedValue(paginatedResult);

      const response = await request(app.getHttpServer())
        .get('/products')
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toBe('Wireless Keyboard');
      expect(response.body.meta.total).toBe(1);

      expect(mockProductsService.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 1,
          limit: 10,
          sortBy: 'createdAt',
          sortOrder: 'desc',
        }),
      );
    });

    it('should transform query parameters into the correct types', async () => {
      mockProductsService.findAll.mockResolvedValue({
        data: [],
        meta: {
          total: 0,
          page: 2,
          limit: 5,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: true,
        },
      });

      await request(app.getHttpServer())
        .get('/products')
        .query({
          page: '2',
          limit: '5',
          minPrice: '100',
          maxPrice: '5000',
          inStock: 'true',
          category: ' Electronics ',
          sortBy: 'price',
          sortOrder: 'asc',
        })
        .expect(200);

      expect(mockProductsService.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 2,
          limit: 5,
          minPrice: 100,
          maxPrice: 5000,
          inStock: true,
          category: 'Electronics',
          sortBy: 'price',
          sortOrder: 'asc',
        }),
      );
    });

    it('should reject invalid pagination parameters', async () => {
      await request(app.getHttpServer())
        .get('/products')
        .query({ page: '0', limit: '200' })
        .expect(400);

      expect(mockProductsService.findAll).not.toHaveBeenCalled();
    });

    it('should reject unsupported sort fields', async () => {
      await request(app.getHttpServer())
        .get('/products')
        .query({ sortBy: 'password' })
        .expect(400);

      expect(mockProductsService.findAll).not.toHaveBeenCalled();
    });
  });

  describe('GET /products/:id', () => {
    it('should return one product', async () => {
      mockProductsService.findOne.mockResolvedValue(mockProduct);

      const response = await request(app.getHttpServer())
        .get(`/products/${productId}`)
        .expect(200);

      expect(response.body.name).toBe('Wireless Keyboard');

      expect(mockProductsService.findOne).toHaveBeenCalledWith(productId);
    });

    it('should return HTTP 404 when the product does not exist', async () => {
      const { NotFoundException } = await import('@nestjs/common');

      mockProductsService.findOne.mockRejectedValue(
        new NotFoundException('Product not found'),
      );

      await request(app.getHttpServer())
        .get(`/products/${productId}`)
        .expect(404);
    });
  });

  describe('PATCH /products/:id', () => {
    it('should update a product', async () => {
      const updatedProduct = {
        ...mockProduct,
        price: 1999,
      };

      mockProductsService.update.mockResolvedValue(updatedProduct);

      const response = await request(app.getHttpServer())
        .patch(`/products/${productId}`)
        .send({ price: 1999 })
        .expect(200);

      expect(response.body.price).toBe(1999);

      expect(mockProductsService.update).toHaveBeenCalledWith(productId, {
        price: 1999,
      });
    });

    it('should reject invalid update data', async () => {
      await request(app.getHttpServer())
        .patch(`/products/${productId}`)
        .send({ price: -500 })
        .expect(400);

      expect(mockProductsService.update).not.toHaveBeenCalled();
    });
  });

  describe('DELETE /products/:id', () => {
    it('should delete a product', async () => {
      mockProductsService.remove.mockResolvedValue({
        message: 'Product deleted successfully',
      });

      const response = await request(app.getHttpServer())
        .delete(`/products/${productId}`)
        .expect(200);

      expect(response.body.message).toBe('Product deleted successfully');

      expect(mockProductsService.remove).toHaveBeenCalledWith(productId);
    });

    it('should return HTTP 404 when the product does not exist', async () => {
      const { NotFoundException } = await import('@nestjs/common');

      mockProductsService.remove.mockRejectedValue(
        new NotFoundException('Product not found'),
      );

      await request(app.getHttpServer())
        .delete(`/products/${productId}`)
        .expect(404);
    });
  });
});
