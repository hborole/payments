import {
  Listener,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from '@hbofficial/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      status: OrderStatus.Created,
      userId: data.userId,
      version: data.version,
    });
    await order.save();

    msg.ack();
  }
}
