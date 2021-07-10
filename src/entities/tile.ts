import { TileType } from "src/constants/tiletype";

export class Tile {

    constructor(public first: TileType, public second: TileType) { }

    equals(tile: Tile): boolean {
        return tile.first === this.first && tile.second === this.second;
    }

}
