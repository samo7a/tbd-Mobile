import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableHighlight,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  FlatList,
  Image,
} from "react-native";
import DogItem from "./DogItem";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import Ionicons from "react-native-vector-icons/Ionicons";
import Slider from "@react-native-community/slider";
import RNPickerSelect from "react-native-picker-select";
import LinearGradient from "react-native-linear-gradient";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import defaultProfilePic from "../../images/dogAvatar.jpg";
import * as ImagePicker from "react-native-image-picker";
import { Picker } from "native-base";
import jwt_decode from "jwt-decode";
import Axios from "../../utilities/axios";
const Storage = require("../../utilities/TokenStorage");

const DogManager = () => {
  const nameRef = useRef();
  const bioRef = useRef();
  const breedRef = useRef();

  const [userId, setUserId] = useState("");

  //dog properties for adding a dog
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [breed, setBreed] = useState("");
  const [size, setSize] = useState("");
  const [age, setAge] = useState(0);
  const [sex, setSex] = useState("");
  const [isPottyTrained, setIsPottyTrained] = useState(false);
  const [isNeutered, setIsNeutered] = useState(false);
  const [dogId, setDogId] = useState();
  const [profilePic, setProfilePic] = useState(defaultProfilePic);

  // //dog properties for editing a dog
  // const [editName, editSetName] = useState("");
  // const [editBio, editSetBio] = useState("");
  // const [editBreed, editSetBreed] = useState("");
  // const [editSize, editSetSize] = useState("");
  // const [editAge, editSetAge] = useState(0);
  // const [editSex, editSetSex] = useState("");
  // const [editIsPottyTrained, editSetIsPottyTrained] = useState(false);
  // const [editIsNeutered, editSetIsNeutered] = useState(false);
  // const [editDogId, editSDogId] = useState(false);
  // const [editmode, setEditmode] = useState(false);

  // // for showing modal
  //const [showEditDog, setshowEditDog] = useState(false);
  const [showAddDog, setShowAddDog] = useState(false);

  // list of mydogs
  const [myDogs, setMyDogs] = useState([]);
  async function getInfo() {
    try {
      const token = await Storage.load("accessToken");
      console.log("token : " + token);
      const userData = await jwt_decode(token, { complete: true });
      console.log("userData : " + JSON.stringify(userData));
      var id = userData.userId;
      console.log("id from useEffect: " + id);
      setUserId(id);
      console.log("userId from useEffect : " + userId);
      const json = {
        id: id,
      };
      try {
        const response = await Axios.post("/getOwnerDogs", json);
        console.log("response length should be 5 : " + response.data.length);
        console.log(response.data);
        const array = [];
        for (var i = 0; i < response.data.length; i++) {
          var obj = {
            key: response.data[i]._id,
            name: response.data[i].Name,
            age: response.data[i].Age,
            bio: response.data[i].Bio,
            size: response.data[i].Size,
            breed: response.data[i].Breed,
            sex: response.data[i].Sex,
            isNeutered: response.data[i].isNeutered,
            isPottyTrained: response.data[i].isPottyTrained,
          };
          array.push(obj);
        }
        console.log(" array : " + array);
        setMyDogs(array);
        console.log(" myDogs : " + array);
      } catch (e) {
        console.log(e);
        Alert.alert("Technical Error, Please Try again!");
      }
    } catch (e) {
      console.log(e);
      Alert.alert("Technical Error, Please Try again!");
    }
  }
  useEffect(() => {
    getInfo();
  }, []);
  const cancel = () => {
    setShowAddDog(false);
  };
  const showAddDogModal = () => {
    setName("");
    setBio("");
    setBreed("");
    setSize("");
    setAge(0);
    setSex("");
    setIsPottyTrained(false);
    setIsNeutered(false);
    setShowAddDog(true);
  };
  const addDog = async () => {
    try {
      const json = {
        Name: name,
        UserID: userId,
        Bio: bio,
        Breed: breed,
        Size: size,
        Age: age,
        Sex: sex,
        isPottyTrained: isPottyTrained,
        isNeutered: isNeutered,
      };
      const response = await Axios.post("/createDog", json);
      const dog = {
        key: response.data,
        name: name,
        bio: bio,
        breed: breed,
        size: size,
        age: age,
        sex: sex,
        isPottyTrained: isPottyTrained,
        isNeutered: isNeutered,
      };
      setMyDogs([...myDogs, dog]);
      setShowAddDog(false);
    } catch (e) {
      console.log(error);
    }
  };

  const showModal = () => {
    setshowEditDog(true);
  };
  const deleteItem = async (item) => {
    var obj = {
      UserID: userId,
      DogID: item.key,
    };
    console.log(JSON.stringify(obj));
    try {
      await Axios.post("/deleteDog", obj);
    } catch (e) {
      console.log(e);
    }
    setMyDogs(myDogs.filter((dog) => dog.key !== item.key));
  };

  const editDogDetails = () => {
    setEditmode(true);
  };

  function editDogArray(dogToEdit) {
    getInfo();
  }
  const choosePhoto = () => {
    const options = {
      noData: true,
      mediaType: "photo",
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.uri) {
        setProfilePic(response);
      }
    });
    //TODO: send the photo the server
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#8D99AE", "#EDF2F4"]}
        style={{ height: "100%" }}
      >
        <FlatList
          data={myDogs}
          keyExtractor={(item) => item.key.toString()}
          renderItem={({ item, index }) => {
            return (
              <DogItem
                data={item}
                userId={userId}
                handleDelete={() => deleteItem(item)}
                //showEditModal={() => showModal()}
                editDogArray={editDogArray}
              />
            );
          }}
        />
        <View style={styles.addButton}>
          <TouchableOpacity onPress={showAddDogModal}>
            <Ionicons name="add-circle-outline" size={40} color="#D90429" />
          </TouchableOpacity>
        </View>

        <Modal
          transparent={true}
          animationType="none"
          visible={showAddDog}
          style={{ zIndex: 1100 }}
          onRequestClose={() => {}}
        >
          <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
              <ScrollView>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <View style={styles.modalBackground}>
                    <View style={styles.form}>
                      <TouchableOpacity
                        onPress={choosePhoto}
                        style={{ margin: 25 }}
                      >
                        <View
                          style={{
                            position: "relative",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Image style={styles.photo} source={profilePic} />
                          <Text
                            style={{
                              color: "white",
                              position: "absolute",
                              alignSelf: "center",
                              textAlign: "center",
                            }}
                          >
                            Upload Profile Picture
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <Text style={styles.text}>Name</Text>
                      <TextInput
                        style={styles.inputText}
                        placeholder="Name"
                        ref={nameRef}
                        onSubmitEditing={() => bioRef.current.focus()}
                        onChangeText={(e) => setName(e)}
                        value={name}
                        backgroundColor="white"
                        keyboardType="default"
                      />
                      <Text style={styles.text}>Bio</Text>
                      <TextInput
                        style={styles.inputbio}
                        placeholder="Bio..."
                        ref={bioRef}
                        onSubmitEditing={() => breedRef.current.focus()}
                        onChangeText={(e) => setBio(e)}
                        value={bio}
                        backgroundColor="white"
                        keyboardType="default"
                        multiline={true}
                      />
                      <Text style={styles.text}>Breed</Text>
                      <TextInput
                        style={styles.inputText}
                        placeholder="Breed"
                        ref={breedRef}
                        onChangeText={(e) => setBreed(e)}
                        value={breed}
                        backgroundColor="white"
                        keyboardType="default"
                      />
                      <View style={styles.pickerView}>
                        <Text>{"What is the size of your dog?"}</Text>
                        <Picker
                          note
                          mode="dropdown"
                          style={{ width: 200 }}
                          selectedValue={size}
                          onValueChange={(e) => setSize(e)}
                        >
                          <Picker.Item label="Small" value="Small" />
                          <Picker.Item label="Medium" value="Medium" />
                          <Picker.Item label="Large" value="Large" />
                        </Picker>
                      </View>
                      <View style={styles.pickerView}>
                        <Text>{"What is the sex of your dog?"}</Text>

                        <Picker
                          note
                          mode="dropdown"
                          style={{ width: 200 }}
                          selectedValue={sex}
                          onValueChange={(e) => setSex(e)}
                        >
                          <Picker.Item label="Male" value="Male" />
                          <Picker.Item label="Female" value="Female" />
                          <Picker.Item label="Other" value="Other" />
                        </Picker>
                      </View>
                      <Text style={styles.text}>Age: {age} years old</Text>
                      <Slider
                        style={{ width: 300, height: 40 }}
                        minimumValue={0}
                        maximumValue={25}
                        step={0.25}
                        value={age}
                        minimumTrackTintColor="#2B2D42"
                        maximumTrackTintColor="#8D99AE"
                        thumbTintColor="#D90429"
                        onValueChange={(e) => setAge(e)}
                      />

                      <BouncyCheckbox
                        size={25}
                        fillColor="red"
                        unfillColor="#FFFFFF"
                        text="Potty Trained?"
                        iconStyle={{ borderColor: "red" }}
                        textStyle={{ textDecorationLine: "none" }}
                        onPress={() => {
                          setIsPottyTrained(!isPottyTrained);
                        }}
                        style={styles.checkbox}
                      />
                      <BouncyCheckbox
                        size={25}
                        fillColor="red"
                        unfillColor="#FFFFFF"
                        text="Neutered?"
                        iconStyle={{ borderColor: "red" }}
                        textStyle={{ textDecorationLine: "none" }}
                        onPress={() => {
                          setIsNeutered(!isNeutered);
                        }}
                        style={styles.checkbox}
                      />
                      <View style={styles.buttonView}>
                        <TouchableOpacity onPress={cancel}>
                          <View style={styles.secondaryButton}>
                            <Text
                              style={{
                                fontFamily: "Arial",
                                fontSize: 15,
                                color: "white",
                                alignSelf: "center",
                              }}
                            >
                              <Ionicons name="close" size={25} color="white" />
                            </Text>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={addDog}>
                          <View style={styles.primaryButton}>
                            <Text
                              style={{
                                fontFamily: "Arial",
                                fontSize: 15,
                                color: "white",
                                alignSelf: "center",
                              }}
                            >
                              <Ionicons
                                name="add-circle-outline"
                                size={25}
                                color="white"
                              />
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </ScrollView>
            </SafeAreaView>
          </KeyboardAvoidingView>
        </Modal>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f4f4f4",
    flex: 1,
  },
  backTextWhite: {
    color: "#FFF",
  },
  rowFront: {
    backgroundColor: "#FFF",
    borderRadius: 5,
    height: 60,
    margin: 5,
    marginBottom: 15,
    shadowColor: "#999",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  rowFrontVisible: {
    backgroundColor: "#FFF",
    borderRadius: 5,
    height: 60,
    padding: 10,
    marginBottom: 15,
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: "#DDD",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15,
    margin: 5,
    marginBottom: 15,
    borderRadius: 5,
  },
  backRightBtn: {
    alignItems: "flex-end",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: 75,
    paddingRight: 17,
  },
  backRightBtnLeft: {
    backgroundColor: "#1f65ff",
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: "red",
    right: 0,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  trash: {
    height: 25,
    width: 25,
    marginRight: 7,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#666",
  },
  details: {
    fontSize: 12,
    color: "#999",
  },
  addButton: {
    margin: 15,
    alignContent: "center",
    justifyContent: "center",
    alignSelf: "center",
    //borderRadius : 50,
    //backgroundColor: "#D90429",
    width: 40,
    height: 40,
  },
  modalBackground: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    padding: 20,
  },
  form: {
    padding: 10,
    height: "100%",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "white",
    width: 325,
    borderRadius: 25,
  },
  checkbox: {
    alignSelf: "center",
    padding: 5,
    margin: 5,
  },
  text: {
    color: "black",
    alignSelf: "center",
    fontSize: 12,
    fontWeight: "500",
  },
  input: {
    width: 300,
    height: 9,
    margin: 1,
    borderRadius: 10,
    alignSelf: "center",
    justifyContent: "flex-start",
  },

  inputText: {
    borderWidth: 1,
    borderColor: "#2B2D42",
    borderStyle: "solid",
    padding: 10,
    fontSize: 12,
    borderRadius: 6,
    height: 40,
    width: "75%",
    margin: 10,
    fontWeight: "600",
    alignSelf: "center",
  },
  inputText2: {
    borderWidth: 1,
    borderColor: "#2B2D42",
    borderStyle: "solid",
    padding: 10,
    fontSize: 12,
    borderRadius: 6,
    height: 40,
    width: "90%",
    margin: 10,
    fontWeight: "600",
    alignSelf: "center",
  },
  inputbio: {
    borderWidth: 1,
    borderColor: "#2B2D42",
    borderStyle: "solid",
    padding: 10,
    fontSize: 12,
    borderRadius: 6,
    height: 75,
    width: "75%",
    margin: 10,
    fontWeight: "600",
    alignSelf: "center",
    //textAlignVertical : 'top'
  },
  buttonView: {
    flexDirection: "row",
  },
  secondaryButton: {
    borderRadius: 50,
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#2B2D42",
    width: 50,
    height: 50,
    margin: 15,
  },
  primaryButton: {
    borderRadius: 50,
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: "#EF233C",
    width: 50,
    height: 50,
    margin: 15,
  },
  button: {
    borderRadius: 8,
    alignSelf: "center",
    backgroundColor: "#EF233C",
    width: 200,
    height: 25,
    margin: 10,
  },
  pickerView: {
    //flexDirection: "column",
    fontSize: 12,
    width: 300,
    paddingHorizontal: 10,
    paddingVertical: 8,
    paddingRight: 30,
  },
  photo: {
    height: 150,
    width: 150,
    borderRadius: 75,
    alignSelf: "center",
    justifyContent: "space-evenly",
  },
});

export default DogManager;
