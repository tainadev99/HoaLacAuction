import React, {Component, useState, useEffect} from 'react';
import {
  View,
  FlatList,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  Alert,
  ToastAndroid,
  Linking,
} from 'react-native';
import {DetailProductStyles} from './styles';
import AsyncStorage from '@react-native-community/async-storage';
import Header from '../common/Header';
import * as RootNavigation from '../../navigation/rootNavigator';
import {Details} from './Details/Details';
import BackgroundTimer from 'react-native-background-timer';
import detailAuctionPropertyForUser from '../../services/detailAuctionProperty';
import detailAuctionPropertyWithoutLogin from '../../services/detailAuctionPropertyWithoutLogin';
import registerAuctionProperty from '../../services/registerAutionProperty';
import paidRegisterAutionPropertyFee from '../../services/paidRegisterAutionPropertyFee';
import Bidding from '../../services/bidding';
import {ListPropertyStyle} from '../Home/HomeDetail/ListProperty/ListPropertyStyle';
import searchPropertyForUser from '../../services/searchPropertyForUser';
import moment from 'moment';
import {USER_PROFILE, LOGIN, AUTH_NAVIGATOR} from '../../navigation/routeNames';
import Stomp from 'react-stomp';
import {environment} from '../../environtments/environment';
import {listAPi} from '../../shared/listAPi';
const {width} = Dimensions.get('window');
const height = width * 0.6;

