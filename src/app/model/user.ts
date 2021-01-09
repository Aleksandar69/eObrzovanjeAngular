export class User {
    public id: string;
    public _ime: string;
    public prezime: string;
    public username: string;
    public role: string;
    public authorities: [];
    public jmbg: string;
    public adresa: string;
    private password: string;
    public brojTelefona: string;
    public profileImageUrl: string;

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
      this.profileImageUrl = '';
    }


    public get ime(){
      return this._ime;
    }

  }
