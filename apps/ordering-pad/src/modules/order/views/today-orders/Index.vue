<script lang="ts" setup>
import { OrderTypeFilter, Order } from '@fjord/core/models/order';
import { reactive, watch } from 'vue';
import { useOrderStore } from '../../store/index';
import { TableColumn } from '@fjord/core/types/vendor/q-table';
import { DateUtils, OrdersUtils } from '@fjord/core/utils';
import { useRouter } from 'vue-router';
import AppFilterOrderType from './components/AppFilterOrderType.vue';
import { usePreferenceStore } from '@/modules/preference/store/preference';
import { useCartStore } from '@/modules/cart/store';

interface State {
  loading: boolean;
  orders: Order[];
  orderTypeFilter: OrderTypeFilter;
  pagination: {
    page: number;
    limit: number;
  };
}

const state = reactive<State>({
  loading: true,
  orders: [],
  orderTypeFilter: OrderTypeFilter.ALL,
  pagination: {
    page: 1,
    limit: 20
  },
});

const orderStore = useOrderStore();
const { back } = useRouter();

const { moneySymbol } = usePreferenceStore();

const { loadCartFromOrder } = useCartStore();

const columns: TableColumn[] = [
  {
    name: 'dailyId',
    label: 'Daily Id',
    field: 'dailyId',
    align: 'center',
    sortable: true,
    style: 'width: 50px;'
  },
  {
    name: 'date',
    label: 'Date',
    field: 'date',
    align: 'center',
    sortable: true,
    format: (val) => DateUtils.formatDateHoursMinutesPostOrAnteMeridiem(val),
    style: 'width: 105px;'
  },
  {
    name: 'deliveryType',
    label: 'Delivery Type',
    field: 'deliveryType',
    align: 'center',
    sortable: true,
    format: (val) => val.toUpperCase(),
    style: 'width: 120px;'
  },
  {
    name: 'address',
    label: 'Address',
    field: 'address',
    align: 'center',
    sortable: true,
    style: 'text-align: start;'
  },
  {
    name: 'method',
    label: 'Payment Method',
    field: 'method',
    align: 'center',
    sortable: true,
    style: 'width: 100px;'
  },
  {
    name: 'totalPrice',
    label: 'Total Price',
    field: 'totalPrice',
    align: 'center',
    sortable: true,
    format: (val) => `${moneySymbol} ${val.toFixed(2)}`,
    style: 'font-size: 1.5rem; width: 115px;',
  },
  {
    name: 'actions',
    label: 'Actions',
    field: 'actions',
    align: 'center',
    style: 'width: 95px;'
  },
];

const viewOrder = async (order: Order) => {
  if (!order.uuid) return;
  const data = await orderStore.getOrder(order.uuid);
  orderStore.setOrder(data);
  loadCartFromOrder(data);
};

const loadMore = async () => {
  state.pagination.page = state.pagination.page + 1;
  const data = await getTodayOrders();
  state.orders = state.orders.concat(data);
  OrdersUtils.decreasingSortOrdersDate(state.orders);
};

const loadTodayOrders = async () => {
  state.orders = await getTodayOrders();
  OrdersUtils.decreasingSortOrdersDate(state.orders);
};

const getTodayOrders = async (): Promise<Order[]> => {
  try {
    state.loading = true;

    const data = await orderStore.getTodayOrders(
      state.orderTypeFilter,
      state.pagination.page,
      state.pagination.limit
    );

    return data;
  } finally {
    state.loading = false;
  }
}

loadTodayOrders();

watch(() => state.orderTypeFilter, () => {
  loadTodayOrders();
})
</script>

<template>
  <q-card class="today-order">
    <q-card-section class="card__header">
      <div>
        <q-btn
          v-sound-click
          class="card__button"
          size="small"
          color="primary"
          icon="arrow_left"
          label="Back"
          @click="back"
        />
        <div class="order-list__summary">
          All Sales:
          <q-chip
            color="negative"
            text-color="white"
            square
            :label="orderStore.orderCount"
          />
        </div>
      </div>
      <div>
        <AppFilterOrderType
          v-model="state.orderTypeFilter"
        />
      </div>
    </q-card-section>
    <q-card-section class="today-order__main-section">
      <q-table
        color="primary"
        hide-pagination
        hide-header
        flat
        :columns="columns"
        :rows="state.orders"
        :bordered="false"
        :rows-per-page-options="[0]"
        wrap-cells
      >
        <template #body-cell-address="scope">
          <q-td :style="scope.col.style">
            <template v-if="scope.row.address">
              <span
                v-if="scope.row.address.fullName || scope.row.address.phone"
                class="client-name"
              >
                {{ scope.row.address.fullName || '' }}
                {{ scope.row.address.phone }}
              </span>
              <div class="address">
                {{ scope.row.address.addressLine1 }}
              </div>
            </template>
          </q-td>
        </template>
        <template #body-cell-method="scope">
          <q-td
            v-if="scope.row.payment.status === 'Paid'"
            :style="scope.col.style"
          >
            <q-chip
              v-if="scope.row.payment.method === 'Cash'"
              color="positive"
              text-color="white"
              square
              :label="scope.row.payment.method"
            />
            <q-chip
              v-else
              color="info"
              text-color="white"
              square
              :label="scope.row.payment.method"
            />
          </q-td>
          <q-td
            v-else
            :style="scope.col.style"
          >
            <q-chip
              color="warning"
              text-color="white"
              square
              :label="scope.row.payment.method"
            />
          </q-td>
        </template>
        <template #body-cell-actions="scope">
          <q-td :style="scope.col.style">
            <q-btn
              v-sound-click
              color="blue"
              @click="viewOrder(scope.row)"
              label="View"
            />
          </q-td>
        </template>
      </q-table>
    </q-card-section>
    <div class="column items-center q-pa-md">
      <q-btn
        v-sound-click
        color="negative"
        :disabled="orderStore.orderCount <= state.orders.length"
        :loading="state.loading"
        label="SHOW MORE"
        @click="loadMore"
      />
    </div>
  </q-card>
</template>

<style lang="scss" scoped>
.today-order {
  display: flex;
  flex-direction: column;
  height: 100%;
  margin-inline: 1rem;

  &__main-section {
    flex: 1;
    overflow-y: auto;
  }
}

.card {
  &__header {
    display: flex;
    justify-content: space-between;
  }

  &__button {
    min-width: 8rem;
    font-weight: bold;
    font-size: 1.2rem;
    box-shadow: 0 2px 4px 0 $light-gray-1, 0 0 6px 0 $white;
  }
}

.order-list {
  &__summary {
    color: $black;
    margin: 0.5rem 0;
    font-size: 1.5rem;
  }
}

.table {
  max-height: calc(100vh - 290px);
  overflow-y: auto;
}

.address {
  font-size: 1.1em;
}

.client-name {
  font-weight: bold;
}

:deep() {
  .on-left {
    margin: 0;
  }
}
</style>
