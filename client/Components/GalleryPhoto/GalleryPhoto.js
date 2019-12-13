import React, { useState, useEffect } from "react";
import * as Permissions from "expo-permissions";
import { Image, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import * as MediaLibrary from "expo-media-library";
import styled from "styled-components";
import Spinner from "../Spinner";

const { width } = Dimensions.get('window')

const View = styled.View`
  flex: 1;
`;

const Button = styled.TouchableOpacity`
  width: 100px;
  height: 30px;
  position: absolute;
  right: ${(width/2) - 50}px;
  top: 50%;
  background-color: black;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
`;

const Text = styled.Text`
  color: white;
  font-weight: 600;
`;

export default ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const [selected, setSelected] = useState();
  const [allPhotos, setAllPhotos] = useState();
  const changeSelected = photo => {
    setSelected(photo);
  };
  const getPhotos = async () => {
    try {
      const { assets } = await MediaLibrary.getAssetsAsync();
      const [firstPhoto] = assets;
      setSelected(firstPhoto);
      setAllPhotos(assets);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  const askPermission = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status === "granted") {
        setHasPermission(true);
        getPhotos();
      }
    } catch (e) {
      console.log(e);
      setHasPermission(false);
    }
  };
  const handleSelected = () => {
    navigation.navigate("AddPhoto", { url: selected.uri });
  };
  useEffect(() => {
    askPermission();
  }, []);
  return (
    <View>
      {loading ? (
        <Spinner />
      ) : (
        <View>
          {hasPermission ? (
            <>
              <Image
                style={{ width: width, height: width * (4/3) }}
                source={{ uri: selected.uri }}
              />

              <Button onPress={handleSelected}>
                <Text>Select Photo</Text>
              </Button>

              <ScrollView
                contentContainerStyle={{
                  flexDirection: "row",
                  flexWrap: "wrap"
                }}
              >
                {allPhotos.map(photo => (
                  <TouchableOpacity
                    key={photo.id}
                    onPress={() => changeSelected(photo)}
                  >
                    <Image
                      source={{ uri: photo.uri }}
                      style={{
                        width: width / 3,
                        height: width * (4/3) / 6,
                        opacity: photo.id === selected.id ? 0.5 : 1
                      }}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          ) : null}
        </View>
      )}
    </View>
  );
};
