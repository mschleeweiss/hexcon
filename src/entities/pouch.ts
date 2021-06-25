import { TileType } from "src/constants/tiletype";
import { Tile } from "./tile";

export class Pouch {

    private _tiles: Tile[] = []

    constructor() {
        this.generatePouch();
        console.log(this._tiles.length);
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
    }

}
