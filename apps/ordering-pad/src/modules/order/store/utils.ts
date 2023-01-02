import moment from 'moment';

interface Dates {
  start: string;
  end: string;
}

interface Filters {
  page?: number;
  limit?: number;
  sort_by?: string;
  desc?: boolean;
  start_at?: string;
  origin?: string;
  end_at?: string;
  status?: string;
}

export const utils = {
  getDates(): Dates {
    const startDate = moment();
    if (startDate.hours() < 8) {
      startDate.subtract(1, 'day');
    }

    return {
      start: startDate.format('YYYY-MM-DD'),
      end: moment().format('YYYY-MM-DD'),
    };
  },

  // TODO: Shared this?
  mountFilters(filters: Filters): URLSearchParams {
    const params = new URLSearchParams();

    for (const key in filters) {
      // @ts-ignore
      params.append(key, filters[key]);
    }

    return params;
  },
};
