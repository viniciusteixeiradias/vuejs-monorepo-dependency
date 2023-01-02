
<script lang="ts" setup>
import { reactive } from 'vue';
import { Order } from '@fjord/core/models/order';
import { useRouter } from 'vue-router';

import AppHeaderTable from './components/AppHeaderTable.vue';
import { usePreferenceStore } from '@/stores/preference';
import { useOrderStore } from '@/modules/order/store/index';
import { useCartStore } from '@/stores/cart';
import { TableColumn } from '@fjord/core/types/vendor/q-table';
import { DateUtils, OrdersUtils } from '@fjord/core/utils';
import PrintDialog from '../../components/PrintDialog.vue';

interface State {
  loading: boolean;
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
  };
  shouldShowConfirmDialogPrinter: boolean;
}

const state: State = reactive({
  loading: true,
  orders: [],
  pagination: {
    page: 1,
    limit: 20
  },
  shouldShowConfirmDialogPrinter: false
});

const router = useRouter();
const orderStore = useOrderStore();
const { moneySymbol } = usePreferenceStore();

const { loadCartFromOrder } = useCartStore();

const columns: TableColumn[] = [
  {
    name: 'index',
    label: 'Index',
    field: 'index',
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
    name: 'address',
    label: 'Address',
    field: 'address',
    align: 'left',
    sortable: true,
    style: 'text-align: start;'
  },
  {
    name: 'method',
    label: 'Payment Method',
    field: 'method',
    align: 'right',
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

const goBack = () => router.push({ name: 'main' });
const index = (index: number): number => state.orders.length - index;

const showOrder = async (order: Order) => {
  await getAndSetOrderInStore(order);
};

const printOrder = async (order: Order) => {
  await getAndSetOrderInStore(order);
  state.shouldShowConfirmDialogPrinter = true;
};

const getAndSetOrderInStore = async (order: Order, viewOrder: boolean = false) => {
  if (!order.uuid) return;
  const data = await orderStore.getOrder(order.uuid);
  orderStore.setOrder(data);

  if (viewOrder) {
    loadCartFromOrder(data);
  }
}

const loadDeliveryOrders = async () => {
  state.orders = await getDeliveryOrders();
  OrdersUtils.decreasingSortOrdersDate(state.orders);
};

const loadMore = async () => {
  state.pagination.page++;
  const data = await getDeliveryOrders();
  state.orders = state.orders.concat(data);
  OrdersUtils.decreasingSortOrdersDate(state.orders);
};

const getDeliveryOrders = async (): Promise<Order[]> => {
  try {
    state.loading = true;
    const data = await orderStore.getDeliveryOrders(
      state.pagination.page,
      state.pagination.limit
    );

    return data;
  } finally {
    state.loading = false;
  }
};

loadDeliveryOrders();
</script>

<template>
  <q-card class="drivers-view">
    <q-card-section class="card__header">
      <div style="text-align: start;">
        <q-btn
          v-sound-click
          class="card__button"
          size="small"
          color="primary"
          icon="arrow_left"
          label="Back"
          @click="goBack"
        />
        <div class="driver-list__summary">
          All Deliveries:
          <q-chip
            color="negative"
            text-color="white"
            square
            :label="orderStore.orderCount"
          />
        </div>
      </div>
      <AppHeaderTable :orders="state.orders" />
    </q-card-section>
    <q-card-section class="drivers-view__main-section">
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
        <template #body-cell-index="scope">
          <q-td>{{ index(scope.rowIndex) }}</q-td>
        </template>
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
          <q-td v-if="scope.row.status === 'On Hold'">
            <q-chip
              color="positive"
              text-color="white"
              square
              label="IN PROGRESS"
            />
          </q-td>
          <q-td v-else>
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
        </template>
        <template #body-cell-actions="scope">
          <q-td class="q-gutter-x-md">
            <q-btn
              v-sound-click
              rounded
              color="positive"
              icon="print"
              @click="printOrder(scope.row)"
            />
            <q-btn
              v-sound-click
              rounded
              color="negative"
              icon="search"
              @click="showOrder(scope.row)"
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
  <PrintDialog v-if="state.shouldShowConfirmDialogPrinter" />
</template>

<style lang="scss" scoped>
.drivers-view {
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

.driver-list {
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
