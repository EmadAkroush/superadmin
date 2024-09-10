import ApiService from "./Api";
export default class Transaction extends ApiService {
  constructor(endPointName) {
    super(endPointName);
  }
  getTransaction({ pageIndex, pageSize , Query , TrackingNumber , transaction , Status , FromDate , ToDate}) {
    let _url = this.serviceUrl + this.endpoints.List;
    if (pageIndex) {
      _url += "?PageIndex=" + pageIndex;
    }
    if (pageSize) {
      _url += "&PageSize=" + pageSize;
    }
    if (Query){
     _url += "&Query=" + Query;
    }
    if(TrackingNumber){
    _url += "&TrackingNumber=" + TrackingNumber;
    }
    if(transaction != null){
        _url += "&Types=" + transaction;
     }
     if(Status != null){
        _url += "&Status=" + Status;
     }
     if (FromDate){
        _url += "&From=" + FromDate ;
       
     }
     if (ToDate){
        
        _url += "&To=" + ToDate;
     }
    
    // if (Types != null) {
    //   _url += "&Types=" + Types;
    // }

    return this.GET(_url);
  }


}
