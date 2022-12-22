<script lang="ts" setup>
import { OrderTypeFilter, Order } from '@fjord/core/src/models/order';
import { reactive } from 'vue';
import { useOrderStore } from '@/stores/order'
import { TableColumn } from '@fjord/core/src/types/vendor/q-table';
import { formatDate } from '@fjord/core/src/utils';
import { useRouter } from 'vue-router';
import { usePreferenceStore } from '@/stores/preference';
import { storeToRefs } from 'pinia';

import AppFilterOrderType from '@/components/AppFilterOrderType.vue';

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
const router = useRouter();

const { moneySymbol } = storeToRefs(usePreferenceStore());

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
    format: (val) => `${moneySymbol.value} ${val.toFixed(2)}`,
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

// const { loadCartFromOrder } = useMethods<CartMethods>('cart');

const goBack = () => router.back();

const viewOrder = async (order: Order) => {
  if (!order.uuid) return;
  const data = await orderStore.getOrder(order.uuid);
  orderStore.setOrder(data);
  // loadCartFromOrder(data);
};

const loadMore = async () => {
  try {
    state.loading = true;
    state.pagination.page = state.pagination.page + 1;

    const data = await orderStore.getTodayOrders(
      state.orderTypeFilter,
      state.pagination.page,
      state.pagination.limit
    );

    state.orders = state.orders.concat(data);
    state.orders.sort((a, b) => a && a.dailyId && b && b.dailyId ? b.dailyId - a.dailyId : 0);
  } finally {
    state.loading = false;
  }
};

const updateOrderTypeFilter = (orderTypeFilter: OrderTypeFilter) => {
  state.orderTypeFilter = orderTypeFilter;
  loadData();
};

const loadData = async () => {
  try {
    state.loading = true;
    const data = await orderStore.getTodayOrders(
      state.orderTypeFilter,
      state.pagination.page,
      state.pagination.limit
    );
    state.orders = data;
    state.orders.sort((a, b) => a && a.dailyId && b && b.dailyId ? b.dailyId - a.dailyId : 0);
  } finally {
    state.loading = false;
  }
};

loadData();
</script>

<template>
  <q-card class="today-order">
    <q-card-section class="card__header">
      <div>
        <q-btn
          class="card__button"
          size="small"
          color="primary"
          icon="arrow_left"
          label="Back"
          @click="goBack"
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
          :model-value="state.orderTypeFilter"
          @update:model-value="updateOrderTypeFilter"
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
        <template #body-cell-date="scope">
          <q-td :style="scope.col.style">
            <q-icon name="schedule" />
            {{ formatDate(scope.value) }}
          </q-td>
        </template>
        <template #body-cell-address="scope">
          <q-td :style="scope.col.style">
            <template v-if="scope.row.address">
              <span
                v-if="scope.row.address.fullName || scope.row.address.phone"
                class="client-name"
              >
                {{
                    scope.row.address.fullName
                      ? `${scope.row.address.fullName}: `
                      : ''
                }}
                {{ `${scope.row.address.phone}` }}
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
              color="blue"
              @click="viewOrder(scope.row)"
            >
              View
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card-section>
    <div class="column items-center q-pa-md">
      <q-btn
        color="negative"
        :disabled="orderStore.orderCount <= state.orders.length"
        :loading="state.loading"
        @click="loadMore"
      >
        SHOW MORE
      </q-btn>
    </div>
  </q-card>
</template>

<style lang="scss" scoped>
.today-order {
  display: flex;
  flex-direction: column;
  height: 100%;

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
