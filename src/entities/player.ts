import { TileType } from "src/constants/tiletype";
import { IEmittable } from "src/interface/emittable.interface";
import { Score } from "./score";
import { Tile } from "./tile";
import { User } from "./user";


export class Player implements IEmittable{
    private static readonly MAX_TILES = 6;

    private _user: User;
    private _tiles: Tile[] = [];
    private _ready: boolean = false;
    private _score: Score = new Score();

    constructor(user: User) {
        this._user = user;
    }

    get user() : User {
        return this._user;
    }

    get tiles(): Tile[] {
        return this._tiles;
    }

    get ready(): boolean {
        return this._ready
    }

    set ready(value: boolean) {
        this._ready = value;
    }

    get score(): Score {
        return this._score;
    }

    getEmittableState(): Object {
        return {
            user: this.user,
            ready: this.ready,
            score: this.score.getEmittableState(),
        };
    }
    
    equals(player: Player): boolean {
      return player.user.id === this.user.id;
    }

    addTile(tile: Tile) {
        if (this.canDrawTile()) {
            this._tiles.push(tile);
        }
    }

    canDrawTile(): boolean {
        return this._tiles.length < Player.MAX_TILES;
    }

    takeTile(first: TileType, second: TileType): Tile {
        const tempTile = new Tile(first, second);
        const idx = this._tiles.findIndex((tile: Tile) => tile.equals(tempTile));
        if (idx < 0) {
            // error
        }
        return this._tiles.splice(idx, 1)[0];
    }
  }
  