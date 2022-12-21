import { URLSearchParams } from "url";

import { Order } from "@fjord/core/src/models/order";
import { AxiosInstance } from "axios";
const ENDPOINT = "/orders";

class OrderService {
  http: AxiosInstance;

  constructor(http: AxiosInstance) {
    this.http = http;
  }

  public get(uuid: string): Promise<Order> {
    return this.http.get(ENDPOINT + `${uuid}`);
  }

  public getAll(filter: URLSearchParams): Promise<Order[]> {
    return this.http.get(ENDPOINT, { params: filter });
  }

  public getCount(filter: URLSearchParams): Promise<number> {
    return this.http.get(`${ENDPOINT}/count`, { params: filter });
  }
}

export default OrderService;
