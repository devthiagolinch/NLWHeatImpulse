import { StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 46,

  },
  message:{
    fontSize: 18,
    color: COLORS.WHITE,
    fontFamily: FONTS.REGULAR,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    marginLeft: 8
  },
  userName: {
    fontSize: 15,
    fontFamily: FONTS.REGULAR,
    color: COLORS.WHITE,
    marginLeft: 12
  }
});