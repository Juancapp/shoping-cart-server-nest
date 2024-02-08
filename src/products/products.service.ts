import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Product } from './product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private productModel: mongoose.Model<Product>,
  ) {}

  async findAll(query = {} as Record<string, never>): Promise<Product[]> {
    const order = {
      ['desc']: -1,
      ['asc']: 1,
    };

    const sortQuery = {};
    const findQuery = { ...query };

    if ('priceOrder' in findQuery) {
      sortQuery['price'] = order[findQuery.priceOrder];
      delete findQuery.priceOrder;
    }

    if ('rateOrder' in findQuery) {
      sortQuery['rating.rate'] = order[findQuery.rateOrder];
      delete findQuery.rateOrder;
    }

    const products = await this.productModel.find(findQuery).sort(sortQuery);

    return products;
  }

  async createProduct(product: Product): Promise<Product> {
    const res = await this.productModel.create(product);
    return res;
  }

  async findByProductId(productId: number): Promise<Product> {
    try {
      const product = await this.productModel.findOne({ productId: productId });
      return product;
    } catch (error) {
      return error;
    }
  }
}
