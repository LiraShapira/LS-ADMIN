import { CompostStandDataDTO } from "../../types/ApiTypes";
import { mergeAllStandsWithDepositStats } from "../../utils/CompostStandUtils";
import CompostStandDataItem from "./CompostStandDataItem";
import { CompostStandFromAPI } from "../../apiServices/CompostStandAPI";

interface CompostStandTableProps {
  compostStandData: CompostStandDataDTO;
  allStands: CompostStandFromAPI[];
  onToggleActive: (stand: CompostStandFromAPI) => void;
}

export const CompostStandTable = ({ compostStandData, allStands, onToggleActive }: CompostStandTableProps) => {
    const standsById = new Map(
        allStands.map((stand) => [String(stand.compostStandId), stand])
    );

    const standsToRender = mergeAllStandsWithDepositStats(
        allStands,
        compostStandData.depositsWeightsByStands,
    );

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
                    {standsToRender.map(
                        (compostStand) => {
                            const standFromApi = standsById.get(String(compostStand.id));
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