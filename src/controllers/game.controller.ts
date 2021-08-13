import { TileType } from "src/constants/tiletype";
import { Board } from "src/entities/board";
import { Hex } from "src/entities/hex";
import { User } from "src/entities/user";
import { Pouch } from "src/entities/pouch";
import { IEmittable } from "src/interface/emittable.interface";
import { Player } from "src/entities/player";
import { Move } from "src/entities/move";
import { Log } from "src/entities/log";

export class GameController implements IEmittable {

    private static readonly MAX_PLAYERS = 4;
    private static readonly MIN_PLAYERS = 2;

    private _id: string = this.generateId(4);
    private _starttime: Date;
    private _admin: User;
    private _players: Player[] = [];
    private _rankedPlayers: Player[] = [];
    private _board: Board;
    private _pouch: Pouch = new Pouch();
    private _currentPlayer: Player;
    private _winner: Player;
    private _moves: Move[] = [];
    private _log: Log = new Log();
    private _state: GameState = GameState.LOBBY;

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
            rankedPlayers: this._rankedPlayers.map((player: Player) => player.getEmittableState()),
            currentPlayer: this._currentPlayer?.getEmittableState(),
            board: this._board?.getEmittableState(),
            state: this._state,
            winner: this._winner,
            log: this._log.getEmittableState(),
            moves: this._moves.map((move: Move) => move.getEmittableState()),
        };
    }

    containsUser(user: User): boolean {
        return this._players.some((player: Player) => player.user.equals(user))
    }

    addUser(user: User): void {
        if (!this.containsUser(user)) {

            if (this._players.length === GameController.MAX_PLAYERS) {
                throw new Error('room_full');
            }

            if (![GameState.LOBBY, GameState.STARTABLE].includes(this._state)) {
                throw new Error('game_already_in_progress');
            }

            this._players.push(new Player(user));

            if (this._players.length === 1) {
                this._admin = user;
            }

            this.updateGameStartable();
        }
    }

    removeUser(user: User): void {
        if (this.containsUser(user)) {
            if ([GameState.LOBBY, GameState.STARTABLE].includes(this._state)) {
                const idx = this._players.findIndex((player: Player) => player.user.equals(user));
                this._players.splice(idx, 1);

                if (this._admin.equals(user) && this._players.length >= 1) {
                    this._admin = this._players[0].user;
                }
            }
        }
    }

    changeReadiness(user: User): void {
        if (![GameState.LOBBY, GameState.STARTABLE].includes(this._state)) {
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

        if (this._state !== GameState.STARTABLE) {
            throw new Error('unauthorized');
        }

        this._starttime = new Date();
        this._state = GameState.AWAITING_MOVE;
        this._board = new Board(this._players.length);
        this.drawPlayerTiles();
        this.determineCurrentPlayer();
    }

    makeMove(user: User, params: Object) {

        if (this._state !== GameState.AWAITING_MOVE) {
            throw new Error('wrong_action');
        }
        if (this._currentPlayer.user !== user) {
            throw new Error('unauthorized');
        }

        const move = new Move(this._currentPlayer, params);

        if (!this._currentPlayer.hasTile(move.tile)) {
            throw new Error('invalid_move');
        }

        if (!this._board.areCellsFree(move.cells) || !this._board.areCellsNeighbors(move.cells)) {
            throw new Error('invalid_move')
        }

        if (this._moves.length < this._players.length) {
            if (!this._board.areCellsAttachedToCorner(move.cells)) {
                throw new Error('invalid_move_first_round')
            }
        } else {
            if (!this._board.areCellsAttachedToNonEmptyCell(move.cells)) {
                throw new Error('invalid_move_other_rounds')
            }
        }

        this._moves.push(move);
        const scoreMap = this._board.calculateScorepoints(move.cells, move.tile);
        const originalTile = this._currentPlayer.takeTile(move.tile.first, move.tile.second);

        this._board.updateCell(move.cells[0], originalTile.first);
        this._board.updateCell(move.cells[1], originalTile.second);

        const fullPointsCountBeforeApplyingMove = this._currentPlayer.score.getFullPointsCount();

        scoreMap.forEach((value: number, color: TileType) => {
            this._currentPlayer.score.incrementScore(color, value);
        });

        this._log.logScore(this._currentPlayer, scoreMap);

        this.rankPlayers();
        if (this.isGameOver()) {
            this._log.logWinner(this._rankedPlayers[0]);
            this._currentPlayer = undefined;
            this._state = GameState.OVER;
            return;
        }

        const fullPointsCountAfterApplyingMove = this._currentPlayer.score.getFullPointsCount();
        const hasPlayerExtraMove = fullPointsCountBeforeApplyingMove !== fullPointsCountAfterApplyingMove;

        if (hasPlayerExtraMove) {
            this._log.logExtraTurn(this._currentPlayer);
            return;
        }

        if (this.canCurrentPlayerSwap()) {
            this._state = GameState.AWAITING_SWAP;
            this._log.logSwap(this._currentPlayer);
            return;
        }

        this.drawPlayerTiles();
        this.determineCurrentPlayer();
    }


    swapTiles(user: User, shouldSwap: boolean) {
        if (this._currentPlayer.user.id !== user.id) {
            throw new Error('unauthorized');
        }

        let returnedTiles = [];
        if (shouldSwap) {
            returnedTiles = this._currentPlayer.returnAllTiles();
        }

        this.drawPlayerTiles();

        if (shouldSwap) {
            this._pouch.giveBackTiles(returnedTiles)
        }

        this._log.logSwapDecision(this._currentPlayer, shouldSwap);
        this.determineCurrentPlayer();
        this._state = GameState.AWAITING_MOVE;
    }

    private updateGameStartable(): void {
        const isStartable = GameController.MIN_PLAYERS <= this._players.length
            && this._players.length <= GameController.MAX_PLAYERS
            && this._players.every((player: Player) => player.ready);

        this._state = isStartable ? GameState.STARTABLE : GameState.LOBBY;
    }

    private determineCurrentPlayer(): void {
        if (!this._currentPlayer) {
            this._currentPlayer = this._players[0];
        } else {
            const idx = this._players.indexOf(this._currentPlayer);
            const newIdx = (idx + 1) % this._players.length;
            this._currentPlayer = this._players[newIdx];
        }
    }

    private canCurrentPlayerSwap(): boolean {
        const scoreValues = this._currentPlayer.score.values;
        const tiles = this._currentPlayer.tiles;

        scoreValues.sort((a, b) => {
            if (a.value < b.value) {
                return -1;
            }
            if (a.value > b.value) {
                return 1;
            }
            return 0;
        });

        const minScore = Math.min(...scoreValues.map((a) => a.value));
        const canSwap = scoreValues
            .filter((v) => v.value === minScore)
            .every((v) => !tiles.some((t) => t.first === v.type || t.second === v.type));

        return canSwap;
    }

    private drawPlayerTiles() {
        this._players.forEach((player: Player) => {
            while (player.canDrawTile()) {
                const tile = this._pouch.drawTile();
                player.addTile(tile);
            }
        })
    }

    private isGameOver() {
        let winner = this._players.find((p: Player) => p.score.isMaxed());

        return winner || this._board.isFull();
    }

    private rankPlayers() {
        this.calcMoveCountForPlayers();
        this.calcThinkTimeForPlayers();

        this._rankedPlayers = this.players.sort((a: Player, b: Player) => {
            const aScore = this.sortedScore(a);
            const bScore = this.sortedScore(b);

            // higher score = better => b - a
            const scoreDiff = aScore
                .map((score, i) => bScore[i] - score)
                .filter(Boolean)[0] ?? 0;
            if (scoreDiff) {
                return scoreDiff;
            }

            // lower count = better => a - b
            const moveDiff = a.moveCount - b.moveCount;
            if (moveDiff) {
                return moveDiff;
            }

            // lower time = better => a - b
            return a.thinkTime - b.thinkTime;
        });
    }

    private calcMoveCountForPlayers() {
        this._players.forEach((player: Player) => {
            const playerMoves = this._moves.filter((move: Move) => move.player.equals(player));
            player.moveCount = playerMoves.length;
        });
    }

    private calcThinkTimeForPlayers() {
        this._players.forEach((player: Player) => {
            player.resetThinkTime()
        });

        this._moves.forEach((move: Move, i: number, moves: Move[]) => {
            const currTime = move.timestamp;
            const previousTime = moves[i - 1]?.timestamp ?? this._starttime;

            const diff = currTime.getTime() - previousTime.getTime();

            move.player.increaseThinkTime(diff);
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

    private sortedScore(player: Player) {
        return player.score.values.map(v => v.value).sort((a, b) => a - b);
    }
}

export const enum GameState {
    LOBBY = "lobby",
    STARTABLE = "startable",
    AWAITING_MOVE = "awaitingMove",
    AWAITING_SWAP = "awaitingSwap",
    OVER = "over",
}

