import { Injectable } from "@angular/core";
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: "root"
})
export class CompanyServiceService {
  constructor(private modal: NgbModal) { }
  
  openCompanyModal(id: string) {
    this.modal.open(id);
  }
}
