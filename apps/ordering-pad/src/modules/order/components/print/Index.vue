
<script lang="ts" setup>
import { Addon, AddonGroup } from '@fjord/core/models/addon';
import { Item } from '@fjord/core/models/item';
import { OrderItem, OrderType } from '@fjord/core/models/order';
import moment from 'moment';
import { computed } from 'vue';

import fastDelivery from '@fjord/core/assets/fast-delivery.png';
import takeAway from '@fjord/core/assets/takeaway.png';
import { useOrderStore } from '../../store/index';
import { storeToRefs } from 'pinia';
import { usePreferenceStore } from '@/modules/preference/store/preference';
import { useTableStore } from '@/modules/table/store';

import style from "./index.css?inline"

const props = defineProps<{
  partialPrint?: boolean;
}>();

const { order } = storeToRefs(useOrderStore());
const { moneySymbol, preferences } = storeToRefs(usePreferenceStore());
const { printableItems } = storeToRefs(useTableStore());

const sortedItems = () => {
  let items = [...(order.value?.items ?? [])];

  items = items.sort((a, b) => {
    if (
      !a.product ||
      !b.product ||
      !a.product.category ||
      !b.product.category
    ) {
      return 0;
    }

    if (
      Number(a.product.category.printRank) >
      Number(b.product.category.printRank)
    ) {
      return 1;
    }
    if (
      Number(a.product.category.printRank) <
      Number(b.product.category.printRank)
    ) {
      return -1;
    }

    if (a.product.category.uuid < b.product.category.uuid) {
      return 1;
    }
    if (a.product.category.uuid > b.product.category.uuid) {
      return -1;
    }
    if (a.product.category.name < b.product.category.name) {
      return 1;
    }
    if (a.product.category.name > b.product.category.name) {
      return -1;
    }
    return 0;
  });

  return items;
};

const orderItems = computed(() => {
  return printableItems.value && props.partialPrint
    ? printableItems.value
    : sortedItems();
});

const showPaymentText = computed(() =>
  order.value?.origin === 'Online'
  || order.value?.deliveryType === OrderType.COLLECTION
  || order.value?.deliveryType === OrderType.DELIVERY
);

const orderType = order.value?.tableNumber
  ? `TABLE ${order.value.tableNumber}`
  : order.value?.deliveryType
    ? `${order.value.deliveryType.toUpperCase()}`
    : 'WALK IN';

const orderDate = moment(order.value?.date).format('MMMM Do YYYY, h:mm a');

const deliveryFee = computed((): number => {
  return (
    (order.value?.deliveryFee ? order.value.deliveryFee : 0) +
    (order.value?.extraDeliveryFee ? order.value.extraDeliveryFee : 0)
  );
});

const isPaidOrder = computed(() => order.value?.payment && order.value.payment.status === 'Paid');

const itemDescription = (item: Item | OrderItem): string => {
  const categoryName = item.product?.category?.composeName
    ? `${item.product?.category.name} `
    : '';
  const composeNamesFirst = (item.addons || [])
    .map((addongroup) =>
      addongroup.addons
        .filter(
          (addon: Addon) =>
            addon.composeName &&
            addon.composeName == 'Show First' &&
            addon.quantity == 1
        )
        .map((addon: Addon) => addon.name)
        .join(' ')
    )
    .join(' ');

  const composeNamesLast = (item.addons || [])
    .map((addongroup) =>
      addongroup.addons
        .filter(
          (addon: Addon) =>
            addon.composeName &&
            addon.composeName == 'Show Last' &&
            addon.quantity == 1
        )
        .map((addon: Addon) => addon.name)
        .join(' ')
    )
    .join(' ');

  return `${item.quantity} x ${categoryName}${composeNamesFirst} ${item.name ? item.name : item.product?.name
    } ${composeNamesLast}`;
};

const addons = (item: Item | OrderItem) => {
  return item.addons
    ? item.addons.filter((addongroup: AddonGroup) =>
      addongroup.addons.some(
        (addon) =>
          !addon.composeName ||
          addon.composeName == 'Not Show' ||
          addon.quantity > 1
      )
    )
    : [];
};

