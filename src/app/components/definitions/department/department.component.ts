import { Component, OnInit, NgModule } from "@angular/core";
import {
  FormsModule,
  ReactiveFormsModule,
  NgForm
} from "@angular/forms";
import { Department } from "../../../models/Department";
import { BaseComponent } from "../../base/base.component";
import { BaseService } from "../../../services/base.service";
import {FlatTreeControl, NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource, MatTreeModule} from '@angular/material/tree';

@Component({
  selector: "app-department",
  templateUrl: "./department.component.html",
  styleUrls: ["./department.component.css"]
})

@NgModule({
  imports: [FormsModule, ReactiveFormsModule],
  declarations: [DepartmentComponent],
  providers: [DepartmentComponent]
})

export class DepartmentComponent extends BaseComponent implements OnInit {

  constructor(public baseService: BaseService) {
    super(baseService);
    this.loadDepartments();
  }

  insertingDepartment: any = {};
  departments: Department[] = [];

  treeControl = new NestedTreeControl<Department>(node => node.InverseParentDepartment);
  dataSource = new MatTreeNestedDataSource<Department>();

  ngOnInit() {}

  insertDepartment(data: NgForm) {

    this.insertingDepartment = <Department>data.value;
    this.baseService.departmentService.InsertDepartment(this.insertingDepartment);

  }

  loadDepartments() {
    this.baseService.departmentService.GetDepartments((deps:Department[]) => {
      let treeDeps:Department[] = [];
      deps.forEach(x=> {
        if (!x.ParentDepartmentId)
          treeDeps.push(x);
        else
        {
          let item = this.searchInDepartments(treeDeps,x.ParentDepartmentId);
          if (item)
            item.InverseParentDepartment.push(x);
          else
            treeDeps.push(x);
        }
      });
      this.departments = treeDeps;
      this.dataSource.data = treeDeps;
    });
  }

  searchInDepartments(source:Department[],parentID:number):Department {
    var foundItem = null;
    
    for(var ii = 0; ii < source.length;ii++) {
      var item = source[ii];
      if (item.DepartmentId == parentID) {
        foundItem = item;
        break;
      }else {
        foundItem = this.searchInDepartments(item.InverseParentDepartment,parentID);
        if (foundItem){
          break;
        }
      }
    }

    return foundItem;
  }

  hasChild = (_:number,department:Department) => department.InverseParentDepartment.length > 0;

}
