import { Cart, CartPayment } from '@fjord/core/models/cart';
import { Item } from '@fjord/core/models/item';
import { Order, OrderType, OrderItem } from '@fjord/core/models/order';
import { Payment } from '@fjord/core/models/payment';
import { Takeaway } from '@fjord/core/models/takeaway';
import { v4 } from 'uuid';

export const utils = {
  cartPaymentFactory(payment?: Payment): CartPayment {
    return {
      serviceFee: payment?.serviceFee ?? 0,
      payedValue: payment?.value ?? 0,
      paymentType: payment?.method ?? 'Cash',
    };
  },

  cartFactory(order: Order): Cart {
    return {
      discount: order.discount || 0,
      items: this.itemsFactory(order.items),
      takeaway: this.takeawayFactory(order),
    };
  },

  itemsFactory(orderItem?: OrderItem[]): Item[] {
    if (!orderItem) {
      return [];
    }

    return orderItem.map((item: OrderItem): Item => {
      return {
        ...item,
        uuid: v4(),
        name: item.name || item.product?.name,
        comment: item.comment || '',
        quantity: item.quantity || 0,
        price: item.price || 0,
        addons: item.addons || [],
        addonsExtra: item.addonsExtra || [],
        extra: item.extra || 0,
      };
    });
  },

  takeawayFactory(order: Order): Takeaway | undefined {
    const deliveryType = order.deliveryType;
    const isDeliveryOrCollection =
      deliveryType === OrderType.DELIVERY ||
      deliveryType === OrderType.COLLECTION;

    if (!isDeliveryOrCollection || !deliveryType) {
      return undefined;
    }

    return {
      type: deliveryType,
      deliveryFee: order.deliveryFee,
      extraDelivery: order.extraDeliveryFee,
      addressUuid: order.address?.uuid ?? '',
      phoneNumber: order.address?.phone ?? '',
      name: order.address?.fullName ?? '',
      address: order.address?.addressLine1 ?? '',
      eirCode: order.address?.postalCode ?? '',
      distance: order.address?.distance ?? '',
      comment: order.comment ?? '',
    };
  },
};
