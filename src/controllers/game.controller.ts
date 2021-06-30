import { TileType } from "src/constants/tiletype";
import { Board } from "src/entities/board";
import { Hex } from "src/entities/hex";
import { User } from "src/entities/user";
import { Pouch } from "src/entities/pouch";
import { IEmittable } from "src/interface/emittable.interface";
import { Player } from "src/entities/player";

export class GameController implements IEmittable {

    private static readonly MAX_PLAYERS = 4;
    private static readonly MIN_PLAYERS = 2;

    private _id: string = this.generateId(4);
    private _admin: User;
    private _players: Player[] = [];
    private _board: Board = new Board(2);
    private _pouch: Pouch = new Pouch();
    private _startable: boolean = false;

    constructor(admin: User) {
        this._admin = admin;
    }

    public get id(): string {
        return this._id;
    }

    getEmittableState(): Object {
        return {
            id: this._id,
            admin: this._admin,
            players: this._players.map((player: Player) => player.getEmittableState()),
            board: this._board.getEmittableState(),
            startable: this._startable,
        };
    }

    addPlayer(user: User): void {
        const playerAlreadyExists = this._players.some((player: Player) => player.user.equals(user))
        console.log(user);
        console.log(this._players);
        if (!playerAlreadyExists) {

            if (this._players.length === GameController.MAX_PLAYERS) {
                throw new Error('room_full');
            }

            // todo: don't add player if game is already running/over
            this._players.push(new Player(user));
            this.updateGameStartable();
        }
    }

    changeReadiness(user: User) {
        const player = this._players.find((player: Player) => player.user.equals(user));
        if (!player) {
            // error
        }
        player.ready = !player.ready;
        this.updateGameStartable();
    }

    private updateGameStartable(): void {
        this._startable = GameController.MIN_PLAYERS <= this._players.length
            && this._players.length <= GameController.MAX_PLAYERS
            && this._players.every((player: Player) => player.ready);
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
