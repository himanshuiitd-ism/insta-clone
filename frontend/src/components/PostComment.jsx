import React, { forwardRef, useState } from "react";
import { BsThreeDots } from "react-icons/bs";

const PostComment = forwardRef(({ open, onClose }, ref) => {
  const [close, setClose] = useState(false);
  const handleContainerClick = (e) => {
    e.stopPropagation(); //Prevent the closing of main box when clicked inside the box (ex:- when you click inside more-option-inside it should not close the modal but when you click outside the modal it should close)
  };

  return (
    <div ref={ref} className="comment-modal" onClick={handleContainerClick}>
      <div className="comment-modal-image">
        <img
          src="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
          alt="Post"
        />
      </div>

      <div className="comment-modal-content">
        <div className="comment-heading">
          <Link to="" className="comment-profile">
            <img
              src="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
              alt="Profile"
            />
            <span
              classNLinkame="comment-username"
              style={{ fontSize: "1.25rem" }}
            >
              Username
            </span>
          </Link>
          <div className="close-icon" onClick={() => setClose(!close)}>
            <BsThreeDots />
          </div>
        </div>
        <div className="comment-body">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
            ullamcorper, nisi a facilisis tincidunt, enim erat commodo quam, at
            facilisis enim leo nec est. Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Sed ullamcorper, nisi a facilisis tincidunt, enim
            erat commodo quam, at facilisis enim leo nec est. Lorem ipsum dolor
            sit amet, consectetur adipiscing elit. Sed ullamcorper, nisi a
            facilisis tincidunt, enim erat commodo quam, at facilisis enim leo
            nec est. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Sed ullamcorper, nisi a facilisis tincidunt, enim erat commodo quam,
            at facilisis enim leo nec est. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit. Sed ullamcorper, nisi a facilisis
            tincidunt, enim erat commodo quam, at facilisis enim leo nec est.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
            ullamcorper, nisi a facilisis tincidunt, enim erat commodo quam, at
            facilisis enim leo nec est. Lorem ipsum dolor sit amet, consectetur
            , enim erat commodo quam, at facilisis enim leo nec est. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit. Sed ullamcorper, nisi a
            facilisis tincidunt, enim erat commodo quam, at facilisis enim leo
            nec est. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Sed ullamcorper, nisi a facilisis tincidunt, enim erat commodo quam,
            at facilisis enim leo nec est. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit. Sed ullamcorper, nisi a facilisis
            tincidunt, enim erat commodo quam, at facilisis enim leo nec est.
            Lorem ipsum dolor sit amet, consectetur, enim erat commodo quam, at
            facilisis enim leo nec est. Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Sed ullamcorper, nisi a facilisis tincidunt, enim
            erat commodo quam, at facilisis enim leo nec est. Lorem ipsum dolor
            sit amet, consectetur adipiscing elit. Sed ullamcorper, nisi a
            facilisis tincidunt, enim erat commodo quam, at facilisis enim leo
            nec est. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Sed ullamcorper, nisi a facilisis tincidunt, enim erat commodo quam,
            at facilisis enim leo nec est. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit. Sed ullamcorper, nisi a facilisis
            tincidunt, enim erat commodo quam, at facilisis enim leo nec est.
          </p>
        </div>
      </div>
      {close && (
        <div className="more-options" onClick={() => setClose(false)}>
          <div className="more-option-inside" onClick={handleContainerClick}>
            <div
              style={{
                color: "#ff284c",
                fontWeight: "600",
                fontSize: "1.25rem",
              }}
            >
              Unfollow
            </div>
            <div>Add to Favorites</div>
            <div>Report</div>
            <div>Share to</div>
          </div>
        </div>
      )}
    </div>
  );
});

export default PostComment;
