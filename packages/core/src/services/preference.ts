import { Preference } from "@fjord/core/src/models/preference";
import { AxiosInstance } from "axios";

const ENDPOINT = "/preferences";

export default (http: AxiosInstance) => ({
  create(preference: Preference): Promise<Preference> {
    return http.post(ENDPOINT, preference);
  },

  get(): Promise<Preference> {
    return http.get(ENDPOINT);
  },
});
