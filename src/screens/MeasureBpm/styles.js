import { StyleSheet } from 'react-native';
import fonts from '../../utils/fonts';
import colors from '../../utils/color';

const styles = StyleSheet.create({
  contentContainerStyle: {},
  monitorTitleInfo: {
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    marginBottom: 30,
  },
  monitorText: {
    fontFamily: fonts.regular,
    color: colors.white,
    fontSize: 22,
    marginBottom: 10,
  },
  monitorTitle: {
    fontFamily: fonts.regular,
    color: colors.white,
    fontSize: 30,
  },
  heartRateImg: {
    width: '40%',
    height: 80,
    alignItems: 'center',
    alignSelf: 'center',
  },
  zoneTitle: {
    fontFamily: fonts.regular,
    color: colors.white,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
  },
  heartRateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  initialRate: {
    width: '25%',
    paddingHorizontal: 3,
    paddingVertical: 5,
    backgroundColor: '#EFD932',
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  quaterRate: {
    width: '25%',
    paddingHorizontal: 3,
    paddingVertical: 5,
    backgroundColor: '#F2943A',
  },
  halfRate: {
    width: '25%',
    paddingHorizontal: 3,
    paddingVertical: 5,
    backgroundColor: '#DF4F70',
  },
  fullRate: {
    width: '25%',
    paddingHorizontal: 3,
    paddingVertical: 5,
    backgroundColor: '#DC2F42',
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  heartRateDescRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  heartRateDesc: {
    fontFamily: fonts.regular,
    color: colors.white,
    fontSize: 14,
  },
  descRow: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  mediumText: {
    fontFamily: fonts.regular,
    color: '#F2943A',
    fontSize: 14,
  },
  averageText: {
    fontFamily: fonts.regular,
    color: '#EFD932',
    fontSize: 14,
  },
  hightText: {
    fontFamily: fonts.regular,
    color: '#DF4F70',
    fontSize: 14,
  },
  heartRateImg: {
    height: 50,
    width: 50,
  },
  ultraHighText: {
    fontFamily: fonts.regular,
    color: '#DC2F42',
    fontSize: 14,
  },
  graphImg: {
    width: '100%',
    height: 200,
  },
});

export default styles;
