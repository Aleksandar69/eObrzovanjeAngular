export class User {
    public id: number;
    public ime: string;
    public prezime: string;
    public username: string;
    public role: string;
    public jmbg: string;
    public adresa: string;
    private password: string;
    public brojTelefona: string;
    public profileImageUrl: string;
    public tekuciRacun: string;
    public brojIndexa: string;

    constructor() {
      this.id = null;
      this.ime = '';
      this.prezime = '';
      this.username = '';
      this.role = '';
      this.jmbg = '';
      this.adresa = '';
      this.password = '';
      this.brojTelefona = '';
      this.profileImageUrl = '';
      this.tekuciRacun = '';
      this.brojIndexa = '';
    }


    public get _ime(){
      return this.ime;
    }

  }
