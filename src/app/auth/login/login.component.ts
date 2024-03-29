import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DialogComponent, PositionDataModel} from "@syncfusion/ej2-angular-popups";
import {EmitType} from "@syncfusion/ej2-base";
import { Title } from '@angular/platform-browser';
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form: FormGroup;

  @ViewChild('Dialog')
  public dialogObj: DialogComponent | undefined;
  public width: string = '335px';
  public visible: boolean = false;
  public showCloseIcon: Boolean = true;
  public formHeader: string = 'Error';
  public content: string = 'Wrong data, try again!';
  public target: string = '#control_wrapper';
  public isModal: boolean = true;
  public animationSettings: any = {
    effect: 'Zoom'
  };
  public textboxValue: any;
  private formSubmitAttempt: boolean | undefined;
  public dlgBtnClick: EmitType<object> = () => {
    this.dialogObj!.hide();
  }
  public dlgButtons: Object[] = [{click: this.dlgBtnClick.bind(this), buttonModel: {content: 'Ok', isPrimary: true}}];
  position: PositionDataModel;

  public focusoutfunction(args: any) {
    if (args.target.value !== '') {
      args.target.parentElement.getElementsByClassName('e-float-text')[0].classList.add('e-label-top');
    } else {
      args.target.parentElement.getElementsByClassName('e-float-text')[0].classList.remove('e-label-top');
    }
  }

  public data: any[];

  public Submit(): void {
    this.formSubmitAttempt = true;
    if (this.form!.valid) {
      this.authService.login(
        this.form.value.username,
        this.form.value.password,
      );
      this.form!.reset();
    }
  }

  constructor(private formBuilder: FormBuilder, private titleService: Title, private authService: AuthService) {
    this.titleService.setTitle('Login');
    this.form = this.formBuilder.group({
      password: [null, [Validators.required, Validators.minLength(6)]],
      username: [null, [Validators.required]],
    });
  }

  public isFieldValid(field: string) {
    return !this.form.get(field).valid && (this.form.get(field).dirty || this.form.get(field).touched);
  }
}
