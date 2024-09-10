import ApiService from './Api';
export default class OrganizationProfile extends ApiService {
    constructor(endPointName) {
      super(endPointName);
    }
  
    getOrganizationProfile({ pageIndex, pageSize , officialName , brandNamem  , statusItem , sortOrderAscending , fromDate , toDate  }) {
      let _url = this.serviceUrl + this.endpoints.List;
      if (pageIndex) {
        _url += '?pageIndex=' + pageIndex;
      }
      if (pageSize) {
        _url += '&pageSize=' + pageSize;
      }
      if (officialName) {
        _url += '&OfficialName=' + officialName;
      }
      if (brandNamem) {
        _url += '&BrandName=' + brandNamem;
      }
      if (statusItem) {
        _url += '&Status=' + statusItem;
      }
      if (sortOrderAscending) {
        _url += '&SortOrderAscending=' + sortOrderAscending;
      }
      if (fromDate ){
        _url += "&From=" + fromDate ;
     }
     if (toDate){
        _url += "&To=" + toDate;
     }
    
      return this.GET(_url);
    }
    getOrganizationProfileDetails(id){
      let _url = this.serviceUrl + this.endpoints.List + `/${id}`;
      return this.GET(_url);
    }
    getDataHistory(id , {pageIndex , pageSize}){
      let _url = this.serviceUrl + this.endpoints.List + `/${id}` + this.endpoints.history;
      if (pageIndex) {
        _url += '?pageIndex=' + pageIndex;   
      }
      if (pageSize) {
        _url += '&pageSize=' + pageSize;
      }
      return this.GET(_url);
    }
    switchingDataAccept(id){
      let _url = this.serviceUrl + this.endpoints.List + `/${id}` + this.endpoints.accept;
      return this.PATCH(_url);
    }
    switchingDataReject(id){
      let _url = this.serviceUrl + this.endpoints.List + `/${id}` + this.endpoints.reject;
      return this.PATCH(_url);
    }
    
    
  }