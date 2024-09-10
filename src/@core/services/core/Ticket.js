import ApiService from "./Api";
export default class Transaction extends ApiService {
  constructor(endPointName) {
    super(endPointName);
  }
  getTicket({ pageIndex, pageSize, FromDate, ToDate, ticket }) {
    let _url = this.serviceUrl + this.endpoints.List;
    if (pageIndex) {
      _url += "?PageIndex=" + pageIndex;
    }
    if (pageSize) {
      _url += "&PageSize=" + pageSize;
    }

    if (FromDate) {
      _url += "&From=" + FromDate;
    }
    if (ToDate) {
      _url += "&To=" + ToDate;
    }
    if (ticket != null) {
      _url += "&Status=" + ticket;
    }


    return this.GET(_url);
  }
  getTicketDetails(id) {
    let _url = this.serviceUrl + this.endpoints.List + `/${id}`;
    return this.GET(_url);
  }
  sendMessage(id, message) {
    let _url =
      this.serviceUrl +
      this.endpoints.List +
      `/${id}` +
      this.endpoints.response;
    return this.POST(_url, message);
  }
}
