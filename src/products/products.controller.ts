import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.schema';

@Controller('products')
export class ProductsController {
  constructor(private productService: ProductsService) {}

  @Get()
  async getAllProducts(@Query() query): Promise<Product[]> {
    return this.productService.findAll(query);
  }

  @Get(':productId')
  async findByProductId(
    @Param('productId')
    productId: number,
  ): Promise<Product> {
    return this.productService.findByProductId(productId);
  }

  @Post()
  async createProduct(
    @Body()
    product,
  ): Promise<Product> {
    return this.productService.createProduct(product);
  }

  @Put(':id')
  async editProduct(
    @Param('id')
    id: string,
    @Body()
    product,
  ): Promise<Product> {
    return this.productService.editProduct(id, product);
  }
}
