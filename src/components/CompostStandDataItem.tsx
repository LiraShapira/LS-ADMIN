import {DepositsWeightsByStand} from "../types/ApiTypes";

interface CompostStandDataItemProp {
  compostStand: DepositsWeightsByStand
}

const CompostStandDataItem = ({compostStand}: CompostStandDataItemProp) => {
  return (
    <div style={ {padding: '10px 0'} }>
      <div style={ {display: "flex"} }>
        <span>
        id:
        </span>
        <span>
        { compostStand.id }
        </span>
      </div>
      <div>
        <span>
        name:
        </span>
        <span>
        { compostStand.name }
         </span>
      </div>
      <div>weight: { compostStand.weight } kg</div>
    </div>
  )
}

export default CompostStandDataItem;
