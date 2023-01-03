
<script lang="ts" setup>
import moment from 'moment';
import { storeToRefs } from 'pinia';
import { useZReportStore } from '@/modules/z-report/store/index';
import { usePreferenceStore } from '@/modules/preference/store/preference';
import style from "./index.css?inline"

const { zReport } = storeToRefs(useZReportStore()); // TODO: Validar se precisa do store do zreport
const { moneySymbol, preferences } = usePreferenceStore();

const printDate = moment(new Date()).format('MMMM Do YYYY, h:mm a');

const showPeriod = zReport?.value?.startAt?.slice(0, 10) !== moment(new Date()).format('YYYY-MM-DD');
</script>

<template>
  <component :is="'style'">
    {{ style }}
  </component>
  <div>
    <div class="text-center">
      <h2>{{ preferences?.company.name }}</h2>
      <p>{{ preferences?.company.address }}</p>
      <p>{{ preferences?.company.phone }}</p>
      <p>{{ preferences?.company.websiteUrl }}</p>
      <p>{{ printDate }}</p>
      <p v-if="showPeriod">
        Period
        {{ `
        ${zReport?.startAt?.slice(0, 10)} -
        ${zReport?.endAt?.slice(0, 10)}
        `}}
      </p>
    </div>

    <hr />
    <h2 style="text-align: center">
      Z Report
    </h2>
    <div>
      <table>
        <tr>
          <td>Type</td>
          <td style="text-align: right">
            No.
          </td>
          <td style="text-align: right">
            Value
          </td>
        </tr>
        <tr
          v-for="(item, index) in zReport?.ordersInfo"
          :key="index"
        >
          <td>{{ item.type }}</td>
          <td style="text-align: right">
            {{ item.count }}
          </td>
          <td style="text-align: right">
            {{ `${moneySymbol} ${item.value.toFixed(2)}` }}
          </td>
        </tr>
      </table>
      <hr />
      <table>
        <tr>
          <td class="print__subtotal">
            Sub Total
          </td>
          <td style="text-align: right">
            {{ zReport?.ordersCount }}
          </td>
          <td
            class="print__subtotal"
            style="text-align: right"
          >
            {{ `${moneySymbol} ${zReport?.subtotal?.toFixed(2)}` }}
          </td>
        </tr>
        <tr>
          <td colspan="3">
            <hr class="dotted" />
          </td>
        </tr>
        <tr>
          <td class="print__total">
            Total
          </td>
          <td />
          <td
            class="print__total"
            style="text-align: right"
          >
            {{ `${moneySymbol} ${zReport?.total?.toFixed(2)}` }}
          </td>
        </tr>
      </table>
      <table v-if="zReport?.vats">
        <tr
          v-for="(value, key) in zReport?.vats"
          :key="key"
        >
          <td>VAT {{ key }}%</td>
          <td style="text-align: right">
            {{ `${moneySymbol} ${value.toFixed(2)}` }}
          </td>
        </tr>
        <tr v-if="zReport.totalVat">
          <td>Total Vat</td>
          <td style="text-align: right">
            {{ `${moneySymbol} ${zReport.totalVat.toFixed(2)}` }}
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>
