import { TileType } from "src/constants/tiletype";
import { IEmittable } from "src/interface/emittable.interface";

export class Score implements IEmittable {

    private static readonly MIN_VALUE = 0;
    private static readonly MAX_VALUE = 18;

    private _values: Map<TileType, number> = new Map<TileType, number>([
        [TileType.RED, Score.MIN_VALUE],
        [TileType.GREEN, Score.MIN_VALUE],
        [TileType.YELLOW, Score.MIN_VALUE],
        [TileType.PURPLE, Score.MIN_VALUE],
        [TileType.ORANGE, Score.MIN_VALUE],
        [TileType.BLUE, Score.MIN_VALUE],
    ]);


    getEmittableState(): Object {
        return {
            values: this.values
        };
    }

    get values(): { type: TileType; value: number }[] {
        return Array
            .from(this._values)
            .map((val: [TileType, number]) => ({ type: val[0], value: val[1] }));
    }

    incrementScore(color: TileType, value: number) {
        const intermediateResult = Math.min(this._values.get(color) + value, Score.MAX_VALUE);
        this._values.set(color, intermediateResult);
    }

    getFullPointsCount(): number {
        return Array
            .from(this._values.values())
            .map((points: number) => points >= Score.MAX_VALUE)
            .filter(Boolean).length;
    }

    isMaxed(): boolean {
        return Array
            .from(this._values.values())
            .every((points: number) => points >= Score.MAX_VALUE);
    }
}
