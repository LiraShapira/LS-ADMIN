 import { useEffect, useState } from 'react';
import { CompostStandDataDTO } from '../../types/ApiTypes';
import { fetchCompostStandData } from '../../apiServices/CompostStandAPI';
import { useAppDispatch } from '../../utils/hooks';
import {
  setIsModalVisible,
  setLoading,
  setModalText,
} from '../../store/appSlice';
import CompostStandChart from './CompostStandChart';
import { CompostStandTable } from './CompostStandTable';
import PeriodSlider from '../PeriodSlider';

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
      <PeriodSlider value={period} onChange={setPeriod} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Compost Stand Table</h1>
        {isStandsListVisible ? (
          <button onClick={() => setIsStandsListVisible(false)}>Hide list</button>
        ) : (
          <button onClick={() => setIsStandsListVisible(true)}>Show List</button>
        )}
      </div>
      {isStandsListVisible &&
        <>

          <span className='mobile-only'>Some data may not be viewable on mobile view</span>

          <CompostStandTable compostStandData={compostStandData} />
        </>
      }
      <CompostStandChart period={period} />
    </div>
  );
};

export default CompostStandDataDisplay;
