import {Picker} from '@react-native-picker/picker';
import React, {Component, useState} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';

export default class TestAPI extends Component {
  constructor(props) {
    super(props);
    this.state = {
      province: [],
      district: [],
      commune: [],
      pickerprovinceValue:
        this.props.pickerProvidenceValue != null
          ? this.props.pickerProvidenceValue
          : '0',
      pickerDistrictValue:
        this.props.pickerDistrictValue != null
          ? this.props.pickerDistrictValue
          : '0',
      pickerCommuneValue:
        this.props.pickerCommuneValue != null
          ? this.props.pickerCommuneValue
          : '0',
      isLoading: true,
    };
  }
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }
  loadAddress() {
    if (
      this.props.pickerProvidenceValue != null &&
      this.props.pickerDistrictValue != null
    ) {
      Promise.all([
        fetch(
          'https://sheltered-anchorage-60344.herokuapp.com/district/?idProvince=' +
            this.state.pickerprovinceValue,
        ).then(res => res.json()),
        fetch(
          'https://sheltered-anchorage-60344.herokuapp.com/commune/?idDistrict=' +
            this.state.pickerDistrictValue,
        ).then(res => res.json()),
        fetch('https://sheltered-anchorage-60344.herokuapp.com/Province').then(
          res => res.json(),
        ),
      ])
        .then(([district, commune, province]) => {
          this.setState({
            district: district,
            commune: commune,
            province: province,
            isLoading: false,
          });
        })
        .catch(err => {
          ToastAndroid.show('Lỗi hệ thống', 1);
        });
    } else if (this.props.pickerDistrictValue == null) {
      Promise.all([
        fetch(
          'https://sheltered-anchorage-60344.herokuapp.com/district/?idProvince=' +
            this.state.province,
        ).then(res => res.json()),
        fetch('https://sheltered-anchorage-60344.herokuapp.com/Province').then(
          res => res.json(),
        ),
      ])
        .then(([district, province]) => {
          this.setState({
            district: district,
            province: province,
            isLoading: false,
          });
        })
        .catch(err => {
          ToastAndroid.show('Lỗi hệ thống', 1);
        });
    } else {
      Promise.all([
        fetch('https://sheltered-anchorage-60344.herokuapp.com/Province').then(
          res => res.json(),
        ),
      ])
        .then(([province]) => {
          this.setState({
            province: province,
            isLoading: false,
          });
        })
        .catch(err => {
          ToastAndroid.show('Lỗi hệ thống', 1);
        });
    }
  }
  componentDidMount() {
    this.loadAddress();
  }
  render() {
    return (
      <View style={styles.container}>
        {this.state.isLoading ? (
          <ActivityIndicator size="large" color="black" />
        ) : (
          <View>
            <View style={styles.viewPicker}>
              <Picker
                style={styles.pickerStyles}
                selectedValue={this.state.pickerprovinceValue}
                onValueChange={itemValue => {
                  this.props.changeProvince(itemValue);
                  this.setState({pickerprovinceValue: itemValue}, () =>
                    fetch(
                      'https://sheltered-anchorage-60344.herokuapp.com/district/?idProvince=' +
                        itemValue,
                    )
                      .then(response => response.json())
                      .then(json => {
                        this.setState({district: json});
                      })
                      .catch(error => {
                        ToastAndroid.show('Lỗi hệ thống', 1000);
                      }),
                  );
                  this.setState({commune: []});
                }}>
                <Picker.Item label={'Chọn tỉnh/thành phố'} value={0} key={0} />
                {this.state.province.map((item, key) => (
                  <Picker.Item
                    label={item.name}
                    value={item.idProvince}
                    key={item.idProvince}
                  />
                ))}
              </Picker>
            </View>
            <View style={styles.viewPicker}>
              <Picker
                style={styles.pickerStyles}
                selectedValue={this.state.pickerDistrictValue}
                onValueChange={itemValue => {
                  this.props.changeDistrict(itemValue);
                  this.setState({pickerDistrictValue: itemValue}, () =>
                    fetch(
                      'https://sheltered-anchorage-60344.herokuapp.com/commune/?idDistrict=' +
                        itemValue,
                    )
                      .then(response => response.json())
                      .then(json => {
                        this.setState({commune: json});
                      })
                      .catch(error => {
                        ToastAndroid.show('Lỗi hệ thống', 1000);
                      }),
                  );
                }}>
                <Picker.Item label={'Chọn quận/huyện'} value={0} key={0} />
                {this.state.district.map((item, key) => (
                  <Picker.Item
                    label={item.name}
                    value={item.idDistrict}
                    key={item.idDistrict}
                  />
                ))}
              </Picker>
            </View>
            <View style={styles.viewPicker}>
              <Picker
                style={styles.pickerStyles}
                selectedValue={this.state.pickerCommuneValue}
                onValueChange={itemValue => {
                  this.props.changeCommune(itemValue);
                  this.setState({pickerCommuneValue: itemValue});
                }}>
                <Picker.Item label={'Chọn phường/xã'} value={0} key={0} />
                {this.state.commune.map((item, key) => (
                  <Picker.Item
                    label={item.name}
                    value={item.idCommune}
                    key={item.idCommune}
                  />
                ))}
              </Picker>
            </View>
          </View>
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
    width: '100%',
    alignSelf: 'center',
  },
  viewPicker: {
    width: '100%',
    height: 45,
    borderWidth: 1,
    alignSelf: 'center',
    borderRadius: 7,
    justifyContent: 'center',
    marginBottom: 5,
    borderColor: '#D9D9D9',
  },
  pickerStyles: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
  },
});
