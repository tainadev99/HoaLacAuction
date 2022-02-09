import React, {Component} from 'react';
import {TextInputStyle} from './styles';
import {View, Text, TextInput, TouchableOpacity, Image} from 'react-native';

export default class TextInputPass02 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSeen: false,
    };
  }
  render() {
    return (
      <View style={TextInputStyle.container}>
        <View
          style={{
            height: 40,
            width: '100%',
            borderColor: '#e0e0d1',
            borderWidth: 1,
            borderRadius: 7,
            flexDirection: 'row',
          }}>
          <TextInput
            defaultValue={this.props.default}
            secureTextEntry={!this.state.isSeen}
            style={TextInputStyle.textinput03}
            placeholder={this.props.hidetext}
            onChangeText={text => {
              this.props.setText(text);
            }}
          />
          {this.state.isSeen && (
            <TouchableOpacity
              onPress={() => {
                this.setState({isSeen: !this.state.isSeen});
              }}>
              <Image
                style={{width: 30, height: 30, marginLeft: 'auto'}}
                source={require('../../../assets/images/eyeSeen.png')}
              />
            </TouchableOpacity>
          )}
          {!this.state.isSeen && (
            <TouchableOpacity
              onPress={() => {
                this.setState({isSeen: !this.state.isSeen});
              }}>
              <Image
                style={{width: 30, height: 30, marginLeft: 'auto'}}
                source={require('../../../assets/images/eyeUnseen.png')}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
}
