import { state } from './state';
import ZReportService from '@fjord/core/services/z-report';
import http from '@/services';
import moment from 'moment';
import { OrderInfo } from '@fjord/core/models/z-report';

interface Period {
  startAt: string;
  endAt: string;
}

export const actions = {
  getDates(startAt: string, endAt: string): Period {
    if (startAt !== moment().format('YYYY-MM-DD')) {
      return {
        startAt,
        endAt,
      };
    }

    const today = moment();

    if (today.hours() < 8) {
      today.subtract(1, 'day');
    }

    return {
      startAt: today.format('YYYY-MM-DD'),
      endAt: moment().format('YYYY-MM-DD'),
    };
  },

  async loadZReport(startAt: string, endAt: string): Promise<void> {
    // TODO: Remove 'PremiseCard' and 'Walk In'
    const filter = {
      start_at: startAt,
      end_at: endAt,
    };

    const zReportService = ZReportService(http);
    state.zReport = await zReportService.getZReport(filter);
  },

  filteredReport(table = true, takeaway = true): void {
    if (state.zReport && state.zReport.ordersInfo) {
      if (!table) {
        state.zReport.ordersInfo = state.zReport.ordersInfo.filter(
          (info: OrderInfo) => info.type !== 'TABLE'
        );
      }
      if (!takeaway) {
        state.zReport.ordersInfo = state.zReport.ordersInfo.filter(
          (info: OrderInfo) =>
            info.type !== 'DELIVERY' && // TODO: Delivery or DELIVERY
            info.type !== 'COLLECTION' &&
            info.type !== 'CARD'
        );
      }
    }
  },
};
