import { type } from "os";
import { TileType } from "src/constants/tiletype";
import { IEmittable } from "src/interface/emittable.interface";
import { Hex } from "./hex";
import { Player } from "./player";
import { Tile } from "./tile";

export class Move implements IEmittable {
    private _player: Player;
    private _cells: [Hex, Hex] = [null, null];
    private _types: [TileType, TileType] = [null, null];
    private _tile: Tile;
    private _timestamp: Date = new Date();

    constructor (player: Player, params: Object) {
        this._player = player;
        Object.keys(params).forEach((key: string, idx: number) => {
            const cell = params[key];
            const coords = cell.coords;

            this._cells[idx] = new Hex(coords.q, coords.r, coords.s);
            this._types[idx] = cell.type;
        });

        this._tile = new Tile(...this._types);
    }

    getEmittableState(): Object {
        return {
            player: this._player.getEmittableState(),
            cells: this._cells,
            tile: this._tile,
        }
    }

    get player(): Player {
        return this._player;
    }

    get cells(): [Hex, Hex] {
        return this._cells;
    }

    get tile(): Tile {
        return this._tile;
    }

    get timestamp(): Date {
        return this._timestamp;
    }
}
