import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";
import { useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { Link } from "react-router-dom";
import {
  deleteUserStart,
  deleteUserSuccess,
  deleteteUserFailure,
  logoutUserFailure,
  logoutUserStart,
  logoutUserSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice";
// import { FaRegClosedCaptioning } from 'react-icons/fa';
const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePercent, setFilepercent] = useState(0);
  const [fileError, setFileError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showlistingError, setshowListingError] = useState(false);
  const [listingItems, setListingItems] = useState([]);
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  useEffect(() => {
    if (file) {
      uploadFile(file);
    }
  }, [file]);
  const uploadFile = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilepercent(Math.round(progress));
      },
      (error) => {
        setFileError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setFormData({ ...formData, avatar: downloadUrl });
        });
      }
    );
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success == false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      console.log(error.message);
      dispatch(updateUserFailure(error.message));
    }
  };
  const handleUserDelete = async (e) => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success == false) {
        dispatch(deleteteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteteUserFailure(error.message));
    }
  };
  const handleLogout = async () => {
    try {
      dispatch(logoutUserStart());
      const res = await fetch("/api/auth/logout");
      const data = res.json();
      if (data.success == false) {
        dispatch(logoutUserFailure(data.message));
        return;
      }
      dispatch(logoutUserSuccess(data));
    } catch (error) {
      dispatch(logoutUserFailure());
    }
  };
  const handleShowList = async () => {
    try {
      setshowListingError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success == false) {
        setshowListingError(true);
        return;
      }
      setListingItems(data);
    } catch (error) {
      setshowListingError(true);
    }
  };
  const deleteListing = async (id) => {
    try {
      const res = await fetch(`/api/listing/delete/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success == false) {
        console.log(data.message);
        return;
      }
      setListingItems((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className=" text-center py-6 text-3xl">Profile Details</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full h-25 w-25 object-cover cursor-pointer self-center mt-2"
        />
        <p className="text-sm self-center">
          {fileError ? (
            <span className="text-red-700">
              Eroor in uploading profile picture(image must be less than 2 mb)
            </span>
          ) : filePercent > 0 && filePercent < 100 ? (
            <span className="text-slate-700">
              {`Uploading ${filePercent}%`}
            </span>
          ) : filePercent == 100 ? (
            <span className="text-green-600">
              {" "}
              Profile picture Successfully uploaded !
            </span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          id="username"
          className="border p-3 rounded-lg"
          onChange={handleChange}
          defaultValue={currentUser.username}
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          className="border p-3 rounded-lg"
          onChange={handleChange}
          defaultValue={currentUser.email}
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg
     p-3 uppercase hover:opacity-90 disabled:opacity-80"
        >
          {loading ? "loading......" : "Update"}
        </button>
      </form>
      <Link to={"/create-listing"}>
        <button
          className="bg-green-700 text-white w-full rounded-lg
     p-3 mt-3 uppercase  hover:opacity-90"
        >
          create Listing
        </button>
      </Link>
      <div className="flex justify-between mt-6">
        <span
          onClick={handleUserDelete}
          className="text-red-600 cursor-pointer"
        >
          Delete account
        </span>

        <span onClick={handleLogout} className="text-red-600 cursor-pointer">
          Sign Out
        </span>
      </div>
      <p className="text-red-600 mt-5"> {error ? error : ""}</p>
      <p className="text-green-700 mt-4">
        {" "}
        {updateSuccess ? "updated successfully" : ""}{" "}
      </p>
      <button
        onClick={handleShowList}
        className="text-green-700 w-full 
     p-3 hover:opacity-90"
      >
        Show listings{" "}
      </button>
      <p className="text-red-600 mt-5">
        {" "}
        {showlistingError ? "Error on listing the items..." : ""}
      </p>
      {listingItems && listingItems.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl">Your listing items</h1>
          {listingItems.map((item) => (
            <div
              key={item._id}
              className="flex justify-between border gap-4 rounded-lg p-3 items-center"
            >
              <Link to={`/listings/${item._id}`}>
                <img
                  src={item.imageUrls[0]}
                  alt="listing_image"
                  className="w-15 h-15 object-contain"
                />
              </Link>
              <Link to={`/listings/${item._id}`}>
                <p className="text-slate-700  flex-1 font-semibold hover:underline truncate">
                  {item.name}
                </p>
              </Link>
              <div className="flex flex-col items-center">
                <button
                  onClick={(e) => deleteListing(item._id)}
                  className="text-red-700 uppercase"
                >
                  Delete
                </button>
                <Link to={`/update-listing/${item._id}`}>
                  <button className="text-green-700 uppercase">Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
