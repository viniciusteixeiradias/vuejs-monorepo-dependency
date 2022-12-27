<script lang="ts" setup>
import { useRouter } from 'vue-router';
import assert from 'assert';

const { back } = useRouter();
</script>

<template>
  <h1>I am drivers</h1>
  <button @click="back">Back</button>
</template>
<!-- <script lang="ts" setup>
import { Order } from '@fjord/core/src/models/order';
import moment from 'moment';
import {
  reactive,
  computed,
  onBeforeMount
} from 'vue';
import { useRouter } from 'vue-router';

import { useGetters, useMethods } from '@/helpers/store';

import { OrderGetters, PreferenceGetters } from '@/types/store/getters';
import { CartMethods, OrderMethods } from '@/types/store/methods';

import AppHeaderTable from './components/AppHeaderTable.vue';

interface State {
  loading: boolean;
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
  };
}

const router = useRouter();
const { moneySymbol } = useGetters<PreferenceGetters>('preference');
const { orderCount } = useGetters<OrderGetters>('order');
const state: State = reactive({
  loading: true,
  orders: [],
  pagination: {
    page: 1,
    limit: 20
  }
});

const { getDeliveryOrders, getOrder, setOrder } = useMethods<OrderMethods>('order');
const { loadCartFromOrder } = useMethods<CartMethods>('cart');
const total = computed(() => {
  return state.orders.reduce((acc, cur) => {
    acc += cur.totalPrice || 0;
    return acc;
  }, 0);
});

const loadData = async () => {
  try {
    const data = await getDeliveryOrders(state.pagination.page, state.pagination.limit);
    state.orders = data;
    state.orders.sort((a, b) => a && a.dailyId && b && b.dailyId ? b.dailyId - a.dailyId : 0);
  } finally {
    state.loading = false;
  }
};

onBeforeMount(loadData);

const formatDate = (date: Date) => moment(date).format('hh:mm a');
const goBack = () => router.push({ name: 'main' });
const index = (index: number): number => state.orders.length - index;

const viewOrder = async (order: Order) => {
  if (!order.uuid) return;

  const data = await getOrder(order.uuid);
  setOrder(data);
  loadCartFromOrder(data);
};

const printOrder = async (order: Order) => {
  if (!order.uuid) return;

  const data: Order = await getOrder(order.uuid);
  setOrder(data);
  router.push({ name: 'print.order' });
};

const loadMore = async () => {
  try {
    state.pagination.page = state.pagination.page + 1;
    const data = await getDeliveryOrders(state.pagination.page, state.pagination.limit);
    state.orders = state.orders.concat(data);
    state.orders.sort((a, b) => a && a.dailyId && b && b.dailyId ? b.dailyId - a.dailyId : 0);
  } finally {
    state.loading = false;
  }
};
</script>

<template>
  <el-card style="margin-top: 0.5rem">
    <template #header>
      <div class="drivers-view__header">
        <div class="drivers-view__summary">
          <el-button
            class="drivers-view__back-button"
            size="small"
            @click="goBack"
          >
            <template #icon>
              <i class="material-icons-outlined">arrow_left</i>
            </template>
            Back
          </el-button>
          <p class="drivers-view__summary-title">All Deliveries:</p>
          <el-tag
            type="danger"
            effect="dark"
            style="margin-right: 0.5rem"
          >
            {{ orderCount }}
          </el-tag>
        </div>
        <AppHeaderTable :orders="state.orders" />
      </div>
    </template>
    <el-scrollbar
      height="calc(100vh - 336px)"
      always
    >
      <el-table
        v-loading="state.loading"
        :data="state.orders"
        style="width: 100%"
        :show-header="false"
        :default-sort="{ prop: 'date', order: 'descending' }"
      >
        <el-table-column
          type="index"
          :index="index"
          width="50"
        />
        <el-table-column
          label="Date"
          width="120"
        >
          <template #default="scope">
            <div class="drivers-view__schedule-time">
              <i class="material-icons-outlined">schedule</i>
              <span style="margin-left: 10px">
                {{ formatDate(scope.row.date) }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column>
          <template #default="scope">
            <div v-if="scope.row.address">
              <span
                v-if="scope.row.address.fullName || scope.row.address.phone"
                class="drivers-view__client-name"
              >
                {{
                    scope.row.address.fullName
                      ? `${scope.row.address.fullName}: `
                      : ''
                }}
                {{ `${scope.row.address.phone}` }}
              </span>
              <br />
              <span class="drivers-view__address">
                {{ scope.row.address.addressLine1 }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="totalPrice"
          align="right"
        >
          <template #default="scope">
            <div v-if="scope.row.status == 'On Hold'">
              <el-tag
                class="drivers-view__tag drivers-view__tag--pending "
                effect="dark"
              >
                IN PROGRESS
              </el-tag>
            </div>
            <div v-else>
              <el-tag
                v-if="scope.row.payment.method === 'Cash'"
                class="drivers-view__tag drivers-view__tag--cash"
                effect="dark"
              >
                {{ scope.row.payment.method }}
              </el-tag>
              <el-tag
                v-else
                class="drivers-view__tag drivers-view__tag--card"
                effect="dark"
              >
                {{ scope.row.payment.method }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="right"
          width="150"
        >
          <template #default="scope">
            <span style="font-size: 1.5rem">
              {{ `${moneySymbol} ${scope.row.totalPrice.toFixed(2)}` }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          align="right"
          width="130"
        >
          <template #default="scope">
            <el-button
              class="click-sound"
              circle
              type="success"
              @click="printOrder(scope.row)"
            >
              <i class="material-icons">print</i>
            </el-button>
            <el-button
              class="click-sound"
              circle
              type="primary"
              @click="viewOrder(scope.row)"
            >
              <i
                class="material-icons-outlined"
                style="font-size: 1.5rem;"
              >
                search
              </i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>
    <div class="drivers-view__show-more-button">
      <el-button
        type="danger"
        :disabled="orderCount <= state.orders.length"
        @click="loadMore"
      >
        SHOW MORE
      </el-button>
    </div>
  </el-card>
</template>

<style lang="scss" scoped>
.drivers-view {
  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }

  &__summary {
    display: flex;
    align-items: center;
    gap: 1;
  }

  &__back-button {
    min-width: 8rem;
    font-weight: bold;
    font-size: 1.2rem;
    box-shadow: 0 2px 4px 0 $light-gray-1, 0 0 6px 0 $white;
  }

  &__summary-title {
    margin: 0 0.5rem;
    font-size: 1.5rem;
  }

  &__address {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-wrap: nowrap;
    font-size: 1.1em;
  }

  &__client-name {
    font-weight: bold;
  }

  &__show-more-button {
    display: flex;
    justify-content: center;
    padding: 0.5rem;
  }

  &__schedule-time {
    display: flex;
    justify-content: center;
    align-items: center;
  }


  &__tag {
    font-weight: bold;

    &--cash {
      background-color: var(--cash-color);
      border-color: var(--cash-color);
    }

    &--card {
      background-color: var(--card-color);
      border-color: var(--card-color);
    }

    &--pending {
      background-color: var(--pending-color);
      border-color: var(--pending-color);
    }
  }
}
</style> -->
