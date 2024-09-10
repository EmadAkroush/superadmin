import Config from './Configs';
import FileService from './core/File'
import TemplateService from "./core/Template";
import TemplateCategoryService from './core/TemplateCategory'
import MusicService from './core/Music'
import TransactionService from './core/Transaction'
import GiftCardListService from './core/GiftCardList'
import OrganizationProfileService from './core/OrganizationProfile'
import TicketService from './core/Ticket'


const templateService = new TemplateService(Config.services.Template.endpointName);
const fileService = new FileService(Config.services.File.endpointName);
const templateCategoryService = new TemplateCategoryService(Config.services.TemplateCategory.endpointName);
const musicService = new MusicService(Config.services.Music.endpointName);
const transactionService = new TransactionService(Config.services.Transaction.endpointName);
const giftCardListService = new GiftCardListService(Config.services.GiftCardList.endpointName);
const organizationProfileService = new OrganizationProfileService(Config.services.OrganizationProfile.endpointName);
const ticketService = new TicketService(Config.services.Ticket.endpointName);



export { fileService , templateService , templateCategoryService , musicService , transactionService , giftCardListService , organizationProfileService , ticketService }


