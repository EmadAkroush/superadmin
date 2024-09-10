import ApiService from "./Api";
export default class GiftCardList extends ApiService {
  constructor(endPointName) {
    super(endPointName);
  }
  getGiftCardList({ pageIndex, pageSize  , TrackingNumber , giftCard , IsPaymentSuccessful , priceTo , priceFrom , FromDate , ToDate}) {
    let _url = this.serviceUrl + this.endpoints.List;
    if (pageIndex) {
      _url += "?PageIndex=" + pageIndex;
    }
    if (pageSize) {
      _url += "&PageSize=" + pageSize;
    }
    if(TrackingNumber){
    _url += "&TrackingNumber=" + TrackingNumber;
    }
    if(giftCard != null){
        _url += "&Type=" + giftCard;
     }
     if(IsPaymentSuccessful != null){
      _url += "&IsPaymentSuccessful=" + IsPaymentSuccessful;
     }
     if(priceFrom){
      _url += "&FromAmount=" + priceFrom;
     }
     if(priceTo){
      _url += "&ToAmount=" + priceTo;
     }
     if(FromDate){
      _url += "&FromDate=" + FromDate;
     }
     if(ToDate){
      _url += "&ToDate=" + ToDate;
     }

   
    //  if (FromDate){
    //     _url += "&From=" + FromDate ;
       
    //  }
    //  if (ToDate){
        
    //     _url += "&To=" + ToDate;
    //  }
    
    // if (Types != null) {
    //   _url += "&Types=" + Types;
    // }

    return this.GET(_url);
  }
  getGiftCardDetails(id) {
    let _url = this.serviceUrl + this.endpoints.List + `/${id}`;
    return this.GET(_url);
  }


}
