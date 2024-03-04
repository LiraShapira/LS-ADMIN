import UserDataDisplay from "./UserDataDisplay";
import CompostStandDataDisplay from "./CompostStandDataDisplay";
import {AppPage} from "../types/AppTypes";

interface DataDashBoardProps {
  currentPage: AppPage;
}

const DataDashBoard = ({currentPage}: DataDashBoardProps) => {
  return (
    <div className={ 'DataDashBoard' }>
      {
        currentPage === 'users' &&
          <UserDataDisplay/>
      }
      {
        currentPage === 'compostStands' &&
          <CompostStandDataDisplay/>
      }
    </div>
  )
}

export default DataDashBoard;
