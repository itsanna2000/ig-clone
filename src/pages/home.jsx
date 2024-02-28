import React, { useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid, faEllipsisVertical} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../context/AuthContext";
import {getDocs, collection, deleteDoc, doc, updateDoc, arrayUnion, arrayRemove, addDoc, query, orderBy, serverTimestamp} from "firebase/firestore";
import { db, auth, storage } from "../firebase";
import { ref, deleteObject } from "firebase/storage";
import { Comments } from "../components/comments";

export const Timeline = () => {

  const {setIsAuth, isAuth} = useContext(AuthContext);

  const [postsList, setPostsList] = useState([]);


  const getPosts = async () => {
    const postsCollection = query(collection(db, "posts"), orderBy("createdAt", "desc"));
     const data = await getDocs(postsCollection);
     setPostsList(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
  }

 getPosts();

  const addLike = async (id) => {
    if (!isAuth) {
      alert("You need to log in to do this.");
    } else {
      const posts = doc(db, "posts", id);
      const likes = {likes: arrayUnion(auth.currentUser.uid)};
      await updateDoc(posts, likes);
      }
  };
  
  const removeLike = async (id) => {
    const posts = doc(db, "posts", id);
      const likes = {likes: arrayRemove(auth.currentUser.uid)};
      await updateDoc(posts, likes);
  }

  const deletePost = async (id, image) => {
    if (!isAuth) {
      alert("You need to log in to do this.");
    } else {
      const commentsRef = await getDocs(collection(db, "posts", id, "comments"));
      commentsRef?.forEach((doc) => {
        deleteDoc(doc.ref)});
      const imageRef = ref(storage, image);
        deleteObject(imageRef);
      const posts = doc(db, "posts", id);
        deleteDoc(posts);
    };
  }

  const [comment, setComment] = useState("");

  const addComment = async (id) => {
    if (!isAuth) {
      alert("You need to log in to do this.")
    } else {
    const commentsRef = collection(db, "posts", id, "comments")
    await addDoc(commentsRef, {
      username: auth.currentUser?.displayName,
      uid: auth.currentUser?.uid,
      createdAt: serverTimestamp(),
      postId: id,
      comment
    }).then(() => setComment(""));
    };
  }

  const [showDropdown, setShowDropdown] = useState([]);

  const handleClick = (id) => {
    setShowDropdown(showDropdown => ({
      [id]: !showDropdown[id],
    }));
  }

    return (
        <div className="timeline">
          {postsList?.map((post) => {
            return ( <div className="post" key={post.id} >
              <div className="header">
              <div className="user-info">
                    <img src={post.author.profilePic} />
                    <div className="username">{post.author.username}</div>
        </div>
        <div className="dropdown-menu">
          <FontAwesomeIcon icon={faEllipsisVertical} onClick={() => handleClick(post.id)} />
          {showDropdown[post.id] === true &&
          <ul>{isAuth && Object.values(post.author).find(uid => uid === auth.currentUser?.uid) ?
            <li onClick={() => deletePost(post.id, post.image)}>Delete</li> :
            <li onClick={() => alert("You are not the author of this post.")}>Delete</li>
            }
          </ul>}
        </div>
        </div>
        <div className="image">
        <img src={post.image} />
        </div>
        <div className="post-info">
          <div className="heart">{isAuth && post.likes.find(uid => uid === auth.currentUser?.uid) ?
            <i><FontAwesomeIcon className='solid' icon={faHeartSolid} onClick={() => removeLike(post.id)} /></i> :
            <i><FontAwesomeIcon className='empty' icon={faHeart} onClick={() => addLike(post.id)} /></i>
            }
            {post.likes.length === 1 ? <span>{post.likes.length} like</span> :
            <span>{post.likes.length} likes</span>}
            </div>
          <div className="caption">
          <div className="username">{post.author.username}</div> <p>{post.caption}</p>
          </div>
          <div className="comments">
          <Comments id={post.id} />
            <textarea type="input" placeholder='Add a comment...' onChange={(e) => setComment(e.target.value)} value={comment}></textarea>
            <button onClick={() => addComment(post.id)}>Add</button>
          </div>
        </div>
      </div>
      )})}
      </div>  
    )
}