export default class DetailProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: 0,
      showHistoryBid: false,
      countTime: true,
      id: this.props.route.params.id,
      data: null,
      isLoading: true,
      showCFRegisterBid: false,
      showCodeRegisterBid: false,
      acceptRegisterBid: false,
      waitRegisterBid: false,
      showPayAution: false,
      currentPrice: null,
      biddingPrice: null,
      currentIdentifyCode: null,
      countAution: 0,
      listBidding: [],
      dataList1: [],
      isLoadingList1: true,
      isAuthen: false,
      secondsLeft: '',
      timerOn: true,
      transactionCode: null,
      identifyCode: 'Ch??a ????ng k?? ?????u gi??',
    };
  }
  renderItemhistoryBid = ({item, index}) => {
    function formatDate(date) {
      return moment(date).format('DD/MM/yyyy HH:mm:ss.SSS');
    }
    return (
      <View
        style={
          this.state.data.userIdentifyCode == item.identifyCode
            ? DetailProductStyles.viewFirstStyles
            : DetailProductStyles.viewSecondModal
        }>
        <View style={DetailProductStyles.viewSmallFirstStyles}>
          <View style={DetailProductStyles.viewFirstText1}>
            <Text style={DetailProductStyles.txtIDModal}>
              {item.identifyCode}
            </Text>
            <Text style={DetailProductStyles.viewFirstText2}>
              {formatDate(item.createTime)}
            </Text>
          </View>
        </View>
        {index == 0 && (
          <View style={DetailProductStyles.imageWin}>
            <Image source={require('../../assets/images/top1DauGia.png')} />
          </View>
        )}
        <View style={DetailProductStyles.viewFirstStyle2}>
          <Text
            style={
              index == 0
                ? DetailProductStyles.viewFirstStyle2Text1
                : DetailProductStyles.viewFirstStyle2Text2
            }>
            {this.formatMoney(item.value)}
          </Text>
        </View>
      </View>
    );
  };
  formatMoney(money) {
    var x;
    x = money.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.');
    return x + ' ??';
  }
  Authenticate = async () => {
    return await AsyncStorage.getItem('jwttoken').then(item => {
      if (item != null) {
        this.setState({isAuthen: true});
        return true;
      } else {
        this.setState({isAuthen: false});
        return false;
      }
    });
  };
  Property = () => {
    let reg = new searchPropertyForUser();
    reg
      .searchPropertyForUser(null, '', null, null, 1, 5, 0)
      .then(res => {
        if (res.data.success) {
          this.setState({dataList1: res.data.data.Data, isLoadingList1: false});
        } else {
          ToastAndroid.show('L???i h??? th???ng', 1);
        }
      })
      .catch(error => {
        ToastAndroid.show('L???i h??? th???ng', 1);
      });
  };
  List1 = () => {
    const renderItem = ({item, index}) => {
      function formatDate(date) {
        return moment(date).format('DD/MM/yyyy HH:mm:ss');
      }
      return (
        <TouchableOpacity
          style={
            index == 0
              ? ListPropertyStyle.list1View
              : ListPropertyStyle.list12View
          }
          onPress={() => {
            this.setState({isLoading: true}, () => {
              this.loadDataTaiLam(item.id);
            });
          }}>
          <View
            style={{
              width: '100%',
              height: 120,
              borderRadius: 15,
              elevation: 5,
              shadowColor: 'black',
            }}>
            <Image
              style={{width: '100%', height: '100%', borderRadius: 15}}
              source={{uri: item.image}}
              resizeMode="cover"
            />
          </View>
          <View style={{flex: 1, width: '90%', alignSelf: 'center'}}>
            <Text numberOfLines={1} style={ListPropertyStyle.list1Txt}>
              {item.name}
            </Text>
            <View style={ListPropertyStyle.list1View2}>
              <Text style={ListPropertyStyle.list1Txt2}>
                <Image source={require('../../assets/images/imageClock.png')} />
                {'  '}
                {formatDate(item.openTime)}
              </Text>
            </View>
            <Text style={ListPropertyStyle.list1Txt3}>
              <Image source={require('../../assets/images/iconMoney.png')} />
              {'  '}
              {this.formatMoney(item.startPrice)}
            </Text>
          </View>
        </TouchableOpacity>
      );
    };
    return (
      <View style={{marginBottom: 10}}>
        <FlatList
          data={this.state.dataList1}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          horizontal
        />
      </View>
    );
  };
  biddingCreate() {
    let reg = new Bidding();
    reg
      .createBidding(this.state.id, this.state.biddingPrice)
      .then(res => {
        if (res.data.success) {
          ToastAndroid.show('?????u gi?? th??nh c??ng', 1000);
        } else {
          ToastAndroid.show('?????u gi?? th???t b???i', 1000);
        }
        this.setState(
          {
            isLoading: true,
          },
          () => {},
        );
      })
      .catch(error => {
        ToastAndroid.show('L???i h??? th???ng', 1000);
      })
      .finally(() => {
        this.setState({showPayAution: false, isLoading: false, countAution: 0});
      });
  }
  biddingList() {
    let reg = new Bidding();
    reg
      .listBidding(this.state.id, 1, 10000, 0)
      .then(res => {
        if (res.data.success) {
          this.setState({listBidding: res.data.data.Data}, () => {
            this.setState({showHistoryBid: true});
          });
        } else {
          ToastAndroid.show('Kh??ng c?? ai ?????u gi??', 1);
        }
      })
      .catch(error => {
        ToastAndroid.show('L???i h??? th???ng', 1000);
      })
      .finally(() => {
        this.setState({isLoading: false});
      });
  }
  async registerAuctionProperty() {
    let reg = new registerAuctionProperty();
    check = false;
    check = await reg
      .registerAuctionProperty({
        auctionPropertyId: this.state.id,
        depositFee: this.state.data.depositFee,
        value: this.state.data.depositFee + this.state.data.registerFee,
      })
      .then(res => {
        if (res.data.success) {
          this.setState({transactionCode: res.data.data.Data.transactionCode});
          return true;
        } else {
          ToastAndroid.show('L???i h??? th???ng', 1000);
          return false;
        }
      })
      .catch(error => {
        ToastAndroid.show('L???i h??? th???ng', 1000);
      });
    return check;
  }
  paidRegisterAutionPropertyFee() {
    let reg = new paidRegisterAutionPropertyFee();
    reg
      .paidRegisterAutionPropertyFee(this.state.id)
      .then(res => {
        if (res.data.success) {
          this.loadDataPaidFee(this.state.id);
        } else {
          ToastAndroid.show('L???i h??? th???ng', 1000);
        }
      })
      .catch(error => {
        ToastAndroid.show('L???i h??? th???ng', 1000);
      })
      .finally(() => this.setState({isLoading: false}));
  }
  loadDataPaidFee(id) {
    let reg = new detailAuctionPropertyForUser();
    reg
      .detailAuctionPropertyForUser(id)
      .then(res => {
        if (res.data.success) {
          this.setState(
            {
              data: res.data.data.Data,
            },
            () => {
              this.setState({
                waitRegisterBid: true,
              });
            },
          );
        } else {
          ToastAndroid.show('L???i h??? th???ng', 1000);
        }
      })
      .catch(error => {
        ToastAndroid.show('L???i h??? th???ng', 1000);
      })
      .finally(() => this.setState({isLoading: false}));
  }
  loadData(id) {
    let reg = new detailAuctionPropertyForUser();
    reg
      .detailAuctionPropertyForUser(id)
      .then(res => {
        if (res.data.success) {
          this.setState(
            {
              data: res.data.data.Data,
              id: res.data.data.Data.id,
            },
            () => {
              this.setState(
                {
                  currentPrice:
                    res.data.data.Data.currentPrice != null
                      ? res.data.data.Data.currentPrice
                      : res.data.data.Data.startPrice,
                  biddingPrice:
                    res.data.data.Data.currentPrice != null
                      ? res.data.data.Data.currentPrice
                      : res.data.data.Data.startPrice,
                  currentIdentifyCode: res.data.data.Data.currentIdentifyCode,
                  secondsLeft:
                    res.data.data.Data.countDownTime > 0
                      ? res.data.data.Data.countDownTime / 1000
                      : 0,
                  transactionCode: res.data.data.Data.transactionCode,
                  timerOn: res.data.data.Data.countDownTime > 0 ? true : false,
                  isLoading: false,
                },
                () => {
                  if (
                    res.data.data.Data.status == 4 &&
                    res.data.data.Data.registerAuctionPropertyResponseStatus ==
                      2
                  ) {
                    if (
                      res.data.data.Data.identifyCode ==
                      res.data.data.Data.currentIdentifyCode
                    ) {
                      Alert.alert(
                        'K???t qu??? ?????u gi??',
                        'Cu???c ?????u gi?? n??y ???? k???t th??c, ch??c m???ng b???n ???? l?? ng?????i chi???n th???ng. Ch??ng t??i s??? li??n h??? v???i b???n s???m nh???t ????? ho??n t???t th??? t???c. C???m ??n v?? b???n ???? tham gia h??? th???ng c???a ch??ng t??i!',
                      );
                    }
                  }
                },
              );
            },
          );
          // Comment
        } else if (
          res.data.errors[0].errorCode == 'CMM.COMMON04' ||
          res.data.errors[0].errorCode == 'AUP.AUCPRO01'
        ) {
          Alert.alert(
            'Cu???c ?????u gi?? ???? b??? hu???',
            'Cu???c ?????u gi?? n??y ???? b??? hu??? v?? m???t v??i s??? c???. Mong qu?? kh??ch th??ng c???m, v???n tin t?????ng v?? s??? d???ng h??? th???ng c???a ch??ng t??i. Xin c???m ??n!',
            [
              {
                text: 'Quay l???i',
                onPress: () => this.props.navigation.goBack(),
                style: 'cancel',
              },
            ],
          );
        } else {
          ToastAndroid.show('L???i h??? th???ng', 1000);
        }
      })
      .catch(error => {
        ToastAndroid.show('L???i h??? th???ng', 1000);
      });
  }
  loadDataWithoutAuthen(id) {
    let reg = new detailAuctionPropertyWithoutLogin();
    reg
      .detailAuctionPropertyWithoutLogin(id)
      .then(res => {
        if (res.data.success) {
          this.setState(
            {
              data: res.data.data.Data,
              id: res.data.data.Data.id,
            },
            () => {
              this.setState(
                {
                  currentPrice:
                    res.data.data.Data.currentPrice != null
                      ? res.data.data.Data.currentPrice
                      : res.data.data.Data.startPrice,
                  biddingPrice:
                    res.data.data.Data.currentPrice != null
                      ? res.data.data.Data.currentPrice
                      : res.data.data.Data.startPrice,
                  currentIdentifyCode: res.data.data.Data.currentIdentifyCode,
                  secondsLeft:
                    res.data.data.Data.countDownTime > 0
                      ? res.data.data.Data.countDownTime / 1000
                      : 0,
                  transactionCode: res.data.data.Data.transactionCode,
                  timerOn: res.data.data.Data.countDownTime > 0 ? true : false,
                  isLoading: false,
                },
                () => {
                  if (
                    res.data.data.Data.status == 4 &&
                    res.data.data.Data.registerAuctionPropertyResponseStatus ==
                      2
                  ) {
                    if (
                      res.data.data.Data.identifyCode !=
                      res.data.data.Data.currentIdentifyCode
                    ) {
                      Alert.alert(
                        'K???t qu??? ?????u gi??',
                        'Cu???c ?????u gi?? n??y ???? k???t th??c, r???t ti???c b???n kh??ng ph???i l?? ng?????i chi???n th???ng. C???m ??n b???n v?? ???? tham gia v??o h??? th???ng c???a ch??ng!',
                      );
                    }
                  }
                },
              );
            },
          );
        } else if (res.data.errors[0].errorCode == 'CMM.COMMON04') {
          Alert.alert(
            'Cu???c ?????u gi?? ???? b??? hu???',
            'Cu???c ?????u gi?? n??y ???? b??? hu??? v?? m???t v??i s??? c???. Mong qu?? kh??ch th??ng c???m, v???n tin t?????ng v?? s??? d???ng h??? th???ng c???a ch??ng t??i. Xin c???m ??n!',
            [
              {
                text: 'Quay l???i',
                onPress: () => this.props.navigation.goBack(),
                style: 'cancel',
              },
            ],
          );
        } else {
          ToastAndroid.show('L???i h??? th???ng', 1000);
        }
      })
      .catch(error => {
        ToastAndroid.show('L???i h??? th???ng', 1000);
      });
  }
  loadDataPaidFee(id) {
    let reg = new detailAuctionPropertyForUser();
    reg
      .detailAuctionPropertyForUser(id)
      .then(res => {
        if (res.data.success) {
          this.setState(
            {
              data: res.data.data.Data,
            },
            () => {
              this.setState({
                waitRegisterBid: true,
              });
            },
          );
        } else {
          ToastAndroid.show('L???i h??? th???ng', 1000);
        }
      })
      .catch(error => {
        ToastAndroid.show('L???i h??? th???ng', 1000);
      })
      .finally(() => this.setState({isLoading: false}));
  }
  loadDataFromBtn(id) {
    let reg = new detailAuctionPropertyForUser();
    reg
      .detailAuctionPropertyForUser(id)
      .then(res => {
        if (res.data.success) {
          this.setState(
            {
              data: res.data.data.Data,
              currentPrice:
                res.data.data.Data.currentPrice != null
                  ? res.data.data.Data.currentPrice
                  : res.data.data.Data.startPrice,
            },
            () => {
              if (this.state.data.userStatus == 2) {
                if (this.state.data.status == 1) {
                  if (
                    this.state.data.registerAuctionPropertyResponseStatus ==
                    null
                  ) {
                    this.setState({showCFRegisterBid: true});
                  } else if (
                    this.state.data.registerAuctionPropertyResponseStatus == 0
                  ) {
                    this.setState({showCodeRegisterBid: true});
                  } else if (
                    this.state.data.registerAuctionPropertyResponseStatus == 1
                  ) {
                    this.setState({waitRegisterBid: true});
                  } else if (
                    this.state.data.registerAuctionPropertyResponseStatus == 2
                  ) {
                    this.setState({acceptRegisterBid: true});
                  }
                }
              } else if (this.state.data.userStatus == 1) {
                Alert.alert(
                  'Tr???ng th??i t??i kho???n: CH??A THANH TO??N PH?? ????NG K?? T??I KHO???N',
                  'Qu?? kh??ch c???n thanh to??n ph?? ????ng k?? ????? x??c th???c t??i kho???n',
                  [
                    {
                      text: '??i ?????n trang x??c th???c t??i kho???n',
                      onPress: () => {
                        RootNavigation.navigate(USER_PROFILE);
                      },
                    },
                    {
                      text: 'OK',
                      style: 'cancel',
                    },
                  ],
                );
              } else if (this.state.data.userStatus == 3) {
                Alert.alert(
                  'Th??ng b??o',
                  'Tr???ng th??i t??i kho???n: X??C TH???C B??? T??? CH???I \n' +
                    'Qu?? kh??ch c???n x??c th???c l???i t??i kho???n ????? ti???p t???c',
                  [
                    {
                      text: '??i ?????n trang x??c th???c t??i kho???n',
                      onPress: () => {
                        RootNavigation.navigate(USER_PROFILE);
                      },
                    },
                    {
                      text: 'OK',
                      style: 'cancel',
                    },
                  ],
                );
              } else if (this.state.data.userStatus == 4) {
                Alert.alert(
                  'Th??ng b??o',
                  'Tr???ng th??i t??i kho???n: ??ANG CH??? X??C TH???C\n' +
                    'T??i kho???n c???a qu?? kh??ch ??ang ch??? ???????c x??c nh???n ????? ti???p t???c',
                  [
                    {
                      text: 'OK',
                      style: 'cancel',
                    },
                  ],
                );
              }
            },
          );
        } else {
          ToastAndroid.show('L???i h??? th???ng', 1000);
        }
      })
      .catch(error => {
        ToastAndroid.show('L???i h??? th???ng', 1000);
      })
      .finally(() => this.setState({isLoading: false}));
  }
  loadDataTaiLam(id) {
    this.setState(
      {
        code: 0,
        showHistoryBid: false,
        countTime: true,
        id: this.props.route.params.id,
        data: null,
        isLoading: true,
        showCFRegisterBid: false,
        showCodeRegisterBid: false,
        acceptRegisterBid: false,
        waitRegisterBid: false,
        showPayAution: false,
        currentPrice: null,
        biddingPrice: null,
        countAution: 0,
        listBidding: [],
        dataList1: [],
        isLoadingList1: true,
        isAuthen: false,
        secondsLeft: '',
        timerOn: true,
        transactionCode: null,
      },
      async () => {
        check1 = await this.Authenticate();
        if (check1) {
          this.loadData(id);
        } else {
          this.loadDataWithoutAuthen(id);
        }
        this.Property();
      },
    );
  }
  componentDidMount() {
    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.loadDataTaiLam(this.props.route.params.id);
    });
  }
  componentWillUnmount() {
    this.focusListener();
    this.setState = (state, callback) => {
      BackgroundTimer.stopBackgroundTimer();
      return;
    };
  }
  openUrl = async url => {
    const isSupported = await Linking.canOpenURL(url);
    if (isSupported) {
      await Linking.openURL(url);
    } else {
      ToastAndroid.show('L???i h??? th???ng', 1000);
    }
  };
  render() {
    function formatDate(date) {
      return moment(date).format('DD/MM/yyyy HH:mm:ss');
    }
    return (
      <View
        style={[
          DetailProductStyles.mid,
          this.state.showHistoryBid ||
          this.state.showCFRegisterBid ||
          this.state.showCodeRegisterBid ||
          this.state.waitRegisterBid ||
          this.state.acceptRegisterBid ||
          this.state.showPayAution
            ? {opacity: 0.3, backgroundColor: '#999999'}
            : {},
        ]}>
        <Header title="Chi ti???t t??i s???n" />
        {this.state.isLoading ? (
          <ActivityIndicator size="large" color="black" />
        ) : (
          <View style={{flex: 1}}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={DetailProductStyles.textName}>
                {this.state.data.propertyName}
              </Text>
              <View
                style={{
                  width: 200,
                  height: 50,
                  borderRadius: 10,
                  backgroundColor: '#FF6027',
                  justifyContent: 'center',
                  marginLeft: 15,
                  marginTop: 15,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: 'white',
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}>
                  {this.state.data.status == 0 && 'S???p m??? ????ng k??'}
                  {this.state.data.status == 1 && 'Trong th???i gian ????ng k??'}
                  {this.state.data.status == 2 && 'S???p m??? ?????u gi?? '}
                  {this.state.data.status == 3 && 'Trong th???i gian ?????u gi??'}
                  {this.state.data.status == 4 && '???? k???t th??c'}
                  {this.state.data.status == 5 && '???? b??n'}
                  {this.state.data.status == 6 && 'B??n th???t b???i'}
                  {this.state.data.status == 7 && '???? k???t th??c'}
                </Text>
              </View>
              <View style={DetailProductStyles.containerScrollVIew}>
                <ScrollView
                  showsHorizontalScrollIndicator={false}
                  horizontal
                  pagingEnabled
                  style={{width, height}}>
                  {this.state.data.images.map((image, index) => (
                    <View style={{width, height}} key={index}>
                      <Image
                        source={{uri: image}}
                        style={DetailProductStyles.image}
                      />
                    </View>
                  ))}
                </ScrollView>
              </View>
              <View
                style={{width: '100%', height: 70, backgroundColor: '#FF6027'}}>
                <View style={DetailProductStyles.viewContainerPrice}>
                  <View style={DetailProductStyles.viewLeft}>
                    <Text style={DetailProductStyles.textTitleLeft}>
                      Gi?? ?????u :
                    </Text>
                    {this.state.isAuthen &&
                      (this.state.data.registerAuctionPropertyResponseStatus !=
                      2 ? (
                        <Text style={DetailProductStyles.textPrice}>
                          Ch??a ????ng k?? ?????u gi??
                        </Text>
                      ) : this.state.currentIdentifyCode == null ? (
                        <Text style={DetailProductStyles.textPrice}>
                          Ch??a c?? ai
                        </Text>
                      ) : (
                        <Text style={DetailProductStyles.textPrice}>
                          {this.formatMoney(
                            this.state.currentPrice == null
                              ? this.state.data.startPrice
                              : this.state.currentPrice,
                          )}
                        </Text>
                      ))}
                    {!this.state.isAuthen && (
                      <Text
                        style={[DetailProductStyles.textPrice, {fontSize: 14}]}>
                        B???n c???n ????ng nh???p
                      </Text>
                    )}
                  </View>
                  <CountDownTimer
                    timeLeft={this.state.secondsLeft}
                    timeOn={this.state.timerOn}
                    //comment
                    stop={() => {
                      this.setState({timerOn: false, secondsLeft: 0}, () => {
                        if (this.state.data.status < 4) {
                          this.loadDataTaiLam();
                        }
                      });
                    }}
                  />
                </View>
              </View>
              <View style={DetailProductStyles.containerUser}>
                <View style={DetailProductStyles.viewPart}>
                  <Text style={DetailProductStyles.txtUserWin}>
                    Ng?????i th???ng hi???n t???i
                  </Text>
                  {!this.state.isAuthen && (
                    <Text style={DetailProductStyles.txtNameUser}>
                      B???n c???n ????ng nh???p
                    </Text>
                  )}
                  {this.state.isAuthen &&
                    (this.state.data.registerAuctionPropertyResponseStatus !=
                    2 ? (
                      <Text style={DetailProductStyles.txtNameUser}>
                        Ch??a ????ng k?? ?????u gi??
                      </Text>
                    ) : this.state.currentIdentifyCode != null ? (
                      <Text style={DetailProductStyles.txtNameUser}>
                        {this.state.currentIdentifyCode}
                      </Text>
                    ) : (
                      <Text style={DetailProductStyles.txtNameUser}>
                        Ch??a c?? ai
                      </Text>
                    ))}
                </View>
                <View style={DetailProductStyles.viewPart}>
                  <Text style={DetailProductStyles.txtUserWin}>
                    Gi?? kh???i ??i???m
                  </Text>
                  <Text style={DetailProductStyles.txtPrice}>
                    {this.formatMoney(this.state.data.startPrice)}
                  </Text>
                </View>
                <View style={DetailProductStyles.viewPart}>
                  <TouchableOpacity
                    style={DetailProductStyles.TOstyle}
                    onPress={() => {
                      if (this.state.isAuthen) {
                        if (this.state.data.userStatus == 2) {
                          if (
                            (this.state.data.status == 3 ||
                              this.state.data.status == 4 ||
                              this.state.data.status == 5) &&
                            this.state.data
                              .registerAuctionPropertyResponseStatus == 2
                          ) {
                            this.biddingList();
                          } else if (
                            this.state.data.status == 0 ||
                            this.state.data.status == 1 ||
                            this.state.data.status == 2
                          ) {
                            Alert.alert('?????u gi?? ch??a b???t ?????u');
                          } else if (
                            this.state.data.status == 6 ||
                            this.state.data.status == 7
                          ) {
                            Alert.alert('?????u gi?? th???t b???i');
                          } else if (
                            this.state.data
                              .registerAuctionPropertyResponseStatus != 2
                          ) {
                            Alert.alert(
                              'B???n c???n ????ng k?? tham gia ?????u gi?? ????? xem l???ch s??? ?????u gi??',
                            );
                          }
                        } else if (this.state.data.userStatus == 1) {
                          Alert.alert(
                            'Tr???ng th??i t??i kho???n: CH??A THANH TO??N PH?? ????NG K?? T??I KHO???N',
                            'Qu?? kh??ch c???n thanh to??n ph?? ????ng k?? ????? x??c th???c t??i kho???n',
                            [
                              {
                                text: '??i ?????n trang x??c th???c t??i kho???n',
                                onPress: () => {
                                  RootNavigation.navigate(USER_PROFILE);
                                },
                              },
                              {
                                text: 'OK',
                                style: 'cancel',
                              },
                            ],
                          );
                        } else if (this.state.data.userStatus == 3) {
                          Alert.alert(
                            'Th??ng b??o',
                            'Tr???ng th??i t??i kho???n: X??C TH???C B??? T??? CH???I\n' +
                              'Qu?? kh??ch c???n x??c th???c l???i t??i kho???n ????? ti???p t???c',
                            [
                              {
                                text: '??i ?????n trang x??c th???c t??i kho???n',
                                onPress: () => {
                                  RootNavigation.navigate(USER_PROFILE);
                                },
                              },
                              {
                                text: 'OK',
                                style: 'cancel',
                              },
                            ],
                          );
                        } else if (this.state.data.userStatus == 4) {
                          Alert.alert(
                            'Th??ng b??o',
                            'Tr???ng th??i t??i kho???n: ??ANG CH??? X??C TH???C\n' +
                              'T??i kho???n c???a qu?? kh??ch ??ang ch??? ???????c x??c nh???n ????? ti???p t???c',
                            [
                              {
                                text: 'OK',
                                style: 'cancel',
                              },
                            ],
                          );
                        }
                      } else {
                        Alert.alert(
                          'TH??NG B??O',
                          'B???n c???n ????ng nh???p ????? xem l???ch s??? ?????u gi??',
                          [
                            {
                              text: '??i ?????n trang ????ng nh???p',
                              onPress: () => {
                                RootNavigation.navigate(AUTH_NAVIGATOR);
                              },
                            },
                            {
                              text: 'OK',
                              style: 'cancel',
                            },
                          ],
                        );
                      }
                    }}>
                    <Text style={DetailProductStyles.txtTO}>Xem l???ch s???</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={DetailProductStyles.viewLine} />
              <Text style={DetailProductStyles.txtDetails}>
                Chi ti???t ?????u gi??:
              </Text>
              <Details title="M?? t??i s???n:" code={'MTS-' + this.state.data.id} />
              <Details
                title="Th???i gian m??? ????ng k??:"
                code={formatDate(this.state.data.registerOpenTime)}
              />
              <Details
                title="Th???i gian k???t th??c ????ng k??:"
                code={formatDate(this.state.data.registerCloseTime)}
              />
              <Details
                title="Ph?? ????ng k?? tham gia ?????u gi??:"
                code={this.formatMoney(this.state.data.registerFee)}
              />
              <Details
                title="B?????c gi??:"
                code={this.formatMoney(this.state.data.stepPrice)}
              />
              <Details
                title="S??? b?????c gi?? t???i ??a /l???n tr???:"
                code="10 b?????c gi??"
              />
              <Details
                title="Ti???n ?????t tr?????c:"
                code={this.formatMoney(this.state.data.depositFee)}
              />
              <Details
                title="Ph????ng th???c ?????u gi??:"
                code="Tr??? gi?? l??n v?? li??n t???c"
              />
              <Details
                title="T??i s???n thu???c s??? h???u:"
                code={this.state.data.ownerName}
              />
              <Details
                title="N??i xem t??i s???n:"
                code={this.state.data.propertyCheckPlace}
              />
              <Details
                title="Th???i gian xem t??i s???n:"
                code={this.state.data.propertyCheckTime}
              />
              <Details
                title="T??? ch???c ?????u gi?? t??i s???n:"
                code="C??ng ty ?????u gi?? h???p danh H??a L???c"
              />
              <Details
                title="?????u gi?? vi??n:"
                code={this.state.data.auctioneerName}
              />
              <Details
                title="Th???i gian b???t ?????u ?????u gi??:"
                code={formatDate(this.state.data.openTime)}
              />
              <Details
                title="Th???i gian k???t th??c ?????u gi??:"
                code={formatDate(this.state.data.closeTime)}
              />
              <Details
                title="M?? ?????u gi?? c???a b???n:"
                code={
                  this.state.data.userIdentifyCode != null
                    ? this.state.data.userIdentifyCode
                    : this.state.identifyCode
                }
              />
              <View>
                <View style={DetailProductStyles.viewInfo}>
                  <TouchableOpacity
                    style={
                      this.state.code == 0
                        ? DetailProductStyles.viewStyleSelected
                        : DetailProductStyles.viewStyleUnselected
                    }
                    onPress={() => this.setState({code: 0})}>
                    <Text
                      style={
                        this.state.code == 0
                          ? DetailProductStyles.textSelected
                          : DetailProductStyles.textUnselected
                      }>
                      TH??NG TIN T??I S???N
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={
                      this.state.code == 1
                        ? DetailProductStyles.viewStyleSelected
                        : DetailProductStyles.viewStyleUnselected
                    }
                    onPress={() => this.setState({code: 1})}>
                    <Text
                      style={
                        this.state.code == 1
                          ? DetailProductStyles.textSelected
                          : DetailProductStyles.textUnselected
                      }>
                      T??I LI???U LI??N QUAN
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={
                      this.state.code == 2
                        ? DetailProductStyles.viewStyleSelected
                        : DetailProductStyles.viewStyleUnselected
                    }
                    onPress={() => this.setState({code: 2})}>
                    <Text
                      style={
                        this.state.code == 2
                          ? DetailProductStyles.textSelected
                          : DetailProductStyles.textUnselected
                      }>
                      TH??NG TIN T??? CH???C ?????U GI??
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    alignSelf: 'flex-start',
                    width: '90%',
                    alignSelf: 'center',
                    marginTop: 20,
                  }}>
                  {this.state.code == 0 && (
                    <View>
                      <Text style={{fontSize: 16, fontStyle: 'italic'}}>
                        {this.state.data.descriptionProperty}
                      </Text>
                    </View>
                  )}
                  {this.state.code == 1 &&
                    (this.state.data.listDocument.length != 0 ? (
                      this.state.data.listDocument.map((item, index) => (
                        <Text
                          style={{fontWeight: 'bold', fontSize: 16}}
                          key={item.id}
                          onPress={() => {
                            this.openUrl(item.url);
                          }}>
                          T??i li???u {index + 1}:{'  '}
                          <Text style={{color: '#3D39FB'}}>{item.title}</Text>
                        </Text>
                      ))
                    ) : (
                      <Text>Kh??ng c?? t??i li???u</Text>
                    ))}
                  {this.state.code == 2 && (
                    <View>
                      <Text style={DetailProductStyles.txtInfo}>
                        T??n t??? ch???c:{' '}
                        <Text style={DetailProductStyles.txtI4s}>
                          C??ng ty ?????u gi?? h???p danh H??a L???c
                        </Text>
                      </Text>
                      <Text style={DetailProductStyles.txtInfo1}>
                        T??n t??i kho???n:{' '}
                        <Text style={DetailProductStyles.txtI4s}>
                          D????ng C??ng Tu???n
                        </Text>
                      </Text>
                      <Text style={DetailProductStyles.txtInfo1}>
                        ?????a ch???:{' '}
                        <Text style={DetailProductStyles.txtI4s2}>
                          ?????i h???c FPT, x?? Th???ch H??a, huy???n Th???ch Th???t, Th??nh ph???
                          H?? N???i
                        </Text>
                      </Text>
                      <Text style={DetailProductStyles.txtInfo1}>
                        M?? t???:{' '}
                        <Text style={DetailProductStyles.txtI4s2}>
                          FPT Group
                        </Text>
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              <Text style={DetailProductStyles.txt1}>T??i s???n kh??c</Text>
              <View style={{width: '90%', alignSelf: 'center'}}>
                {this.state.isLoadingList1 ? (
                  <ActivityIndicator size="large" color="black" />
                ) : (
                  this.List1()
                )}
              </View>
            </ScrollView>
            {(this.state.data.status == 1 || this.state.data.status == 3) && (
              <TouchableOpacity
                style={DetailProductStyles.TOBTNStyles}
                onPress={() => {
                  if (this.state.isAuthen) {
                    if (
                      this.state.data.registerAuctionPropertyResponseStatus ==
                        2 &&
                      this.state.data.status == 3 &&
                      this.state.data.userStatus == 2
                    ) {
                      if (
                        this.state.currentPrice != this.state.data.startPrice
                      ) {
                        this.setState({
                          biddingPrice:
                            this.state.currentPrice + this.state.data.stepPrice,
                          countAution: 1,
                        });
                      } else {
                        this.setState({
                          biddingPrice: this.state.currentPrice,
                          countAution: 0,
                        });
                      }
                      this.setState({showPayAution: true});
                    } else {
                      this.loadDataFromBtn(this.state.id);
                    }
                  } else {
                    Alert.alert(
                      'TH??NG B??O',
                      'B???n c???n ????ng nh???p ????? ????ng k?? ?????u gi?? ho???c tham gia ?????u gi??',
                      [
                        {
                          text: '??i ?????n trang ????ng nh???p',
                          onPress: () => {
                            RootNavigation.navigate(AUTH_NAVIGATOR);
                          },
                        },
                        {
                          text: 'OK',
                          style: 'cancel',
                        },
                      ],
                    );
                  }
                }}>
                <Text style={DetailProductStyles.txtTO2}>
                  {this.state.data.status == 1 ? '????ng k??' : '?????u gi??'}
                </Text>
              </TouchableOpacity>
            )}
            {/* showCFRegisterBid */}
            <Modal
              transparent={true}
              visible={this.state.showCFRegisterBid}
              animationType="slide">
              <View
                style={[DetailProductStyles.viewDonBidStyles2, {height: 300}]}>
                <TouchableOpacity
                  onPress={() => this.setState({showCFRegisterBid: false})}
                  style={[
                    DetailProductStyles.viewDonBidImageStyles,
                    {
                      marginLeft: 'auto',
                      elevation: 10,
                      shadowColor: 'black',
                      borderWidth: 1,
                      borderRadius: 5,
                      width: 40,
                      height: 40,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: 'white',
                      borderColor: '#EDEDED',
                      marginRight: 15,
                      marginTop: 15,
                    },
                  ]}>
                  <Image
                    style={DetailProductStyles.imageDoneBidStyles2}
                    resizeMode="stretch"
                    source={require('../../assets/images/Delete.png')}
                  />
                </TouchableOpacity>
                <View
                  style={[
                    DetailProductStyles.viewDoneBidText1,
                    {textAlign: 'center'},
                  ]}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: 'Open Sans',
                      fontWeight: 'bold',
                      marginTop: -20,
                    }}>
                    B???n mu???n ????ng k?? ?????u gi?? ?
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    width: '100%',
                    marginBottom: 50,
                    marginTop: 'auto',
                  }}>
                  <TouchableOpacity
                    onPress={() =>
                      this.setState(
                        {
                          showCFRegisterBid: false,
                        },
                        async () => {
                          check = await this.registerAuctionProperty();
                          this.loadData(this.state.id);
                          if (check) {
                            this.setState({
                              showCodeRegisterBid: true,
                            });
                          } else {
                            ToastAndroid.show('L???i h??? th???ng', 1000);
                          }
                        },
                      )
                    }
                    style={[
                      DetailProductStyles.touchStyles,
                      {backgroundColor: '#26D3DE'},
                    ]}>
                    <Text
                      style={[DetailProductStyles.touchText, {color: 'white'}]}>
                      X??c nh???n
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.setState({showCFRegisterBid: false})}
                    style={[
                      DetailProductStyles.touchStyles,
                      {backgroundColor: '#FB3F39'},
                    ]}>
                    <Text
                      style={[DetailProductStyles.touchText, {color: 'white'}]}>
                      H???y
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            {/* showCodeRegisterBid */}
            <Modal
              transparent={true}
              visible={this.state.showCodeRegisterBid}
              animationType="slide">
              <View style={DetailProductStyles.viewDonBidStyles2}>
                <TouchableOpacity
                  onPress={() => this.setState({showCodeRegisterBid: false})}
                  style={[
                    DetailProductStyles.viewDonBidImageStyles,
                    {
                      marginLeft: 'auto',
                      elevation: 10,
                      shadowColor: 'black',
                      borderWidth: 1,
                      borderRadius: 5,
                      width: 40,
                      height: 40,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: 'white',
                      borderColor: '#EDEDED',
                      marginRight: 15,
                      marginTop: 15,
                    },
                  ]}>
                  <Image
                    style={DetailProductStyles.imageDoneBidStyles2}
                    resizeMode="stretch"
                    source={require('../../assets/images/Delete.png')}
                  />
                </TouchableOpacity>
                <View style={DetailProductStyles.viewDoneBidText1}>
                  <ScrollView style={{flex: 1}}>
                    <Text
                      style={[
                        DetailProductStyles.viewDoneBidText2,
                        {textAlign: 'center'},
                      ]}>
                      Qu?? kh??ch vui l??ng thanh to??n ph?? ????ng k?? tham gia ?????u gi??
                      {'\n'}
                      S??? ti???n:{' '}
                      {this.formatMoney(
                        this.state.data.depositFee +
                          this.state.data.registerFee,
                      )}
                      {'\n'}
                      T??n t??i kho???n: C??ng ty ?????u gi?? Hola{'\n'}
                      S??? t??i kho???n: 5010117720004{'\n'}
                      T???i: Ng??n h??ng Qu??n ?????i MB Bank - Chi nh??nh ????ng H?? -
                      Qu???ng Tr???{'\n'}
                      N???i dung: ???{this.state.transactionCode} n???p ph?? ????ng k??
                      tham gia ?????u gi?????.
                    </Text>
                  </ScrollView>
                </View>
                <View
                  style={[
                    DetailProductStyles.viewDoneBidTouch,
                    {marginTop: 'auto', marginBottom: 50},
                  ]}>
                  <TouchableOpacity
                    onPress={() =>
                      this.setState(
                        {
                          showCodeRegisterBid: false,
                          isLoading: true,
                        },
                        () => {
                          this.paidRegisterAutionPropertyFee();
                        },
                      )
                    }
                    style={[
                      DetailProductStyles.touchStyles,
                      {backgroundColor: '#26D3DE'},
                    ]}>
                    <Text
                      style={[DetailProductStyles.touchText, {color: 'white'}]}>
                      ???? thanh to??n
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.setState({showCodeRegisterBid: false})}
                    style={[
                      DetailProductStyles.touchStyles,
                      {backgroundColor: '#FB3F39'},
                    ]}>
                    <Text
                      style={[DetailProductStyles.touchText, {color: 'white'}]}>
                      Thanh to??n sau
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            {/* waitRegisterBid */}
            <Modal
              transparent={true}
              visible={this.state.waitRegisterBid}
              animationType="slide">
              <View style={DetailProductStyles.viewDonBidStyles2}>
                <TouchableOpacity
                  onPress={() => this.setState({waitRegisterBid: false})}
                  style={[
                    DetailProductStyles.viewDonBidImageStyles,
                    {
                      marginLeft: 'auto',
                      elevation: 10,
                      shadowColor: 'black',
                      borderWidth: 1,
                      borderRadius: 5,
                      width: 40,
                      height: 40,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: 'white',
                      borderColor: '#EDEDED',
                      marginRight: 15,
                      marginTop: 15,
                    },
                  ]}>
                  <Image
                    style={DetailProductStyles.imageDoneBidStyles2}
                    resizeMode="stretch"
                    source={require('../../assets/images/Delete.png')}
                  />
                </TouchableOpacity>
                <Image
                  style={DetailProductStyles.imageCancelBidStyle}
                  resizeMode="stretch"
                  source={require('../../assets/images/cancelBidImg.png')}
                />
                <View style={DetailProductStyles.viewCancelBidText1}>
                  <Text
                    style={[
                      DetailProductStyles.viewDoneBidText2,
                      {textAlign: 'center'},
                    ]}>
                    Qu?? kh??ch vui l??ng thanh to??n ph?? ????ng k?? tham gia ?????u gi??
                    {'\n'}
                    S??? ti???n:{' '}
                    {this.formatMoney(
                      this.state.data.depositFee + this.state.data.registerFee,
                    )}
                    {'\n'}
                    T??n t??i kho???n: C??ng ty ?????u gi?? Hola{'\n'}
                    S??? t??i kho???n: 5010117720004{'\n'}
                    T???i: Ng??n h??ng Qu??n ?????i MB Bank - Chi nh??nh ????ng H?? - Qu???ng
                    Tr???{'\n'}
                    N???i dung: ???{this.state.transactionCode} n???p ph?? ????ng k?? tham
                    gia ?????u gi?????.
                  </Text>
                </View>
              </View>
            </Modal>
            {/* acceptRegisterBid */}
            <Modal
              transparent={true}
              visible={this.state.acceptRegisterBid}
              animationType="slide">
              <View style={DetailProductStyles.viewCancelBidStyles}>
                <TouchableOpacity
                  onPress={() => this.setState({acceptRegisterBid: false})}
                  style={[
                    DetailProductStyles.viewDonBidImageStyles,
                    {
                      marginLeft: 'auto',
                      elevation: 10,
                      shadowColor: 'black',
                      borderWidth: 1,
                      borderRadius: 5,
                      width: 40,
                      height: 40,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: 'white',
                      borderColor: '#EDEDED',
                      marginRight: 15,
                      marginTop: 15,
                    },
                  ]}>
                  <Image
                    style={DetailProductStyles.imageDoneBidStyles2}
                    resizeMode="stretch"
                    source={require('../../assets/images/Delete.png')}
                  />
                </TouchableOpacity>
                <Image
                  style={DetailProductStyles.imageCancelBidStyle}
                  resizeMode="stretch"
                  source={require('../../assets/images/cancelBidImg.png')}
                />
                <View style={DetailProductStyles.viewCancelBidText1}>
                  <Text style={DetailProductStyles.viewCancelBid}>
                    B???n ???? ????ng k?? th??nh c??ng
                  </Text>
                </View>
                <TouchableOpacity
                  style={DetailProductStyles.touchStyles3}
                  onPress={() => this.setState({acceptRegisterBid: false})}>
                  <Text style={DetailProductStyles.touchTextCancelBid}>OK</Text>
                </TouchableOpacity>
              </View>
            </Modal>
            {/* showHistoryBid */}
            <Modal
              transparent={true}
              visible={this.state.showHistoryBid}
              animationType="slide">
              <View style={DetailProductStyles.viewModalStyles}>
                <View style={DetailProductStyles.viewSmallModalStyles}>
                  <View style={DetailProductStyles.viewTextModal1}>
                    <Text style={DetailProductStyles.textModal1}>
                      L???ch s??? ?????u gi??
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => this.setState({showHistoryBid: false})}
                    style={[
                      DetailProductStyles.viewDonBidImageStyles,
                      {
                        marginLeft: 'auto',
                        elevation: 10,
                        shadowColor: 'black',
                        borderWidth: 1,
                        borderRadius: 5,
                        width: 40,
                        height: 40,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'white',
                        borderColor: '#EDEDED',
                        marginRight: 15,
                        marginTop: 15,
                      },
                    ]}>
                    <Image
                      style={DetailProductStyles.imageDoneBidStyles2}
                      resizeMode="stretch"
                      source={require('../../assets/images/Delete.png')}
                    />
                  </TouchableOpacity>
                </View>
                <View style={DetailProductStyles.viewLine2} />
                <View style={{flexDirection: 'row'}}>
                  <View style={{width: '50%'}}>
                    <Text style={DetailProductStyles.textModal2}>
                      Ng?????i ?????u gi??
                    </Text>
                  </View>
                  <View style={{width: '50%'}}>
                    <Text style={DetailProductStyles.textModal3}>Gi??</Text>
                  </View>
                </View>
                <FlatList
                  data={this.state.listBidding}
                  renderItem={this.renderItemhistoryBid}
                  keyExtractor={item => item.id}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  style={{marginBottom: 10}}
                />
              </View>
            </Modal>
            {/* showPayAution */}
            <Modal
              transparent={true}
              visible={this.state.showPayAution}
              animationType="slide">
              <View style={DetailProductStyles.viewDonBidStyles}>
                <TouchableOpacity
                  onPress={() => this.setState({showPayAution: false})}
                  style={[
                    DetailProductStyles.viewDonBidImageStyles,
                    {
                      marginLeft: 'auto',
                      elevation: 10,
                      shadowColor: 'black',
                      borderWidth: 1,
                      borderRadius: 5,
                      width: 40,
                      height: 40,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: 'white',
                      borderColor: '#EDEDED',
                      marginRight: 15,
                      marginTop: 15,
                    },
                  ]}>
                  <Image
                    style={DetailProductStyles.imageDoneBidStyles2}
                    resizeMode="stretch"
                    source={require('../../assets/images/Delete.png')}
                  />
                </TouchableOpacity>
                <View
                  style={{
                    height: 280,
                    width: '100%',
                  }}>
                  <View
                    style={{
                      height: 280,
                      width: 280,
                      borderRadius: 200,
                      alignSelf: 'center',
                    }}>
                    <Image
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 200,
                        resizeMode: 'cover',
                      }}
                      source={{uri: this.state.data.images[0]}}
                    />
                  </View>
                  <View
                    style={{
                      backgroundColor: '#FF5F27',
                      borderRadius: 15,
                      justifyContent: 'center',
                      alignItems: 'center',
                      position: 'absolute',
                      marginRight: 'auto',
                      marginTop: 35,
                      width: '40%',
                      height: 35,
                      marginLeft: 10,
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        textAlign: 'center',
                        fontSize: 16,
                        fontFamily: 'Open Sans',
                        fontWeight: 'bold',
                      }}>
                      {this.formatMoney(
                        this.state.currentPrice != null
                          ? this.state.currentPrice
                          : this.state.data.startPrice,
                      )}
                    </Text>
                  </View>
                </View>
                <View style={{width: '75%', marginTop: 10}}>
                  <Text
                    numberOfLines={2}
                    style={{fontSize: 24, fontWeight: 'bold'}}>
                    {this.state.data.propertyName}
                  </Text>
                </View>
                <View style={[DetailProductStyles.viewDoneBidText1]}>
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <View style={{width: 20, height: 20}}>
                      <Image
                        source={require('../../assets/images/imgDola.png')}
                        style={{
                          width: '100%',
                          height: '100%',
                          resizeMode: 'cover',
                        }}
                      />
                    </View>
                    <Text
                      style={[
                        DetailProductStyles.viewDoneBidText2,
                        {marginLeft: 20, color: '#FF5F27'},
                      ]}>
                      {this.formatMoney(
                        this.state.biddingPrice != null
                          ? this.state.biddingPrice
                          : this.state.data.startPrice,
                      )}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      borderColor: 'red',
                      marginTop: 'auto',
                      marginBottom: 10,
                    }}>
                    <View
                      style={{
                        width: '50%',
                        justifyContent: 'center',
                        marginTop: 'auto',
                      }}>
                      <Text
                        style={[
                          DetailProductStyles.viewDoneBidText2,
                          {textAlign: 'center'},
                        ]}>
                        B?????c gi??:{' '}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        width: '100%',
                        alignItems: 'center',
                        height: 70,
                      }}>
                      <View
                        style={{
                          width: '50%',
                          justifyContent: 'center',
                        }}>
                        <View style={{flexDirection: 'row', width: '100%'}}>
                          {this.state.countAution !=
                            (this.state.currentPrice !=
                            this.state.data.startPrice
                              ? 1
                              : 0) && (
                            <TouchableOpacity
                              disabled={
                                (this.state.currentPrice !=
                                this.state.data.startPrice
                                  ? 1
                                  : 0) == this.state.countAution
                              }
                              onPress={() => {
                                this.state.countAution > 0
                                  ? this.setState({
                                      biddingPrice:
                                        this.state.currentPrice +
                                        (this.state.countAution - 1) *
                                          this.state.data.stepPrice,
                                      countAution: this.state.countAution - 1,
                                    })
                                  : null;
                              }}
                              style={[
                                DetailProductStyles.touchMinusStyles,
                                {marginRight: 'auto'},
                              ]}>
                              <Text style={DetailProductStyles.touchText}>
                                -
                              </Text>
                            </TouchableOpacity>
                          )}
                          {this.state.countAution ==
                            (this.state.currentPrice !=
                            this.state.data.startPrice
                              ? 1
                              : 0) && (
                            <View
                              style={[
                                DetailProductStyles.touchMinusStyles,
                                {
                                  marginRight: 'auto',
                                  borderWidth: 0,
                                  backgroundColor: 'white',
                                },
                              ]}></View>
                          )}
                          <View
                            style={{
                              width: 40,
                              height: 40,
                              justifyContent: 'center',
                            }}>
                            <Text style={DetailProductStyles.touchText}>
                              {this.state.countAution}{' '}
                            </Text>
                          </View>
                          {this.state.countAution == 10 && (
                            <View
                              style={[
                                DetailProductStyles.touchMinusStyles,
                                {
                                  marginLeft: 'auto',
                                  borderWidth: 0,
                                  backgroundColor: 'white',
                                },
                              ]}></View>
                          )}
                          {this.state.countAution != 10 && (
                            <TouchableOpacity
                              disabled={this.state.countAution == 10}
                              onPress={() => {
                                if (
                                  this.state.currentPrice !=
                                  this.state.biddingPrice
                                ) {
                                  this.setState({
                                    biddingPrice:
                                      this.state.currentPrice +
                                      (this.state.countAution + 1) *
                                        this.state.data.stepPrice,
                                    countAution: this.state.countAution + 1,
                                  });
                                } else {
                                  this.setState({
                                    biddingPrice:
                                      this.state.currentPrice +
                                      (this.state.countAution + 1) *
                                        this.state.data.stepPrice,
                                    countAution: this.state.countAution + 1,
                                  });
                                }
                              }}
                              style={[
                                DetailProductStyles.touchMinusStyles,
                                {marginLeft: 'auto'},
                              ]}>
                              <Text style={DetailProductStyles.touchText}>
                                +
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          if (
                            this.state.biddingPrice > this.state.currentPrice ||
                            this.state.currentPrice ==
                              this.state.data.startPrice
                          ) {
                            this.biddingCreate();
                          } else {
                            Alert.alert('Gi?? ?????u ph???i cao h??n gi?? hi???n t???i.');
                          }
                        }}
                        style={[
                          DetailProductStyles.touchStyles,
                          {
                            backgroundColor: '#FF5F27',
                            marginLeft: 'auto',
                            height: '100%',
                          },
                        ]}>
                        <Text
                          style={[
                            DetailProductStyles.touchText,
                            {color: 'white'},
                          ]}>
                          X??c nh???n
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </Modal>
            {this.state.isAuthen && (
              <Stomp
                url={`${environment.apiUrl}/${listAPi.socketBidding}`}
                topics={[listAPi.topicSocketBidding]}
                onConnect={() => {}}
                onDisconnect={() => {}}
                onMessage={msg => {
                  if (msg == 'Disabled') {
                    Alert.alert(
                      'Cu???c ?????u gi?? ???? b??? hu???',
                      'Cu???c ?????u gi?? n??y ???? b??? hu??? v?? m???t v??i s??? c???. Mong qu?? kh??ch th??ng c???m, v???n tin t?????ng v?? s??? d???ng h??? th???ng c???a ch??ng t??i. Xin c???m ??n!',
                      [
                        {
                          text: 'Quay l???i',
                          onPress: () => this.props.navigation.goBack(),
                          style: 'cancel',
                        },
                      ],
                    );
                  } else {
                    this.setState({
                      currentPrice: msg.currentMaxPrice,
                      currentIdentifyCode: msg.currentIdentifyCode,
                      countAution: 1,
                      biddingPrice: msg.currentMaxPrice+this.state.data.stepPrice
                    });
                  }
                }}
              />
            )}
          </View>
        )}
      </View>
    );
  }
}

