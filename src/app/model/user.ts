export class User {
    public userId: string;
    public ime: string;
    public prezime: string;
    public username: string;
    public role: string;
    public authorities: [];
    public jmbg: string;
    public adresa: string;
    private password: string;

    constructor() {
      this.userId = '';
      this.ime = '';
      this.prezime = '';
      this.username = '';
      this.role = '';
      this.authorities = [];
      this.jmbg = '';
      this.adresa = '';
      this.password = '';
    }

  }
