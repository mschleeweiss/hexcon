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

    public get id(): string {
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
        // todo: extract to board class
        const cornerTiles = TileType.getAll();

        const mapRadius = this.determineMapRadius();
        for (let x = -mapRadius; x <= mapRadius; x++) {
            const yLow = Math.max(-mapRadius, -x - mapRadius);
            const yHigh = Math.min(mapRadius, -x + mapRadius);
            for (let y = yLow; y <= yHigh; y++) {
                const hex = new Hex(x, y, -x - y);
                const tileType = this.isCorner(hex) ? cornerTiles.pop() : TileType.EMPTY;
                this._board.set(hex, tileType);
            }
        }
    }

    private determineMapRadius(): number {
        return 3;
    }

    private isCorner(hex: Hex): boolean {
        const radius = this.determineMapRadius();
        const absCoords = hex.coords().map((coord: number) => Math.abs(coord));
        return absCoords.filter((coord: number) => coord === radius).length === 2;
    }

    private logBoard() {
        console.log(this._board);
    }

}