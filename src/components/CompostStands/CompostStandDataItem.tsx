import { CompostStandWithDepositData } from '../../utils/CompostStandUtils';
import { CompostStandFromAPI } from '../../apiServices/CompostStandAPI';

interface CompostStandDataItemProp {
  compostStand: CompostStandWithDepositData;
  standFromApi?: CompostStandFromAPI;
  onToggleActive: (stand: CompostStandFromAPI) => void;
}
const CompostStandDataItem = ({ compostStand, standFromApi, onToggleActive }: CompostStandDataItemProp) => {
  return (
    <tr>
      {/* <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{compostStand.id}</td> */}
      <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
        <span style={{ textAlign: 'left', display: 'block' }}>{compostStand.name}</span></td>
      <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{compostStand.weight} kg</td>
      <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
        {compostStand.depositCount}
      </td>
      <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
        {compostStand.depositUsersCount}
      </td>
      <td className='desktop-only' style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
        {compostStand.averageDepositWeight} kg
      </td>
      <td style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
        <span style={{
          padding: '0.25rem 0.5rem',
          borderRadius: '4px',
          backgroundColor: standFromApi?.isActive ? '#d4edda' : '#f8d7da',
          color: standFromApi?.isActive ? '#155724' : '#721c24'
        }}>
          {standFromApi?.isActive ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
        <button
          onClick={() => standFromApi && onToggleActive(standFromApi)}
          disabled={!standFromApi}
          style={{
            padding: '0.25rem 0.75rem',
            backgroundColor: standFromApi?.isActive ? '#dc3545' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: standFromApi ? 'pointer' : 'not-allowed',
            fontSize: '0.875rem',
            opacity: standFromApi ? 1 : 0.6,
          }}
        >
          {standFromApi ? (standFromApi.isActive ? 'Disable' : 'Enable') : 'N/A'}
        </button>
      </td>
    </tr >
  );
};

export default CompostStandDataItem;
