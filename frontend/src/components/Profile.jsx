import React, { useEffect, useState } from "react";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useSelector } from "react-redux";
import image from "./images/image.png";
import { useParams } from "react-router-dom";

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(userId);

  useGetUserProfile(userId);
  const { userProfile, user } = useSelector((store) => store.auth);

  // Dynamic values instead of hardcoded
  const isMyId = user?._id === userId;
  const isFollowed = user?.following?.includes(userId) || false;

  useEffect(() => {
    if (currentUserId !== userId) {
      setIsLoading(true);
      setCurrentUserId(userId);
    }
  }, [userId, currentUserId]);

  useEffect(() => {
    if (userProfile && userProfile._id === userId) {
      setIsLoading(false);
    }
  }, [userId, userProfile]);

  if (isLoading || !userProfile || userProfile._id !== userId) {
    return (
      <div className="loading-container">
        <div className="loading-text">Loading Profile...</div>
      </div>
    );
  }

  const handleFollow = () => {};

  return (
    <div className="Profile">
      <div className="profile-header">
        {/* Profile Image */}
        <div className="Profile-image">
          <img
            src={userProfile?.profilePicture?.url || image}
            alt={`${userProfile?.username}'s profile`}
          />
        </div>

        {/* Profile Info */}
        <div className="profile-info">
          {/* Username and Buttons Row */}
          <div className="profile-header-top">
            <div className="profile-username-section">
              <h1>{userProfile?.username}</h1>
              {userProfile?.bio && <h2>{userProfile.bio}</h2>}
            </div>

            {/* Action Buttons */}
            <div className="profile-buttons">
              {isMyId ? (
                <div className="profile-top-button">
                  <button>Edit Profile</button>
                  <button>View Archive</button>
                  <button>Ad Tools</button>
                </div>
              ) : isFollowed ? (
                <div className="following">
                  <button>Following</button>
                  <button>Message</button>
                </div>
              ) : (
                <div className="follow">
                  <button>Follow</button>
                </div>
              )}
            </div>
          </div>

          {/* Stats Row */}
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-number">
                {userProfile?.posts?.length || 0}
              </span>
              <span className="stat-label">posts</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {userProfile?.followers?.length || 0}
              </span>
              <span className="stat-label">followers</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {userProfile?.following?.length || 0}
              </span>
              <span className="stat-label">following</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
