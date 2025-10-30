import { useEffect, useState } from "react";

export default function Nav() {
    const Logout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    };
  return (
    <div class="nav">
      <div class="nav-title">Nav</div>
      <button class="nav-button" onClick={() =>Logout()}>Logout</button>
    </div>
  );
}