const CountDownTimer = props => {
  const [timer, setTimer] = useState(props.timeLeft);
  const [timerOn, setTimerOn] = useState(props.timeOn);
  const countDown = () => {
    BackgroundTimer.runBackgroundTimer(() => {
      setTimer(secs => {
        if (secs > 0) {
          return secs - 1;
        } else {
          return 0;
        }
      });
    }, 1000);
  };
  useEffect(() => {
    if (timerOn) {
      setTimer(props.timeLeft);
      countDown();
    } else {
      BackgroundTimer.stopBackgroundTimer();
    }
    return () => {
      BackgroundTimer.stopBackgroundTimer();
    };
  }, [timerOn]);
  useEffect(() => {
    if (timer === 0 && props.timeLeft > 0) {
      props.stop();
      BackgroundTimer.stopBackgroundTimer();
    }
  }, [timer]);
  useEffect(() => {
    setTimerOn(props.timeOn);
  }, [props.timeOn]);
  const clockify = () => {
    let days = Math.floor(timer / 60 / 60 / 24);
    let hours = Math.floor((timer / 60 / 60) % 24);
    let mins = Math.floor((timer / 60) % 60);
    let seconds = Math.floor(timer % 60);
    let displayDays = days < 10 ? `0${days}` : days;
    let displayHours = hours < 10 ? `0${hours}` : hours;
    let displayMins = mins < 10 ? `0${mins}` : mins;
    let displaySecs = seconds < 10 ? `0${seconds}` : seconds;
    return {
      displayDays,
      displayHours,
      displayMins,
      displaySecs,
    };
  };
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '50%',
        marginRight: '5%',
      }}>
      <View style={DetailProductStyles.viewTime}>
        <Text style={DetailProductStyles.txtNgayGio}>Ng??y</Text>
        <View style={DetailProductStyles.viewCount}>
          <Text style={DetailProductStyles.txtCount}>
            {clockify().displayDays}
          </Text>
        </View>
      </View>
      <View style={DetailProductStyles.viewTime}>
        <Text style={DetailProductStyles.txtNgayGio}>Gi???</Text>
        <View style={DetailProductStyles.viewCount}>
          <Text style={DetailProductStyles.txtCount}>
            {clockify().displayHours}
          </Text>
        </View>
      </View>
      <View style={DetailProductStyles.viewTime}>
        <Text style={DetailProductStyles.txtNgayGio}>Ph??t</Text>
        <View style={DetailProductStyles.viewCount}>
          <Text style={DetailProductStyles.txtCount}>
            {clockify().displayMins}
          </Text>
        </View>
      </View>
      <View style={DetailProductStyles.viewTime}>
        <Text style={DetailProductStyles.txtNgayGio}>Gi??y</Text>
        <View style={DetailProductStyles.viewCount}>
          <Text style={DetailProductStyles.txtCount}>
            {clockify().displaySecs}
          </Text>
        </View>
      </View>
    </View>
  );
};
