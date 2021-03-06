import React, {Component, useState, useEffect} from 'react';
import {
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  BackHandler,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import {RegisterStyle} from './styles';
import ButtonLogin from '../common/Button/ButtonLogin';
import {styles} from '../../shared/styles';
import HeaderLoginRegister from '../common/HeaderLoginRegister/HeaderLoginRegister';
import Radio from '../common/Radio';
import TextInputRegis from '../common/TextInputRegis/TextInputRegis';
import TextInputPass02 from '../common/TextInputPassword/TextInputPass02';
import * as rootNavigation from '../../navigation/rootNavigator';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import TextInputRegis02 from '../common/TextInputRegis/TextInputRegis02';
import TextInputRegis03 from '../common/TextInputRegis/TextInputRegis03';
import TextInputRegis04 from '../common/TextInputRegis/TextInputRegis04';
import CustomDateTimePicker from '../common/DatePicker/datePicker';
import TextInputRegis06 from '../common/TextInputRegis/TextInputRegis06';
import TextInputRegisOnlyNumber from '../common/TextInputRegis/TextInputRegisOnlyNumber';
import TextInputRegis07 from '../common/TextInputRegis/TextInputRegis07';
import {LOGIN} from '../../navigation/routeNames';
import {Picker} from '@react-native-picker/picker';
import RegisterService from '../../services/register';
import BackgroundTimer from 'react-native-background-timer';
import TestAPI from '../TestAPI/TestAPI';
import ModelCamera from './ModelCamera';
import ListBank from './ListBank';
StatusBar.setHidden(false);
const RegisterStack = createStackNavigator();

const defaultDateOfBirth = new Date();
const Bank = props => {
  const [bankName, setBankName] = useState(props.default);
  return (
    <View
      style={{
        width: '100%',
        height: 40,
        borderWidth: 1,
        justifyContent: 'center',
        marginBottom: 11,
        borderColor: '#e0e0d1',
        borderRadius: 7,
      }}>
      <Picker
        style={{
          fontSize: 17,
          width: '100%',
          fontWeight: 'bold',
        }}
        dropdownIconColor="#FA4A0C"
        itemStyle={{fontWeight: 'bold'}}
        textStyle={{fontSize: 12, fontWeight: 'bold'}}
        selectedValue={bankName}
        onValueChange={itemValue => {
          if (bankName != itemValue) {
            setBankName(itemValue);
            props.setBank(itemValue);
          }
        }}>
        <Picker.Item label="H??y ch???n ng??n h??ng" value="" />
        {ListBank.map((item, key) => (
          <Picker.Item
            label={item.vn_name}
            value={item.vn_name}
            key={item.bankCode}
          />
        ))}
      </Picker>
    </View>
  );
};
export default class Register_01 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gender: true,
      email: '',
      phone: '',
      userName: '',
      pass: '',
      repass: '',
      page: 1,
      firstName: '',
      middleName: '',
      lastName: '',
      dateOfBirth: defaultDateOfBirth,
      providence: [],
      district: [],
      commune: [],
      pickerProvidenceValue: '0',
      pickerDistrictValue: '0',
      pickerCommuneValue: '0',
      town: '',
      numberCardID: '',
      imageBackUrl: null,
      imageFrontUrl: null,
      imageProfileUrl: null,
      bankNumber: '',
      bankOwner: '',
      bankName: '',
      bankBranch: '',
      firstNumber: '',
      secondNumber: '',
      thirdNumber: '',
      fourNumber: '',
      fiveNumber: '',
      sixNumber: '',
      codeEmail: '',
      valid_page1: false,
      valid_page2: false,
      title: 'Ti???p theo',
      check: false,
      isRequest: false,
      secondLeft: 0,
    };
  }
  backAction = () => {
    Alert.alert('X??c nh???n', 'B???n mu???n d???ng vi???c ????ng k??, quay l???i ????ng nh???p?', [
      {
        text: 'Hu???',
        onPress: () => null,
        style: 'cancel',
      },
      {text: 'X??c nh???n', onPress: () => this.props.navigation.goBack()},
    ]);
    return true;
  };
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backAction);
  }
  componentWillUnmount() {
    BackgroundTimer.stopBackgroundTimer();
    BackHandler.removeEventListener('hardwareBackPress', this.backAction);
  }
  formatDate(date) {
    var dateFormat = String(date).split('-');
    return dateFormat[2] + '-' + dateFormat[1] + '-' + dateFormat[0];
  }
  Radio_Gender = () => {
    const [selected, setSelected] = useState(0);
    return (
      <View style={{marginBottom: 11}}>
        <Radio
          selected={selected}
          options={['Nam', 'N???']}
          onChangeSelect={(opt, i) => {
            setSelected(i);
            if (i == 0) {
              this.setState({gender: true});
            } else {
              this.setState({gender: false});
            }
          }}
        />
      </View>
    );
  };
  Register2 = () => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{flex: 1, backgroundColor: 'white'}}>
        <Text style={RegisterStyle.textType}>
          H??? v?? t??n:<Text style={{color: 'red'}}> *</Text>
        </Text>
        <View
          style={{
            flexDirection: 'row',
            height: 40,
            marginBottom: 11,
          }}>
          <TextInputRegis02
            default={this.state.firstName}
            hidetext=" H???"
            setText={text => {
              this.setState({firstName: text});
            }}
          />
          <TextInputRegis03
            default={this.state.middleName}
            hidetext=" T??n ?????m"
            setText={text => {
              this.setState({middleName: text});
            }}
          />
          <TextInputRegis04
            default={this.state.lastName}
            hidetext=" T??n"
            setText={text => {
              this.setState({lastName: text});
            }}
          />
        </View>
        <Text style={RegisterStyle.textType}>
          Ng??y sinh:<Text style={{color: 'red'}}> *</Text>
        </Text>
        <View style={[RegisterStyle.imageCalendarView]}>
          <View style={{width: 35, height: 35}}>
            <Image
              style={RegisterStyle.imageCalendar}
              source={require('../../assets/images/calendar.png')}
            />
          </View>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <CustomDateTimePicker
              textStyle={{
                borderColor: '#D9D9D9',
                height: 40,
              }}
              defaultDate={
                this.state.dateOfBirth == defaultDateOfBirth
                  ? defaultDateOfBirth
                  : this.state.dateOfBirth
              }
              onDateChange={value => {
                this.setState({dateOfBirth: value});
              }}
            />
          </View>
        </View>
        <Text style={RegisterStyle.textType}>
          Gi???i t??nh:<Text style={{color: 'red'}}> *</Text>
        </Text>
        {this.Radio_Gender()}
        <Text style={RegisterStyle.textType}>
          ?????a ch???:<Text style={{color: 'red'}}> *</Text>
        </Text>
        <TestAPI
          pickerProvidenceValue={
            this.state.pickerProvidenceValue == '0'
              ? null
              : this.state.pickerProvidenceValue
          }
          pickerDistrictValue={
            this.state.pickerDistrictValue == '0'
              ? null
              : this.state.pickerDistrictValue
          }
          pickerCommuneValue={
            this.state.pickerCommuneValue == '0'
              ? null
              : this.state.pickerCommuneValue
          }
          changeProvince={value => {
            this.setState({pickerProvidenceValue: value});
          }}
          changeDistrict={value => {
            this.setState({pickerDistrictValue: value});
          }}
          changeCommune={value => {
            this.setState({pickerCommuneValue: value});
          }}
        />
        <TextInputRegis06
          default={this.state.town}
          hidetext="?????a ch??? chi ti???t"
          setText={text => {
            this.setState({town: text});
          }}
        />
        <Text style={[RegisterStyle.textType]}>
          S??? CMT/ Th??? c??n c?????c:
          <Text style={{color: 'red'}}> *</Text>
        </Text>
        <TextInputRegisOnlyNumber
          default={this.state.numberCardID}
          hidetext="Nh???p s??? CMT, s??? th??? c??n c?????c, s??? h??? chi???u"
          setText={text => {
            this.setState({numberCardID: text});
          }}
        />
        <Text style={RegisterStyle.textType}>
          ???nh CMT/CCCD m???t tr?????c:<Text style={{color: 'red'}}> *</Text>
        </Text>
        <ModelCamera
          img={this.state.imageFrontUrl}
          passImage={value => {
            this.setState({imageFrontUrl: value});
          }}
        />
        <Text style={RegisterStyle.textType}>
          ???nh CMT/CCCD m???t sau:<Text style={{color: 'red'}}> *</Text>
        </Text>
        <ModelCamera
          img={this.state.imageBackUrl}
          passImage={value => {
            this.setState({imageBackUrl: value});
          }}
        />
        <Text style={RegisterStyle.textType}>
          ???nh nh???n d???ng khu??n m???t{' '}
          <Text style={{fontWeight: 'normal'}}>(???nh r?? n??t, d??? nh???n di???n)</Text>
          :<Text style={{color: 'red'}}> *</Text>
        </Text>
        <ModelCamera
          img={this.state.imageProfileUrl}
          passImage={value => {
            this.setState({imageProfileUrl: value});
          }}
        />
        <Text style={RegisterStyle.textType}>
          S??? t??i kho???n ng??n h??ng:<Text style={{color: 'red'}}> *</Text>
        </Text>
        <TextInputRegisOnlyNumber
          default={this.state.bankNumber}
          hidetext="Vui l??ng nh???p s??? t??i kho???n ng??n h??ng"
          setText={text => {
            this.setState({bankNumber: text});
          }}
        />
        <Text style={RegisterStyle.textType}>
          T??n ch??? t??i kho???n:<Text style={{color: 'red'}}> *</Text>
        </Text>
        <TextInputRegis07
          default={this.state.bankOwner}
          hidetext="Vui l??ng nh???p t??n ch??? t??i kho???n"
          setText={text => {
            this.setState({bankOwner: text});
          }}
        />
        <Text style={RegisterStyle.textType}>
          T??n ng??n h??ng:<Text style={{color: 'red'}}> *</Text>
        </Text>
        <Bank
          default={this.state.bankName}
          setBank={itemValue => {
            this.setState({bankName: itemValue});
          }}
        />
        <Text style={RegisterStyle.textType}>
          Chi nh??nh ng??n h??ng:<Text style={{color: 'red'}}> *</Text>
        </Text>
        <TextInputRegis07
          default={this.state.bankBranch}
          hidetext="Vui l??ng nh???p t??n chi nh??nh ng??n h??ng"
          setText={text => {
            this.setState({bankBranch: text});
          }}
        />
      </ScrollView>
    );
  };
  Register1 = () => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{flex: 1, backgroundColor: 'white'}}>
        <Text style={RegisterStyle.textType}>
          Email:<Text style={{color: 'red'}}> *</Text>
        </Text>
        <TextInputRegis
          default={this.state.email}
          hidetext="username@gmail.com"
          setText={text => {
            this.setState({email: text}, () => {
              this.setState({email: this.state.email.toLocaleLowerCase()});
            });
          }}
        />
        <Text style={RegisterStyle.textType}>
          S??? ??i???n tho???i:<Text style={{color: 'red'}}> *</Text>
        </Text>
        <TextInputRegisOnlyNumber
          default={this.state.phone}
          hidetext="0323456789"
          setText={text => {
            this.setState({phone: text});
          }}
        />
        <Text style={RegisterStyle.textType}>
          T??n ????ng nh???p:<Text style={{color: 'red'}}> *</Text>
        </Text>
        <TextInputRegis
          default={this.state.userName}
          hidetext="username"
          setText={text => {
            this.setState({userName: text}, () => {
              this.setState({
                userName: this.state.userName.toLocaleLowerCase(),
              });
            });
          }}
        />
        <Text style={RegisterStyle.textType}>
          M???t kh???u:<Text style={{color: 'red'}}> *</Text>
        </Text>
        <TextInputPass02
          default={this.state.pass}
          hidetext="********************"
          setText={text => {
            this.setState({pass: text});
          }}
        />
        <Text style={[RegisterStyle.textType]}>
          Nh???p l???i m???t kh???u:<Text style={{color: 'red'}}> *</Text>
        </Text>
        <TextInputPass02
          default={this.state.repass}
          hidetext="********************"
          setText={text => {
            this.setState({repass: text});
          }}
        />
      </ScrollView>
    );
  };
  Register4 = () => {
    const [timer, setTimer] = useState(60);
    const [timerOn, setTimerOn] = useState(true);
    const countDown = () => {
      BackgroundTimer.runBackgroundTimer(() => {
        setTimer(secs => {
          if (secs > 0) {
            setTimerOn(true);
            return secs - 1;
          } else {
            return 0;
          }
        });
      }, 1000);
    };
    useEffect(() => {
      if (timerOn) {
        countDown();
      } else {
        BackgroundTimer.stopBackgroundTimer();
      }
      return () => {
        BackgroundTimer.stopBackgroundTimer();
      };
    }, [timerOn]);
    useEffect(() => {
      if (timer === 0) {
        setTimerOn(false);
        BackgroundTimer.stopBackgroundTimer();
      }
    }, [timer]);
    return (
      <View style={RegisterStyle.register4_container}>
        <Text style={RegisterStyle.register4_textGeneral}>
          Hi???n t???i ch??ng t??i ???? g???i m?? x??c minh ?????n email c???a b???n. Vui l??ng ki???m
          tra email v?? x??c nh???n m??.
        </Text>
        <View style={RegisterStyle.register4_CaptchaContainer}>
          <TextInput
            defaultValue={this.state.firstNumber}
            style={RegisterStyle.register4_Captcha}
            ref={input => {
              this.firstTextInput = input;
            }}
            maxLength={1}
            onChangeText={text => {
              this.setState({firstNumber: text});
              if (text != '') {
                this.secondTextInput.focus();
              }
            }}></TextInput>
          <TextInput
            defaultValue={this.state.secondNumber}
            style={RegisterStyle.register4_Captcha}
            ref={input => {
              this.secondTextInput = input;
            }}
            maxLength={1}
            onChangeText={text => {
              this.setState({secondNumber: text});
              if (text != '') {
                this.thirdTextInput.focus();
              }
            }}></TextInput>
          <TextInput
            defaultValue={this.state.thirdNumber}
            style={RegisterStyle.register4_Captcha}
            ref={input => {
              this.thirdTextInput = input;
            }}
            maxLength={1}
            onChangeText={text => {
              this.setState({thirdNumber: text});
              if (text != '') {
                this.fourTextInput.focus();
              }
            }}></TextInput>
          <TextInput
            defaultValue={this.state.fourNumber}
            style={RegisterStyle.register4_Captcha}
            ref={input => {
              this.fourTextInput = input;
            }}
            maxLength={1}
            onChangeText={text => {
              this.setState({fourNumber: text});
              if (text != '') {
                this.fiveTextInput.focus();
              }
            }}></TextInput>
          <TextInput
            defaultValue={this.state.fiveNumber}
            style={RegisterStyle.register4_Captcha}
            ref={input => {
              this.fiveTextInput = input;
            }}
            maxLength={1}
            onChangeText={text => {
              this.setState({fiveNumber: text});
              if (text != '') {
                this.sixTextInput.focus();
              }
            }}></TextInput>
          <TextInput
            defaultValue={this.state.sixNumber}
            style={RegisterStyle.register4_Captcha}
            ref={input => {
              this.sixTextInput = input;
            }}
            maxLength={1}
            onChangeText={text => {
              this.setState({sixNumber: text});
            }}></TextInput>
        </View>
        <View style={{marginTop: 15, justifyContent: 'center'}}>
          <Text style={{textAlign: 'center'}}>M?? x??c minh ch??a ???????c g???i. </Text>
          <Text style={{textAlign: 'center'}}>{timer}</Text>
          <TouchableOpacity
            onPress={() => {
              if (timer == 0) {
                setTimer(60);
                let reg = new RegisterService();
                reg
                  .Register({
                    createBankingRequest: {
                      bankName: this.state.bankName,
                      branch: this.state.bankBranch,
                      number: this.state.bankNumber,
                      ownerName: this.state.bankOwner,
                    },
                    registerRequest: {
                      cardId: this.state.numberCardID,
                      commune: this.state.pickerCommuneValue,
                      dateOfBirth: this.state.dateOfBirth,
                      district: this.state.pickerDistrictValue,
                      email: this.state.email,
                      firstName: this.state.firstName,
                      imageCardIdBack: this.state.imageBackUrl,
                      imageCardIdFront: this.state.imageFrontUrl,
                      imageProfile: this.state.imageProfileUrl,
                      lastName: this.state.lastName,
                      middleName: this.state.middleName,
                      password: this.state.pass,
                      phone: this.state.phone,
                      province: this.state.pickerProvidenceValue,
                      sex: this.state.gender,
                      street: this.state.town,
                      username: this.state.userName,
                    },
                  })
                  .then(res3 => {
                    if (res3.data.success) {
                      Alert.alert('???? g???i l???i m??.');
                    } else {
                      Alert.alert('L???i ????ng k??.');
                    }
                  })
                  .catch(error => {
                    ToastAndroid.show('L???i h??? th???ng', 1);
                  })
                  .finally(() => {
                    setTimerOn(true);
                  });
              } else {
                Alert.alert('H???t 60s h??y g???i l???i');
              }
            }}>
            <Text
              style={{
                color: '#FB3F39',
                fontWeight: 'bold',
                textAlign: 'center',
              }}>
              G???i l???i ?
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  componentWillUnmount() {
    BackgroundTimer.stopBackgroundTimer();
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={RegisterStyle.header}>
          <HeaderLoginRegister name="????ng k??" />
        </View>
        {this.state.isRequest ? (
          <ActivityIndicator size="large" color="black" />
        ) : (
          <View style={RegisterStyle.bottom}>
            <View style={[styles.containerBottomLoginRegister, {flex: 1}]}>
              <Text style={{alignSelf: 'center'}}>
                B???n ???? c?? t??i kho???n?{'   '}
                <Text
                  style={{color: 'red'}}
                  onPress={() => rootNavigation.navigate(LOGIN)}>
                  ????ng nh???p
                </Text>
              </Text>
              <View style={RegisterStyle.circleView}>
                <TouchableOpacity
                  style={
                    this.state.page == 1
                      ? RegisterStyle.circleBTN
                      : RegisterStyle.circleBTN02
                  }
                  onPress={() => {
                    if (this.state.page != 1) {
                      rootNavigation.navigate('Register1');
                      this.setState({title: 'Ti???p theo'});
                      this.setState({page: 1});
                    }
                  }}>
                  <Text style={{color: 'white'}}>1</Text>
                </TouchableOpacity>
                <Text>????????????????????????</Text>
                <TouchableOpacity
                  style={
                    this.state.page == 2
                      ? RegisterStyle.circleBTN
                      : RegisterStyle.circleBTN02
                  }
                  onPress={() => {
                    if (this.state.valid_page1) {
                      rootNavigation.navigate('Register2');
                      this.setState({title: '????ng k??'});
                      this.setState({page: 2});
                    } else {
                      Alert.alert('B???n ph???i ho??n th??nh b?????c 1 tr?????c.');
                    }
                  }}>
                  <Text style={{color: 'white'}}>2</Text>
                </TouchableOpacity>
                <Text>????????????????????????</Text>
                <TouchableOpacity
                  style={
                    this.state.page == 3
                      ? RegisterStyle.circleBTN
                      : RegisterStyle.circleBTN02
                  }
                  onPress={() => {
                    if (this.state.valid_page2) {
                      rootNavigation.navigate('Register4');
                      this.setState({title: 'X??c nh???n m??'});
                      this.setState({page: 3});
                    } else Alert.alert('B???n ph???i ho??n th??nh b?????c 2 tr?????c.');
                  }}>
                  <Text style={{color: 'white'}}>3</Text>
                </TouchableOpacity>
              </View>
              <View style={{flex: 1, width: '100%'}}>
                <RegisterStack.Navigator
                  screenOptions={{
                    headerShown: false,
                    cardStyleInterpolator:
                      CardStyleInterpolators.forHorizontalIOS,
                  }}>
                  <RegisterStack.Screen
                    name="Register1"
                    component={this.Register1}
                  />
                  <RegisterStack.Screen
                    name="Register2"
                    component={this.Register2}
                  />
                  <RegisterStack.Screen
                    name="Register4"
                    component={this.Register4}
                  />
                </RegisterStack.Navigator>
              </View>
              <ButtonLogin
                name={this.state.title}
                login={() => {
                  if (this.state.page == 1) {
                    let check = true;
                    if (
                      !this.state.email
                        .trim()
                        .match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
                    ) {
                      check = false;
                      this.setState({valid_page1: false});
                      return Alert.alert('Email kh??ng h???p l???');
                    }
                    if (
                      !this.state.phone
                        .trim()
                        .match('(84|0[1|3|5|7|8|9])+([0-9]{8})$')
                    ) {
                      check = false;
                      this.setState({valid_page1: false});
                      return Alert.alert('S??? ??i???n tho???i kh??ng h???p l???.');
                    }
                    if (
                      !this.state.userName
                        .trim()
                        .match(
                          '^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+[a-zA-Z0-9]$',
                        )
                    ) {
                      check = false;
                      this.setState({valid_page1: false});
                      return Alert.alert(
                        'T??n ????ng nh???p kh??ng h???p l???.',
                        `- ????? d??i t??? 8 ?????n 20 k?? t???\n- C?? th??? ch???a ch??? c??i, ch??? s???, d???u ch???m v?? d???u g???ch d?????i.`,
                      );
                    }
                    let reg = new RegisterService();
                    reg
                      .validateRegister({
                        email: this.state.email,
                        username: this.state.userName,
                      })
                      .then(res => {
                        if (!res.data.success) {
                          check = false;
                          this.setState({valid_page1: false});
                          if (
                            res.data.errors[0].errorCode == 'ERR.REGISTER04'
                          ) {
                            return Alert.alert('Email ???? c?? ng?????i s??? d???ng.');
                          }
                          if (
                            res.data.errors[0].errorCode == 'ERR.REGISTER02'
                          ) {
                            return Alert.alert(
                              'T??n ????ng nh???p ???? c?? ng?????i s??? d???ng.',
                            );
                          }
                        }
                      })
                      .finally(() => {
                        if (check) {
                          if (
                            !this.state.pass
                              .trim()
                              .match(
                                '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})',
                              )
                          ) {
                            check = false;
                            this.setState({valid_page1: false});
                            return Alert.alert(
                              'Password kh??ng h???p l???',
                              `- C?? th??? ch???a k?? t??? b???t k?? ngo???i tr??? d???u c??ch\n- ????? d??i ??t nh???t 8 k?? t???\n- Ph???i c?? c??? ch??? th?????ng, ch??? hoa, ch??? s??? v?? k?? t??? ?????c bi???t`,
                            );
                          }
                          if (this.state.pass != this.state.repass) {
                            check = false;
                            this.setState({valid_page1: false});
                            return Alert.alert(
                              'M???t kh???u nh???p l???i kh??ng tr??ng kh???p.',
                            );
                          }
                          if (check) {
                            this.setState({valid_page1: true});
                            this.setState({title: '????ng k??', page: 2});
                            rootNavigation.navigate('Register2');
                          }
                        }
                      });
                  } else if (this.state.page == 2) {
                    let check = true;
                    if (
                      !this.state.firstName
                        .trim()
                        .match(
                          '^[a-z A-Z??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????sW]+$',
                        ) ||
                      this.state.firstName.trim().toString() == ''
                    ) {
                      check = false;
                      this.setState({valid_page2: false});
                      return Alert.alert('H??? kh??ng h???p l???');
                    }
                    if (
                      !this.state.middleName
                        .trim()
                        .match(
                          '^[a-z A-Z??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????sW]+$',
                        ) &&
                      !this.state.middleName.trim().toString() == ''
                    ) {
                      check = false;
                      this.setState({valid_page2: false});
                      return Alert.alert('T??n ?????m kh??ng h???p l???');
                    }
                    if (
                      !this.state.lastName
                        .trim()
                        .match(
                          '^[a-z A-Z??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????sW]+$',
                        ) ||
                      this.state.lastName.trim().toString() == ''
                    ) {
                      check = false;
                      this.setState({valid_page2: false});
                      return Alert.alert('T??n kh??ng h???p l???');
                    }
                    if (
                      this.state.pickerProvidenceValue == '0' ||
                      this.state.pickerDistrictValue == '0' ||
                      this.state.pickerCommuneValue == '0'
                    ) {
                      check = false;
                      this.setState({valid_page2: false});
                      return Alert.alert('?????a ch??? kh??ng h???p l???');
                    }
                    if (this.state.town.trim() == '') {
                      check = false;
                      this.setState({valid_page2: false});
                      return Alert.alert('?????a ch??? chi ti???t kh??ng h???p l???');
                    }
                    if (
                      !this.state.numberCardID
                        .trim()
                        .match('^([0-9]{9})$|^([0-9]{12})$') ||
                      this.state.numberCardID == ''
                    ) {
                      check = false;
                      this.setState({valid_page2: false});
                      return Alert.alert('C??n c?????c/CMND kh??ng h???p l???');
                    }
                    if (this.state.imageFrontUrl == null) {
                      check = false;
                      this.setState({valid_page2: false});
                      return Alert.alert('???nh tr?????c c??n c?????c/CMND ch??a h???p l???');
                    }
                    if (this.state.imageBackUrl == null) {
                      check = false;
                      this.setState({valid_page2: false});
                      return Alert.alert('???nh sau c??n c?????c/CMND ch??a h???p l???');
                    }
                    if (this.state.imageProfileUrl == null) {
                      check = false;
                      this.setState({valid_page2: false});
                      return Alert.alert('???nh nh???n d???ng ch??a h???p l???');
                    }

                    if (!this.state.bankNumber.trim().match('^[0-9]+$')) {
                      check = false;
                      this.setState({valid_page2: false});
                      return Alert.alert('S??? t??i kho???n ng??n h??ng ch??a h???p l???');
                    }
                    if (
                      !this.state.bankOwner
                        .trim()
                        .match(
                          '^[a-z A-Z??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????sW]+$',
                        ) ||
                      this.state.bankOwner.trim() == ''
                    ) {
                      check = false;
                      this.setState({valid_page2: false});
                      return Alert.alert(
                        'T??n ch??? t??i kho???n ng??n h??ng ch??a h???p l???',
                      );
                    }
                    if (this.state.bankName.trim() == '') {
                      check = false;
                      this.setState({valid_page2: false});
                      return Alert.alert('T??n ng??n h??ng ch??a h???p l???');
                    }
                    if (
                      !this.state.bankBranch
                        .trim()
                        .match(
                          '^[a-z A-Z??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????sW]+$',
                        ) ||
                      this.state.bankBranch.trim() == ''
                    ) {
                      check = false;
                      this.setState({valid_page2: false});
                      return Alert.alert('Chi nh??nh ng??n h??ng ch??a h???p l???');
                    }
                    if (check) {
                      this.setState({isRequest: true});
                      let reg = new RegisterService();
                      reg
                        .Register({
                          createBankingRequest: {
                            bankName: this.state.bankName,
                            branch: this.state.bankBranch,
                            number: this.state.bankNumber,
                            ownerName: this.state.bankOwner,
                          },
                          registerRequest: {
                            cardId: this.state.numberCardID,
                            commune: this.state.pickerCommuneValue,
                            dateOfBirth: this.state.dateOfBirth,
                            district: this.state.pickerDistrictValue,
                            email: this.state.email,
                            firstName: this.state.firstName,
                            imageCardIdBack: this.state.imageBackUrl,
                            imageCardIdFront: this.state.imageFrontUrl,
                            imageProfile: this.state.imageProfileUrl,
                            lastName: this.state.lastName,
                            middleName: this.state.middleName,
                            password: this.state.pass,
                            phone: this.state.phone,
                            province: this.state.pickerProvidenceValue,
                            sex: this.state.gender,
                            street: this.state.town,
                            username: this.state.userName,
                          },
                        })
                        .then(res3 => {
                          if (res3.data.success) {
                            this.setState({
                              valid_page2: true,
                              isRequest: false,
                              secondLeft: 60,
                            });
                            this.setState({
                              title: 'X??c nh???n m??',
                              page: 3,
                            });
                            rootNavigation.navigate('Register4');
                          } else {
                            this.setState({isRequest: false});
                            return Alert.alert('L???i ????ng k??.');
                          }
                        })
                        .catch(error => {
                          this.setState({isRequest: false});
                          ToastAndroid.show('L???i h??? th???ng', 1);
                        });
                    }
                  } else {
                    let reg = new RegisterService();
                    let captcha =
                      '' +
                      this.state.firstNumber +
                      this.state.secondNumber +
                      this.state.thirdNumber +
                      this.state.fourNumber +
                      this.state.fiveNumber +
                      this.state.sixNumber;
                    reg
                      .validateCaptcha({
                        captcha: captcha,
                        email: this.state.email,
                      })
                      .then(async res => {
                        if (res.data.success) {
                          ToastAndroid.show(
                            '????ng k?? th??nh c??ng.',
                            ToastAndroid.LONG,
                          );
                          this.props.navigation.goBack();
                        } else {
                          this.setState({
                            firstNumber: '',
                            secondNumber: '',
                            thirdNumber: '',
                            fourNumber: '',
                            fiveNumber: '',
                            sixNumber: '',
                          });
                          Alert.alert('M?? x??c nh???n kh??ng ch??nh x??c.');
                        }
                      })
                      .catch(error => {
                        ToastAndroid.show('L???i h??? th???ng', 1);
                      });
                  }
                }}
              />
            </View>
          </View>
        )}
      </View>
    );
  }
}
