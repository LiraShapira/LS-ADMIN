import { CompostStandWithWeight } from '../../utils/CompostStandUtils';

interface CompostStandDataItemProp {
  compostStand: CompostStandWithWeight;
}

const CompostStandDataItem = ({ compostStand }: CompostStandDataItemProp) => {
  return (
    <div style={{ padding: '10px 0' }}>
      <div style={{ display: 'flex' }}>
        <span>id:</span>
        <span>{compostStand.id}</span>
      </div>
      <div>
        <span>name:</span>
        <span>{compostStand.name}</span>
      </div>
      <div>deposit weight: {compostStand.weight} kg</div>
    </div>
  );
};

export default CompostStandDataItem;
