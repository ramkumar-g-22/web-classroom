import React, { useState } from "react";

function Comment() {
  const [value, setValue] = useState("");
  return (
    <div>
      <img src="" alt="" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Add class comment..."
      />
      <button type="submit">Post</button>
    </div>
  );
}

export default Comment;
