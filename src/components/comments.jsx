import React, {useState, useContext} from "react";
import {getDocs, collection, doc, deleteDoc, query, orderBy} from "firebase/firestore";
import { db, auth } from "../firebase";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../context/AuthContext";

export const Comments = ({id}) => {

    const {setIsAuth, isAuth} = useContext(AuthContext);

    const [commentsList, setCommentsList] = useState([]);
    const commentsRef = collection(db, "posts", id, "comments");

    const getComments = async (id) => {
      const commentsCollection = query(commentsRef, orderBy("createdAt", "asc"));
        const data = await getDocs(commentsCollection);
     setCommentsList(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
    };

    getComments();

    const [showDropdown, setShowDropdown] = useState([]);

    const handleClick = (id) => {
      setShowDropdown(showDropdown => ({
        [id]: !showDropdown[id],
      }));
    };

    const deleteComment = async (id) => {
      const comment = doc(commentsRef, id);
      await deleteDoc(comment);
      };

    return (<div>
        {commentsList?.map((doc) => {
            return (
                <div className="comment" key={doc.id}>
                  <div className="comment-content">
              <div className="username">{doc.username}</div> <p>{doc.comment}</p></div>
              <div className="dropdown-menu">
          <div className="dots" onClick={() => handleClick(doc.id)}><FontAwesomeIcon icon={faEllipsis} /></div>
          {showDropdown[doc.id] === true &&
          <ul>{isAuth && Object.values(doc).find(uid => uid === auth.currentUser?.uid) ?
            <li onClick={() => deleteComment(doc.id)}>Delete</li> :
            <li onClick={() => alert("You are not the author of this comment.")}>Delete</li>
            }
          </ul>}
        </div>
              </div>
            )
        })
    }
    </div>
    )
}