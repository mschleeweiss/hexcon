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
    private _board: Board;
    private _pouch: Pouch = new Pouch();
    private _startable: boolean = false;
    private _active: boolean = false;
    private _over: boolean = false;
    private _currentPlayer: Player;

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
            currentPlayer: this._currentPlayer?.getEmittableState(),
            board: this._board?.getEmittableState(),
            startable: this._startable,
            active: this._active,
            over: this._over,
        };
    }

    addPlayer(user: User): void {
        const playerAlreadyExists = this._players.some((player: Player) => player.user.equals(user))
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

    startGame(user: User) {
        if (this._admin !== user) {
            throw new Error('unauthorized');
        }

        if (!this._startable) {
            throw new Error('unauthorized');
        }

        this._active = true;
        this._board = new Board(this._players.length);
        this.determineCurrentPlayer();
    }

    private updateGameStartable(): void {
        this._startable = GameController.MIN_PLAYERS <= this._players.length
            && this._players.length <= GameController.MAX_PLAYERS
            && this._players.every((player: Player) => player.ready);
    }

    private determineCurrentPlayer(): void {
        if (!this._currentPlayer) {
            this._currentPlayer = this._players[0];
        } else {
            const idx = this._players.indexOf(this._currentPlayer);
            const newIdx = idx + 1 % this._players.length;
            this._currentPlayer = this._players[newIdx];
        }
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
