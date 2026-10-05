sap.ui.define([], function () {
  "use strict";

  function shuffle(aInput) {
    const aResult = aInput.slice();
    for (let i = aResult.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [aResult[i], aResult[j]] = [aResult[j], aResult[i]];
    }
    return aResult;
  }
  function createBingoBoard(aBuzzwordPool) {
    const iBoardSize = 5;
    const iTileCount = iBoardSize * iBoardSize;
    const iCenterIndex = Math.floor(iTileCount / 2);
    const aSelectedWords = shuffle(aBuzzwordPool).slice(0, iTileCount - 1);
    const aTiles = [];
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
  function checkBingo(aTiles) {
    const iBoardSize = Math.sqrt(aTiles.length);
    const isMarked = (iRow, iCol) => aTiles[iRow * iBoardSize + iCol].marked;
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
  var __exports = {
    __esModule: true
  };
  __exports.createBingoBoard = createBingoBoard;
  __exports.checkBingo = checkBingo;
  return __exports;
});
//# sourceMappingURL=bingo-dbg.js.map
