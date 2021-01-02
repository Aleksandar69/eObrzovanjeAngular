import { User } from './user';

export class Student{

  private id: string;
  private _ime: string;
  private prezime: string;
  private username: string;
  private role: string;
  private authorities: [];
  private jmbg: string;
  private adresa: string;
  private password: string;
  private brojTelefona: string;
  private index: String;
  private _stanje: number;
  private tekuciRacun: String;

  constructor() {
    this.id = '';
    this._ime = '';
    this.prezime = '';
    this.username = '';
    this.role = '';
    this.authorities = [];
    this.jmbg = '';
    this.adresa = '';
    this.password = '';
    this.brojTelefona = '';
    this.index = '';
    this._stanje = 0;
    this.tekuciRacun = '';
  }


  public get ime(){
    return this._ime;
  }

  public set stanje(stanje: number){
    this._stanje = stanje;
  }
}
