<script lang="ts" setup>
import { printHtml } from '@/hooks/usePrint';
import ZReport from '@/modules/z-report/components/print/Index.vue';
import { usePreferenceStore } from '@/stores/preference';
import { useZReportStore } from '../store/index';
// TODO: Ignore src
import { Order } from '@fjord/core/models/order';
import { TableColumn } from '@fjord/core/types/vendor/q-table';
import moment from 'moment';
import { storeToRefs } from 'pinia';
import { createApp, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';

const { push } = useRouter();
const { zReport } = storeToRefs(useZReportStore());
const { getDates, loadZReport, filteredReport } = useZReportStore()
const { moneySymbol, useTables, useTakeaway } = usePreferenceStore();

const { startAt, endAt } = getDates(moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'));

interface State {
  startAt: string,
  endAt: string,
  loading: boolean,
  orders: Order[]
}

const state = reactive<State>({
  startAt,
  endAt,
  loading: false,
  orders: []
});


const columns: TableColumn[] = [
  {
    name: 'type',
    label: 'Type',
    field: 'type',
    align: 'center',
    sortable: true,
    style: 'width: 50px;'
  },
  {
    name: 'count',
    label: 'Count',
    field: 'count',
    align: 'center',
    sortable: true,
    style: 'width: 105px;'
  },
  {
    name: 'value',
    label: 'Value',
    field: 'value',
    align: 'center',
    sortable: true,
    format: (val) => `${moneySymbol} ${val.toFixed(2)}`,
    style: 'width: 120px;'
  }
];

const loadData = async () => {
  try {
    state.loading = true;
    await loadZReport(state.startAt, state.endAt);
    filteredReport(useTables.value, useTakeaway.value);
  } catch (error) {
    console.error(error)
  } finally {
    state.loading = false;
  }
};

const print = () => {
  try {
    const div = document.createElement('div');
    createApp(ZReport).mount(div);

    const html = div.outerHTML;
    printHtml(html);
  } catch (error) {
    console.error(error)
  } finally {
    push({ name: 'main' });
  }
}

loadData();

watch(() => state.startAt, () => {
  loadData();
});

watch(() => state.endAt, () => {
  loadData();
});
</script>

<template>
  <q-card>
    <q-card-section>
      <div class="card__header">
        <q-btn
          icon="arrow_left"
          label="Back"
          color="primary"
          v-sound-click
          @click="push({ name: 'main' })"
        />
        <q-btn
          icon="print"
          label="Print"
          color="positive"
          v-sound-click
          @click="print"
        />
      </div>
      <div class="row">
        <div class="col-3">
          <q-input
            v-model="state.startAt"
            filled
            type="date"
            label="Start date"
          />
        </div>
        <div class="col-3">
          <q-input
            v-model="state.endAt"
            filled
            type="date"
            label="End date"
          />
        </div>
      </div>
    </q-card-section>
    <q-card-section>
      <q-table
        :columns="columns"
        :rows="zReport?.ordersInfo || []"
        :loading="state.loading"
        hide-pagination
        hide-header
        flat
        :bordered="false"
        :rows-per-page-options="[0]"
        wrap-cells
      />
    </q-card-section>
    <q-card-actions>
      <div class="summary">
        <div
          v-if="zReport?.subtotal"
          class="subtotal"
        >
          <span>Subtotal</span>
          <span>{{ zReport.ordersCount }}</span>
          <span>{{ `${moneySymbol} ${zReport.subtotal.toFixed(2)}` }}</span>
        </div>
        <div
          v-if="zReport?.total"
          class="total"
        >
          <span>Total</span>
          <span>{{ `${moneySymbol} ${zReport.total.toFixed(2)}` }}</span>
        </div>
        <div
          v-if="zReport?.vats"
          class="vats"
        >
          <div
            v-for="(value, key) in zReport.vats"
            :key="key"
            class="subtotal"
          >
            <span>VAT {{ key }}%</span>
            <span>{{ `${moneySymbol} ${value.toFixed(2)}` }}</span>
          </div>
          <div
            v-if="zReport.totalVat"
            class="subtotal"
          >
            <span>Total Vat</span>
            <span>{{ `${moneySymbol} ${zReport.totalVat.toFixed(2)}` }}</span>
          </div>
        </div>
      </div>
    </q-card-actions>
  </q-card>
</template>

<style lang="scss" scoped>
.row>div {
  padding: 0.5rem;
}

.card {
  &__header {
    display: flex;
    justify-content: space-between;
    padding-bottom: 1rem;
  }
}

.summary {
  color: black;
  width: 100%;

  .vats {
    border-top: solid 1px $light-gray-1;
    border-bottom: solid 1px $light-gray-1;
  }

  .subtotal {
    flex: 1;
    display: flex;
    justify-content: space-between;
    font-size: 1rem;
    padding: 0.4rem 0.4rem;
  }

  .total {
    flex: 1;
    display: flex;
    justify-content: space-between;
    font-size: 1.6em;
    border-top: solid 1px $light-gray-1;
    padding: 0.4rem 0.4rem;
  }
}
</style>
