import { TileType } from "src/constants/tiletype";
import { Tile } from "./tile";

export class Pouch {

    private _tiles: Tile[] = []

    constructor() {
        this.generatePouch();
        console.log(this._tiles);
    }

    drawTile() {
        if (this._tiles.length < 1) {
            throw new Error("pouch_empty"); 
        }

        return this._tiles.pop();
    }

    private generatePouch(): void {
        const types = TileType.getAll();
        for (let i = 0; i < types.length; ++i) {
            const firstType = types[i];
            for (let j = i; j < types.length; ++j) {
                const secondType = types[j];
                const tile = new Tile(firstType, secondType);
                // six tiles for each two-colour combination (e.g. red/orange) 
                // five for each double (e.g. blue/blue)
                const count = firstType === secondType ? 5 : 6;
                const tiles = Array(count).fill(tile);
                this._tiles.push(...tiles);
            };
        };

        this.shuffle(this._tiles);
    }

    private shuffle(list) {
        let currentIndex = list.length;
      
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
      
          // Pick a remaining element...
          const randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          // And swap it with the current element.
          [list[currentIndex], list[randomIndex]] = [
            list[randomIndex], list[currentIndex]];
        }
      
        return list;
      }

}
