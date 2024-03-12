import Toast from 'react-native-toast-message';
 
const showToast = ({
  type = "info",
  message = '',
  subMessage = '',
  position = 'top',
}) => {
  Toast.show({
    type: type,
    text1: message,
    text2: subMessage,
    position,
  });
};
 
const showToastError = ({
  type = "error",
  message = '',
  subMessage = '',
  position = 'top',
}) => {
  Toast.show({
    type,
    text1: message,
    text2: subMessage,
    position,
  });
};
 
const showToastSuccess = ({
  type = "success",
  message = '',
  subMessage = '',
  position = 'top',
}) => {
  Toast.show({
    type,
    text1: message,
    text2: subMessage,
    position,
  });
};
 
const hideToast = () => {
  Toast.hide();
};
 
export {showToast, hideToast, showToastSuccess, showToastError};