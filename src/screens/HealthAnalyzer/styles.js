import {StyleSheet, Dimensions} from 'react-native';
import {ms, s, vs} from '../../utils/sizeMatters';

const windowHeight = Dimensions.get('window').height;
export const styles = StyleSheet.create({
  wrapper: {
    margin: s(22),
    paddingBottom: vs(40),
    overflow: 'hidden',
    borderRadius: 10,
    position: 'relative',
  },
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    paddingVertical: '16%',
    display: 'flex',
    alignItems: 'center',
  },
  itemsContainer: {
    paddingTop: '12%',
    paddingBottom: '2%',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
});
