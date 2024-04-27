import {Component} from '@angular/core';
import {Address} from "../../../../types/address";
import {Observable} from "rxjs";
import {ScheduleTableCreatorComponent} from "../schedule-table-creator.component";
import {Classroom, EditClassroom} from "../../../../types/classroom";
import {ClassroomService} from "../../../../services/classroom.service";
import {AddressService} from "../../../../services/address.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-classrooms',
  templateUrl: './classrooms.component.html',
})
export class ClassroomsComponent extends ScheduleTableCreatorComponent {
  classrooms: Classroom[];

  constructor(private classroomService: ClassroomService, private addressService: AddressService, private formBuilder: FormBuilder) { // Внедрите AddressService
    super();

    this.classroomForm = this.formBuilder.group({
      type: ['', Validators.required],
      address: ['', Validators.required],
      capacity: ['', Validators.required],
      number: ['', Validators.required]
    });
  }

  public addressDataSource: { [key: string]: Object }[] = [];
  public classroomForm: FormGroup;
  public filterPlaceholder: string = 'Search';
  public height: string = '220px';
  public watermark: string = 'Select a street';

  public getStreet(address: Address): string {
    return `${address.street} ${address.streetNumber}`;
  }

  selectedType: string;
  selectedAddressId: string;
  types: string[];
  addresses: Address[];

  onTypeChange(event: any): void {
    this.selectedType = event.itemData.value;
    if (!this.selectedType) {
      console.error('Type is undefined');
    }
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
      this.addressDataSource = addresses.map(address => ({
        id: address.id,
        street: `${address.street} ${address.streetNumber}`
      }));
    });
  }

  addClassroom(classroom: { capacity: number, number: number, address: string }): Observable<Classroom> {
    const classroomWithId = {
      type: this.selectedType,
      addressId: this.classroomForm.value.address,
      capacity: classroom.capacity,
      number: classroom.number
    };

    return this.classroomService.createClassroom(classroomWithId);
  }

  editClassroom(classroomData: EditClassroom): Observable<Classroom> {
    const classroomWithId = {
      id: classroomData.id,
      type: this.selectedType ? this.selectedType : classroomData.type,
      addressId: this.selectedAddressId && this.selectedAddressId,
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
