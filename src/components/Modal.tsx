import { useDispatch } from 'react-redux';
import {
  selectIsModalVisible,
  selectModalText,
  setIsModalVisible,
  setModalText,
} from '../store/appSlice';
import { useAppSelector } from '../utils/hooks';

export interface ModalProps {
  type?: 'info' | 'error';
  children: JSX.Element | JSX.Element[];
}
const Modal = ({ children, type = 'info' }: ModalProps) => {
  const isModalVisible = useAppSelector(selectIsModalVisible);
  const modalText = useAppSelector(selectModalText);
  const dispatch = useDispatch();

  const onResetModal = () => {
    dispatch(setIsModalVisible(false));
    dispatch(setModalText(''));
  };

  return (
    <>
      {isModalVisible && modalText && (
        <div className='overlay'>
          <div
            style={{
              borderColor: type === 'info' ? 'blue' : 'red',
              borderWidth: 4,
              borderStyle: 'solid',
              width: '50%',
              height: '50%',
              background: 'white',
              display: 'flex',
              flexDirection: 'column',
              padding: '10px',
              alignItems: 'center',
              justifyContent: 'space-around',
            }}
          >
            <div>{modalText}</div>
            <button onClick={onResetModal}>ok</button>
          </div>
        </div>
      )}
      {children}
    </>
  );
};

export default Modal;
