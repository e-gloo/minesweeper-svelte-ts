import type { CellState } from "src/utils/constants";


type TCell = {
    isMine: boolean,
    value: number,
    state: CellState
}

export default TCell;