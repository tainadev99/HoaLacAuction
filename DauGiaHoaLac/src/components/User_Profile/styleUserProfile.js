import {StyleSheet} from 'react-native';

export const styleUserProfile = StyleSheet.create({
  user_container: {
    width: '90%',
    alignSelf: 'center',
    flex: 1,
    paddingVertical: 10,
  },
  topUser: {
    width: '100%',
    alignItems: 'center',
  },

  cover: {
    width: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: 163,
    backgroundColor: 'green',
    position: 'relative',
  },
  avatar: {
    width: 140,
    height: 140,
    bottom: -70,
    borderRadius: 70,
    borderColor: 'white',
    borderWidth: 3,
    elevation: 10,
    position: 'absolute',
    alignSelf: 'center',
  },
  camera_container: {
    width: 43,
    height: 43,
    position: 'absolute',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
  },

  circle_camera: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: undefined,
    height: undefined,
    borderRadius: 70,
    flex: 1,
  },

  botUser: {
    flex: 1,
    width: '100%',
  },
  menu: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#A6A5A5',
    paddingBottom: 13,
  },

  textMenu: {
    color: '#A6A5A5',
    fontSize: 17,
    fontWeight: 'bold',
    marginRight: 20,
    height: 30,
  },
  textMenu2: {
    color: '#A6A5A5',
    fontSize: 17,
    fontWeight: 'bold',
    height: 30,
  },

  textMenuSelected: {
    color: '#FA4A0C',
    borderColor: '#FA4A0C',
    borderBottomWidth: 2,
  },

  inforUser: {
    flex: 1,
    marginTop: 10,
  },
  headerView: {
    height: 70,
    borderBottomWidth: 0.7,
    borderBottomColor: '#AAAAAA',
    backgroundColor: 'white',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerViewVW: {
    width: '90%',
    height: 63,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  headerTxt: {
    fontFamily: 'Roboto',
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 28.13,
  },
  headerEditBTN: {
    height: '100%',
    width: 20,
    alignSelf: 'center',
    justifyContent: 'center',
  },
});