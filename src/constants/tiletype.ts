export enum TileType {
    EMPTY = 0,
    RED = 1,
    GREEN = 2,
    YELLOW = 3,
    PURPLE = 4,
    ORANGE = 5,
    BLUE = 6
}

export namespace TileType {
    export function getAll(): TileType[] {
        const tiles = [
            TileType.YELLOW,
            TileType.RED,
            TileType.PURPLE,
            TileType.ORANGE,
            TileType.GREEN,
            TileType.BLUE,
        ];
        return shuffle(tiles) ;
    }

    function shuffle(array) {
        var currentIndex = array.length,  randomIndex;
      
        while (0 !== currentIndex) {
      
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
      
        return array;
      }
}
