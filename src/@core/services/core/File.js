import ApiService from './Api';
export default class FileService extends ApiService {
  constructor(endPointName) {
    super(endPointName);
  }
  createFile(formData) {
    let _url = this.serviceUrl + this.endpoints.create;
    return this.POST(_url, formData);
  }

  deleteFile(data) {
    let _url = this.serviceUrl + this.endpoints.delete;
    return this.POST(_url, data);
  }
}
