import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customersExists = await this.customersRepository.findById(
      customer_id,
    );
    if (!customersExists) {
      throw new AppError('Could not find any customer with the given id');
    }
    const existentProducts = await this.productsRepository.findAllById(
      products,
    );

    if (!existentProducts.length) {
      throw new AppError('Could not find any products with the given id');
    }

    const existentProductsIds = existentProducts.map(product => product.id);

    const checkInexistentProducts = products.filter(
      product => !existentProductsIds.includes(product.id),
    );

    if (!checkInexistentProducts.length) {
      throw new AppError(`could not product ${checkInexistentProducts[0].id}`);
    }

    const findProductsWithNoQuatintyAvailable = products.filter(
      product =>
        existentProducts.filter(p => p.id === product.id)[0].quantity <
        product.quantity,
    );
    if (findProductsWithNoQuatintyAvailable.length) {
      throw new AppError(
        `The quantity ${findProductsWithNoQuatintyAvailable[0].quantity} is not available for
         ${findProductsWithNoQuatintyAvailable[0].id}`,
      );
    }
  }
}

export default CreateOrderService;
