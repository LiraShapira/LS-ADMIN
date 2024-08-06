import { selectIsAppLoading } from '../store/appSlice';
import { useAppSelector } from '../utils/hooks';

interface LoaderProps {
  children: JSX.Element | JSX.Element[];
}

const Loader = ({ children }: LoaderProps) => {
  const appLoading = useAppSelector(selectIsAppLoading);

  return (
    <>
      {appLoading && (
        <div className='overlay'>
          <div className='loader'></div>
        </div>
      )}
      {children}
    </>
  );
};

export default Loader;
