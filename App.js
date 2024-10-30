import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Marker } from "react-native-maps";
import MapView from "react-native-map-clustering";
import axios from 'axios';

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://eonet.gsfc.nasa.gov/api/v2.1/events')
        .then((response) => {
          setData(response.data.events);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
  }, []);

  return (
      <View style={styles.container}>
        {loading ? (
            <View style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}>
              <Text>Yükleniyor...</Text>
            </View>
        ) : (
            <MapView
                style={styles.map}
                initialRegion={{
                  latitude: 36.3719444,
                  longitude: -97.5683333,
                  latitudeDelta: 10.0922,
                  longitudeDelta: 10.0421,
                }}
            >
              {data.map((item, index) => (
                  item.categories[0].id == '8' && item.geometries.map((geometry, geoIndex) => (
                      <Marker
                          key={`${index}-${geoIndex}`}
                          coordinate={{
                            latitude: geometry.coordinates[1],
                            longitude: geometry.coordinates[0],
                          }}
                          title={item.title}
                          description={item.categories[0].title}
                      />
                  ))
              ))}
            </MapView>
        )}
        <StatusBar style="auto" />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
