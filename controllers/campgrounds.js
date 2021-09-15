const Campground = require("../models/campground");

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res) => {
  // if(!req.body.campground) throw new ExpressError('Invalid Campground data',400)
  const campground = new Campground(req.body.campground);
  campground.author = req.user._id;
  await campground.save();
  req.flash("success", "Succesfully made a new Campground");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!campground) {
    req.flash("error", "Cannot find campground");
    res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;  
    const campground = await Campground.findById(id);
     
      if(!campground){
      req.flash('error','Cannot find that campground');
      return res.redirect('/campgrounds')
      }
      res.render("campgrounds/edit", { campground });
    }
module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    if(!campground){
      req.flash('error','Cannot find campground');
      res.redirect('/campgrounds')
    }
    req.flash('success','Succesfully updated Campground')
    res.redirect(`/campgrounds/${campground._id}`);
  }
module.exports.delete= async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Succesfully deleted Campground')
    res.redirect("/campgrounds");
  }