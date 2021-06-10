export class Player {
    id: string;
    name: string;
    connected: boolean;
  
    constructor(id: string, name: string) {
      this.id = id;
      this.name = name;
      this.connected = true;
    }
  
    equals(player: Player): boolean {
      return player.id === this.id;
    }
  }
  