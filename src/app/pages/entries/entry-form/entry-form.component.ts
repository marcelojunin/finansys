import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EntryService } from './../shared/entry.service';
import { switchMap } from 'rxjs/operators';
import toastr from 'toastr';
import { Entry } from './../shared/entry.model';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;
  entryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm = false;
  entry: Entry = new Entry();

  constructor(
    private entryService: EntryService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.buildEntryForm();
    this.setCurrentAction();
    this.loadEntry();
  }

  ngAfterContentChecked(): void {
    this.setTitle();
  }

  public submitForm(): void {
    this.submittingForm = true;

    if(this.currentAction === 'new') {
      this.createEntry();
    } else {
      this.updateEntry();
    }

  }

  private setCurrentAction(): void {
    if (this.activatedRoute.url['value'][0].path === 'new') {
      this.currentAction = 'new';
    } else {
      this.currentAction = 'edit';
    }
  }

  private buildEntryForm(): void {
    this.entryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [null, [Validators.required]],
      categoryId: [null, [Validators.required]],
    });
  }

  private loadEntry(): void {
    if (this.currentAction === 'edit') {

      this.activatedRoute.paramMap.pipe(
        switchMap(params => this.entryService.getById(+params.get('id')))
      ).subscribe((resp) => {
        this.entry = resp;
        this.entryForm.patchValue(resp);
      }, error => {
        console.log(error);
      });
    }
  }

  private setTitle(): void {
    if (this.currentAction === 'new') {
      this.pageTitle = 'Criando lançamento';
    } else {
      const entryName = this.entry.name || '';
      this.pageTitle = 'Editando lançamento : ' + entryName;
    }
  }

  private createEntry(): void {
    const entry: Entry = Object.assign(new Entry(), this.entryForm.value);

    this.entryService.create(entry)
      .subscribe(
        response => this.actionForSuccess(response),
        error => this.actionForError(error)
      );
  }

  private updateEntry(): void {
    const entry: Entry = Object.assign(new Entry(), this.entryForm.value);

    this.entryService.update(entry)
      .subscribe(
        response => this.actionForSuccess(response),
        error => this.actionForError(error)
      );
  }

  private actionForSuccess(entry: Entry): void {
    toastr.success('Solicitação processada com sucesso!');

    this.router.navigateByUrl('entries', {skipLocationChange: true}).then(
      () => this.router.navigate(['entries', entry.id, 'edit'])
    );
  }

  private actionForError(error: any) {
    toastr.error('Ocorreu um erro!');
    this.submittingForm = false;

    if (error.status === 422) {
      this.serverErrorMessages = JSON.parse(error._body).errors;
    } else {
      this.serverErrorMessages = ['Falha na comunicacao com servidor.']
    }
  }

}