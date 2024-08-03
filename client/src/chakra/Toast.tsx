import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

export const ToastProvider = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={2000}
      newestOnTop={true}
      closeOnClick
      rtl={false}
      draggable
      theme="colored"
    />
  );
};

type Status = 'success' | 'error' | 'info' | 'default';
export default function ToastAlert(status: Status, message: string) {
  switch (status) {
    case 'success':
      toast.success(message);
      break;
    case 'error':
      toast.error(message);
      break;
    case 'info':
      toast.info(message);
      break;
    case 'default':
      toast(message);
      break;
  }
}
