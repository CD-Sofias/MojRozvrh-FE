import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DialogModule} from '@syncfusion/ej2-angular-popups';
import {DropDownListModule} from '@syncfusion/ej2-angular-dropdowns';
import {NumericTextBoxModule, TextBoxModule} from '@syncfusion/ej2-angular-inputs';
import {CheckBoxModule} from '@syncfusion/ej2-angular-buttons';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {AuthRoutingModule} from './auth-routing.module';
import {FieldErrorDisplayComponent} from "../subcomponent/subcomponent.component";
import {HttpClientModule} from "@angular/common/http";
import {AuthService} from "./auth.service";

@NgModule({
  declarations: [LoginComponent, RegisterComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule,
    DialogModule, TextBoxModule, CheckBoxModule, DropDownListModule,
    NumericTextBoxModule, AuthRoutingModule, FieldErrorDisplayComponent,
    HttpClientModule],
  exports: [LoginComponent, RegisterComponent],
  providers: [AuthService],
})
export class AuthModule {
}

