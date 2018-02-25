import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, TextInput, Switch, Alert } from 'react-native';

export default class Geolocation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      latitude: null,
      longitude: null,
      error: null,
      locationNotifyUrl : "http://192.168.1.107:8080/gps",
      tourid: null,
      truckid: null
    };

   this.getMyLocation = this.getMyLocation.bind(this);
   this.sendLocation = this.sendLocation.bind(this);
  }

  getMyLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 },
    );
  }

  sendLocation() {

    fetch(this.state.locationNotifyUrl,{
        method: 'POST',
        body: JSON.stringify({
          latitude: this.state.latitude,
          longitude: this.state.longitude,
          tourId: this.state.tourid,
          truckId: this.state.truckid,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        if(response.status!=200)
        {
          
            Alert.alert(
                'Alert',
                'Operation Failed !!. Http status code '+response.status,
                [
                  {text: 'OK', onPress: () => console.log('OK Pressed')},
                ],
                { cancelable: true }
              )

        }
        else
        {
            Alert.alert(
              'Alert',
              'Operation Succeeded. ',
              [
                {text: 'OK', onPress: () => console.log('OK Pressed')},
              ],
              { cancelable: true }
            )
        }
      
      }).catch((error) => {
          Alert.alert(
            'Alert',
            'Operation Failed !!. Error '+error,
            [
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            { cancelable: true }
          )

      });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.box1}>
          <Text style={ {fontSize: 20, textAlign:'center'} }> GPS Application </Text>
        </View>

        <View style={styles.box1}>
          <Button title="Get Location" onPress={this.getMyLocation}/>
          <Text>Latitude: {this.state.latitude}</Text>
          <Text>Longitude: {this.state.longitude}</Text>
          {this.state.error ? <Text>Error: {this.state.error}</Text> : null}
        </View>

        <View style={styles.box2}>
          <TextInput 
            value={this.state.tourid}
            placeholder="Tour Id"
            onChangeText={(text) => this.setState({tourid : text})}
          />
          <TextInput 
            value={this.state.truckid}
            placeholder="Truck Id"
            onChangeText={(text) => this.setState({truckid : text})}
          />
          <TextInput 
            value={this.state.locationNotifyUrl}
            placeholder="Notification URL"
            onChangeText={(text) => this.setState({locationNotifyUrl : text})}
          />
          <Button title="Send" onPress={this.sendLocation}/>
        </View>
        <View style={styles.box3}></View>


      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
    //header
  box1: {
    flex: 5,
    
  },

  box2: {
    flex: 5,
  },

  box3: {
    flex: 10,
  }
});


