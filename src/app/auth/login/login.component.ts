import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DialogComponent, PositionDataModel} from "@syncfusion/ej2-angular-popups";
import {EmitType} from "@syncfusion/ej2-base";
import { Title } from '@angular/platform-browser';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment.prod";
import {Router} from "@angular/router";

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
      this.login(
        this.form.value.username,
        this.form.value.password,
      );
      this.form!.reset();
    }
  }

  constructor(private formBuilder: FormBuilder, private titleService: Title, private http: HttpClient, private router: Router) {
    this.titleService.setTitle('Login');
    this.form = this.formBuilder.group({
      password: [null, [Validators.required, Validators.minLength(6)]],
      username: [null, [Validators.required]],
    });
  }

  public isFieldValid(field: string) {
    return !this.form.get(field).valid && (this.form.get(field).dirty || this.form.get(field).touched);
  }
  login(userName: string, password: string): void {
    const body = {username: userName, password: password};
    this.http.post<any>(environment.backendUrl + '/auth/login', body, {observe: 'response'}).subscribe({
      next: (response) => {
        const accessToken = response.headers.get('Set-Cookie');
        localStorage.setItem('access_token', accessToken);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Server error', error);
        this.dialogObj!.show();
      }
    });
  }


}
