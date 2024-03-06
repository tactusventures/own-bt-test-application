import { Provider } from "react-redux";
import { store } from "./src/store/store";
import { Text, View } from "react-native";

const App = () => {
  return (
    <>
     
        <Provider store={store}>
          <View>
            <Text>
              Hello World
            </Text>
          </View>
        </Provider>
    
      
    </>
  );
};

export default App;