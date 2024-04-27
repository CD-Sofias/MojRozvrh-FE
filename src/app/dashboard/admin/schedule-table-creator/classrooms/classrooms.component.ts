import {Component} from '@angular/core';
import {Address} from "../../../../types/address";
import {Observable} from "rxjs";
import {ScheduleTableCreatorComponent} from "../schedule-table-creator.component";
import {Classroom} from "../../../../types/classroom";
import {ClassroomService} from "../../../../services/classroom.service";
import {FilteringEventArgs} from "@syncfusion/ej2-angular-dropdowns";
import {AddressService} from "../../../../services/address.service";
import {Query} from "@syncfusion/ej2-data";

@Component({
  selector: 'app-classrooms',
  templateUrl: './classrooms.component.html',
})
export class ClassroomsComponent extends ScheduleTableCreatorComponent {
  classrooms: Classroom[];


  constructor(private classroomService: ClassroomService, private addressService: AddressService) { // Внедрите AddressService
    super();
  }

  public filterPlaceholder: string = 'Search';
  public height: string = '220px';
  public watermark: string = 'Select a street';


  getStreetName(addressId: string): string {
    const address = this.addresses.find(address => address.id === addressId);
    return address ? address.street : 'Unknown';
  }

  getStreetId(addressId: string): string {

    const address = this.addresses.find(address => address.id === addressId);
    return address ? address.id : null;
  }

  onFiltering(event: FilteringEventArgs): void {
    let query: Query = new Query();
    query = (event.text !== '') ? query.where('name', 'startswith', event.text, true) : query;
    event.updateData(this.addresses, query);
  }

  selectedType: string;
  selectedAddressId: string;
  types: string[];
  addresses: Address[];

  onTypeChange(event: any): void {
    console.log(event.itemData)
    this.selectedType = event.itemData.value;
    if (!this.selectedType) {
      console.error('Type is undefined');
    }
  }

  onAddressChange(event: any): void {

    this.selectedAddressId = event.itemData.id;
    if (!this.selectedAddressId) {
      console.error('AddressId Not Defined');
    }
    console.log(this.selectedAddressId)
  }

  getClassrooms(): void {
    this.classroomService.getAllClassrooms().subscribe(classrooms => {
      this.classrooms = classrooms;
      this.data = this.classrooms;
    });
  }

  getTypes(): void {
    this.classroomService.getClassroomTypes().subscribe(types => {
      this.types = types;
    });
  }

  getAddresses(): void {
    this.addressService.getAllAddress().subscribe(addresses => {
      this.addresses = addresses.map(address => ({
        ...address,
        street: `${address.street} ${address.streetNumber}`
      }));
    });
  }

  addClassroom(classroom: { capacity: number, number: number }): Observable<Classroom> {
    const classroomWithId = {
      type: this.selectedType,
      addressId: this.selectedAddressId,
      capacity: classroom.capacity,
      number: classroom.number
    };

    return this.classroomService.createClassroom(classroomWithId);
  }

  editClassroom(classroomData: any): Observable<Classroom> {
    // console.log(classroomData.)
    const classroomWithId = {
      id: classroomData.id,
      type: this.selectedType ? this.selectedType : classroomData.type,
      addressId: this.selectedAddressId ? this.selectedAddressId : classroomData.addresses.id,
      capacity: classroomData.capacity,
      number: classroomData.number,
      code: classroomData.code
    };
    return this.classroomService.updateClassroom(classroomWithId);
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.getClassrooms();
    this.getTypes();
    this.getAddresses();
  }


  actionBegin(args: { requestType: string, action: string, data: any, rowData: any, cancel?: boolean }): void {
    super.actionBegin(args);


    if (args.requestType === 'save') {
      if (args.action === 'add') {

        this.addClassroom(args.data).subscribe({
          next: () => {
            this.getClassrooms();
          },
          error: error => {
            console.error(error);
            args.cancel = true;
            this.toastObj.show(this.toasts[1]);
          }
        });
      } else if (args.action === 'edit') {

        this.editClassroom(args.data).subscribe({
          next: () => {
            this.getClassrooms();
          },
          error: error => {
            console.error(error);
            args.cancel = true;
            this.toastObj.show(this.toasts[1]);
          }
        });
      }
    } else if (args.requestType === 'delete') {
      args.cancel = true;
      this.classroomService.deleteClassroom(args.data[0].id).subscribe({
        next: () => {
          this.getClassrooms();
        },
        error: error => {
          console.error(error);
          this.toastObj.show(this.toasts[0]);
        }
      });
    }
  }
}
