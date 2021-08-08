import { TileType } from "src/constants/tiletype";
import { Player } from "./player";

export class Log {

    messages: string[] = [];

    logTest(): void {
        console.log("test");
        this.messages.push("test");
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
        this.messages.push(message);
    }

    logExtraTurn(player: Player): void {
        const name = player.user.name;
        const message = `<strong>${name}</strong> just gained an <strong>extra turn</strong>.`;
        this.messages.push(message);
    }

    logSwap(player: Player): void {
        const name = player.user.name;
        const message = `<strong>${name}</strong> has the choice to swap all their tiles.`;
        this.messages.push(message);
    }

    logSwapDecision(player: Player, decision: boolean): void {
        const name = player.user.name;
        const message = `<strong>${name}</strong> has decided <strong>${ decision ? 'not ': '' }to swap their tiles</strong>.`;
        this.messages.push(message);

    }
}
