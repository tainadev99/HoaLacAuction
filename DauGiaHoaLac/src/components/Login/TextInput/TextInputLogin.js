import React, {Component} from 'react';
import {TextInputStyle} from './styles';
import {View, Text, TextInput, Image, TouchableOpacity} from 'react-native';

export default class TextInputLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSeen: false,
    };
  }
  render() {
    return (
      <View style={TextInputStyle.container}>
        <Text style={TextInputStyle.textname}>{this.props.name}</Text>
        <View
          style={{
            flexDirection: 'row',
            height: 40,
            width: '100%',
            borderBottomColor: 'black',
            borderBottomWidth: 0.5,
            marginBottom: 30,
          }}>
          <TextInput
            style={
              !this.props.isPass
                ? TextInputStyle.textinput
                : TextInputStyle.textinput2
            }
            secureTextEntry={this.props.isPass && !this.state.isSeen}
            ref={this.props.refTextInput}
            onChangeText={text => {
              this.props.setText(text);
            }}
          />
          {this.props.isPass && this.state.isSeen && (
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
          {this.props.isPass && !this.state.isSeen && (
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
