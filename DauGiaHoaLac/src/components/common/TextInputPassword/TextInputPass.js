import React, {Component} from 'react';
import {TextInputStyle} from './styles';
import {View, Text, TextInput, TouchableOpacity, Image} from 'react-native';

export default class TextInputPass extends Component {
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
            height: 40,
            width: '100%',
            borderBottomColor: 'black',
            borderBottomWidth: 1,
            marginBottom: '7%',
            flexDirection: 'row',
          }}>
          <TextInput
            defaultValue={this.props.default}
            secureTextEntry={!this.state.isSeen}
            style={{
              height: 40,
              width: '90%',
              borderBottomColor: 'black',
              borderBottomWidth: 1,
              marginBottom: '7%',
            }}
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
