import { Provider } from "react-redux";
import { store } from "./src/store/store";
import { Text, View } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AddDevice from "./src/screens/AddDevice";


const Stack = createStackNavigator();


const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
           <Stack.Screen name="Home" component={AddDevice} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;