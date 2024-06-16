import { selectIsLoading } from '../store/appSlice';
import { useAppSelector } from '../utils/hooks';

interface LoaderProps {
  children: JSX.Element | JSX.Element[];
}

const Loader = ({ children }: LoaderProps) => {
  const loading = useAppSelector(selectIsLoading);

  return (
    <>
      {loading && (
        <div className='overlay'>
          <div className='loader'></div>
        </div>
      )}
      {children}
    </>
  );
};

export default Loader;
