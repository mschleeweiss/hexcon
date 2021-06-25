import { TileType } from "src/constants/tiletype";
import { Board } from "src/entities/board";
import { Hex } from "src/entities/hex";
import { Player } from "src/entities/player";
import { Pouch } from "src/entities/pouch";
import { IEmittable } from "src/interface/emittable.interface";

export class GameController implements IEmittable {

    private static readonly MAX_PLAYERS = 4;

    private _id: string = this.generateId(4);
    private _admin: Player;
    private _players: Player[] = [];
    private _board: Board = new Board(2);
    private _pouch: Pouch = new Pouch();

    constructor(admin: Player) {
        this._admin = admin;
    }

    public get id(): string {
        return this._id;
    }

    getEmittableState(): Object {
        return {
            id: this._id,
            admin: this._admin,
            players: this._players,
            board: this._board.getEmittableState(),
        };
    }

    addPlayer(player: Player): void {
        if (!this._players.includes(player)) {

            if (this._players.length === GameController.MAX_PLAYERS) {
                throw new Error('room_full');
            }
            this._players.push(player);
            this.updateGameStartable();
        }
    }

    private updateGameStartable(): void {

    }

    private generateId(length: number): string {
        const result = [];
        const characters =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++) {
            result.push(
                characters.charAt(Math.floor(Math.random() * characters.length)),
            );
        }
        return result.join('');
    }



}