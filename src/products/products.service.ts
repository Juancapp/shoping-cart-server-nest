import { Injectable, NotFoundException } from '@nestjs/common';
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

    const resPerPage = 10;
    const currentPage = 'page' in query ? Number(query.page) : 1;
    const skip = resPerPage * (currentPage - 1);

    const sortQuery = {};
    const findQuery =
      'title' in query
        ? {
            ...query,
            title: {
              $regex: query.title,
              $options: 'i',
            },
          }
        : { ...query };

    if ('priceOrder' in findQuery) {
      sortQuery['price'] = order[findQuery.priceOrder];
      delete findQuery.priceOrder;
    }

    console.log(sortQuery);

    if ('rateOrder' in findQuery) {
      sortQuery['rating.rate'] = order[findQuery.rateOrder];
      delete findQuery.rateOrder;
    }

    if ('page' in findQuery) {
      delete findQuery.page;
    }

    const products = await this.productModel
      .find(findQuery)
      .limit(resPerPage)
      .sort(sortQuery)
      .skip(skip);

    if (!products.length) throw new NotFoundException('There are not products');

    return products;
  }

  async createProduct(product: Product): Promise<Product> {
    const res = await this.productModel.create(product);
    return res;
  }

  async editProduct(id: string, product: Product): Promise<Product> {
    const res = await this.productModel.findByIdAndUpdate(id, product, {
      new: true,
      runValidators: true,
    });

    return res;
  }

  async findByProductId(productId: number): Promise<Product> {
    const product = await this.productModel.findOne({ productId: productId });

    if (!product) throw new NotFoundException('Book not found');

    return product;
  }
}
