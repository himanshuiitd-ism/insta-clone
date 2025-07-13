import { FaRegBookmark, FaRegComment, FaRegHeart } from "react-icons/fa";
import image from "./images/image.png";
import { FiSend } from "react-icons/fi";
import PostComment from "./PostComment";
import { useRef, useState } from "react";

const Post = () => {
  const [postComment, setPostComment] = useState("");
  const [open, setOpen] = useState(false);
  const commentRef = useRef(null);

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
          <img src={image} alt="Profile" />
        </div>
        <div className="post-username">Username</div>
        <div className="follAndUnf">Follow</div>
      </div>

      {/* Post Image */}
      <div className="post-middle">
        <img
          src="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
          alt="Post"
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

        <div className="post-likes">100 likes</div>
        <div className="post-caption">
          <span style={{ fontWeight: "500" }}>username</span> caption
        </div>
        <span
          className="post-comment-count"
          onClick={handleCommentClick}
          style={{ cursor: "pointer", color: "gray" }}
        >
          View all 10 comments
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
