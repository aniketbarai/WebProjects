import React from "react";
import { MdOutlinePushPin, MdCreate, MdDelete } from "react-icons/md";
import moment from "moment";

const NoteCard = ({
  title,
  date,
  content,
  tags,
  isPinned,
  onEdit,
  onDelete,
  onPinNote,
}) => {
  return (
    <div className="border rounded-xl p-3 sm:p-4 bg-white hover:shadow-xl transition-all ease-in-out w-full">
      
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <h6 className="text-sm sm:text-base font-medium break-words">
            {title}
          </h6>
          <span className="text-xs text-slate-500">
            {moment(date).format("Do MMM YYYY")}
          </span>
        </div>

        <MdOutlinePushPin
          className={`icon-btn shrink-0 ${
            isPinned ? "text-primary" : "text-slate-300"
          }`}
          onClick={onPinNote}
        />
      </div>

      {/* Content */}
      <p className="text-xs sm:text-sm text-slate-600 mt-2 break-words">
        {content?.slice(0, 100)}
      </p>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-3 gap-2">
        
        {/* Tags */}
        <div className="text-xs sm:text-sm text-slate-500 break-words">
          {tags.map((item) => `#${item} `)}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <MdCreate
            className="icon-btn hover:text-green-600"
            onClick={onEdit}
          />
          <MdDelete
            className="icon-btn hover:text-red-500"
            onClick={onDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default NoteCard;