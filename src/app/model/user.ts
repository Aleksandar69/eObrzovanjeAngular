export class User {
    public userId: string;
    public ime: string;
    public prezime: string;
    public username: string;
    public role: string;
    public authorities: [];

    constructor() {
      this.userId = '';
      this.ime = '';
      this.prezime = '';
      this.username = '';
      this.role = '';
      this.authorities = [];
    }

  }
