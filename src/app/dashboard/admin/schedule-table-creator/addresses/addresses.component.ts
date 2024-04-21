import { Component } from '@angular/core';
import {GridModule} from "@syncfusion/ej2-angular-grids";
import {ToastModule} from "@syncfusion/ej2-angular-notifications";
import {Observable} from "rxjs";
import {ScheduleTableCreatorComponent} from "../schedule-table-creator.component";
import {Address} from "../../../../types/address";
import {AddressService} from "../../../../services/address.service";

@Component({
  selector: 'app-addresses',
  standalone: true,
    imports: [
        GridModule,
        ToastModule
    ],
  templateUrl: './addresses.component.html',
  styleUrl: './addresses.component.css'
})
export class AddressesComponent extends ScheduleTableCreatorComponent{
  addresses: Address[];

  constructor(private addressService: AddressService) {
    super();
  }

  getAddresses(): void {
    this.addressService.getAllAddress().subscribe(addresses => {
      this.addresses = addresses;
      this.data = this.addresses;
    });
  }

  addAddress(address: { streetNumber: number, street: string }): Observable<Address> {
    const addressWithId = {id: '', ...address};
    return this.addressService.createAddress(addressWithId);
  }

  editAddress(addressData: any): Observable<Address> {
    return this.addressService.updateAddress(addressData);
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.getAddresses();
  }

  actionBegin(args: { requestType: string, action: string, data: any, rowData: any, cancel?: boolean }): void {
    super.actionBegin(args);

    if (args.requestType === 'save') {
      if (args.action === 'add') {
        this.addAddress(args.data).subscribe({
          next: () => {
            this.getAddresses();
          },
          error: error => {
            console.error(error);
            args.cancel = true;
            this.toastObj.show(this.toasts[1]);
          }
        });
      } else if (args.action === 'edit') {
        this.editAddress(args.data).subscribe({
          next: () => {
            this.getAddresses();
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
      this.addressService.deleteAddress(args.data[0].id).subscribe({
        next: () => {
          this.getAddresses();
        },
        error: error => {
          console.error(error);
          this.toastObj.show(this.toasts[0]);
        }
      });
    }
  }
}
