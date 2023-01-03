<script lang="ts" setup>
import {
  computed,
  reactive,
  ref,
  onBeforeMount
} from 'vue';
import { Printer, Settings, SettingsFile} from '@fjord/core/models/settings';
import { Preference } from '@fjord/core/models/preference';
import { PrinterInfo } from 'electron';

// import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { useSettingsStore } from '../store/index';
import { storeToRefs } from 'pinia';
import { usePreferenceStore } from '@/modules/preference/store/preference';
import InputNumber from '@fjord/core/components/InputNumber.vue';
import { TableColumn } from '@fjord/core/types/vendor/q-table';

const fileSettings = reactive<SettingsFile>({
  apiUrl: '',
  loginByCode: false
});

const store = useSettingsStore();
const { preferences } = storeToRefs(usePreferenceStore());
const { save: savePreferences } = usePreferenceStore();

interface State {
  settings: Settings;
  windowsPrinters: PrinterInfo[];
  dialogPrinters: boolean;
  printer: Printer;
  online: boolean;
  onlyCollection: boolean;
}

const state: State = reactive({
  settings: {
    askBeforePrint: store.settings.askBeforePrint || false,
    printers: JSON.parse(JSON.stringify(store.settings.printers || [])),
    onHoldPrintTimes: store.settings.onHoldPrintTimes || 1,
    checkoutPrintTimes: store.settings.checkoutPrintTimes || 1,
    useVirtualKeyboard: store.settings.useVirtualKeyboard || false
  },
  dialogPrinters: false,
  windowsPrinters: [],
  printer: {
    label: '',
    device: ''
  },
  online: !!preferences?.value?.general?.online,
  onlyCollection: !!preferences?.value?.general?.onlyCollection
});

const router = useRouter();
const Form = ref();

const printers = computed((): Printer[] => store.settings.printers || []);
const rules = {
  onHoldPrintTimes: [
    {
      required: true,
      message: 'Please input "On Hold" print times',
      trigger: 'blur'
    },
    { min: 1, max: 5, message: 'Length should 1 to 5', trigger: 'blur' }
  ],
  checkoutPrintTimes: [
    {
      required: true,
      message: 'Please input "Checkout" print times',
      trigger: 'blur'
    },
    { min: 1, max: 5, message: 'Length should 1 to 5', trigger: 'blur' }
  ]
};

const loadPrinters = async () => {
  // @ts-ignore
  state.windowsPrinters = await window.api.getPrinters();
};

const save = () => {
  store.saveSettings(state.settings);
  const newPreferences: Preference = JSON.parse(
    JSON.stringify(preferences?.value)
  );

  newPreferences.general.online = state.online;
  newPreferences.general.onlyCollection = state.onlyCollection;

  // @ts-ignore
  window.api.saveSettings(JSON.stringify(fileSettings));
  savePreferences(newPreferences);
  router.push({ name: 'main' });
};

const cancel = () => {
  router.push({ name: 'main' });
};

const addPrinter = () => {
  // TODO: IMPROVE THIS PLEASE
  // let error = '';
  // if (!state.printer.label) {
  //   error = 'The printer label cannot be empty';
  // } else if (
  //   printers.value.some(
  //     (printer) =>
  //       printer.label.toUpperCase() == state.printer.label.toUpperCase()
  //   )
  // ) {
  //   error = 'The printer label already exists. Please define another label';
  // }
  // if (error == '') {
  //   if (!state.printer.device) {
  //     error = 'The printer device cannot be empty';
  //   } else if (
  //     printers.value.some(
  //       (printer) =>
  //         printer.device.toUpperCase() == state.printer.device.toUpperCase()
  //     )
  //   ) {
  //     error =
  //       'The printer device already exists. Please define another printer';
  //   }
  // }
  // if (error) {
  //   console.error(error); // TODO: ElMessage.error(error);
  //   return;
  // } else {
    /*
      TODO: printer.device is a object
      description: "Generic PostScript Printer"
      displayName: "10.0.0.1"
      isDefault: true
      name: "_10_0_0_1"
      options: {copies: '1', device-uri: 'lpd://10.0.0.1/', finishings: '3', job-cancel-after: '10800', job-hold-until: 'no-hold', …}
      status: 3
    */
    const { name } = state.printer.device
    console.log(state.printer.label, name)
    store.addNewPrinter({
      label: state.printer.label,
      device: name
    });
    state.printer.label = '';
    state.printer.device = '';
  // }
};

const deletePrinter = (printer: Printer) => {
  store.removePrinter(printer);
};

const savePrinters = () => {
  store.saveSettings(state.settings);
  state.dialogPrinters = false;
};

onBeforeMount(async () => {
  // @ts-ignore
  const settings = await window.api.getSettings();
  fileSettings.loginByCode = settings.loginByCode;
  fileSettings.apiUrl = settings.apiUrl;
});

loadPrinters();

