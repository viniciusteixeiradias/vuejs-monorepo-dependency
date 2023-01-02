import { ZReport } from '../models/z-report';
import { AxiosInstance } from 'axios';

const ENDPOINT = 'reports/';

interface Filters {
  start_at?: string;
  end_at?: string;
}

export default (http: AxiosInstance) => ({
  getZReport(filter: Filters): Promise<ZReport> {
    return http.get(`${ENDPOINT}zreport`, { params: filter });
  },
});
