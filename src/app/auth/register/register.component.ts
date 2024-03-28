import {Component, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DialogComponent} from '@syncfusion/ej2-angular-popups';
import {EmitType} from '@syncfusion/ej2-base';
import {Title} from "@angular/platform-browser";
import {environment} from "../../../environments/environment.prod";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-register',
  styleUrls: ['register.component.css'],
  templateUrl: 'register.component.html',
  encapsulation: ViewEncapsulation.None
})
export class RegisterComponent {
  form: FormGroup;

  @ViewChild('Dialog')
  public dialogObj: DialogComponent | undefined;
  public width: string = '335px';
  public visible: boolean = false;
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

  constructor(private formBuilder: FormBuilder, private titleService: Title, private http: HttpClient) {
    this.titleService.setTitle('Register');
    this.form = this.formBuilder.group({
      firstname: [null, Validators.required],
      lastname: [null, Validators.required],
      username: [null, [Validators.required, Validators.minLength(2)]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      email: [null, [Validators.required, Validators.email]],
      mobile: [null, [Validators.required, Validators.min(100000000), Validators.max(999999999999)]]
    });
  }

  public isFieldValid(field: string) {
    return !this.form.get(field).valid && (this.form.get(field).dirty || this.form.get(field).touched);
  }

  register(firstName: string, lastName: string, userName: string, password: string, email: string, mobile: number): void {
    const body = {firstname: firstName, lastname: lastName, username: userName, password: password, email: email, mobile: mobile};
    this.http.post<any>(environment.backendUrl + '/register', body).subscribe({
      next: (response) => {
        if (response && response.access_token) {
          localStorage.setItem('access_token', response.access_token);
        } else {
          console.error('Registration error');
        }
      },
      error: (error) => {
        console.error('Server error', error);
      }
    });
  }

}
