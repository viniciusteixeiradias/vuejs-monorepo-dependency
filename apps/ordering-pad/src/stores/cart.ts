import { defineStore } from 'pinia'
import { Cart, CartPayment } from '@fjord/core/src/models/cart'
import { Item } from '@fjord/core/src/models/item'
import { Order, OrderType, OrderItem } from '@fjord/core/src/models/order'
import { Payment } from '@fjord/core/src/models/payment'
import { Takeaway } from '@fjord/core/src/models/takeaway'
import { v4 as uuidv4 } from 'uuid'

interface State {
  cart: Cart
  editItem: Item | null
  payment: CartPayment
  baseOrder: Order | null
}

export const useCartStore = defineStore('cart', {
  state(): State {
    return {
      cart: {
        discount: 0,
        items: []
      },
      editItem: null,
      payment: {
        paymentType: 'Cash',
        payedValue: 0,
        serviceFee: 0
      },
      baseOrder: null
    }
  },

  actions: {
    loadCartFromOrder(order: Order): void {
      this.baseOrder = order
      this.payment = cartPaymentFactory(order.payment)
      this.cart = cartFactory(order)
    }
  }
})

const cartPaymentFactory = (payment?: Payment): CartPayment => {
  return {
    serviceFee: payment?.serviceFee ?? 0,
    payedValue: payment?.value ?? 0,
    paymentType: payment?.method ?? 'Cash'
  }
}

const cartFactory = (order: Order): Cart => {
  return {
    discount: order.discount || 0,
    items: itemsFactory(order.items),
    takeaway: takeawayFactory(order)
  }
}

const itemsFactory = (orderItem?: OrderItem[]): Item[] => {
  if (!orderItem) {
    return []
  }

  return orderItem.map((item: OrderItem): Item => {
    return {
      ...item,
      uuid: uuidv4(),
      name: item.name || item.product?.name,
      comment: item.comment || '',
      quantity: item.quantity || 0,
      price: item.price || 0,
      addons: item.addons || [],
      addonsExtra: item.addonsExtra || [],
      extra: item.extra || 0
    }
  })
}

const takeawayFactory = (order: Order): Takeaway | undefined => {
  const deliveryType = order.deliveryType
  const isDeliveryOrCollection = deliveryType === OrderType.DELIVERY || deliveryType === OrderType.COLLECTION

  if (!isDeliveryOrCollection || !deliveryType) {
    return undefined
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
    comment: order.comment ?? ''
  }
}
