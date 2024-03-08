import { Provider } from "react-redux";
import { persistor, store } from "./src/store/store";
import NavigationProvider from "./src/navigator/NavigationProvider";
import BleManager from 'react-native-ble-manager';
import { PersistGate } from "redux-persist/integration/react";

BleManager.start({showAlert: false});

const App = () => {

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationProvider/>
      </PersistGate>
    </Provider>
  ); 
};

export default App;