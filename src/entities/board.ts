import { TileType } from "src/constants/tiletype";
import { IEmittable } from "src/interface/emittable.interface";
import { Hex } from "./hex";
import { Tile } from "./tile";

export class Board implements IEmittable {

    private _playerCount: number;
    private _map: Map<Hex, TileType> = new Map();
    private _hexagons: Hex[] = [];
    // boolean means "has only empty neighbors"
    private _cornerCells: Map<Hex, boolean> = new Map();

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

    areCellsAttachedToCorner(cells: [Hex, Hex]): boolean {
        return cells.some((cell: Hex) => {
            return Array
                .from(this._cornerCells)
                .filter((val: [Hex, boolean]) => val[1])
                .some((val: [Hex, boolean]) => val[0].distance(cell) === 1)
        })
    }

    isFull(): boolean {
        for (let [key, value] of this._map) {
            if (value === TileType.EMPTY) {
                const neighbors = key.neighbors().map(neighbor => this.getOriginalHex(neighbor));
                for (let i = 0; i < neighbors.length; ++i) {
                    if (this._map.get(neighbors[i]) === TileType.EMPTY) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    areCellsAttachedToNonEmptyCell(cells: [Hex, Hex]): boolean {
        return cells.some((cell: Hex) => {
            return cell.neighbors()
                .map(neighbor => this.getOriginalHex(neighbor))
                .map(neighbor => this._map.get(neighbor))
                .some(type => type !== undefined && type !== TileType.EMPTY);
        })
    }

    updateCell(cell: Hex, type: TileType): void {
        const origCell = this.getOriginalHex(cell);
        this._map.set(origCell, type);

        // update list of corner cells
        const cornerNeighbor = Array
            .from(this._cornerCells)
            .filter((val: [Hex, boolean]) => val[1])
            .find((val: [Hex, boolean]) => val[0].distance(cell) === 1);

        if (cornerNeighbor) {
            this._cornerCells.set(cornerNeighbor[0], false);
        }
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
                const isCorner = this.isCorner(hex);
                const tileType = isCorner ? cornerTiles.pop() : TileType.EMPTY;
                this._map.set(hex, tileType);
                this._hexagons.push(hex);
                if (this.isCorner(hex)) {
                    this._cornerCells.set(hex, true);
                }
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
