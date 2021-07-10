import { TileType } from "src/constants/tiletype";
import { IEmittable } from "src/interface/emittable.interface";
import { Hex } from "./hex";
import { Tile } from "./tile";

export class Board implements IEmittable {

    private _playerCount: number;
    private _map: Map<Hex, TileType> = new Map();
    private _hexagons: Hex[] = [];

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

    areCellsFree(cells: [Hex, Hex]): boolean {
        return cells.every((cell: Hex) => {
            const hex = this.getOriginalHex(cell);
            return this._map.get(hex) === TileType.EMPTY
        });
    }

    areCellsNeighbors(cells: [Hex, Hex]): boolean {
        return cells[0].distance(cells[1]) === 1;
    }

    updateCell(cell: Hex, type: TileType): void {
        const origCell = this.getOriginalHex(cell);
        this._map.set(origCell, type);
    }

    calculateScorepoints(cells: [Hex, Hex], tile: Tile): Map<TileType, number> {
        const moveTuples = [
            { cell: this.getOriginalHex(cells[0]), type: tile.first, score: 0 },
            { cell: this.getOriginalHex(cells[1]), type: tile.second, score: 0 }
        ];

        const scoreMap = new Map<TileType, number>();

        moveTuples.forEach((value: { cell: Hex; type: TileType; score: number }) => {
            for (let i = 0; i < Hex.directions.length; ++i) {
                let currentCell = value.cell.neighbor(i);
                while (this._map.get(this.getOriginalHex(currentCell)) === value.type) {
                    value.score += 1;
                    currentCell = currentCell.neighbor(i);
                }
            }

            const prevScore = scoreMap.get(value.type) ?? 0;
            scoreMap.set(value.type, prevScore + value.score);
        });

        return scoreMap;
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
                this._hexagons.push(hex);
            }
        }
    }

    private getOriginalHex(hex: Hex): Hex {
        return this._hexagons.find((val: Hex) => val.equals(hex));
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
