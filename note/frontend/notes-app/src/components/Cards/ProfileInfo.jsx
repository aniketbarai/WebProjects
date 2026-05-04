import React from "react";
import { getInitials } from "../../utils/helper";

const ProfileInfo = ({ userInfo, onLogout }) => {
  return (
    <div className="flex items-center gap-2 sm:gap-3 max-w-full">
      {/* Avatar */}
      <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-200 shrink-0">
        {getInitials(userInfo?.fullName)}
      </div>

      {/* User Info */}
      <div className="min-w-0">
        <p className="text-xs sm:text-sm font-medium truncate">
          {userInfo?.fullName}
        </p>

        <button
          onClick={onLogout}
          className="mt-1 text-xs sm:text-sm text-red-500 border border-red-300 px-2 py-1 rounded hover:bg-red-50 active:scale-95"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;
