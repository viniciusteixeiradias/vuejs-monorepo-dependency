import { URLSearchParams } from "url";

import { Order } from "@fjord/core/src/models/order";
import { AxiosInstance } from "axios";
const ENDPOINT = "/orders";

export default (http: AxiosInstance) => ({
  get: (uuid: string): Promise<Order> => {
    return http.get(ENDPOINT + `${uuid}`);
  },

  getAll: (filter: URLSearchParams): Promise<Order[]> => {
    return http.get(ENDPOINT, { params: filter });
  },

  getCount: (filter: URLSearchParams): Promise<number> => {
    return http.get(`${ENDPOINT}/count`, { params: filter });
  },
});
