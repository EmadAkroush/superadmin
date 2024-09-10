import ApiService from './Api';
export default class Music extends ApiService {
    constructor(endPointName) {
      super(endPointName);
    }
  
    getMusic({ pageIndex, pageSize , IsActive , Query }) {
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
 
    postMusic(Template){
      let _url = this.serviceUrl + this.endpoints.List;

      return this.POST(_url , Template)
    }
    deleteMusic(id){
      let _url = this.serviceUrl + this.endpoints.List + `/${id}`;
      return this.Delete(_url);
    }
    statusMusic(id){
      let _url = this.serviceUrl + this.endpoints.changeActiveStatus + `/${id}`;

      return this.PATCH(_url);
    }
    editMusic(id , newTemplate){
      let _url = this.serviceUrl + this.endpoints.List + `/${id}`;
      return this.PUT(_url , newTemplate);
    }
    templateMusicId({pageIndex, pageSize , CategoryId}){
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