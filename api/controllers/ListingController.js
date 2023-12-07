import Listing from "../models/ListingModel.js";
import { ErrorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deletListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(ErrorHandler(404, "Listing not found!"));
  }

  if (req.user.id !== listing.userRef) {
    return next(ErrorHandler(401, "You can only delete your own listings!"));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing has been deleted!");
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(ErrorHandler(404, "Listing not found!"));
  }

  if (req.user.id !== listing.userRef) {
    return next(ErrorHandler(401, "You can only delete your own listings!"));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {}
};
export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(ErrorHandler(401, "listing not found!"));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};
export const getAllList = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startingIndex = parseInt(req.query.startingIndex) || 0;
    let offer = req.query.offer;
    if (offer === undefined || offer === false) {
      offer = { $in: [true, false] }; // select true and false both from database and show both values
    }
    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === false) {
      furnished = { $in: [true, false] };
    }

    let parking = req.query.parking;
    if (parking === undefined || parking === false) {
      parking = { $in: [true, false] };
    }

    let type = req.query.type;
    if (type === "rent" || type === "all") {
      type = { $in: ["sale", "rent"] };
    }

    const searchItem = req.query.searchItem || "";
    const sort = req.query.sort || "createdAt ";
    const order = req.query.order || "desc";

    const listings = await Listing.find({
      name: { $regex: searchItem, $options: "i" }, //  regex will search the item (name of listing even some part of word ) ,i for any lowercase also
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startingIndex);
    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
