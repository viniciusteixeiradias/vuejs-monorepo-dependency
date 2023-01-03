<script lang="ts" setup>
import { usePrintHtml } from '@/hooks/usePrint';
import {
  onMounted,
  computed,
  reactive,
  createApp,
  watch
} from 'vue';
import { useRouter } from 'vue-router';
import { useOrderStore } from '../store/index';
import { useSettingsStore } from '@/modules/settings/store/index';
import { storeToRefs } from 'pinia';
import { useTableStore } from '@/modules/table/store';
import { Printer } from '@fjord/core/models/settings';
import PrintOrder from './print/Index.vue'
import OpenTill from '@fjord/core/ccomponents/OnpenTill.vue'

interface State {
  showPrinterList: boolean;
  selectedPrinters: string[];
}

const state: State = reactive({
  showPrinterList: false,
  selectedPrinters: []
});

const router = useRouter();
const { order } = storeToRefs(useOrderStore());
const { settings } = storeToRefs(useSettingsStore());
const { setPrinters }= useSettingsStore();
const { printableItems } = storeToRefs(useTableStore());

const options = computed(() => printers.value.map((x: any) => {
  return {
    label: x.label,
    value: x.label
  }
}))

// const options: {label: string, value: string}[] = [];

// for (let i = 0; i < 4; i++) {
//   options.push({
//     label: 'printer ' + i,
//     value: 'printer'+i
//   })
// }

const handlePrint = () => {
  if (printers.value
    && printers.value.length > 1
    && state.selectedPrinters.length === 0) {
    console.error('Select a device to print.'); // TODO: ElMessage
  } else {
    callPrint();
  }
};

const openTill = () => {
  state.showPrinterList = false;

  const div = document.createElement('div');
  createApp(OpenTill).mount(div);

  const html = div.outerHTML;
  usePrintHtml(html); // options, p
};

const callPrint = async () => {
  try {
    await printPage();
    // TODO: Check this with Levi or Daniel
    // for (const printIndex in printGroupNames) {
    //   setTimeout(() => {
    //     router.push({
    //       name: 'print.order.c',
    //       params: { printGroupName: printGroupNames[printIndex] }
    //     });
    //   }, 100 * Number(printIndex));
    // }
  } finally {
    router.push({ name: 'main' });
  }
};

const orderItems = computed(() => {
  return printableItems.value || sortedItems();
});

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

const printGroupNames: string[] = [];
for (const item of orderItems.value || []) {
  if (
    item.product?.category?.printGroupName &&
    !printGroupNames.includes(item.product?.category?.printGroupName)
  ) {
    printGroupNames.push(item.product?.category?.printGroupName);
  }
}

const printers = computed(() => settings.value.printers);

const printPage = async () => {
  let printTimes = 1;

  if (order.value?.status === 'On Hold') {
    printTimes = settings.value.onHoldPrintTimes || 1
  } else if (order.value?.status === 'Completed') {
    printTimes = settings.value.checkoutPrintTimes || 1
  }

  const printerList = printers.value.filter((print: Printer) =>
    state.selectedPrinters.some((value) => print.label === value)
  );

  setPrinters(printerList);

  const div = document.createElement('div');
  createApp(PrintOrder, {
    partialPrint: false
  }).mount(div);
  const html = div.outerHTML;
  usePrintHtml(html); // TODO: copies: printTimes, printerList
};

const hasPrinter = computed(() => printers.value && printers.value.length > 1)

onMounted(() => {
  if (settings.value.askBeforePrint) {
    state.showPrinterList = true;
  } else {
    callPrint();
  }
});

watch(
  () => state.showPrinterList,
  (value) => {
    if (!value) {
      router.push({ name: 'main' });
    }
  }
);
</script>

<template>
  <q-dialog v-model="state.showPrinterList" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar size="6rem" icon="print" color="primary" text-color="white" />
        <h4 class="q-ml-sm">{{ hasPrinter ? 'Select Printers to Print.' : 'Print Sale?' }}</h4>
      </q-card-section>

      <q-card-section>
        <q-option-group
          v-model="state.selectedPrinters"
          :options="options"
          type="checkbox"
        >
        </q-option-group>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          v-sound-click
          push
          style="width: 150px"
          :label="hasPrinter ? 'Cancel' : 'No'"
          color="red"
          @click="openTill"
        />
        <q-btn
          v-sound-click
          push
          style="width: 150px"
          :label="hasPrinter ? 'Print' : 'Yes'"
          color="primary"
          @click="handlePrint"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
