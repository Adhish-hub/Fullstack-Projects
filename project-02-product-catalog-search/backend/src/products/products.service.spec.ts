import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import type { Model } from 'mongoose';

import { ProductsService } from './products.service.js';
import type { Product } from './schemas/product.schema.js';
import type { CreateProductDto } from './dto/create-product.dto.js';
import type { UpdateProductDto } from './dto/update-product.dto.js';
import type { SearchProductsDto } from './dto/search-products.dto.js';

const PRODUCT_ID = '507f1f77bcf86cd799439011';


const sampleProduct = {
  _id: PRODUCT_ID,
  name: 'Mechanical Keyboard',
  description: 'RGB mechanical keyboard',
  price: 2500,
  category: 'Electronics',
  stock: 10,
  sku: 'KEY-001',
};

describe('ProductsService', () => {
  let service: ProductsService;

  let model: {
    create: ReturnType<typeof vi.fn>;
    find: ReturnType<typeof vi.fn>;
    countDocuments: ReturnType<typeof vi.fn>;
    findById: ReturnType<typeof vi.fn>;
    findByIdAndUpdate: ReturnType<typeof vi.fn>;
    findByIdAndDelete: ReturnType<typeof vi.fn>;
  };

  let findQuery: {
    sort: ReturnType<typeof vi.fn>;
    skip: ReturnType<typeof vi.fn>;
    limit: ReturnType<typeof vi.fn>;
    exec: ReturnType<typeof vi.fn>;
  };

  let countQuery: {
    exec: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    findQuery = {
      sort: vi.fn().mockReturnThis(),
      skip: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([sampleProduct]),
    };

    countQuery = {
      exec: vi.fn().mockResolvedValue(1),
    };

    model = {
      create: vi.fn().mockResolvedValue(sampleProduct),
      find: vi.fn().mockReturnValue(findQuery),
      countDocuments: vi.fn().mockReturnValue(countQuery),
      findById: vi.fn().mockReturnValue({
        exec: vi.fn().mockResolvedValue(sampleProduct),
      }),
      findByIdAndUpdate: vi.fn().mockReturnValue({
        exec: vi.fn().mockResolvedValue(sampleProduct),
      }),
      findByIdAndDelete: vi.fn().mockReturnValue({
        exec: vi.fn().mockResolvedValue(sampleProduct),
      }),
    };

    service = new ProductsService(model as unknown as Model<Product>);
  });

  describe('create', () => {
    it('should create a product successfully', async () => {
      const dto = {
        name: 'Mechanical Keyboard',
        description: 'RGB keyboard',
        price: 2500,
        category: 'Electronics',
        stock: 10,
        sku: 'KEY-001',
      } as CreateProductDto;

      await expect(service.create(dto)).resolves.toEqual(sampleProduct);
      expect(model.create).toHaveBeenCalledWith(dto);
    });

    it('should throw ConflictException for duplicate SKU', async () => {
      model.create.mockRejectedValue({ code: 11000 });

      const dto = { sku: 'KEY-001' } as CreateProductDto;

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });

    it('should rethrow unexpected database errors', async () => {
      const error = new Error('Database unavailable');
      model.create.mockRejectedValue(error);

      await expect(service.create({} as CreateProductDto)).rejects.toThrow(
        error,
      );
    });
  });

  describe('findAll', () => {
    it('should return products with pagination metadata', async () => {
      countQuery.exec.mockResolvedValue(25);

      const query = {
        page: 2,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      } as SearchProductsDto;

      const result = await service.findAll(query);

      expect(result.data).toEqual([sampleProduct]);
      expect(result.meta).toEqual({
        total: 25,
        page: 2,
        limit: 10,
        totalPages: 3,
        hasNextPage: true,
        hasPreviousPage: true,
      });

      expect(findQuery.skip).toHaveBeenCalledWith(10);
      expect(findQuery.limit).toHaveBeenCalledWith(10);
    });

    it('should reject a minimum price greater than maximum price', async () => {
      const query = {
        page: 1,
        limit: 10,
        sortBy: 'price',
        sortOrder: 'asc',
        minPrice: 5000,
        maxPrice: 1000,
      } as SearchProductsDto;

      await expect(service.findAll(query)).rejects.toThrow(BadRequestException);

      expect(model.find).not.toHaveBeenCalled();
    });

    it('should build a keyword search filter', async () => {
      const query = {
        search: 'keyboard',
        page: 1,
        limit: 10,
        sortBy: 'name',
        sortOrder: 'asc',
      } as SearchProductsDto;

      await service.findAll(query);

      const filter = model.find.mock.calls[0][0];

      expect(filter.$or).toHaveLength(3);
      expect(filter.$or[0].name).toBeInstanceOf(RegExp);
      expect(filter.$or[1].description).toBeInstanceOf(RegExp);
      expect(filter.$or[2].sku).toBeInstanceOf(RegExp);
    });

    it('should build a category filter', async () => {
      const query = {
        category: 'Electronics',
        page: 1,
        limit: 10,
        sortBy: 'name',
        sortOrder: 'asc',
      } as SearchProductsDto;

      await service.findAll(query);

      const filter = model.find.mock.calls[0][0];

      expect(filter.category).toBeInstanceOf(RegExp);
      expect(filter.category.test('electronics')).toBe(true);
    });

    it('should build a price range filter', async () => {
      const query = {
        minPrice: 1000,
        maxPrice: 5000,
        page: 1,
        limit: 10,
        sortBy: 'price',
        sortOrder: 'asc',
      } as SearchProductsDto;

      await service.findAll(query);

      const filter = model.find.mock.calls[0][0];

      expect(filter.price).toEqual({
        $gte: 1000,
        $lte: 5000,
      });
    });

    it('should filter products that are in stock', async () => {
      const query = {
        inStock: true,
        page: 1,
        limit: 10,
        sortBy: 'name',
        sortOrder: 'asc',
      } as SearchProductsDto;

      await service.findAll(query);

      expect(model.find.mock.calls[0][0].stock).toEqual({
        $gt: 0,
      });
    });

    it('should filter products that are out of stock', async () => {
      const query = {
        inStock: false,
        page: 1,
        limit: 10,
        sortBy: 'name',
        sortOrder: 'asc',
      } as SearchProductsDto;

      await service.findAll(query);

      expect(model.find.mock.calls[0][0].stock).toBe(0);
    });

    it('should apply ascending sorting', async () => {
      const query = {
        page: 1,
        limit: 10,
        sortBy: 'price',
        sortOrder: 'asc',
      } as SearchProductsDto;

      await service.findAll(query);

      expect(findQuery.sort).toHaveBeenCalledWith({
        price: 1,
        _id: 1,
      });
    });

    it('should execute product retrieval and count in parallel', async () => {
      const query = {
        page: 1,
        limit: 10,
        sortBy: 'name',
        sortOrder: 'desc',
      } as SearchProductsDto;

      await service.findAll(query);

      expect(model.find).toHaveBeenCalledTimes(1);
      expect(model.countDocuments).toHaveBeenCalledTimes(1);
      expect(findQuery.exec).toHaveBeenCalledTimes(1);
      expect(countQuery.exec).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a product using its ID', async () => {
      await expect(service.findOne(PRODUCT_ID)).resolves.toEqual(sampleProduct);

      expect(model.findById).toHaveBeenCalledWith(PRODUCT_ID);
    });

    it('should reject an invalid MongoDB ID', async () => {
      await expect(service.findOne('invalid-id')).rejects.toThrow(
        BadRequestException,
      );

      expect(model.findById).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when the product does not exist', async () => {
      model.findById.mockReturnValue({
        exec: vi.fn().mockResolvedValue(null),
      });

      await expect(service.findOne(PRODUCT_ID)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a product successfully', async () => {
      const dto = {
        price: 3000,
      } as UpdateProductDto;

      await expect(service.update(PRODUCT_ID, dto)).resolves.toEqual(
        sampleProduct,
      );

      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(PRODUCT_ID, dto, {
        new: true,
        runValidators: true,
      });
    });

    it('should throw NotFoundException when updating a missing product', async () => {
      model.findByIdAndUpdate.mockReturnValue({
        exec: vi.fn().mockResolvedValue(null),
      });

      await expect(
        service.update(PRODUCT_ID, {} as UpdateProductDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException when the updated SKU already exists', async () => {
      model.findByIdAndUpdate.mockReturnValue({
        exec: vi.fn().mockRejectedValue({ code: 11000 }),
      });

      await expect(
        service.update(PRODUCT_ID, {
          sku: 'DUPLICATE',
        } as UpdateProductDto),
      ).rejects.toThrow(ConflictException);
    });

    it('should reject an invalid product ID', async () => {
      await expect(
        service.update('invalid-id', {} as UpdateProductDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should delete a product successfully', async () => {
      await expect(service.remove(PRODUCT_ID)).resolves.toEqual(sampleProduct);

      expect(model.findByIdAndDelete).toHaveBeenCalledWith(PRODUCT_ID);
    });

    it('should throw NotFoundException when the product does not exist', async () => {
      model.findByIdAndDelete.mockReturnValue({
        exec: vi.fn().mockResolvedValue(null),
      });

      await expect(service.remove(PRODUCT_ID)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should reject an invalid product ID', async () => {
      await expect(service.remove('invalid-id')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
