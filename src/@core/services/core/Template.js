import ApiService from './Api';
export default class Template extends ApiService {
    constructor(endPointName) {
      super(endPointName);
    }
  
    getTemplate({ pageIndex, pageSize , IsActive , Query }) {
      let _url = this.serviceUrl + this.endpoints.List;
      if (pageIndex) {
        _url += '?pageIndex=' + pageIndex;
      }
      if (pageSize) {
        _url += '&pageSize=' + pageSize;
      }
      if (IsActive != null) {
        _url += '&IsActive=' + IsActive;
      }
   
      if (Query) {
        _url += '&Query=' + Query;
      } 
      return this.GET(_url);
    }
 
    postTemplate(Template){
      let _url = this.serviceUrl + this.endpoints.List;

      return this.POST(_url , Template)
    }
    deleteTemplate(id){
      let _url = this.serviceUrl + this.endpoints.List + `/${id}`;
      return this.Delete(_url);
    }
    statusTemplate(id){
      let _url = this.serviceUrl + this.endpoints.changeActiveStatus + `/${id}`;

      return this.PATCH(_url);
    }
    editTemplate(id , newTemplate){
      let _url = this.serviceUrl + this.endpoints.List + `/${id}`;
      return this.PUT(_url , newTemplate);
    }
    templateCategoryId({pageIndex, pageSize , CategoryId}){
      let _url = this.serviceUrl + this.endpoints.List;
      if (pageIndex) {
        _url += '?pageIndex=' + pageIndex;
      }
      if (pageSize) {
        _url += '&pageSize=' + pageSize;
      }
      if (CategoryId) {
        _url += '&CategoryId=' + CategoryId;
      }
   
      return this.GET(_url);
    }
  }