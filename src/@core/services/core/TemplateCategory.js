import ApiService from "./Api";
export default class TemplateCategory extends ApiService {
  constructor(endPointName) {
    super(endPointName);
  }
  getCategory({ pageIndex, PageSize , Types , IsActive , Query}) {
    let _url = this.serviceUrl + this.endpoints.List;
    if (pageIndex) {
      _url += "?PageIndex=" + pageIndex;
    }
    if (PageSize) {
      _url += "&PageSize=" + PageSize;
    }
    if (Types != null) {
      _url += "&Types=" + Types;
    }
    if (IsActive != null) {
      _url += "&IsActive=" + IsActive;
    }
    if (Query) {
      _url += "&Query=" + Query;
    }


    return this.GET(_url);
  }
  changeActiveCategory(id) {
    let _url = this.serviceUrl + this.endpoints.ChangeActiveStatus + `/${id}`;
  
    return this.PATCH(_url);
  }
  addCategory(AddData){
    let _url = this.serviceUrl + this.endpoints.List ;

    return this.POST(_url , AddData)
  }
  editCategory(id , EditData){
    let _url = this.serviceUrl + this.endpoints.List + `/${id}` ;
    return this.PUT(_url , EditData)
  }
  deleteCategory(id){
    let _url = this.serviceUrl + this.endpoints.List + `/${id}`;
    return this.Delete(_url);
  }
  
    

}
