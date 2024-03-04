import {useEffect, useState} from "react";
import {CompostStandDataDTO} from "../types/ApiTypes";
import {fetchCompostStandData} from "../apiServices/CompostStandAPI";
import {createCompostStandData} from "../utils/CompostStandUtils";
import CompostStandDataItem from "./CompostStandDataItem";

const initialUserData: CompostStandDataDTO = {
  depositsWeightsByStands: [
    {
      id: '6',
      name: "alexander_zaid",
      weight: 0
    }
  ],
  period: 30
}

const CompostStandDataDisplay = () => {
  const [compostStandData, setUserData] = useState<CompostStandDataDTO>(initialUserData);
  const [period, setPeriod] = useState<number>(30)

  useEffect(() => {
    // TODO debounce
    fetchCompostStandData({
      period
    })
      .then((response) => {
        if (response instanceof Error) {
          throw new Error(response.message);
        }
        setUserData(response.data);
      })
      .catch((e) => {
        throw new Error(e);
      })
  }, [period])

  return (
    <div className={ 'DataDisplay' }>
      <h2 className={ 'DataDisplay__title' }>
        Compost Stand Data
      </h2>
      <div>
        PERIOD: { period } days
      </div>
      <input
        defaultValue={ 30 }
        type={ 'number' }
        onChange={ e => setPeriod(parseInt(e.target.value)) }
        min={ 0 }
      />
      {
        createCompostStandData(compostStandData.depositsWeightsByStands)
          .map(compostStand => (
          <CompostStandDataItem compostStand={compostStand} />
        ))
      }
      <div>

      </div>
    </div>
  )
}

export default CompostStandDataDisplay;