const columns: TableColumn[] = [
  {
    name: 'label',
    label: 'Label',
    field: 'label',
    align: 'center',
    sortable: true,
    style: 'width: 150px;'
  },
  {
    name: 'device',
    label: 'Printer Device',
    field: 'device',
    align: 'center',
    sortable: true
  },
  {
    name: 'actions',
    label: 'Actions',
    field: 'actions',
    align: 'center',
    style: 'width: 95px;'
  },
];
</script>

<template>
  <div class="settings-view">
    <div class="settings-view__header">
      <span>Settings</span>
    </div>
    <div class="settings-view__body">
      <q-dialog
        v-model="state.dialogPrinters"
        full-width
      >
        <q-card>
          <q-card-section>
            <div class="title">Printer Settings</div>
          </q-card-section>
          <q-card-section>
            <div class="col-3">
              <q-checkbox
                v-model="state.settings.askBeforePrint"
                label="Ask Before Print"
              />
            </div>
          </q-card-section>
          <q-card-section>
            <q-form :model="state.printer">
              <div class="row">
                <div class="col-12">
                  <q-input
                    v-model="state.printer.label"
                    label="Label"
                    filled
                    dense
                  />
                </div>
              </div>
              <div class="row">
                <div class="col-10">
                  <q-select
                    v-model="state.printer.device"
                    label="Printer"
                    placeholder="Select Printer to use"
                    :options="state.windowsPrinters"
                    option-value="name"
                    option-label="name"
                  />
                </div>
                <div class="col-2 add-printer">
                  <q-btn
                    v-sound-click
                    color="negative"
                    label="Add Printer"
                    @click="addPrinter"
                  />
                </div>
              </div>
            </q-form>
          </q-card-section>
          <q-card-section>
            <q-table
              :columns="columns"
              :rows="printers"
            >
              <template #body-cell-actions="scope">
                <q-td class="actions-table">
                  <q-btn
                    color="negative"
                    label="Delete"
                    @click="deletePrinter(scope.row)"
                  />
                </q-td>
              </template>
            </q-table>
          </q-card-section>
          <q-card-section class="card-actions">
            <q-btn
              color="negative"
              label="Cancel"
              @click="state.dialogPrinters = false"
            />
            <q-btn
              color="positive"
              label="Confirm"
              @click="savePrinters"
            />
          </q-card-section>
        </q-card>
      </q-dialog>
      <q-form
        ref="Form"
        :model="state.settings"
        status-icon
        :rules="rules"
      >
        <div class="row">
          <div class="col-3">
            <q-toggle
              v-model="state.online"
              label="Restaurant Open"
            />
          </div>
          <div class="col-3">
            <q-toggle
              v-model="state.onlyCollection"
              color="blue"
              label="Only Collection"
            />
          </div>
          <div class="col-3">
            <q-toggle
              v-model="fileSettings.loginByCode"
              label="Login by Code as Default"
            />
          </div>
        </div>
        <div class="row">
          <div class="col-4">
            <InputNumber
              v-model="state.settings.onHoldPrintTimes"
              label="On Hold Print Times"
              :maxlength="5"
            />
          </div>
          <div class="col-4">
            <InputNumber
              v-model="state.settings.checkoutPrintTimes"
              label="Checkout Print Times"
              :maxlength="5"
            />
          </div>
          <div class="col-4">
            <q-btn
              v-sound-click
              color="negative"
              label="Printer Settings"
              @click="state.dialogPrinters = true"
            />
          </div>
        </div>
      </q-form>
    </div>
    <div class="settings-view__footer">
      <q-btn
        v-sound-click
        color="negative"
        label="cancel"
        @click="cancel"
      />
      <q-btn
        v-sound-click
        color="positive"
        label="Save"
        @click="save"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 1rem;
}

.actions-table {
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 0 0 0.5rem 0.5rem;
  background-color: $light-gray-9;
  justify-content: space-between;

  .q-btn {
    display: flex;
    width: 100%;
    height: 4rem;
    font-size: 1.2rem;
    align-items: center;
    justify-content: center;
  }
}

.add-printer {
  display: flex;
  align-items: center;
  justify-content: center;
}

.title {
  font-size: 1.5rem;
}

.settings-view {
  background-color: $white;
  border-radius: 0.5rem;
  margin-top: 0.5rem;

  &__header {
    border-radius: 0.5rem 0.5rem 0 0;
    background-color: $light-gray-9;
    display: flex;
    font-size: 2rem;
    color: $black;
    padding: 0.5rem;
  }

  &__btn {
    font-size: 1.2rem;
    font-weight: bold;
    text-transform: uppercase;
    width: 100%;
    height: 4rem;

    &--active {
      color: $white;
      background-color: $dark-green;
    }
  }

  &__body {
    padding: 1rem;
  }

  &__footer {
    border-radius: 0 0 0.5rem 0.5rem;
    background-color: $light-gray-9;
    display: flex;
    justify-content: space-between;
    padding: 0.5rem;
    gap: 0.5rem;

    button {
      font-size: 1.2rem;
      width: 100%;
      height: 4rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  &__space {
    padding-right: 1rem;
  }
}

.button {
  &__proceed {
    background-color: $dark-green;
    color: $white;
  }
}
</style>
