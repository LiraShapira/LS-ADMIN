import { CompostStandWithDepositData } from '../../utils/CompostStandUtils';

interface CompostStandDataItemProp {
  compostStand: CompostStandWithDepositData;
}
const CompostStandDataItem = ({ compostStand }: CompostStandDataItemProp) => {
  return (
    <tr>
      {/* <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{compostStand.id}</td> */}
      <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
        <span style={{ textAlign: 'left', display: 'block' }}>{compostStand.name}</span></td>
      <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{compostStand.weight} kg</td>
      <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
        {compostStand.depositCount}
      </td>
      <td className='desktop-only' style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
        {compostStand.averageDepositWeight} kg
      </td>
    </tr >
  );
};

export default CompostStandDataItem;
