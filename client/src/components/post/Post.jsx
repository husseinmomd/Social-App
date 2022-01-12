import "./post.css";
import { MoreVert, Delete, Edit } from "@material-ui/icons";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import { AuthContext } from "../../context/AuthContext";

export default function Post({ post, fetchPosts }) {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser } = useContext(AuthContext);
  const topRight = document.querySelector(".postTopRight");

  function privacy() {
    if (user._id === post.userId) {
      topRight.style.display = "none";
    } else {
      topRight.style.display = "block";
    }
  }

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  const deletePost = async () => {
    swal("Are you sure you want to delete?", {
      buttons: {
        catch: {
          text: "Delete!",
          value: "catch",
        },
        cancel: {
          text: "Cancel!",
          value: "cancel",
        },
        Cancel: true,
      },
    }).then((value) => {
      switch (value) {
        case "catch":
          (async () => {
            try {
              const res = await axios.delete(`/posts/${post._id}`);
              console.log(res);
              swal("Deleted!", "Post deleted!", "success");
              fetchPosts();
            } catch (error) {
              swal("Ops!", "Somthing went wrong!", "error");
            }

            // if (!res && res.status !== 200) {
            //   return;
            // }
          })();

        default:
          break;
      }
    });
  };
  const fetchUser = async () => {
    const res = await axios.get(`/users?userId=${post.userId}`);
    setUser(res.data);
  };
  useEffect(() => {
    fetchUser();
  }, [post.userId]);

  const likeHandler = () => {
    try {
      axios.put("/posts/" + post._id + "/like", { userId: currentUser._id });
      setLike(isLiked ? like - 1 : like + 1);
      setIsLiked(!isLiked);
    } catch (err) {
      console.log(err);
    }
  };

  const editPost = () => {
    console.log("clicked");
  };

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${user.username}`}>
              <img
                className="postProfileImg"
                src={
                  user.profilePicture
                    ? PF + user.profilePicture
                    : PF + "person/noAvatar.png"
                }
                alt=""
              />
            </Link>
            <span className="postUsername">{user.username}</span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          {currentUser._id === post.userId && (
            <div
              className="postTopRight"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <Delete
                onClick={deletePost}
                style={{ cursor: "pointer", color: "grey" }}
              ></Delete>
              <Edit
                onClick={editPost}
                style={{ cursor: "pointer", color: "grey" }}
              ></Edit>
            </div>
          )}
        </div>
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          <img className="postImg" src={PF + post.img} alt="" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              className="likeIcon"
              src={`${PF}like.png`}
              onClick={likeHandler}
              alt=""
            />
            <img
              className="likeIcon"
              src={`${PF}heart.png`}
              onClick={likeHandler}
              alt=""
            />
            <span className="postLikeCounter">{like} people like it</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">{post.comment} comments</span>
          </div>
        </div>
      </div>
    </div>
  );
}
