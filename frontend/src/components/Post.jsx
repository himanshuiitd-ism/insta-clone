import { FaRegBookmark, FaRegComment, FaRegHeart } from "react-icons/fa";
import image from "./images/image.png";
import { FiSend } from "react-icons/fi";
import PostComment from "./PostComment";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";

const Post = ({ post }) => {
  const [postComment, setPostComment] = useState("");
  const [open, setOpen] = useState(false);
  const commentRef = useRef(null);
  const { user } = useSelector((state) => state.auth);

  const handleCommentClick = (e) => {
    e.stopPropagation();
    setOpen(true);
  };

  const handleCloseComments = () => {
    setOpen(false);
  };

  const changeEventHandler = (e) => {
    setPostComment(e.target.value.trim() ? e.target.value : "");
  };

  return (
    <div className="post" style={{ width: "400px", position: "relative" }}>
      {/* Post Header */}
      <div className="post-header">
        <div className="post-profile">
          <img src={post.author?.profilePicture.url || image} alt="Profile" />
        </div>
        <div className="post-username">{post.author.username}</div>
        <div className="follAndUnf">
          {user?.username === post.author.username ? "Delete" : "Follow"}
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
            <span className="bottom-icon heart">
              <FaRegHeart />
            </span>
            <span className="bottom-icon comment" onClick={handleCommentClick}>
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
        <span
          className="post-comment-count"
          onClick={handleCommentClick}
          style={{ cursor: "pointer", color: "gray" }}
        >
          View all {post.comments.length} comments
        </span>

        {/* Comment Input */}
        <div className="post-comment">
          <input
            type="text"
            placeholder="Add a Comment..."
            value={postComment}
            onChange={changeEventHandler}
          />
          {postComment && <button className="post-comment-button">Post</button>}
        </div>
      </div>

      {/* Modal Comment Box */}
      {open && (
        <div className="modal-overlay" onClick={handleCloseComments}>
          <PostComment
            open={open}
            onClose={handleCloseComments}
            ref={commentRef}
          />
        </div>
      )}
    </div>
  );
};

export default Post;
