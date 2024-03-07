import { Provider } from "react-redux";
import { store } from "./src/store/store";
import NavigationProvider from "./src/navigator/NavigationProvider";
import BleManager from 'react-native-ble-manager';

BleManager.start({showAlert: false});

const App = () => {

  return (
    <Provider store={store}>
        <NavigationProvider/>
    </Provider>
  );
};

export default App;