import React, {useContext, useEffect, useState} from "react";
import { AuthContext } from "../context/AuthContext";
import {storage, db, auth} from "../firebase";
import {ref, uploadBytes, getDownloadURL} from "firebase/storage";
import {v4} from "uuid";
import {addDoc, collection, serverTimestamp} from "firebase/firestore";

export const Create = () => {

    const {setIsAuth, isAuth} = useContext(AuthContext);

    const [selectedImage, setSelectedImage] = useState(null);
    const [caption, setCaption] = useState("");
    const postsCollectionRef = collection(db, "posts");

    const uploadImage = () => {
        if (selectedImage === null) {
            alert("You have to select an image!");
        } else {
        const imageName = `/${selectedImage.name + v4()}`
        const imageRef = ref(storage, imageName);
         uploadBytes(imageRef, selectedImage).then(() => {
            getDownloadURL(imageRef).then((url) => {
                addDoc(postsCollectionRef, {
                    image: url,
                    caption,
                    createdAt: serverTimestamp(),
                    author: {
                        username: auth.currentUser?.displayName,
                        profilePic: auth.currentUser?.photoURL,
                        uid: auth.currentUser?.uid,
                    },
                    likes: []
                }).then(done => window.location = "/");
            });
        });
    };
    }

    return (
        <div className="create">

            {!isAuth ? <h2>You need to login in order to post!</h2> :
            
            <div className="wrapper">
                <h2>Create post</h2>
                <h3>Select a picture</h3>
                    <div className="pic">
                    <input type="file" accept="image/*" onChange={(e) => setSelectedImage(e.target.files[0])} />
                </div>
                <h3>Type a caption</h3>
                <div className="caption">
                    <textarea type="text" placeholder="type a caption" onChange={(e) => setCaption(e.target.value)} ></textarea>
                </div>
                <button onClick={uploadImage}>post</button>
            </div>}
        </div>
    )
}