import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId } from 'mongoose';
import type { Model, QueryFilter } from 'mongoose';

import { Product, ProductDocument } from './schemas/product.schema.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { SearchProductsDto } from './dto/search-products.dto.js';

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 11000
  );
}

// Escape special regular-expression characters supplied by users.
function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export interface PaginatedProducts {
  data: ProductDocument[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
  ) {}

  // CREATE
  async create(createProductDto: CreateProductDto): Promise<ProductDocument> {
    try {
      return await this.productModel.create(createProductDto);
    } catch (error: unknown) {
      if (isDuplicateKeyError(error)) {
        throw new ConflictException('A product with this SKU already exists');
      }
      throw error;
    }
  }

  // ADVANCED SEARCH, FILTERING, SORTING AND PAGINATION
  async findAll(query: SearchProductsDto): Promise<PaginatedProducts> {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      inStock,
      page,
      limit,
      sortBy,
      sortOrder,
    } = query;

    // Validate the relationship between minimum and maximum price.
    if (
      minPrice !== undefined &&
      maxPrice !== undefined &&
      minPrice > maxPrice
    ) {
      throw new BadRequestException('minPrice cannot be greater than maxPrice');
    }

    // Build the MongoDB filter dynamically.
    const filter: QueryFilter<Product> = {};

    // KEYWORD SEARCH
    if (search) {
      const searchRegex = new RegExp(escapeRegex(search), 'i');

      filter.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { sku: searchRegex },
      ];
    }

    // CATEGORY FILTER
    if (category) {
      filter.category = new RegExp(`^${escapeRegex(category)}$`, 'i');
    }

    // PRICE RANGE FILTER
    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceFilter: {
        $gte?: number;
        $lte?: number;
      } = {};

      if (minPrice !== undefined) {
        priceFilter.$gte = minPrice;
      }

      if (maxPrice !== undefined) {
        priceFilter.$lte = maxPrice;
      }

      filter.price = priceFilter;
    }

    // STOCK FILTER
    if (inStock === true) {
      filter.stock = { $gt: 0 };
    } else if (inStock === false) {
      filter.stock = 0;
    }

    // PAGINATION
    const skip = (page - 1) * limit;

    // SORTING
    const direction: 1 | -1 = sortOrder === 'asc' ? 1 : -1;

    const sort: Record<string, 1 | -1> = {
      [sortBy]: direction,
      _id: direction,
    };

    // Run product retrieval and total count in parallel.
    const [products, total] = await Promise.all([
      this.productModel.find(filter).sort(sort).skip(skip).limit(limit).exec(),

      this.productModel.countDocuments(filter).exec(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1 && total > 0,
      },
    };
  }

  // FIND ONE
  async findOne(id: string): Promise<ProductDocument> {
    this.validateProductId(id);

    const product = await this.productModel.findById(id).exec();

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  // UPDATE
  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductDocument> {
    this.validateProductId(id);

    try {
      const updatedProduct = await this.productModel
        .findByIdAndUpdate(id, updateProductDto, {
          new: true,
          runValidators: true,
        })
        .exec();

      if (!updatedProduct) {
        throw new NotFoundException('Product not found');
      }

      return updatedProduct;
    } catch (error: unknown) {
      if (isDuplicateKeyError(error)) {
        throw new ConflictException('Another product already uses this SKU');
      }

      throw error;
    }
  }

  // DELETE
  async remove(id: string): Promise<ProductDocument> {
    this.validateProductId(id);

    const deletedProduct = await this.productModel.findByIdAndDelete(id).exec();

    if (!deletedProduct) {
      throw new NotFoundException('Product not found');
    }

    return deletedProduct;
  }

  private validateProductId(id: string): void {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid product ID');
    }
  }
}
