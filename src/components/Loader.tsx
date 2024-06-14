import { selectIsModalVisible } from '../store/appSlice';
import { useAppSelector } from '../utils/hooks';

interface LoaderProps {
  children: JSX.Element | JSX.Element[];
}

const Loader = ({ children }: LoaderProps) => {
  const isModalVisible = useAppSelector(selectIsModalVisible);

  return (
    <>
      {isModalVisible && (
        <div className='overlay'>
          <div className='loader'></div>
        </div>
      )}
      {children}
    </>
  );
};

export default Loader;
