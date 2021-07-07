import { TileType } from "src/constants/tiletype";
import { IEmittable } from "src/interface/emittable.interface";
import { Hex } from "./hex";

export class Board implements IEmittable {

    _playerCount: number;
    _map: Map<Hex, TileType> = new Map();

    constructor(playerCount: number) {
        this._playerCount = playerCount;
        this.generateBoard();
    }

    getEmittableState(): Object {
        const map = Array
            .from(this._map)
            .map((val: [Hex, number]) => ({ coords: val[0], type: val[1] }));

        return { map };
    }

    private generateBoard(): void {
        const cornerTiles = TileType.getAll();

        const mapRadius = this.determineMapRadius();
        for (let q = -mapRadius; q <= mapRadius; q++) {
            const rLow = Math.max(-mapRadius, -q - mapRadius);
            const rHigh = Math.min(mapRadius, -q + mapRadius);
            for (let r = rLow; r <= rHigh; r++) {
                const hex = new Hex(q, r, -q - r);
                const tileType = this.isCorner(hex) ? cornerTiles.pop() : TileType.EMPTY;
                this._map.set(hex, tileType);
            }
        }
    }

    private determineMapRadius(): number {
        return this._playerCount + 3;
    }

    private isCorner(hex: Hex): boolean {
        const radius = this.determineMapRadius();
        const absCoords = hex.coords().map((coord: number) => Math.abs(coord));
        return absCoords.filter((coord: number) => coord === radius).length === 2;
    }
}
