export class User {
    id: string;
    name: string;
    connected: boolean;
  
    constructor(id: string, name: string) {
      this.id = id;
      this.name = name;
      this.connected = true;
    }
  
    equals(user: User): boolean {
      return user.id === this.id;
    }
  }
  