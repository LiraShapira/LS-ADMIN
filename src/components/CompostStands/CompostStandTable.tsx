import { CompostStandDataDTO } from "../../types/ApiTypes";
import { createCompostStandData } from "../../utils/CompostStandUtils";
import CompostStandDataItem from "./CompostStandDataItem";

export const CompostStandTable = ({ compostStandData }: { compostStandData: CompostStandDataDTO }) => {
    return (
        <div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        {/* <th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>ID</th> */}
                        <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'left' }}>Name</th>
                        <th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Weight (kg)</th>
                        <th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Deposits Count</th>
                        <th className='desktop-only' style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Average Deposit Weight (kg)</th>
                    </tr>
                </thead>
                <tbody>
                    {createCompostStandData(compostStandData.depositsWeightsByStands).map(
                        (compostStand) => (
                            <CompostStandDataItem
                                key={compostStand.id}
                                compostStand={compostStand}
                            />
                        )
                    )}
                </tbody>
            </table>
        </div>
    );
}