const addonsExtra = (item: Item | OrderItem) => {
  return item.addonsExtra ? item.addonsExtra : [];
};

const totalItem = (item: Item | OrderItem) => {
  return (item.quantity || 1) * ((item.price || 0) + (item.extra || 0));
};

const printCategoryName = (index: number) => {
  if (Number(orderItems.value[index].product?.category?.printRank) === 0) {
    return '';
  }

  if (
    index > 0 &&
    orderItems.value[index].product?.category?.uuid ===
    orderItems.value[index - 1].product?.category?.uuid
  ) {
    return '';
  }

  return `--- ${orderItems.value[index].product?.category?.name ?? ''} ---`;
};

const companyNamePrintSize = `${preferences?.value?.general.companyNamePrintSize || '1.5'}rem`;
</script>

<template>
  <component :is="'style'">
    {{ style }}
  </component>
  <div
    :style="`--company-name-print-size: ${companyNamePrintSize};`"
    class="print-order"
  >
    <div class="text-center">
      <p class="title">{{ preferences?.company.name }}</p>
      <p>{{ preferences?.company.address }}</p>
      <p>{{ preferences?.company.phone }}</p>
      <p>{{ preferences?.company.websiteUrl }}</p>
      <h3>{{ orderType }}</h3>
      <p>{{ orderDate }}</p>
      <p
        v-if="order?.status !== 'On Hold' && order?.status !== 'Table'"
        style="font-weight: bold"
      >
        Sale {{ order?.dailyId }}
      </p>
    </div>
    <p
      v-show="order?.comment"
      style="font-weight: bold"
    >
      Comment: {{ order?.comment }}
    </p>
    <hr />
    <div>
      <table>
        <template
          v-for="(item, index) in orderItems"
          :key="index"
        >
          <tr style="text-align: center">
            <td colspan="2">
              {{ printCategoryName(index) }}
            </td>
          </tr>
          <tr>
            <td style="width: 100%">
              <div class="print__description">
                {{ itemDescription(item) }}
              </div>
              <div v-if="item.comment">
                {{ item.comment }}
              </div>
              <div
                v-for="(addongroup, idx) in addons(item)"
                :key="idx"
              >
                <p
                  v-if="addongroup.showName"
                  class="print__option-name"
                >
                  {{ ` --- ${addongroup.name} ---` }}
                  <br />
                </p>
                <div
                  v-for="(addon, idx) in addongroup.addons"
                  :key="idx"
                >
                  <p
                    v-for="index in addon.quantity"
                    :key="index"
                    class="print__addon"
                  >
                    {{ addon.name }}
                    <br />
                  </p>
                </div>
              </div>
              <div
                v-for="(addongroup, idx) in addonsExtra(item)"
                :key="idx"
              >
                <p
                  v-if="addongroup.showName"
                  class="print__option-name"
                >
                  {{ ` --- ${addongroup.name} ---` }}
                  <br />
                </p>
                <div
                  v-for="(addon, idx) in addongroup.addons"
                  :key="idx"
                >
                  <p
                    v-for="index in addon.quantity"
                    :key="index"
                    class="print__addon"
                  >
                    {{ addon.name }}<br />
                  </p>
                </div>
              </div>
            </td>
            <td style="text-align: right">
              {{ `${moneySymbol}${totalItem(item).toFixed(2)}` }}
            </td>
          </tr>
        </template>
      </table>
      <hr />
      <table v-if="!partialPrint">
        <tr>
          <td class="print__subtotal">
            Sub Total
          </td>
          <td
            class="print__subtotal"
            style="text-align: right"
          >
            {{ `${moneySymbol} ${order?.subTotal?.toFixed(2)}` }}
          </td>
        </tr>
        <tr v-show="
          order?.deliveryType == 'Delivery' &&
          (order?.deliveryFee || order?.extraDeliveryFee)
        ">
          <td class="print__subtotal">
            Delivery Fee
          </td>
          <td
            class="print__subtotal"
            style="text-align: right"
          >
            {{ `${moneySymbol} ${deliveryFee.toFixed(2)}` }}
          </td>
        </tr>
        <tr v-show="order?.payment && order?.payment.serviceFee">
          <td class="print__subtotal">
            Service Charge
          </td>
          <td
            class="print__subtotal"
            style="text-align: right"
          >
            {{ `${moneySymbol} ${order?.payment?.serviceFee?.toFixed(2)}` }}
          </td>
        </tr>
        <tr v-show="order?.discountValue">
          <td class="print__subtotal">
            {{ `Discount ${order?.discount}%` }}
          </td>
          <td
            class="print__subtotal"
            style="text-align: right"
          >
            {{ `- ${moneySymbol} ${order?.discountValue?.toFixed(2)}` }}
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <hr class="dotted" />
          </td>
        </tr>
        <tr>
          <td class="print__total">
            Total
          </td>
          <td
            class="print__total"
            style="text-align: right"
          >
            {{ `${moneySymbol} ${order?.totalPrice?.toFixed(2)}` }}
          </td>
        </tr>
        <tr v-show="order?.payment?.status == 'Paid'">
          <td class="print__subtotal">
            Paid
          </td>
          <td
            class="print__subtotal"
            style="text-align: right"
          >
            {{ `${moneySymbol} ${order?.payment?.value?.toFixed(2)}` }}
          </td>
        </tr>
        <tr v-show="order?.changeDue">
          <td colspan="2">
            <hr class="dotted" />
          </td>
        </tr>
        <tr v-show="order?.changeDue">
          <td class="print__subtotal">
            Change Due
          </td>
          <td
            class="print__subtotal"
            style="text-align: right"
          >
            {{ `${moneySymbol} ${order?.changeDue.toFixed(2)}` }}
          </td>
        </tr>
      </table>
      <hr />
      <div v-if="showPaymentText">
        <p
          v-if="isPaidOrder"
          class="payment-text"
        >
          ORDER HAS BEEN PAID
        </p>
        <p
          v-else
          class="payment-text"
        >
          ORDER NOT PAID
        </p>
        <p
          v-if="order?.payment && order?.payment.stripeToken"
          class="payment-info"
        >
          Card ending with: {{ order?.payment.last4digits }}
        </p>
        <hr />
      </div>
      <div v-else-if="isPaidOrder">
        <p class="payment-text">
          Paid by {{ order?.payment?.method }}
        </p>
        <hr />
      </div>
      <div
        v-if="!partialPrint && order?.address"
        class="address"
      >
        <div class="address__header">
          <div>
            <strong>{{ order?.deliveryType }} Info:</strong>
            <p>
              <strong>{{ order?.address.fullName }}</strong>
            </p>
            <p>
              <strong>{{ order?.address.phone }}</strong>
            </p>
          </div>
          <div>
            <img
              v-if="order?.deliveryType?.toUpperCase() === 'DELIVERY'"
              class="address__icon"
              :src="fastDelivery"
            />
            <img
              v-else
              class="address__icon"
              :src="takeAway"
            />
          </div>
        </div>
        <div v-if="order?.deliveryType?.toUpperCase() === 'DELIVERY'">
          {{ order?.address.addressLine1 }}
          <br v-if="order?.address.postalCode" />
          {{ order?.address.postalCode }}
          <br />
          <strong>DISTANCE: </strong> {{ order?.address.distance }}
        </div>
      </div>
      <div class="footer">
        <p
          v-if="order?.deliveryTime"
          class="text-center"
          style="font-weight: bold; padding-bottom: 0.5rem"
        >
          {{
order?.deliveryType == 'Collection'
  ? `Collect at ${order?.deliveryTime}.`
  : `Delivery at ${order?.deliveryTime}.`
          }}
        </p>
        <p class="text-center">Thank you for ordering</p>
        <p class="text-center">Powered by Foodinn.ie</p>
      </div>
    </div>
  </div>
</template>
