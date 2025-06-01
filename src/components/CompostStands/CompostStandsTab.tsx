import { useEffect, useState } from 'react';
import { CompostStandDataDTO } from '../../types/ApiTypes';
import { fetchCompostStandData } from '../../apiServices/CompostStandAPI';
import { createCompostStandData } from '../../utils/CompostStandUtils';
import CompostStandDataItem from './CompostStandDataItem';
import { useAppDispatch } from '../../utils/hooks';
import {
  setIsModalVisible,
  setLoading,
  setModalText,
} from '../../store/appSlice';
import CompostStandChart from './CompostStandChart';

const initialUserData: CompostStandDataDTO = {
  depositsWeightsByStands: [
    {
      id: '9',
      name: 'burma',
      depositWeightSum: 148.92,
      averageDepositWeight: 18.62,
      depositCount: 8,
    },
  ],
  period: 30,
};

const CompostStandDataDisplay = () => {
  const [compostStandData, setCompostStandData] =
    useState<CompostStandDataDTO>(initialUserData);
  const [isStandsListVisible, setIsStandsListVisible] = useState(true);
  const [period, setPeriod] = useState<number>(30);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setLoading(true));
    // TODO debounce
    fetchCompostStandData({
      period,
    })
      .then((response) => {
        if (response instanceof Error) {
          throw new Error(response.message);
        }
        setCompostStandData(response.data);
        dispatch(setLoading(false));
      })
      .catch((e) => {
        dispatch(setModalText(e.message));
        dispatch(setIsModalVisible(true));
        dispatch(setLoading(false));
      });
  }, [period]);

  return (
    <div className={'DataDisplay'}>
      <h2 className={'DataDisplay__title'}>Compost Stand Data</h2>
      <div>PERIOD: {period} days</div>
      <input
        defaultValue={30}
        type={'number'}
        onChange={(e) => setPeriod(parseInt(e.target.value))}
        min={0}
      />
      {isStandsListVisible ? (
        <button onClick={() => setIsStandsListVisible(false)}>Hide list</button>
      ) : (
        <button onClick={() => setIsStandsListVisible(true)}>Show List</button>
      )}
      {isStandsListVisible &&
        createCompostStandData(compostStandData.depositsWeightsByStands).map(
          (compostStand) => (
            <CompostStandDataItem
              key={compostStand.id}
              compostStand={compostStand}
            />
          )
        )}
      <CompostStandChart period={period} />
    </div>
  );
};

export default CompostStandDataDisplay;
