// TODO: Delete this store, use the actions in ZReport component.
import { defineStore } from 'pinia';
import { OrderInfo, ZReport } from '@fjord/core/models/z-report';
import moment from 'moment';
import http from '@/services';
import ZReportService from '@fjord/core/services/z-report';

interface State {
  zReport?: ZReport;
}

export const useZReportStore = defineStore('zReport', {
  state(): State {
    return {
      zReport: undefined,
    };
  },

  actions: {
    getDates(start: string, end: string): { start: string; end: string } {
      if (start !== moment().format('YYYY-MM-DD')) {
        return {
          start,
          end,
        };
      }

      const today = moment();

      if (today.hours() < 8) {
        today.subtract(1, 'day');
      }

      return {
        start: today.format('YYYY-MM-DD'),
        end: moment().format('YYYY-MM-DD'),
      };
    },

    async loadZReport(startAt: string, endAt: string): Promise<void> {
      // TODO: Remove 'PremiseCard' and 'Walk In'
      const filter = {
        start_at: startAt,
        end_at: endAt,
      };

      const zReportService = ZReportService(http);
      this.zReport = await zReportService.getZReport(filter);
    },

    filteredReport(table = true, takeaway = true): void {
      if (this.zReport && this.zReport.ordersInfo) {
        if (!table) {
          this.zReport.ordersInfo = this.zReport.ordersInfo.filter(
            (info: OrderInfo) => info.type !== 'TABLE'
          );
        }
        if (!takeaway) {
          this.zReport.ordersInfo = this.zReport.ordersInfo.filter(
            (info: OrderInfo) =>
              info.type !== 'DELIVERY' && // TODO: Delivery or DELIVERY
              info.type !== 'COLLECTION' &&
              info.type !== 'CARD'
          );
        }
      }
    },
  },
});
