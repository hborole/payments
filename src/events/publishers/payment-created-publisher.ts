import { PaymentCreatedEvent, Publisher, Subjects } from '@hbofficial/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
