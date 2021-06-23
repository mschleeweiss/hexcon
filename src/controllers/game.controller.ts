import { TileType } from "src/constants/tiletype";
import { Hex } from "src/entities/hex";
import { Player } from "src/entities/player";

export class GameController {

    private static readonly MAX_PLAYERS = 4;

    private _id: string = this.generateId(4);
    private _admin: Player;
    private _players: Player[] = [];
    private _board: Map<Hex, TileType> = new Map();

    constructor(admin: Player) {
        this._admin = admin;
        this.generateBoard();
        this.logBoard();
    }

    public get id() : string {
        return this._id;
    }
    
    getGameState(): Object {
        return {
            id: this._id,
            admin: this._admin,
            players: this._players,
            board: Array.from(this._board),
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

    private generateBoard(): void {
        const mapRadius = this.determineMapRadius();
        for (let q = -mapRadius; q <= mapRadius; q++) {
            const r1 = Math.max(-mapRadius, -q - mapRadius);
            const r2 = Math.min(mapRadius, -q + mapRadius);
            for (let r = r1; r <= r2; r++) {
                this._board.set(new Hex(q, r, -q-r), TileType.EMPTY);
            }
        }
    }

    private determineMapRadius(): number {
        return 5;
    }

    private logBoard() {
        console.log(this._board);
    }

}