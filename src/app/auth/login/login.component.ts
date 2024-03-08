import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DialogComponent, PositionDataModel} from "@syncfusion/ej2-angular-popups";
import {EmitType} from "@syncfusion/ej2-base";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  form: FormGroup;

  @ViewChild('Dialog')
  public dialogObj: DialogComponent | undefined;
  public width: string = '335px';
  public visible: boolean = false;
  public multiple: boolean = false;
  public showCloseIcon: Boolean = true;
  public formHeader: string = 'Success';
  public content: string = 'You have successfully registered, Thank you.';
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

  public Submit(): void {
    this.formSubmitAttempt = true;
    if (this.form!.valid) {
      console.log(this.form.value);
      this.dialogObj!.show();
      this.form!.reset();
    }
  }

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.textboxValue = '';
    this.form = this.formBuilder.group({
      password: [null, [Validators.required, Validators.minLength(6)]],
      email: [null, [Validators.required, Validators.email]],
    });
  }

  public isFieldValid(field: string) {
    return !this.form.get(field).valid && (this.form.get(field).dirty || this.form.get(field).touched);
  }
}
