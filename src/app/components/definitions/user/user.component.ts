import { Component, OnInit, NgModule, DoCheck } from "@angular/core";
import { FormsModule, ReactiveFormsModule, NgForm } from "@angular/forms";
import { BaseComponent } from "../../base/base.component";
import { BaseService } from "../../../services/base.service";
import { HttpErrorResponse } from "@angular/common/http";
import { Department } from "../../../models/Department";
import { Role } from "../../../models/Role";
import { Firm } from "../../../models/Firm";
import { User } from "../../../models/User";
import { Location } from "../../../models/Location";
import { TreeGridTable } from '../../../extends/TreeGridTable/modules/TreeGridTable';

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.css"]
})
@NgModule({
  imports: [FormsModule, ReactiveFormsModule],
  declarations: [UserComponent],
  providers: [UserComponent]
})
export class UserComponent extends BaseComponent implements OnInit {


  /* Is Request send and waiting for response ? */
  isWaitingInsertOrUpdate: boolean = false;

  currentUser: User = new User();
  users: User[] = [];
  departments: Department[] = [];
  locations: Location[] = [];
  roles: Role[] = [];
  firms: Firm[] = [];

  public dataTable: TreeGridTable = new TreeGridTable("user",
    [
      {
        columnDisplayName: 'İsim',
        columnName: ['FirstName'],
        isActive: true,
        classes: [],
        placeholder: '',
        type: 'text'
      },
      {
        columnDisplayName: 'Soyisim',
        columnName: ['LastName'],
        isActive: true,
        classes: [],
        placeholder: '',
        type: 'text'
      },
      {
        columnDisplayName: 'Unvan',
        columnName: ['UserTitle'],
        isActive: true,
        classes: [],
        placeholder: '',
        type: 'text'
      },
      {
        columnDisplayName: 'Firma',
        columnName: ['Firm', 'Name'],
        isActive: true,
        classes: [],
        placeholder: '',
        type: 'text'
      },
      {
        columnDisplayName: 'Lokasyon',
        columnName: ['Location', 'Name'],
        isActive: true,
        classes: [],
        placeholder: '',
        type: 'text'
      },
      {
        columnDisplayName: 'Departman',
        columnName: ['Department', 'Name'],
        isActive: true,
        classes: [],
        placeholder: '',
        type: 'text'
      },
      {
        columnDisplayName: 'Telefon',
        columnName: ['PhoneNumber'],
        isActive: true,
        classes: [],
        placeholder: '',
        type: 'text'
      },
      {
        columnDisplayName: 'E-mail',
        columnName: ['UserMail'],
        isActive: true,
        classes: [],
        placeholder: '',
        type: 'text'
      },
      {
        columnDisplayName: 'Açıklama',
        columnName: ['Description'],
        isActive: true,
        classes: [],
        placeholder: '',
        type: 'text'
      }
    ],
    {
      isDesc: false,
      column: ['FirstName']
    }
  );

  t(o) {
    return "";
  }

  constructor(public baseService: BaseService) {
    super(baseService);
    this.loadUsers();
  }
  ngOnInit() { }

  registerUser: any = {};

  insertUser(data: NgForm) {
    this.insertingUser = <User>data.value;
    this.baseService.userService.InsertUser(
      this.insertingUser
    );
  }

  loadUsers() {
    this.baseService.userService.GetUsers(
      (usrs: User[]) => {
        this.users = usrs;
        this.dataTable.TGT_loadData(this.users);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  loadDropdownList() {

    // Departmanların listelenmesi
    this.baseService.departmentService.GetDepartments(
      departments => (this.departments = departments),
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    // Lokasyonların listelenmesi      
    this.baseService.locationService.GetLocations(
      locations => (this.locations = locations),
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    this.baseService.userService.GetUsers(
      (usrs: User[]) => {
        this.users = usrs;
        this.dataTable.TGT_loadData(this.users);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    this.baseService.userService.GetRoles(roles => {
      this.roles = roles;
    });

    this.baseService.userService.GetFirms(firms => {
      this.firms = firms;
    });
  }
}
