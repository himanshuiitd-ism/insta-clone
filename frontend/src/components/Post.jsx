import {
  FaHeart,
  FaRegBookmark,
  FaRegComment,
  FaRegHeart,
} from "react-icons/fa";
import image from "./images/image.png";
import { FiSend } from "react-icons/fi";
import PostComment from "./PostComment";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DeletePost from "./DeletePost";
import toast from "react-hot-toast";
import axios from "axios";
import { setPosts, setSelectedPost } from "../redux/postSlice";
import { Link } from "react-router-dom";

const Post = ({ post }) => {
  const [postComment, setPostComment] = useState("");
  const [open, setOpen] = useState(false);
  const commentRef = useRef(null);
  const { user } = useSelector((state) => state.auth);
  const [deletePost, setDeletePost] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();
  const [liked, setLiked] = useState(post?.likes?.includes(user?._id) || false);

  useEffect(() => {
    setLiked(post?.likes?.includes(user?._id) || false);
  }, [post?.likes, user._id]);

  const handleCommentClick = (e) => {
    // e.stopPropagation();
    setOpen(true);
  };
  const handleCloseComments = () => {
    setOpen(false);
  };

  const changeEventHandler = (e) => {
    setPostComment(e.target.value.trim() ? e.target.value : "");
  };

  const handleDeleteClick = async (e) => {
    if (!user) {
      toast.error("Please login to delete posts");
      return;
    }

    try {
      setDeleting(true);
      const res = await axios.delete(
        `http://localhost:8000/api/v1/post/posts/${post._id}/deletepost`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const newSetOfPost = posts.filter(
          (postItem) => postItem._id !== post._id
        );
        dispatch(setPosts(newSetOfPost));
        setDeleting(false);
        setDeletePost(false);
        toast.success(res.data.message);
      }
    } catch (error) {
      setDeleting(false);
      console.log(error);
      if (error.response?.status === 401) {
        toast.error("Please login to perform this action");
      } else {
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    }
  };

  const handleCloseDelete = () => {
    setDeletePost(false);
  };

  const handleLikeDislike = async () => {
    if (!user) {
      toast.error("Please login to like posts");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/posts/${post._id}/like`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        setLiked(!liked); // Toggle the liked state
        toast.success(res.data.message);
        const updatedPost = posts.map((p) => {
          if (p._id === post._id) {
            const isLiked = p.likes.includes(user._id);
            return {
              ...p,
              likes: isLiked
                ? p.likes.filter((id) => id !== user._id)
                : [...p.likes, user._id],
            };
          }
          return p;
        });
        dispatch(setPosts(updatedPost));
      }
    } catch (error) {
      console.log(error);
      if (error.response?.status === 401) {
        toast.error("Please login to perform this action");
      } else {
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    }
  };

  const handleComment = async () => {
    if (!user) {
      toast.error("Please login to Comment");
      return;
    }
    if (!postComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/posts/${post._id}/comments`,
        { text: postComment },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setPostComment("");

        const newComment = res.data.data;
        //update redux store
        const updatedPost = posts.map((p) => {
          if (p._id === post._id) {
            return {
              ...p,
              comments: [newComment, ...p.comments],
            };
          }
          return p;
        });
        dispatch(setPosts(updatedPost));
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleComment();
    }
  };

  return (
    <div className="post" style={{ width: "400px", position: "relative" }}>
      {/* Post Header */}
      <div className="post-header">
        <div className="post-profile">
          <img src={post?.author?.profilePicture?.url || image} alt="Profile" />
        </div>
        <div className="post-username">
          <Link to={`/${post?.author?._id}/profile`}>
            {post?.author?.username}
          </Link>
          {post?.author?._id === user?._id ? (
            <span
              style={{
                fontSize: "14px",
                color: "white",
                height: "16px",
                width: "20px",
                borderRadius: "5px",
                backgroundColor: "black",
                paddingBottom: "1px",
              }}
            >
              author
            </span>
          ) : (
            ""
          )}
        </div>
        <div
          className="follAndUnf"
          onClick={
            user?.username === post?.author?.username
              ? () => {
                  setDeletePost(true);
                }
              : undefined
          }
        >
          {user?.username === post?.author?.username ? "Delete" : "Follow"}
        </div>
      </div>

      {/* Post Image */}
      <div
        className="post-middle"
        style={{
          position: "relative",
          overflow: "hidden", // Ensures blur doesn't leak outside
          height: "400px", // Set a fixed height (adjust as needed)
          backgroundColor: "#f0f0f0", // Fallback background
        }}
      >
        {/* Blurry Background Image */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${post.image.url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(5px)",
          }}
        />

        {/* Main Image (sharp) */}
        <img
          src={post.image.url}
          alt="Post"
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            objectFit: "contain",
            zIndex: 1,
          }}
        />
      </div>

      {/* Post Footer */}
      <div className="post-bottom">
        <div className="post-bottom-icons">
          <div className="post-bottom-icon">
            <span className="bottom-icon heart" onClick={handleLikeDislike}>
              {liked ? <FaHeart style={{ color: "red" }} /> : <FaRegHeart />}
            </span>
            <span
              className="bottom-icon comment"
              onClick={() => {
                handleCommentClick(), dispatch(setSelectedPost(post));
              }}
            >
              <FaRegComment />
            </span>
            <span className="bottom-icon send">
              <FiSend />
            </span>
          </div>
          <span className="bookmark">
            <FaRegBookmark />
          </span>
        </div>

        <div className="post-likes">{post.likes.length} likes</div>
        <div className="post-caption">
          <span style={{ fontWeight: "500" }}>{post.author.username}</span>{" "}
          {post.caption}
        </div>
        {post.comments.length !== 0 ? (
          <span
            className="post-comment-count"
            onClick={() => {
              handleCommentClick(), dispatch(setSelectedPost(post));
            }}
            style={{ cursor: "pointer", color: "gray" }}
          >
            View all {post.comments.length} comments
          </span>
        ) : (
          ""
        )}

        {/* Comment Input */}
        <div className="post-comment">
          <input
            type="text"
            placeholder="Add a Comment..."
            value={postComment}
            onChange={changeEventHandler}
            onKeyDown={handleKeyDown}
          />
          {postComment && (
            <button
              className="post-comment-button"
              style={{
                cursor: "pointer",
              }}
              onClick={handleComment}
            >
              Post
            </button>
          )}
        </div>
      </div>

      {/* Modal Comment Box */}
      {open && (
        <div className="modal-overlay" onClick={handleCloseComments}>
          <PostComment
            onClose={handleCloseComments}
            ref={commentRef}
            handleComment={handleComment}
            postComment={postComment}
          />
        </div>
      )}
      {/* Modal Delete Box */}
      {deletePost && (
        <div onClick={handleCloseDelete} className="modal-overlay">
          <DeletePost
            deletePost={deletePost}
            setDeletePost={setDeletePost}
            handleCloseDelete={handleCloseDelete}
            handleDeleteClick={handleDeleteClick}
            deleting={deleting}
          />
        </div>
      )}
    </div>
  );
};

export default Post;
