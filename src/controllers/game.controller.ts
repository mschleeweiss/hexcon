import { TileType } from "src/constants/tiletype";
import { Board } from "src/entities/board";
import { Hex } from "src/entities/hex";
import { User } from "src/entities/user";
import { Pouch } from "src/entities/pouch";
import { IEmittable } from "src/interface/emittable.interface";
import { Player } from "src/entities/player";
import { Move } from "src/entities/move";

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

    get id(): string {
        return this._id;
    }

    get players(): Player[] {
        // shallow copy so array can't be modified
        return [...this._players];
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

            if (this._active || this._over) {
                throw new Error('game_already_in_progress');
            }

            this._players.push(new Player(user));
            this.updateGameStartable();
        }
    }

    changeReadiness(user: User) {
        if (this._active || this._over) {
            return;
        }
        
        const player = this._players.find((player: Player) => player.user.equals(user));
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
        this.initPlayerTiles();
    }

    makeMove(move: Move) {
        if (this._currentPlayer.user !== move.user) {
            throw new Error('unauthorized');
        }

        if (!this._currentPlayer.hasTile(move.tile)) {
            throw new Error('invalid_move');
        }

        if (!this._board.areCellsFree(move.cells) || !this._board.areCellsNeighbors(move.cells)) {
            throw new Error ('invalid_move')
        }
        
        const scoreMap = this._board.calculateScorepoints(move.cells, move.tile);
        const originalTile = this._currentPlayer.takeTile(move.tile.first, move.tile.second);

        this._board.updateCell(move.cells[0], move.tile.first);
        this._board.updateCell(move.cells[1], move.tile.second);
        // determine current player (may be the same if has extra move)
        // return error/success for callback
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

    private initPlayerTiles() {
        this._players.forEach((player: Player) => {
            while (player.canDrawTile()) {
                const tile = this._pouch.drawTile();
                player.addTile(tile);
            }
        })
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
