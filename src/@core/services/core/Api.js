
import endpoints from '../EndPoints';
import { concatBaseWithVersion } from '../Utils';
import Config from '../Configs';
import axios from 'axios';
export default class ApiService {
  constructor(service) {
    this.endpoints = endpoints[service];
    this.serviceUrl = concatBaseWithVersion(Config.services[service]);
    this.$http = axios;
  }

  GET(resource) {
    return this.$http.get(resource);
  }

  POST(resource, params) {
    return this.$http.post(resource, params);
  }

  PUT(resource, params) {
    return this.$http.put(resource, params);
  }

  PATCH(resource, params) {
    return this.$http.patch(resource, params);
  }

  Delete(resource, params) {
    if (params) {
      return this.$http.delete(resource, {
        data: params,
      });
    } else {
      return this.$http.delete(resource);
    }
  }
}
