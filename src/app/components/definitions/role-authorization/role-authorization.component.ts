import { Component, OnInit,NgModule } from '@angular/core';
import {
  NgForm,
  ReactiveFormsModule,
  FormGroup,
  NgModel
} from "@angular/forms";
import { BaseComponent } from '../../base/base.component';
import { BaseService } from 'src/app/services/base.service';
import { TreeGridTable } from 'src/app/extends/TreeGridTable/modules/TreeGridTable';

@Component({
  selector: 'app-role-authorization',
  templateUrl: './role-authorization.component.html',
  styleUrls: ['./role-authorization.component.css']
})
@NgModule({
  imports: [ReactiveFormsModule],
  declarations: [RoleAuthorizationComponent],
  providers: [RoleAuthorizationComponent]
})

export class RoleAuthorizationComponent extends BaseComponent implements OnInit {
  
  
  constructor(protected baseService: BaseService) {
    super(baseService);
   }

   public dataTable: TreeGridTable = new TreeGridTable(
    "roleauthorization",
    [
      {
        columnDisplayName: "Rol",
        columnName: ["Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Görüntüleyebilir",
        columnName: ["OutBrowse"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Ekleyebilir",
        columnName: ["OutInsert"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Düzenleyebilir",
        columnName: ["OutUpdate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Silebilir",
        columnName: ["OutDelete"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      }
    
    ],
    {
      isDesc: false,
      column: ["Name"]
    }
  );

   public dataTableRoleAuth: TreeGridTable = new TreeGridTable(
    "menu",
    [
      {
        columnDisplayName: "Menü",
        columnName: ["Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Görüntüleyebilir",
        columnName: ["OutBrowse"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "checkbox"
      },
      {
        columnDisplayName: "Ekleyebilir",
        columnName: ["OutInsert"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "checkbox"
      },
      {
        columnDisplayName: "Düzenleyebilir",
        columnName: ["OutUpdate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "checkbox"
      },
      {
        columnDisplayName: "Silebilir",
        columnName: ["OutDelete"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "checkbox"
      }
    
    ],
    {
      isDesc: false,
      column: ["Name"]
    }
  );


  ngOnInit() {
    
  }

}
