<script lang="ts" setup>
import { computed } from 'vue';
import { Order, OrderStatus } from '@fjord/core/src/models/order';
import { PaymentMethod } from '@fjord/core/src/models/payment';
import { usePreferenceStore } from '@/stores/preference';
import { TableColumn } from '@fjord/core/src/types/vendor/q-table';

const { moneySymbol } = usePreferenceStore();

const props = defineProps<{
  orders: Order[];
}>();

interface TableOptions {
  all: string;
  card: string;
  cash: string;
  inProgress: string;
};

interface TableValues {
  count: number;
  value: number;
  fee: number;
};

const tableData = computed<TableOptions[]>(() => {
  const summarize = (acc: TableValues, cur: Order): TableValues => ({
    count: acc.count + 1,
    value: acc.value + (cur.totalPrice || 0),
    fee: acc.fee + (cur.deliveryFee || 0) + (cur.extraDeliveryFee || 0)
  });

  const cashOrders = props.orders.filter(order =>
    order.payment?.method === PaymentMethod.CASH &&
    order.status !== OrderStatus.ON_HOLD
  );
  const cashSummary = cashOrders.reduce(summarize, {
    count: 0,
    value: 0,
    fee: 0
  });

  const cardOrders = props.orders.filter(order =>
    order.payment?.method === PaymentMethod.CARD
  );
  const cardSummary = cardOrders.reduce(summarize, {
    count: 0,
    value: 0,
    fee: 0
  });

  const inProgressOrders = props.orders.filter(order =>
    order.status === OrderStatus.ON_HOLD
  );
  const inProgressSummary = inProgressOrders.reduce(summarize, {
    count: 0,
    value: 0,
    fee: 0
  });

  const allOrdersSummary = props.orders.reduce(summarize, {
    count: 0,
    value: 0,
    fee: 0
  });

  const textAboutTotalValues = (summary: TableValues) => {
    return `(${summary.count}) `+
      `${moneySymbol} ${summary.value.toFixed(2)}`;
  };

  const textAboutFeesValues = (summary: TableValues) => {
    return `${moneySymbol} ${summary.fee.toFixed(2)}`;
  };

  const totalValues = {
    all: 'Total D fee',
    card: textAboutTotalValues(cardSummary),
    cash: textAboutTotalValues(cashSummary),
    inProgress: textAboutTotalValues(inProgressSummary)
  };

  const totalFees = {
    all: textAboutFeesValues(allOrdersSummary),
    card: textAboutFeesValues(cardSummary),
    cash: textAboutFeesValues(cashSummary),
    inProgress: textAboutFeesValues(inProgressSummary)
  };
  return [ totalValues, totalFees ];
});

const columns: TableColumn[] = [
  {
    name: 'all',
    label: 'All',
    field: 'all',
    align: 'center'
  },
  {
    name: 'card',
    label: 'Card',
    field: 'card',
    align: 'center'
  },
  {
    name: 'cash',
    label: 'Cash',
    field: 'cash',
    align: 'center'
  },
  {
    name: 'inProgress',
    label: 'In Progress',
    field: 'inProgress',
    align: 'center'
  }
];
</script>

<template>
  <q-table
    class="app-header-table"
    hide-pagination
    :columns="columns"
    :rows="tableData"
    wrap-cells
  ></q-table>
</template>

<style lang="scss">
.app-header-table {
  thead {
    th {
      padding: 0.313rem 0 0.313rem 0;
      color: $white;
      background-color: $danger;

      &:nth-last-child(3) {
        color: $white;
        background-color: var(--card-color);
      }

      &:nth-last-child(2) {
        color: $white;
        background-color: var(--cash-color);
      }

      &:nth-last-child(1) {
        color: $white;
        background-color: var(--pending-color);

      }
    }
  }

  .el-table__body {
    td {
      padding: 0.313rem 0 0.313rem 0;
      font-size: 0.875rem;
    }
  }
}
</style>

<style lang="scss" scoped>
.app-header-table {
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  max-width: 60%;
  width: 50%;
}
</style>
