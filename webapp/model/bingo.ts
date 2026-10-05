export interface ITile {
    id: number;
    text: string;
    marked: boolean;
    free: boolean;
}

function shuffle<T>(aInput: T[]): T[] {
    const aResult = aInput.slice();
    for (let i = aResult.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [aResult[i], aResult[j]] = [aResult[j], aResult[i]];
    }
    return aResult;
}

export function createBingoBoard(aBuzzwordPool: string[]): ITile[] {
    const iBoardSize = 5;
    const iTileCount = iBoardSize * iBoardSize;
    const iCenterIndex = Math.floor(iTileCount / 2);
    const aSelectedWords = shuffle(aBuzzwordPool).slice(0, iTileCount - 1);

    const aTiles: ITile[] = [];
    let iWordIndex = 0;

    for (let iId = 0; iId < iTileCount; iId++) {
        const bIsFree = iId === iCenterIndex;
        aTiles.push({
            id: iId,
            text: bIsFree ? "FREE" : aSelectedWords[iWordIndex++],
            marked: bIsFree,
            free: bIsFree
        });
    }

    return aTiles;
}

export function checkBingo(aTiles: ITile[]): boolean {
    const iBoardSize = Math.sqrt(aTiles.length);
    const isMarked = (iRow: number, iCol: number): boolean => aTiles[iRow * iBoardSize + iCol].marked;

    for (let iRow = 0; iRow < iBoardSize; iRow++) {
        let bRowComplete = true;
        for (let iCol = 0; iCol < iBoardSize; iCol++) {
            bRowComplete = bRowComplete && isMarked(iRow, iCol);
        }
        if (bRowComplete) {
            return true;
        }
    }

    for (let iCol = 0; iCol < iBoardSize; iCol++) {
        let bColComplete = true;
        for (let iRow = 0; iRow < iBoardSize; iRow++) {
            bColComplete = bColComplete && isMarked(iRow, iCol);
        }
        if (bColComplete) {
            return true;
        }
    }

    let bMainDiagonal = true;
    let bAntiDiagonal = true;
    for (let i = 0; i < iBoardSize; i++) {
        bMainDiagonal = bMainDiagonal && isMarked(i, i);
        bAntiDiagonal = bAntiDiagonal && isMarked(i, iBoardSize - 1 - i);
    }

    return bMainDiagonal || bAntiDiagonal;
}
