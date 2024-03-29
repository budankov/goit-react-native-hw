import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from "react-native";
import { useSelector } from "react-redux";
import { db } from "../../firebase/config";
import { collection, addDoc, onSnapshot, query } from "firebase/firestore";

import formatDate from "../../utils/formatDate";

// Icons
import { AntDesign } from "@expo/vector-icons";

const CommentsScreen = ({ route }) => {
  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState([]);

  const { postID, photo } = route.params;
  const { nickname } = useSelector((state) => state.auth);
  console.log(route.params);

  useEffect(() => {
    getAllComments();
  }, []);

  const createComment = async () => {
    const date = formatDate(new Date());

    const commentsRef = collection(db, `posts/${postID}/comments`);
    await addDoc(commentsRef, { comment, nickname, date });

    setComment("");
  };

  const getAllComments = async () => {
    const commentsQuery = query(collection(db, `posts/${postID}/comments`));
    onSnapshot(commentsQuery, (data) =>
      setAllComments(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    );
  };

  return (
    <View style={styles.bcgContainer}>
      <View style={styles.container}>
        <View style={styles.photoWrapper}>
          <Image style={styles.photo} source={{ uri: photo }} />
        </View>
        <SafeAreaView style={styles.SafeAreaView}>
          <FlatList
            data={allComments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View>
                <View style={styles.commentWrapper}>
                  <Text style={styles.commentText}>{item.comment}</Text>
                  <Text style={styles.commentDate}>{item.date}</Text>
                </View>
              </View>
            )}
          />
        </SafeAreaView>
        <View style={styles.submitForm}>
          <TextInput
            style={styles.input}
            placeholder="Коментувати..."
            value={comment}
            onChangeText={setComment}
          ></TextInput>
          <TouchableOpacity
            style={styles.submitBtn}
            activeOpacity={0.8}
            onPress={createComment}
          >
            <AntDesign
              style={styles.submitBtnIcon}
              name="arrowup"
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bcgContainer: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  container: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  SafeAreaView: { flex: 1 },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    backgroundColor: "#F6F6F6",
    borderRadius: 50,
    padding: 16,
  },
  submitForm: {
    marginTop: 32,
  },
  submitBtn: {
    position: "absolute",
    right: 5,
    top: 5,
    backgroundColor: "#FF6C00",
    borderRadius: 50,
  },
  submitBtnIcon: {
    padding: 8,
    color: "#FFF",
  },

  photo: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  photoWrapper: {
    top: 0,
    height: 240,
    marginTop: 32,
    marginBottom: 32,
    borderColor: "#E8E8E8",
  },
  commentWrapper: {
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    borderRadius: 6,
    padding: 16,
    marginBottom: 24,
    flex: 1,
  },

  commentText: {
    color: "#212121",
    fontSize: 13,
    lineHeight: 18,
  },

  commentDate: {
    color: "#bdbdbd",
    fontSize: 10,
    lineHeight: 12,
    textAlign: "right",
  },
});

export default CommentsScreen;
