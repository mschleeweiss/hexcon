import { type } from "os";
import { TileType } from "src/constants/tiletype";
import { Hex } from "./hex";
import { Tile } from "./tile";
import { User } from "./user";

export class Move {
    private _user: User;
    private _cells: [Hex, Hex] = [null, null];
    private _types: [TileType, TileType] = [null, null];
    private _tile: Tile;

    constructor (user: User, params: Object) {
        this._user = user;
        Object.keys(params).forEach((key: string, idx: number) => {
            const cell = params[key];
            const coords = cell.coords;

            this._cells[idx] = new Hex(coords.q, coords.r, coords.s);
            this._types[idx] = cell.type;
        });

        this._tile = new Tile(...this._types);
    }

    get user(): User {
        return this._user;
    }

    get cells(): [Hex, Hex] {
        return this._cells;
    }

    get tile(): Tile {
        return this._tile;
    }
}
