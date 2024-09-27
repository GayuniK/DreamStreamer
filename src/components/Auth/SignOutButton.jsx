import React from 'react';

const SignOutButton = ({ signOut }) => (
  <button
    onClick={signOut}
    className="w-full py-2 bg-white-500 text-black rounded hover:bg-green-600 transition duration-200"
  >
    Sign Out
  </button>
);

export default SignOutButton;
