import { TileType } from "src/constants/tiletype";
import { IEmittable } from "src/interface/emittable.interface";
import { Player } from "./player";

export class Log implements IEmittable {

    private _messages: string[] = [];

    getEmittableState(): Object {
        return {
            message: this._messages.join('')
        };
    }

    logScore(player: Player, score: Map<TileType, number>): void {
        const scoreTexts = Array
            .from(score)
            .map((value: [TileType, number]) => {
                const color = TileType[value[0]].toLocaleLowerCase();
                const points = value[1];
                
                return `<span class="${color}">${color} (+${points})</span>`;
            });

        const scoreText = scoreTexts.join(" and ");
        const name = player.user.name;

        const message = `<strong>${name}</strong> scored <strong>${scoreText}</strong>.`
        this.log(message);
    }

    logExtraTurn(player: Player): void {
        const name = player.user.name;
        const message = `<strong>${name}</strong> just gained an <strong>extra turn</strong>.`;
        this.log(message);
    }

    logSwap(player: Player): void {
        const name = player.user.name;
        const message = `<strong>${name}</strong> has the choice to swap all their tiles.`;
        this.log(message);
    }

    logSwapDecision(player: Player, decision: boolean): void {
        const name = player.user.name;
        const message = `<strong>${name}</strong> has decided <strong>${ decision ? 'not ': '' }to swap their tiles</strong>.`;
        this.log(message);

    }

    private log(message: string) {
        if (this._messages.length > 0) {
            this._messages.push('<br>');
        }

        this._messages.push(message);
    }
}
