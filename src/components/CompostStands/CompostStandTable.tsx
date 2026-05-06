import { CompostStandDataDTO } from "../../types/ApiTypes";
import { createCompostStandData } from "../../utils/CompostStandUtils";
import CompostStandDataItem from "./CompostStandDataItem";
import { CompostStandFromAPI } from "../../apiServices/CompostStandAPI";

interface CompostStandTableProps {
  compostStandData: CompostStandDataDTO;
  allStands: CompostStandFromAPI[];
  onToggleActive: (stand: CompostStandFromAPI) => void;
}

export const CompostStandTable = ({ compostStandData, allStands, onToggleActive }: CompostStandTableProps) => {
    return (
        <div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        {/* <th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>ID</th> */}
                        <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'left' }}>Name</th>
                        <th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Weight (kg)</th>
                        <th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Deposits Count</th>
                        <th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Depositors (users)</th>
                        <th className='desktop-only' style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Average Deposit Weight (kg)</th>
                        <th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Status</th>
                        <th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {createCompostStandData(compostStandData.depositsWeightsByStands).map(
                        (compostStand) => {
                            const standFromApi = allStands.find(
                                (stand) => String(stand.compostStandId) === String(compostStand.id)
                            );
                            return (
                            <CompostStandDataItem
                                key={compostStand.id}
                                compostStand={compostStand}
                                standFromApi={standFromApi}
                                onToggleActive={onToggleActive}
                            />
                            );
                        }
                    )}
                </tbody>
            </table>
        </div>
    );
}